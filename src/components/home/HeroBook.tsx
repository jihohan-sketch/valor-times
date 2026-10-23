"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

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
/** A turning page is cut into this many strips, each bent a little further. */
const STRIPS = 7;
/** How far a soft page curls at the middle of its turn, edge against spine. */
const CURL = 46;
/** A full turn when the reader clicks rather than drags. */
const TURN_MS = 1050;
/** Left alone, the book turns its own page this often. */
const AUTO_MS = 15_000;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const rad = (deg: number) => (deg * Math.PI) / 180;

/* Light comes from in front and a little above. A face going edge-on to the
   reader darkens; the back of a page coming down flat lightens again. */
const frontShade = (a: number) => 0.5 * clamp(a / 90, 0, 1) ** 1.6;
const backShade = (a: number) => 0.5 * clamp((180 - a) / 90, 0, 1) ** 1.6;

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

const SOUND_KEY = "vt.book.sound";
const SOUND_EVENT = "vt-book-sound";

/* The reader's sound choice, kept in their browser. Read through a store so
   the server (which cannot know it) and the first client render agree. */
const subscribeSound = (cb: () => void) => {
  window.addEventListener(SOUND_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(SOUND_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};
const soundOn = () => {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
};
const setSoundOn = (on: boolean) => {
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {}
  window.dispatchEvent(new Event(SOUND_EVENT));
};

/**
 * A rustle of paper, made on the spot: a burst of filtered noise with a soft
 * attack and a long tail. No file to fetch, and only ever after a reader's own
 * click, since browsers will not play sound before one.
 */
function rustle(ctx: AudioContext) {
  const length = Math.floor(ctx.sampleRate * 0.42);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    const t = i / length;
    data[i] = (Math.random() * 2 - 1) * (t < 0.08 ? t / 0.08 : (1 - t) ** 2.2);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2600;
  band.Q.value = 0.6;
  const gain = ctx.createGain();
  gain.gain.value = 0.16;
  source.connect(band).connect(gain).connect(ctx.destination);
  source.start();
}

type Active = { leaf: number; dir: 1 | -1 };
type Gesture = Active & {
  x0: number;
  spine: number;
  grab: number;
  dragging: boolean;
  lastX: number;
  lastT: number;
  v: number;
};

/**
 * The cover of the paper as a book on a dark table. The spine runs down the
 * middle of an open spread (one page, spine on the left, on a phone). Click
 * the right page or drag its edge to turn forward; the left page to go back.
 *
 * A turning page is not a card on a hinge: it is cut into strips, each
 * nested in the one before and rotated a little further, so the page bends
 * along its length as it goes over — the edge leading, the spine following.
 * Every strip carries its own slice of the page and is shaded for the angle
 * it makes with the light; the page throws a shadow on whichever page it is
 * passing over. Pages at rest are flat, single sheets; only the page in the
 * reader's hand is cut. The frame-by-frame work writes styles straight to the
 * strips, so React renders once when a turn starts and once when it ends.
 *
 * Left alone, the book turns a page every fifteen seconds and, at the back
 * cover, closes itself again. Once a reader turns a page by hand, it stops
 * doing that and leaves the book to them.
 */
export function HeroBook({ pages, title }: { pages: BookPage[]; title: string }) {
  const leaves = pages.length / 2;
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const strips = useRef<(HTMLDivElement | null)[]>([]);
  const fronts = useRef<(HTMLDivElement | null)[]>([]);
  const backs = useRef<(HTMLDivElement | null)[]>([]);
  const shadowL = useRef<HTMLDivElement>(null);
  const shadowR = useRef<HTMLDivElement>(null);
  const theta = useRef(0);
  const gesture = useRef<Gesture | null>(null);
  const pending = useRef<{ to: number; ms: number; ease: (t: number) => number; user: boolean } | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const closing = useRef(false);

  const [size, setSize] = useState<{ w: number; spread: boolean } | null>(null);
  const [turned, setTurned] = useState(0);
  const [active, setActive] = useState<Active | null>(null);
  const [handled, setHandled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sound = useSyncExternalStore(subscribeSound, soundOn, () => false);
  const reduced = useSyncExternalStore(subscribeMotion, () => matchMedia(MOTION_QUERY).matches, () => false);
  const hidden = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "hidden", () => false);

  const w = size?.w ?? 0;
  const h = Math.round(w * ASPECT);
  const spread = size?.spread ?? true;
  // On a phone the left page is out of sight, so the back cover never shows.
  const maxTurned = spread ? leaves : leaves - 1;

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

  /** Bends the page in hand to `angle` (0 lying right, 180 lying left). */
  const draw = useCallback(
    (angle: number) => {
      if (!active) return;
      const hard = active.leaf === 0 || active.leaf === leaves - 1;
      const n = hard ? 1 : STRIPS;
      const lift = Math.sin(rad(angle));
      const edge =
        active.dir > 0
          ? Math.min(180, angle + (hard ? 0 : CURL * lift))
          : Math.max(0, angle - (hard ? 0 : CURL * lift));
      const step = n > 1 ? (edge - angle) / (n - 1) : 0;

      for (let i = 0; i < n; i++) {
        const strip = strips.current[i];
        if (!strip) continue;
        strip.style.transform = `rotateY(${-(i === 0 ? angle : step)}deg)`;
        const a0 = angle + i * step - step / 2;
        const a1 = angle + i * step + step / 2;
        const front = fronts.current[i];
        const back = backs.current[i];
        if (front) {
          front.style.background = `linear-gradient(to right, rgb(10 8 6 / ${frontShade(a0).toFixed(3)}), rgb(10 8 6 / ${frontShade(a1).toFixed(3)}))`;
        }
        if (back) {
          back.style.background = `linear-gradient(to right, rgb(10 8 6 / ${backShade(a1).toFixed(3)}), rgb(10 8 6 / ${backShade(a0).toFixed(3)}))`;
        }
      }

      /* The shadow the lifted page throws on the page it is passing over,
         reaching from the spine to just past where its edge hangs. */
      const reach = Math.abs(Math.cos(rad((angle + edge) / 2))) * w;
      const depth = (0.42 * lift).toFixed(3);
      const soft = (0.18 * lift).toFixed(3);
      const right = shadowR.current;
      const left = shadowL.current;
      if (right && left) {
        const onRight = (angle + edge) / 2 < 90;
        const target = onRight ? right : left;
        const other = onRight ? left : right;
        target.style.opacity = "1";
        target.style.background = `linear-gradient(${onRight ? "to right" : "to left"}, rgb(0 0 0 / ${depth}), rgb(0 0 0 / ${soft}) ${reach}px, transparent ${reach + 90}px)`;
        other.style.opacity = "0";
      }
    },
    [active, leaves, w],
  );

  const resetShadows = () => {
    if (shadowL.current) shadowL.current.style.opacity = "0";
    if (shadowR.current) shadowR.current.style.opacity = "0";
  };

  const play = useCallback(() => {
    if (!sound) return;
    try {
      audio.current ??= new AudioContext();
      rustle(audio.current);
    } catch {}
  }, [sound]);

  /** Runs the page in hand to `to`, then lays it down and settles the book. */
  const run = useCallback(
    (to: number, ms: number, ease: (t: number) => number) => {
      if (!active) return () => {};
      const from = theta.current;
      const start = performance.now();
      let frame = 0;
      const tick = (now: number) => {
        const t = ms <= 0 ? 1 : Math.min(1, (now - start) / ms);
        theta.current = from + (to - from) * ease(t);
        draw(theta.current);
        if (t < 1) {
          frame = requestAnimationFrame(tick);
          return;
        }
        resetShadows();
        if (to >= 180) setTurned(active.leaf + 1);
        else setTurned(active.leaf);
        setActive(null);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    },
    [active, draw],
  );

  // A turn was asked for before its strips existed: start it now they do.
  useEffect(() => {
    if (!active) return;
    draw(theta.current);
    const next = pending.current;
    if (!next) return;
    pending.current = null;
    return run(next.to, next.ms, next.ease);
  }, [active, draw, run]);

  const turn = useCallback(
    (dir: 1 | -1, { user = true, ms = TURN_MS } = {}) => {
      if (active || !size) return;
      const leaf = dir > 0 ? turned : turned - 1;
      if (leaf < 0 || leaf >= leaves || (dir > 0 && turned >= maxTurned)) return;
      if (user) {
        setHandled(true);
        closing.current = false;
        play();
      }
      if (reduced) {
        setTurned(dir > 0 ? turned + 1 : turned - 1);
        return;
      }
      theta.current = dir > 0 ? 0 : 180;
      pending.current = { to: dir > 0 ? 180 : 0, ms, ease: easeInOut, user };
      setActive({ leaf, dir });
    },
    [active, size, turned, leaves, maxTurned, reduced, play],
  );

  // Left alone: a page every fifteen seconds, then close up and start again.
  useEffect(() => {
    if (handled || reduced || hovered || hidden || active || !size) return;
    if (closing.current) {
      if (turned === 0) {
        closing.current = false;
      } else {
        const t = setTimeout(() => turn(-1, { user: false, ms: 560 }), 90);
        return () => clearTimeout(t);
      }
    }
    const t = setTimeout(() => {
      if (turned >= maxTurned) {
        closing.current = true;
        turn(-1, { user: false, ms: 560 });
      } else {
        turn(1, { user: false });
      }
    }, AUTO_MS);
    return () => clearTimeout(t);
  }, [handled, reduced, hovered, hidden, active, size, turned, maxTurned, turn]);

  const onPointerDown = (event: React.PointerEvent) => {
    if (active || !size || event.button !== 0) return;
    if ((event.target as Element).closest("a, button")) return;
    const book = bookRef.current;
    if (!book) return;
    const spine = book.getBoundingClientRect().left + w;
    const x = event.clientX;
    let pick: Active | null = null;
    if (spread) {
      if (x >= spine && turned < maxTurned) pick = { leaf: turned, dir: 1 };
      else if (x < spine && turned > 0) pick = { leaf: turned - 1, dir: -1 };
    } else if (x - spine < w * 0.3 && turned > 0) {
      pick = { leaf: turned - 1, dir: -1 };
    } else if (turned < maxTurned) {
      pick = { leaf: turned, dir: 1 };
    }
    if (!pick) return;
    gesture.current = {
      ...pick,
      x0: x,
      spine,
      grab: Math.max(60, Math.abs(x - spine)),
      dragging: false,
      lastX: x,
      lastT: event.timeStamp,
      v: 0,
    };
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const g = gesture.current;
    if (!g || reduced) return;
    const x = event.clientX;
    const dt = Math.max(1, event.timeStamp - g.lastT);
    g.v = 0.7 * g.v + 0.3 * ((x - g.lastX) / dt);
    g.lastX = x;
    g.lastT = event.timeStamp;
    if (!g.dragging) {
      if (Math.abs(x - g.x0) < 6) return;
      g.dragging = true;
      setHandled(true);
      closing.current = false;
      theta.current = g.dir > 0 ? 0 : 180;
      setActive({ leaf: g.leaf, dir: g.dir });
    }
    if (spread) {
      // The point in hand follows the pointer: it sits at spine + grab·cos θ.
      theta.current = (Math.acos(clamp((x - g.spine) / g.grab, -1, 1)) * 180) / Math.PI;
    } else {
      const progress = clamp(((g.x0 - x) * g.dir) / (w * 0.85), 0, 1);
      theta.current = g.dir > 0 ? progress * 180 : 180 - progress * 180;
    }
    draw(theta.current);
  };

  const onPointerUp = () => {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    if (!g.dragging) {
      turn(g.dir);
      return;
    }
    const fling = g.dir > 0 ? g.v < -0.45 : g.v > 0.45;
    const past = g.dir > 0 ? theta.current > 90 : theta.current < 90;
    const done = fling || past;
    const to = done ? (g.dir > 0 ? 180 : 0) : g.dir > 0 ? 0 : 180;
    if (done) play();
    const settle = { to, ms: 280 + 520 * (Math.abs(to - theta.current) / 180), ease: easeOut, user: true };
    // A quick flick can let go before the page in hand has been cut into
    // strips; then the effect that sees them arrive runs the settle instead.
    if (active) run(settle.to, settle.ms, settle.ease);
    else pending.current = settle;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      turn(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      turn(-1);
    }
  };

  const toggleSound = () => {
    const next = !sound;
    setSoundOn(next);
    if (next) {
      try {
        audio.current ??= new AudioContext();
        rustle(audio.current);
      } catch {}
    }
  };

  // Where the book sits: closed books sit centred on their one visible page.
  const shift = !spread ? -w : turned === 0 ? -w / 2 : turned === leaves ? w / 2 : 0;
  const visibleLeft = spread && turned > 0;
  const visibleRight = turned < leaves;

  return (
    <div
      ref={stageRef}
      className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
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
          className="bk-viewport relative outline-none"
          style={{
            width: spread ? w * 2 : w,
            height: h,
            clipPath: spread ? undefined : "inset(-120px -120px -120px 0)",
          }}
          tabIndex={0}
          role="group"
          aria-roledescription="book"
          aria-label="The cover of this issue. Use the arrow keys to turn the pages."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
        >
          <div
            aria-hidden="true"
            className="bk-floor"
            style={{
              left: (visibleLeft ? 0 : w) + shift - 20,
              width: (visibleLeft && visibleRight ? 2 * w : w) + 40,
            }}
          />
          <div
            ref={bookRef}
            className="bk-book"
            style={{
              width: w * 2,
              height: h,
              transform: `translateX(${shift}px)`,
              perspective: `${Math.round(w * 4.4)}px`,
              perspectiveOrigin: `${w}px 50%`,
            }}
          >
            {/* The thickness of the paper still to turn, and already turned. */}
            <div
              aria-hidden="true"
              className="bk-edge bk-edge-right"
              style={{ left: 2 * w, width: Math.min(7, (leaves - turned) * 1.4) }}
            />
            {spread && (
              <div
                aria-hidden="true"
                className="bk-edge bk-edge-left"
                style={{ left: -Math.min(7, turned * 1.4), width: Math.min(7, turned * 1.4) }}
              />
            )}

            {Array.from({ length: leaves }, (_, leaf) => {
              const inHand = active?.leaf === leaf;
              const over = leaf < turned;
              const z = inHand ? leaves * 2 + 5 : over ? leaf + 1 : leaves - leaf;
              const front = pages[leaf * 2];
              const back = pages[leaf * 2 + 1];
              const frontShows = !inHand && !over && leaf === turned;
              const backShows = !inHand && over && leaf === turned - 1 && spread;
              const n = inHand ? (leaf === 0 || leaf === leaves - 1 ? 1 : STRIPS) : 1;
              const rest = over ? 180 : 0;
              return (
                <div
                  key={`${leaf}-${inHand ? "hand" : "rest"}`}
                  className="bk-leaf"
                  style={{ left: w, width: w, height: h, zIndex: z }}
                >
                  <Strips
                    n={n}
                    w={w}
                    rest={inHand && active ? (active.dir > 0 ? 0 : 180) : rest}
                    front={<Face page={front} side="right" shows={frontShows} priority={leaf === 0} />}
                    back={<Face page={back} side="left" shows={backShows} />}
                    frontShows={frontShows}
                    backShows={backShows}
                    register={
                      inHand
                        ? (i, part, el) => {
                            (part === "strip" ? strips : part === "front" ? fronts : backs).current[i] = el;
                          }
                        : undefined
                    }
                  />
                </div>
              );
            })}

            <div ref={shadowL} aria-hidden="true" className="bk-cast" style={{ left: 0, width: w, zIndex: leaves * 2 + 4 }} />
            <div ref={shadowR} aria-hidden="true" className="bk-cast" style={{ left: w, width: w, zIndex: leaves * 2 + 4 }} />
            <div aria-hidden="true" className="bk-spine" style={{ left: w - 18, zIndex: leaves * 2 + 3, opacity: visibleLeft && visibleRight ? 1 : 0 }} />
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center gap-5 text-[color:var(--bk-ink-soft)]">
        <button
          type="button"
          className="bk-button"
          onClick={() => turn(-1)}
          disabled={!size || turned === 0}
          aria-label="Previous page"
        >
          ←
        </button>
        <ol className="flex items-center gap-2" aria-label="Pages">
          {Array.from({ length: maxTurned + 1 }, (_, i) => (
            <li key={i}>
              <span
                className="bk-dot"
                data-on={i === turned ? "" : undefined}
                aria-current={i === turned ? "page" : undefined}
              >
                <span className="sr-only">
                  {i === 0 ? "Cover" : i === leaves ? "Back cover" : `Spread ${i}`}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="bk-button"
          onClick={() => turn(1)}
          disabled={!size || turned >= maxTurned}
          aria-label="Next page"
        >
          →
        </button>
        <button
          type="button"
          className="bk-sound kicker"
          onClick={toggleSound}
          aria-pressed={sound}
        >
          Sound {sound ? "on" : "off"}
        </button>
      </div>
    </div>
  );
}

/**
 * A leaf as nested strips. Each strip is hinged on the right edge of the one
 * before, so rotating every strip a little bends the whole page. Every strip
 * shows the slice of the front (and, mirrored, the back) that falls on it.
 * At rest a leaf is a single strip, so only the page in hand is cut.
 */
function Strips({
  n,
  w,
  rest,
  front,
  back,
  frontShows,
  backShows,
  register,
}: {
  n: number;
  w: number;
  rest: number;
  front: React.ReactNode;
  back: React.ReactNode;
  frontShows: boolean;
  backShows: boolean;
  register?: (i: number, part: "strip" | "front" | "back", el: HTMLDivElement | null) => void;
}) {
  const sw = w / n;
  const strip = (i: number): React.ReactNode => (
    <div
      ref={register ? (el) => register(i, "strip", el) : undefined}
      className="bk-strip"
      style={{ left: i === 0 ? 0 : sw, width: sw, transform: `rotateY(${i === 0 ? -rest : 0}deg)` }}
    >
      <div className="bk-face" aria-hidden={frontShows && i === 0 ? undefined : true} inert={!(frontShows && i === 0)}>
        <div className="bk-slice" style={{ left: -i * sw, width: w }}>
          {front}
        </div>
        <div ref={register ? (el) => register(i, "front", el) : undefined} className="bk-light" />
      </div>
      <div className="bk-face bk-face-back" aria-hidden={backShows && i === 0 ? undefined : true} inert={!(backShows && i === 0)}>
        <div className="bk-slice" style={{ left: -(n - 1 - i) * sw, width: w }}>
          {back}
        </div>
        <div ref={register ? (el) => register(i, "back", el) : undefined} className="bk-light" />
      </div>
      {i < n - 1 && strip(i + 1)}
    </div>
  );
  return strip(0);
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
