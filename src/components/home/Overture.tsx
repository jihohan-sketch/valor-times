"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/**
 * The opening.
 *
 * A white page. A pen scribbles across the middle of it — loose, quick, the way
 * you test an idea before you commit to it — and then the scribble settles and
 * the same hand writes VALOR TIMES straight through it, left to right, and
 * rules a red line underneath. The lockup lifts away and the front page is
 * already there beneath it, where the scroll left it.
 *
 * ── How it works
 * A tall invisible runway sits above the homepage. The reader's scroll through
 * it *is* the animation: one number, `--p` (0 → 1), which every part of the
 * scene reads. Nothing runs on a timer, so the sequence can never get ahead of
 * the reader or fall behind them.
 *
 * React renders once. After that a rAF-throttled scroll handler writes a dozen
 * custom properties onto <html> and the compositor does the rest — no
 * re-render, no layout, and every animated property is a transform, an opacity,
 * a stroke offset or a mask. That is what keeps it smooth on a phone.
 *
 * ── Who has to watch it
 * Nobody, twice. The sequence is marked seen in `sessionStorage` the moment it
 * finishes, so a reader moving around the site and coming back to the front
 * page lands straight on the front page, and `Skip` or `Escape` jump to the end
 * at any point.
 *
 * ── Reduced motion
 * This sequence deliberately ignores `prefers-reduced-motion`, which is a
 * decision the paper made rather than an oversight — so it is written down
 * here rather than left to be discovered.
 *
 * The case for the exemption is that almost none of the sequence is motion in
 * the sense the setting means. There is no autoplay, no loop, no parallax and
 * nothing that moves on a clock: every stroke advances exactly as far as the
 * reader's own scroll advances it and stops dead when they stop, which is
 * direct manipulation rather than animation. The lift and the blur at the very
 * end are the only exceptions, and they last a fifth of one screen.
 *
 * The cost is real and worth naming: a reader who turned the setting on for a
 * vestibular reason still gets that closing lift. What they also get is `Skip`
 * and `Escape`, either of which ends the whole thing immediately, and the
 * guarantee that it never plays twice.
 *
 * Nothing else on the site takes this exemption. Section reveals, the issue
 * ribbon, the cover rotation and every image zoom all still stand down under
 * the setting — see globals.css.
 */

/**
 * Runway length, in viewport heights: long enough to read as a sequence, short
 * enough that nobody has to sit through it.
 */
const RUNWAY = 1.5;

const SEEN_KEY = "vt:overture-seen";

/** Progress through one phase of the sequence, clamped to 0…1. */
const seg = (p: number, from: number, to: number) =>
  Math.min(1, Math.max(0, (p - from) / (to - from)));

/** Smoothstep, so a phase eases in and out of its own span. */
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Whether this reader has already watched it — read straight from the browser
 * rather than kept in React state, because it is a fact about the environment
 * and not something this component owns.
 *
 * It goes through `useSyncExternalStore` so it can be read during render on the
 * client while the server renders the same thing every time: the alternative is
 * a `setState` in an effect, which is a second render pass for something that
 * was already known before the first one.
 */
const subscribeNever = () => () => {};

function readSeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    /* Storage unavailable — treat as a first visit. */
  }
  return false;
}

