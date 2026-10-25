"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** One story on the cover, set by `Hero` on the server. */
export interface HeroSlide {
  slug: string;
  title: string;
  /** The headline's type size, chosen from its length. */
  scale: string;
  /** Whether the story carries a photograph rather than a page scan. */
  photo: boolean;
  kicker: React.ReactNode;
  /** Dek, byline and the "Read story" link. */
  body: React.ReactNode;
  image: React.ReactNode;
  /** Small picture for the "Also on the cover" row: the photo or its placeholder. */
  thumb: React.ReactNode;
  /** The section label without its link, for inside the row's own link. */
  label: React.ReactNode;
  /** Author and date, for the same row. */
  byline: React.ReactNode;
}

/** From one story arriving to the next, the turn included. */
const SLIDE_MS = 15_000;

/** One turn, corner lifting to the page gone over the left edge. Slow on
    purpose: a page turned by someone reading, not flicked. */
const TURN_MS = 3200;
/** How far the fold leans when the top corner first lifts, in degrees. It
    stands up as the page goes over, and leaves square along the left edge. */
const LEAN = 38;
/** Reduced motion: a plain crossfade, nothing turns. */
const FADE_MS = 450;

type Point = [number, number];

/** Slow to lift, unhurried across, slow to leave. */
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * The part of a W×H page on one side of the line n·p = s, as a CSS polygon:
 * `flat` keeps n·p ≤ s (still lying down), otherwise n·p ≥ s (lifted).
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
 * Every style of one moment in a turn of a W×H cover. `p` is how far over it
 * is: 0 lying flat, 1 gone over the left edge.
 *
 * The page folds along a line, the way paper does. The part still down keeps
 * its side of the line; the lifted part is the rest of the page mirrored
 * across it, so it shows the back of the sheet. The line starts at the
 * top-right corner on a steep lean and sweeps left, standing up as it goes,
 * so the corner leads and the foot of the page follows it over.
 *
 * A mirror alone would lay the flap flat on the page. A turning page stands
 * up off it, and seen from above a sheet at an angle looks shorter across
 * the fold, so the flap is foreshortened toward the fold line — most at the
 * middle of the turn, when the page is most upright — and shaded like a
 * rounded bend where it leaves the page.
 */
