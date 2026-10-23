"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** One page of the cover book, set by `Hero` on the server. */
export type BookPage =
  | { kind: "cover"; src: string; alt: string }
  | {
      kind: "contents";
      issue: string;
      dateLabel: string;
      items: { slug: string; title: string; category: string; folio: number }[];
    }
  | {
      kind: "story";
      slug: string;
      title: string;
      dek: string;
      category: string;
      author: string;
      dateLabel: string;
      image?: { src: string; alt: string };
      folio: number;
    }
  | { kind: "end"; issue: string; dateLabel: string; href: string }
  | { kind: "back" }
  | { kind: "blank" };

/** The printed page is 1400 × 1992; the book is cut to the same proportions. */
const ASPECT = 1992 / 1400;
/** Below this, there is room for one page, not an open spread. */
const SPREAD_MIN = 720;
/** From one page settling to the next one starting to lift. */
const READ_MS = 15_000;
/** One page, corner lifting to page lying flat on the left. Slow on purpose. */
const TURN_MS = 3200;
/** Back to the cover after the last page: the same turn, run backwards, quicker. */
const REWIND_MS = 1100;
const REWIND_GAP = 140;
/** How far the fold leans when the corner first lifts, in degrees. A hand
    lifting a top corner folds it on a steep diagonal; the fold rights itself
    as the page goes over, and it lands square on the spine. */
const LEAN = 38;

type Point = [number, number];
type Turn = { leaf: number; dir: 1 | -1; ms: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** Slow to lift, unhurried across, slow to land. */
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => {
  const q = matchMedia(MOTION_QUERY);
  q.addEventListener("change", cb);
  return () => q.removeEventListener("change", cb);
};
const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};

/**
 * The part of a W×H page on one side of the line n·p = s, as a CSS polygon:
 * `flat` keeps n·p ≤ s (still lying on the book), otherwise n·p ≥ s (lifted).
 */
function halfPage(w: number, h: number, nx: number, ny: number, s: number, flat: boolean) {
  const side = (p: Point) => (nx * p[0] + ny * p[1] - s) * (flat ? 1 : -1);
  const corners: Point[] = [[0, 0], [w, 0], [w, h], [0, h]];
  const out: Point[] = [];
  corners.forEach((p, i) => {
    const q = corners[(i + 1) % corners.length];
    const a = side(p);
    const b = side(q);
    if (a <= 0) out.push(p);
    if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
      const k = a / (a - b);
      out.push([p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]);
    }
  });
  if (out.length < 3) return "polygon(0 0, 0 0, 0 0)";
  return `polygon(${out.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ")})`;
}

/**
 * Every style of one moment in a turn, for a right-hand page `w` wide with
 * its spine at x = 0. `p` is how far over the page is: 0 lying flat on the
 * right, 1 lying flat on the left.
 *
 * The page is folded along a line, the way paper is. The flat part keeps its
 * side of the line; the lifted part is the rest of the page mirrored across
 * it, so it shows the back of the page — which is the next left-hand page,
 * and lands exactly on it when the fold reaches the spine. The line starts at
 * the top-right corner on a steep lean and sweeps to the spine, standing up
 * as it goes, so the corner leads and the foot of the page follows.
 */
function fold(p: number, w: number, h: number) {
  const lean = ((LEAN * (1 - p) ** 0.85) * Math.PI) / 180;
  // The fold's normal points up and out, toward the corner that lifts first.
  const nx = Math.cos(lean);
  const ny = -Math.sin(lean);
  const s = (w * nx + 1) * (1 - p);

  /* Gradients run along the normal. At this angle the gradient line starts
     at the bottom-left corner, where n·p = −h·sin(lean); `at(v)` is where on
     that line n·p = v. */
  const angle = 90 - (lean * 180) / Math.PI;
  const off = h * Math.sin(lean);
  const at = (v: number) => `${(v + off).toFixed(1)}px`;
  const lift = Math.sin(Math.PI * p);

  return {
    front: halfPage(w, h, nx, ny, s, true),
    flap: halfPage(w, h, nx, ny, s, false),
    transform: `matrix(${1 - 2 * nx * nx}, ${-2 * nx * ny}, ${-2 * nx * ny}, ${1 - 2 * ny * ny}, ${2 * s * nx}, ${2 * s * ny})`,
    // The flat page darkens a little into the fold where it starts to bend.
    crease: `linear-gradient(${angle}deg, transparent ${at(s - 80)}, rgb(30 20 10 / 0.12) ${at(s)}, transparent ${at(s)})`,
    /* The back of the lifted page: a dark crease at the fold, then the curve
       catching the lamp, then paper turning away from it again. */
    sheen: `linear-gradient(${angle}deg, transparent ${at(s)}, rgb(30 20 10 / 0.2) ${at(s)}, rgb(255 255 255 / 0.5) ${at(s + 16)}, rgb(255 255 255 / 0.12) ${at(s + 60)}, transparent ${at(s + 130)}, rgb(30 20 10 / ${(0.1 * lift).toFixed(3)}) ${at(s + w)})`,
    // Its shadow on the page it is uncovering, deepest mid-turn.
    cast: `linear-gradient(${angle}deg, transparent ${at(s)}, rgb(0 0 0 / ${(0.4 * lift ** 0.6).toFixed(3)}) ${at(s)}, rgb(0 0 0 / ${(0.16 * lift).toFixed(3)}) ${at(s + 24)}, transparent ${at(s + 90 + 80 * p)})`,
  };
}