export function Overture() {
  const runway = useRef<HTMLDivElement>(null);
  const seen = useSyncExternalStore(subscribeNever, readSeen, () => false);
  const [played, setPlayed] = useState(false);
  const done = seen || played;

  /** Jump to the end of the runway — the Skip button and Escape both land here. */
  const skip = useCallback(() => {
    const height = runway.current?.offsetHeight ?? window.innerHeight;
    window.scrollTo({ top: height, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // A reader who has already watched it never enters the runway again: it is
    // gone on the first paint after mount.
    if (done) {
      root.dataset.overture = "done";
      return;
    }

    const finish = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* Private mode. The intro simply plays again next time. */
      }

      /* Take the runway out and give the scroll back the distance it occupied,
         in the same frame. Without the second half the document would shrink
         under a scroll position that stayed put and the page would lurch a
         screen and a half down; without the first half, scrolling back up would
         land in blank paper with no sequence left to play in it. The reader
         ends at the top of the front page, which is where the sequence has
         spent its whole length pointing. */
      const track = runway.current;
      if (track) {
        const height = track.offsetHeight;
        const from = window.scrollY;
        track.style.height = "0px";
        /* Instant, and only here: `scroll-behavior: smooth` on the root would
           otherwise animate a correction that is meant to be invisible. */
        const behaviour = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, Math.max(0, from - height));
        root.style.scrollBehavior = behaviour;
      }

      /* Set last: scroll anchoring stays off (see globals.css) until the
         correction above has landed, so the browser cannot make a second
         adjustment of its own for the same removed block. */
      root.dataset.overture = "done";
      root.style.removeProperty("--veil");
      root.style.removeProperty("--stage-y");
      root.style.removeProperty("--stage-s");
      if (history.scrollRestoration) history.scrollRestoration = "auto";
      setPlayed(true);
    };

    root.dataset.overture = "running";

    /* A reload halfway through the sequence would otherwise restore the scroll
       into the middle of it, which reads as a broken page rather than as an
       opening. Start every play from the top. */
    const previousRestoration = history.scrollRestoration;
    if (history.scrollRestoration) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let span = runway.current?.offsetHeight ?? window.innerHeight * RUNWAY;
    let frame = 0;
    let finished = false;

    /* The pen that rides the scribble is placed by asking the scribble where it
       is — `getPointAtLength` on the path itself. Sampling the real geometry is
       what keeps the nib exactly on the ink at every point of a curve that has
       no closed form, and it costs one cheap call a frame. */
    let ink: SVGPathElement | null = null;
    let inkLength = 0;

    const paint = () => {
      frame = 0;
      const p = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 1;

      /* The gestures, in the order a hand would make them — and strictly one
         at a time. The windows below do not overlap, because a hand holds one
         pen: the nib has to be gone from the end of one stroke before it can
         appear at the start of the next. */
      const scribble = ease(seg(p, 0.02, 0.32));
      const write = ease(seg(p, 0.34, 0.66));
      const rule = ease(seg(p, 0.68, 0.84));
      const out = ease(seg(p, 0.84, 1));

      const set = (name: string, value: string) => root.style.setProperty(name, value);

      /* ── The sketch ──
         Two offsets, not one scaled: `stroke-dasharray` repeats, so an offset
         pushed past 1 wraps around and draws the tail of the path rather than
         delaying its head. The second pass gets its own slightly later window
         instead, which is also closer to how a second pass is actually made. */
      set("--scribble", String(1 - scribble));
      set("--scribble-2", String(1 - ease(seg(p, 0.05, 0.34))));
      /* It holds while the letters come through it, and only then goes. */
      set("--scribble-o", String(0.9 - 0.9 * ease(seg(p, 0.38, 0.62))));
      set(
        "--guide-o",
        String(0.6 * ease(seg(p, 0, 0.1)) * (1 - ease(seg(p, 0.36, 0.52)))),
      );

      /* ── The pens ──
         One rides the scribble, one writes the name, one rules the line. Three
         rather than one so the pen is never seen teleporting between two
         gestures: each fades out at the end of its own stroke. */
      set("--pen1-o", String(Math.min(1, scribble * 14) * (1 - ease(seg(p, 0.28, 0.325)))));
      set("--pen2-o", String(ease(seg(p, 0.325, 0.36)) * (1 - ease(seg(p, 0.655, 0.69)))));
      set("--pen3-o", String(ease(seg(p, 0.685, 0.72)) * (1 - ease(seg(p, 0.83, 0.87)))));

      ink ??= document.getElementById("vt-scribble") as SVGPathElement | null;
      if (ink) {
        inkLength ||= ink.getTotalLength();
        const nib = ink.getPointAtLength(scribble * inkLength);
        set("--pen1-x", `${nib.x}px`);
        set("--pen1-y", `${nib.y}px`);
      }

      /* ── The name, and the rule under it ── */
      set("--write", String(write));
      set("--rule", String(rule));

      /* ── The hand-off ── */
      set("--p", String(p));
      set("--mark-o", String(1 - out));
      set("--hint-o", String(1 - Math.min(1, p * 7)));
      set("--veil", String(1 - out));

      /* The hand-off: the lockup lifts out while the front page rises the last
         fraction of an inch into place under it, so the two read as one
         movement rather than as a swap. */
      set("--lock-y", `${-out * 56}px`);
      set("--scene-s", String(1 + out * 0.22));
      set("--scene-b", `${out * 6}px`);
      set("--stage-y", `${(1 - out) * 40}px`);
      set("--stage-s", String(0.985 + out * 0.015));

      if (p >= 1 && !finished) {
        finished = true;
        finish();
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };

    const observer = new ResizeObserver(() => {
      span = runway.current?.offsetHeight ?? window.innerHeight * RUNWAY;
      onScroll();
    });
    if (runway.current) observer.observe(runway.current);

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      if (history.scrollRestoration && previousRestoration) {
        history.scrollRestoration = previousRestoration;
      }
    };
  }, [done, skip]);

  return (
    <>
      {/* The runway: the distance the sequence is scrolled through. Absent
          from the start for anyone who has already seen it, and taken out by
          `finish` — together with the scroll it consumed — once it is over. */}
      <div
        ref={runway}
        aria-hidden="true"
        className="overture-runway"
        /* Height, not a display utility: a Tailwind `block`/`hidden` here would
           sit in the utilities layer and quietly beat the rules in globals.css
           that have to remove this element. */
        style={{ height: done ? "0px" : `${RUNWAY * 100}svh` }}
      />

      <div className="overture" data-done={done ? "true" : "false"} aria-hidden="true">
        <Scene />

        {/* The invitation. Pinned to the veil rather than to the scene, so it
            neither scales nor blurs on the way out. */}
        <div
          className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-14"
          style={{ opacity: "var(--hint-o, 1)" }}
        >
          <span className="kicker whitespace-nowrap text-muted">Scroll</span>
          <span className="block h-8 w-px overflow-hidden bg-rule">
            <span className="overture-hint block h-full w-full bg-red" />
          </span>
        </div>

        {!done && (
          <button
            type="button"
            onClick={skip}
            className="absolute bottom-7 right-5 z-10 flex items-center gap-3 py-2 text-ink transition-opacity duration-300 hover:opacity-60 md:bottom-10 md:right-10"
            style={{ opacity: "var(--hint-o, 1)" }}
          >
            <span className="kicker text-muted">Skip</span>
            <span className="h-px w-8 bg-rule-2" aria-hidden="true" />
          </button>
        )}
      </div>
    </>
  );
}