function fold(p: number, w: number, h: number) {
  const lean = (LEAN * (1 - p) ** 0.85 * Math.PI) / 180;
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
  // How high the page stands: nothing at either end of the turn, most midway.
  const lift = Math.sin(Math.PI * p);

  /* Mirror across the fold (A, b), then squash toward the fold line by
     `squash` along its normal: q → P(Aq + b) + squash·s·n, P = I − squash·nnᵀ. */
  const squash = 0.4 * Math.sin(Math.PI * p) ** 0.8;
  const a00 = 1 - 2 * nx * nx;
  const a01 = -2 * nx * ny;
  const a11 = 1 - 2 * ny * ny;
  const p00 = 1 - squash * nx * nx;
  const p01 = -squash * nx * ny;
  const p11 = 1 - squash * ny * ny;
  const m00 = p00 * a00 + p01 * a01;
  const m01 = p00 * a01 + p01 * a11;
  const m10 = p01 * a00 + p11 * a01;
  const m11 = p01 * a01 + p11 * a11;
  const bx = 2 * s * nx;
  const by = 2 * s * ny;
  const tx = p00 * bx + p01 * by + squash * s * nx;
  const ty = p01 * bx + p11 * by + squash * s * ny;

  return {
    page: halfPage(w, h, nx, ny, s, true),
    flap: halfPage(w, h, nx, ny, s, false),
    transform: `matrix(${m00}, ${m10}, ${m01}, ${m11}, ${tx}, ${ty})`,
    // The higher the page stands, the further its shadow falls and the softer.
    shadow: `drop-shadow(${(-6 - 14 * lift).toFixed(1)}px ${(6 + 12 * lift).toFixed(1)}px ${(10 + 22 * lift).toFixed(1)}px rgb(13 13 16 / ${(0.12 + 0.16 * lift).toFixed(3)}))`,
    // The page still down darkens a little into the fold where it bends.
    crease: `linear-gradient(${angle}deg, transparent ${at(s - 90)}, rgb(30 20 10 / 0.1) ${at(s)}, transparent ${at(s)})`,
    /* The back of the sheet: a dark crease at the fold, then the curve
       catching the light, then paper turning away from it again. */
    sheen: `linear-gradient(${angle}deg, transparent ${at(s)}, rgb(30 20 10 / 0.22) ${at(s)}, rgb(30 20 10 / 0.08) ${at(s + 6)}, rgb(255 255 255 / 0.75) ${at(s + 22)}, rgb(255 255 255 / 0.3) ${at(s + 48)}, rgb(30 20 10 / 0.06) ${at(s + 95)}, transparent ${at(s + 170)}, rgb(30 20 10 / ${(0.04 + 0.08 * lift).toFixed(3)}) ${at(s + w)})`,
    // Its shadow on the story it is uncovering, deepest mid-turn.
    cast: `linear-gradient(${angle}deg, transparent ${at(s)}, rgb(13 13 16 / ${(0.3 * lift).toFixed(3)}) ${at(s)}, rgb(13 13 16 / ${(0.1 * lift).toFixed(3)}) ${at(s + 26)}, transparent ${at(s + 110 + 90 * p)})`,
  };
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const query = matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function reducedMotion() {
  return matchMedia(MOTION_QUERY).matches;
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function tabHidden() {
  return document.visibilityState === "hidden";
}

/**
 * Turns the cover over every fifteen seconds, like the page of a paper being
 * read: the top-right corner of the story showing lifts, and the page curls
 * slowly down and over to the left, its shadow sweeping across the next
 * story, which is already lying underneath.
 *
 * Each frame comes from `fold` rather than CSS, because a fold is a mirror
 * across a moving, tilting line: the page still down is clipped to one side
 * of it, and the lifted flap is the other side mirrored across it. The
 * paper is `.hero-sheet`, `.hero-flap` and `.hero-cast` in globals.css.
 *
 * Every story is laid out at once, stacked in a single grid cell with all but
 * one hidden. Only the stories on screen hold the cell open — the hidden ones
 * are taken out of flow — so the cover ends where the story showing ends
 * rather than at the height of the tallest one, and the page below settles to
 * the new story once a turn is over. During a turn two are visible: the
 * outgoing page on top, the incoming one under it — and the incoming one is
 * already the live heading, so a click mid-turn lands on the story arriving.
 *
 * The first story is server-rendered whole and only moves when it is due to
 * leave, so the page arrives complete. The turn waits while a pointer is over
 * the cover, focus is inside it, or the tab is hidden: a story never changes
 * under a reader's click.
 */
export function HeroRotator({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  /** The page being turned away, while it is still in motion. */
  const [from, setFrom] = useState<number | null>(null);
  const [due, setDue] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, reducedMotion, () => false);
  const hidden = useSyncExternalStore(subscribeVisibility, tabHidden, () => false);

  const slide = slides[index];

  /* The clock starts when a story arrives — the moment the page over it
     starts to lift — so arrival to arrival is fifteen seconds. */
  useEffect(() => {
    if (count < 2) return;
    const timer = setTimeout(() => setDue(true), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, count]);

  // Due, and nobody is reading it: turn the page.
  useEffect(() => {
    if (!due || from !== null || hovered || focused || hidden) return;
    const timer = setTimeout(() => {
      setFrom(index);
      setIndex((index + 1) % count);
      setDue(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [due, from, hovered, focused, hidden, index, count]);

  const bookRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const flapPaperRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const creaseRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);

  // Reduced motion: the page on top fades off (CSS) and is gone.
  useEffect(() => {
    if (from === null || !reduced) return;
    const timer = setTimeout(() => setFrom(null), FADE_MS);
    return () => clearTimeout(timer);
  }, [from, reduced]);

  // Otherwise turn it, a frame at a time.
  useEffect(() => {
    const book = bookRef.current;
    const layers = [flapRef, flapPaperRef, sheenRef, creaseRef, castRef].map((r) => r.current);
    if (from === null || reduced || !book || layers.some((el) => !el)) return;
    const [flap, paper, sheen, crease, cast] = layers as HTMLDivElement[];
    const page = book.querySelector<HTMLElement>('.hero-sheet[data-state="turning"]');
    if (!page) return;

    const w = book.clientWidth;
    const h = book.clientHeight;
    const start = performance.now();
    let frame = 0;

    const reset = () => {
      page.style.clipPath = "";
      for (const el of [flap, cast, crease]) el.style.visibility = "hidden";
    };

    const draw = (now: number) => {
      const t = Math.min(1, (now - start) / TURN_MS);
      const f = fold(easeInOutSine(t), w, h);
      page.style.clipPath = f.page;
      crease.style.backgroundImage = f.crease;
      paper.style.clipPath = f.flap;
      flap.style.transform = f.transform;
      flap.style.filter = f.shadow;
      sheen.style.backgroundImage = f.sheen;
      cast.style.backgroundImage = f.cast;
      for (const el of [flap, cast, crease]) el.style.visibility = "visible";
      if (t < 1) {
        frame = requestAnimationFrame(draw);
      } else {
        /* Leave the page folded away: unclipping it here would show the old
           story whole for the frame before React hides it. The cleanup below
           resets the layers once the new story has taken its place. */
        setFrom(null);
      }
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      reset();
    };
  }, [from, reduced]);

  if (!slide) return null;

  const others =
    count > 1
      ? Array.from({ length: Math.min(3, count - 1) }, (_, k) => slides[(index + 1 + k) % count])
      : [];

  return (
    <div
      className="relative"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      {/* Fifteen seconds, drawn along the rule under the issue line. */}
      {count > 1 && (
        <span key={index} aria-hidden="true" className="hero-progress" />
      )}

      <div ref={bookRef} className="hero-book relative grid">
        {/* The turning page's shadow, the crease where it bends, and its back. */}
        <div ref={castRef} aria-hidden="true" className="hero-cast" />
        <div ref={creaseRef} aria-hidden="true" className="hero-crease" />
        <div ref={flapRef} aria-hidden="true" className="hero-flap">
          <div ref={flapPaperRef} className="hero-flap-paper">
            <div ref={sheenRef} className="hero-flap-sheen" />
          </div>
        </div>

        {slides.map((entry, i) => {
          const active = i === index;
          const turning = i === from;
          // Pictures load for the stories in view and the one coming next.
          const near = active || turning || i === (index + 1) % count;
          const Title = active ? "h1" : "p";
          const sheet = turning ? "turning" : active ? (from !== null ? "under" : "shown") : "hidden";

          return (
            <div
              key={entry.slug}
              className={`hero-sheet [grid-area:1/1] px-5 pb-8 md:px-10 md:pb-12 ${
                active || turning ? "" : "invisible absolute inset-x-0 top-0"
              }`}
              data-state={sheet}
              aria-hidden={active ? undefined : true}
              inert={!active}
            >
              <div className="pt-8 md:pt-12">{entry.kicker}</div>

              <Title
                id={active ? "cover-story" : undefined}
                className={`display-tight mt-5 text-balance ${entry.scale}`}
              >
                <Link href={`/article/${entry.slug}`} className="link-draw inline">
                  {entry.title}
                </Link>
              </Title>

              <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
                <div className={`self-start ${entry.photo ? "lg:col-span-4" : "lg:col-span-8"}`}>
                  {entry.body}
                </div>

                {entry.photo && (
                  <Link
                    href={`/article/${entry.slug}`}
                    className="block lg:col-span-8"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-shell lg:aspect-[16/9]">
                      <div className="absolute inset-0">
                        {near && entry.image}
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {others.length > 0 && (
        <div className="mt-12 border-t border-rule pt-5 md:mt-16">
          <p className="kicker text-muted">Also on the cover</p>
          <ul className="mt-4 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((story, k) => (
              <li
                key={story.slug}
                className="hero-listing"
                style={{ animationDelay: `${k * 90}ms` }}
              >
                <Link href={`/article/${story.slug}`} className="group flex items-start gap-4">
                  <div className="w-24 shrink-0 md:w-28">{story.thumb}</div>
                  <div className="min-w-0">
                    {story.label}
                    {/* Two lines held open, so a shorter headline does not pull the row up. */}
                    <span className="headline mt-1.5 line-clamp-2 min-h-[2.4em] text-[1.05rem] leading-snug text-balance">
                      <span className="link-draw">{story.title}</span>
                    </span>
                    <div className="mt-1.5">{story.byline}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