/**
 * The cover of the paper as a book left open on a dark table, being read.
 * Every fifteen seconds a page turns on its own: the top-right corner lifts,
 * and the page curls down and over the spine, slowly, the way someone reading
 * turns a page without hurrying. After the last page the book is leafed back
 * to the cover, and the reading starts again.
 *
 * No 3D: a turning page is two layers drawn from `fold` each frame — the part
 * still flat, and the lifted part mirrored across the fold — over the page
 * that will be uncovered. Pages at rest are ordinary markup, links and all.
 * React renders when a turn starts and when it ends; the frames in between
 * are written straight to the layers' styles.
 */
export function HeroBook({ pages, title }: { pages: BookPage[]; title: string }) {
  const leaves = pages.length / 2;
  // The last leaf is the back cover; the book is read up to the page before.
  const last = leaves - 1;
  const stageRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const creaseRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const flapClipRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);
  const rewinding = useRef(false);

  const [size, setSize] = useState<{ w: number; spread: boolean } | null>(null);
  const [turned, setTurned] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const reduced = useSyncExternalStore(subscribeMotion, () => matchMedia(MOTION_QUERY).matches, () => false);
  const hidden = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "hidden", () => false);

  const w = size?.w ?? 0;
  const h = Math.round(w * ASPECT);
  const spread = size?.spread ?? true;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const avail = entry.contentRect.width;
      const isSpread = avail >= SPREAD_MIN;
      const pageW = Math.floor(isSpread ? Math.min(460, (avail - 48) / 2) : Math.min(420, avail - 8));
      setSize((s) => (s && s.w === pageW && s.spread === isSpread ? s : { w: pageW, spread: isSpread }));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // The reader's pace: a page every fifteen seconds, then back to the cover.
  useEffect(() => {
    if (!size || turn || hidden) return;
    if (rewinding.current && turned === 0) rewinding.current = false;
    const back = rewinding.current || turned >= last;
    const wait = rewinding.current ? REWIND_GAP : READ_MS;
    const timer = setTimeout(() => {
      if (reduced) {
        // Nothing moves: the next page is simply there.
        setTurned(back ? 0 : turned + 1);
        return;
      }
      if (back) {
        rewinding.current = true;
        setTurn({ leaf: turned - 1, dir: -1, ms: REWIND_MS });
      } else {
        setTurn({ leaf: turned, dir: 1, ms: TURN_MS });
      }
    }, wait);
    return () => clearTimeout(timer);
  }, [size, turn, hidden, turned, last, reduced]);

  // The turn itself, a frame at a time.
  useEffect(() => {
    if (!turn || !size) return;
    const layers = [frontRef, creaseRef, flapRef, flapClipRef, sheenRef, castRef].map((r) => r.current);
    if (layers.some((el) => !el)) return;
    const [front, crease, flap, flapClip, sheen, cast] = layers as HTMLDivElement[];
    const ease = turn.dir > 0 ? easeInOutSine : easeInOutCubic;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = clamp((now - start) / turn.ms, 0, 1);
      const p = turn.dir > 0 ? ease(t) : 1 - ease(t);
      const f = fold(p, w, h);
      front.style.clipPath = f.front;
      crease.style.backgroundImage = f.crease;
      flapClip.style.clipPath = f.flap;
      flap.style.transform = f.transform;
      sheen.style.backgroundImage = f.sheen;
      cast.style.backgroundImage = f.cast;
      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setTurned(turn.dir > 0 ? turn.leaf + 1 : turn.leaf);
      setTurn(null);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [turn, size, w, h]);

  const page = (i: number) => (i >= 0 && i < pages.length ? pages[i] : null);
  /* What lies where. At rest: the back of the last leaf turned on the left,
     the front of the next on the right. Mid-turn: the same, but read around
     the leaf in motion — the pages either side of it lie underneath. */
  const j = turn?.leaf ?? -1;
  const leftPage = turn ? page(2 * j - 1) : page(2 * turned - 1);
  const rightPage = turn ? page(2 * j + 2) : page(2 * turned);
  const goingTo = turn ? (turn.dir > 0 ? j + 1 : j) : turned;
  // A closed book sits centred on its cover; on a phone, only the right page shows.
  const shift = !spread ? -w : goingTo === 0 ? -w / 2 : 0;
  const start = turn ? fold(turn.dir > 0 ? 0 : 1, w, h) : null;
  const ms = turn?.ms ?? TURN_MS;
  const thick = (n: number) => Math.min(7, n * 1.4);

  return (
    <div ref={stageRef} className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center">
      <h1 id="cover-story" className="sr-only">
        {title}
      </h1>

      {!size ? (
        // Before the first measure: the closed book, so the page arrives whole.
        <div className="bk-placeholder relative aspect-[1400/1992] w-full max-w-[420px]">
          {pages[0].kind === "cover" && (
            <Image src={pages[0].src} alt={pages[0].alt} fill priority sizes="420px" className="object-cover" />
          )}
        </div>
      ) : (
        <div
          className="relative"
          style={{
            width: spread ? w * 2 : w,
            height: h,
            // On a phone the left page is off the table: clip at the spine.
            clipPath: spread ? undefined : "inset(-60px -60px -60px 0)",
          }}
        >
          <div
            aria-hidden="true"
            className="bk-floor"
            style={{
              left: (goingTo > 0 && spread ? 0 : w) + shift - 20,
              width: (goingTo > 0 && spread ? 2 * w : w) + 40,
              transitionDuration: `${ms}ms`,
            }}
          />
          <div
            className="bk-book"
            style={{ width: w * 2, height: h, transform: `translateX(${shift}px)`, transitionDuration: `${ms}ms` }}
          >
            {/* The thickness of the paper still to read, and already read. */}
            <div aria-hidden="true" className="bk-edge bk-edge-right" style={{ left: 2 * w, width: thick(leaves - goingTo) }} />
            {/* The left stack is only there once a page has landed on it. */}
            {spread && turned > 0 && (
              <div
                aria-hidden="true"
                className="bk-edge bk-edge-left"
                style={{ left: -thick(turned), width: thick(turned) }}
              />
            )}

            {leftPage && (
              <Sheet className="bk-slot" left={0} w={w} live={!turn}>
                <Face page={leftPage} side="left" shows={!turn} />
              </Sheet>
            )}
            {rightPage && (
              <Sheet className="bk-slot" left={w} w={w} live={!turn}>
                <Face page={rightPage} side="right" shows={!turn} priority={turned === 0} />
              </Sheet>
            )}

            {turn && start && (
              <>
                <div ref={castRef} aria-hidden="true" className="bk-cast" style={{ left: w, width: w, backgroundImage: start.cast }} />
                <div
                  ref={frontRef}
                  aria-hidden="true"
                  className="bk-turning"
                  style={{ left: w, width: w, clipPath: start.front }}
                >
                  <Sheet w={w}>
                    <Face page={pages[2 * j]} side="right" shows={false} />
                  </Sheet>
                  <div ref={creaseRef} className="bk-overlay" style={{ backgroundImage: start.crease }} />
                </div>
                <div
                  ref={flapRef}
                  aria-hidden="true"
                  className="bk-flap"
                  style={{ left: w, width: w, height: h, transform: start.transform }}
                >
                  <div ref={flapClipRef} className="bk-flap-clip" style={{ clipPath: start.flap }}>
                    {/* The back of the page, printed mirror-wise on this side
                        so the mirror of the fold sets it the right way round. */}
                    <div className="bk-mirror">
                      <Sheet w={w}>
                        <Face page={pages[2 * j + 1]} side="left" shows={false} />
                      </Sheet>
                    </div>
                    <div ref={sheenRef} className="bk-overlay" style={{ backgroundImage: start.sheen }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** A page-sized box that a page's type sizes against (`cqw`). */
function Sheet({
  w,
  left,
  live = false,
  className = "",
  children,
}: {
  w: number;
  left?: number;
  live?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bk-sheet ${className}`}
      style={{ width: w, left }}
      aria-hidden={live ? undefined : true}
      inert={!live}
    >
      {children}
    </div>
  );
}

/** One page's printing. `side` is where it lies when the book is open. */
function Face({
  page,
  side,
  shows,
  priority = false,
}: {
  page: BookPage;
  side: "left" | "right";
  shows: boolean;
  priority?: boolean;
}) {
  if (page.kind === "cover") {
    return (
      <div className="bk-page bk-cover" data-side={side}>
        <Image src={page.src} alt={page.alt} fill priority={priority} sizes="460px" className="object-cover" />
        <div className="bk-gloss" />
      </div>
    );
  }

  if (page.kind === "back") {
    return (
      <div className="bk-page bk-backcover" data-side={side}>
        <p className="font-display text-[11cqw] leading-none text-[color:var(--bk-paper)]">The Valor Times</p>
        <p className="kicker mt-[4cqw] text-[2.4cqw] text-[color:var(--bk-paper)]/60">Reported by the people who live it</p>
      </div>
    );
  }

  if (page.kind === "blank") {
    return <div className="bk-page" data-side={side} />;
  }

  if (page.kind === "contents") {
    return (
      <div className="bk-page px-[9cqw] py-[10cqw]" data-side={side}>
        <p className="kicker text-[2.5cqw] text-red">
          {page.issue} · {page.dateLabel}
        </p>
        <p className="mt-[3cqw] font-display text-[10cqw] leading-[0.95] text-ink">In this issue</p>
        <ol className="mt-[7cqw] border-t border-ink/80">
          {page.items.map((item) => (
            <li key={item.slug} className="flex items-baseline gap-[3cqw] border-b border-rule py-[2.6cqw]">
              <span className="w-[5cqw] shrink-0 font-display text-[4cqw] tabular-nums text-red">{item.folio}</span>
              <span className="min-w-0">
                <span className="block font-display text-[4.4cqw] leading-tight text-ink">{item.title}</span>
                <span className="kicker mt-[0.8cqw] block text-[2.1cqw] text-muted">{item.category}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (page.kind === "end") {
    return (
      <div className="bk-page flex flex-col justify-center px-[10cqw]" data-side={side}>
        <p className="kicker text-[2.5cqw] text-red">
          {page.issue} · {page.dateLabel}
        </p>
        <p className="mt-[3cqw] font-display text-[9.5cqw] leading-[0.95] text-ink">Read the whole paper</p>
        <p className="mt-[5cqw] text-[3.4cqw] leading-relaxed text-ink-2">
          Every page of this issue as it was printed, comics and all.
        </p>
        <Link
          href={page.href}
          tabIndex={shows ? undefined : -1}
          className="kicker mt-[7cqw] inline-flex w-fit items-center gap-[2cqw] border-b border-ink pb-[1cqw] text-[2.6cqw] text-ink transition-colors hover:border-red hover:text-red"
        >
          Open the issue <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  const long = page.title.length > 38;
  return (
    <div className="bk-page flex flex-col px-[8cqw] pb-[6cqw] pt-[8cqw]" data-side={side}>
      <div className="flex items-baseline justify-between border-b border-ink/80 pb-[2cqw]">
        <span className="kicker text-[2.4cqw] text-red">{page.category}</span>
        <span className="kicker text-[2.2cqw] tabular-nums text-muted">{page.dateLabel}</span>
      </div>
      <p className={`mt-[4.5cqw] line-clamp-3 font-display leading-[0.95] text-ink ${long ? "text-[7.4cqw]" : "text-[9cqw]"}`}>
        {page.title}
      </p>
      {page.image && (
        <div className="relative mt-[5cqw] aspect-[4/3] w-full overflow-hidden bg-shell">
          <Image src={page.image.src} alt={page.image.alt} fill sizes="400px" className="object-cover" />
        </div>
      )}
      <p className={`mt-[4.5cqw] text-[3.3cqw] leading-relaxed text-ink-2 ${page.image ? "line-clamp-3" : "line-clamp-6"}`}>
        {page.dek}
      </p>
      <p className="kicker mt-[3.5cqw] text-[2.2cqw] text-muted">By {page.author}</p>
      <div className="mt-auto flex items-end justify-between pt-[4cqw]">
        <Link
          href={`/article/${page.slug}`}
          tabIndex={shows ? undefined : -1}
          className="kicker inline-flex items-center gap-[2cqw] border-b border-ink pb-[1cqw] text-[2.5cqw] text-ink transition-colors hover:border-red hover:text-red"
        >
          Read story <span aria-hidden="true">→</span>
        </Link>
        <span className="font-display text-[3.4cqw] tabular-nums text-muted">{page.folio}</span>
      </div>
    </div>
  );
}