/* ── Geometry ──
   One coordinate system for the whole scene, so the scribble, the letters, the
   rule and the three pens are placed against each other exactly rather than by
   eye across separate elements.

   LEFT and RIGHT are not chosen: they are where VALOR TIMES actually lands in
   this box at this size, measured off the rendered `getBBox` and padded by a
   few units. Everything the hand draws — the scribble it starts with, the wipe
   the name is written through, the rule underneath — runs between exactly those
   two, which is what makes the sequence read as one gesture repeated rather
   than as three graphics of three different widths. */
const BOX = { w: 600, h: 230 };
/** The measure the hand writes within: everything starts and ends on these. */
const LEFT = 126;
const RIGHT = 473;
const SPAN = RIGHT - LEFT;
const BASELINE = 140;
const RULE_Y = 175;

/**
 * The scribble.
 *
 * Loose and continuous, and deliberately the size and shape of the words that
 * are about to replace it — which is what makes the swap read as one hand
 * resolving an idea rather than as two graphics being crossfaded.
 */
/**
 * The scribble.
 *
 * Loose and continuous, and drawn to the exact measure the words will occupy —
 * which is what makes the swap read as one hand resolving an idea rather than
 * as two graphics being crossfaded.
 */
const SCRIBBLE =
  "M 126 124.4 C 151.5 77.7 184.1 74.8 194 110.2 C 203.9 145.7 168.5 155.6 161.4 121.6 " +
  "C 154.3 84.7 198.2 70.6 232.2 96.1 C 263.4 120.2 250.6 149.9 228 142.8 " +
  "C 205.3 135.7 216.6 96.1 256.3 90.4 C 298.8 84.7 303 138.6 327.1 137.2 " +
  "C 354 135.7 346.9 90.4 376.7 91.8 C 405 93.2 399.4 142.8 429.1 128.7 " +
  "C 451.8 118 460.3 101.7 473 94.7";

/** A second, fainter pass over the same ground — the way a sketch is built. */
const SCRIBBLE_GHOST =
  "M 130.2 115.9 C 155.7 83.3 185.5 83.3 192.6 114.5 C 199.6 142.8 172.7 148.5 167.1 120.2 " +
  "C 161.4 90.4 199.6 80.5 229.4 101.7 C 257.7 121.6 247.8 144.2 229.4 138.6 " +
  "C 211 132.9 220.9 101.7 256.3 97.5 C 296 93.2 300.2 134.3 325.7 132.9 " +
  "C 351.2 131.5 345.5 97.5 375.3 98.9 C 402.2 100.3 397.9 137.2 426.3 124.4 " +
  "C 447.5 114.5 457.4 101.7 468.8 97.5";

/**
 * The scene: a sketch that resolves into a masthead.
 *
 * Everything lives in one SVG at one scale, absolutely centred, so no part of
 * it can push another part around as it arrives — at p = 0 the drawing is in
 * the middle of the page, and it stays there until the whole lockup lifts away.
 */
function Scene() {
  return (
    <div
      className="absolute inset-0"
      style={{
        transform: "scale(var(--scene-s, 1))",
        filter: "blur(var(--scene-b, 0px))",
        willChange: "transform, filter",
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 w-[min(92vw,46rem)]"
        style={{
          opacity: "var(--mark-o, 1)",
          transform: "translate(-50%, -50%) translateY(var(--lock-y, 0px))",
        }}
      >
        <svg
          viewBox={`0 0 ${BOX.w} ${BOX.h}`}
          className="w-full overflow-visible"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            {/* The wipe the name is written through: one rectangle whose left
                edge is fixed and whose right edge is the nib. */}
            <mask
              id="vt-write"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={BOX.w}
              height={BOX.h}
            >
              <rect
                x={LEFT - 8}
                y="0"
                width={SPAN + 16}
                height={BOX.h}
                fill="#fff"
                style={{
                  transformOrigin: `${LEFT - 8}px 0px`,
                  transform: "scaleX(var(--write, 0))",
                }}
              />
            </mask>
          </defs>

          {/* ── Paper ──
              Two pencil guides, the faintest thing on the page, there only long
              enough to say that this is a sheet being drawn on. */}
          <g style={{ opacity: "var(--guide-o, 0)" }}>
            <line
              x1={LEFT}
              y1={BASELINE}
              x2={RIGHT}
              y2={BASELINE}
              stroke="var(--color-rule-2)"
              strokeWidth="1"
            />
            <line
              x1={LEFT}
              y1={BASELINE - 62}
              x2={RIGHT}
              y2={BASELINE - 62}
              stroke="var(--color-rule)"
              strokeWidth="1"
            />
          </g>

          {/* ── The scribble ──
              Two passes at different weights, so the stroke reads as ink laid
              down by a hand rather than as one plotted curve. */}
          <g style={{ opacity: "var(--scribble-o, 0.9)" }}>
            <path
              d={SCRIBBLE_GHOST}
              stroke="var(--color-ink-2)"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.35"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: "var(--scribble-2, 1)" }}
            />
            <path
              id="vt-scribble"
              d={SCRIBBLE}
              stroke="var(--color-ink)"
              strokeWidth="2.2"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: "var(--scribble, 1)" }}
            />
          </g>

          {/* ── The name, written through the scribble ── */}
          <g mask="url(#vt-write)">
            <text
              className="display-tight"
              x={BOX.w / 2}
              y={BASELINE}
              textAnchor="middle"
              fontSize="76"
              letterSpacing="1"
              fill="var(--color-ink)"
            >
              VALOR <tspan fill="var(--color-red)">TIMES</tspan>
            </text>
          </g>

          {/* ── The rule under it ── */}
          <path
            d={`M${LEFT} ${RULE_Y} H${RIGHT}`}
            stroke="var(--color-red)"
            strokeWidth="3"
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: "calc(1 - var(--rule, 0))" }}
          />

          {/* ── The pen, three times ──
              Riding the scribble, then the name, then the rule. Each fades out
              at the end of its own stroke, so the hand is never seen jumping
              from one gesture to the next. */}
          <g
            style={{
              opacity: "var(--pen1-o, 0)",
              transform: "translate(var(--pen1-x, 56px), var(--pen1-y, 132px))",
            }}
          >
            <Pen />
          </g>

          <g
            style={{
              opacity: "var(--pen2-o, 0)",
              transform: `translate(calc(${LEFT - 8}px + var(--write, 0) * ${
                SPAN + 16
              }px), ${BASELINE}px)`,
            }}
          >
            <Pen />
          </g>

          <g
            style={{
              opacity: "var(--pen3-o, 0)",
              transform: `translate(calc(${LEFT}px + var(--rule, 0) * ${SPAN}px), ${RULE_Y}px)`,
            }}
          >
            <Pen />
          </g>
        </svg>
      </div>
    </div>
  );
}

/**
 * The nib, held at the angle a right hand holds one. Drawn at the origin with
 * its point on (0, 0), so placing it anywhere is a single translate.
 */
function Pen() {
  return (
    <g
      transform="rotate(-30)"
      stroke="var(--color-ink)"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M0 0 L-7.5 -23 L7.5 -23 Z" fill="var(--color-paper)" />
      <path d="M0 -3 V-15" strokeWidth="1.6" />
      <circle cx="0" cy="-18" r="2.4" strokeWidth="1.4" />
      <path
        d="M-7.5 -23 L-6.4 -62 Q0 -70 6.4 -62 L7.5 -23"
        fill="var(--color-paper)"
      />
      <path d="M-6.9 -37 H6.9" strokeWidth="1.4" />
    </g>
  );
}
