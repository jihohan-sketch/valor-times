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
 * A white page with the wordmark on it, a pen that writes the red rule under
 * the name, and a front page that typesets itself underneath — the paper being
 * made, in the order it is actually made. Then the white dissolves and the real
 * front page is already there, one screen down, where the scroll left it.
 *
 * ── How it works
 * A tall invisible runway sits above the homepage. Scrolling through it moves a
 * single number, `--p` (0 → 1), which every part of the scene reads. React
 * renders once; after that a rAF-throttled scroll handler writes a dozen custom
 * properties onto <html> and the compositor does the rest. Nothing re-renders,
 * nothing lays out, and every animated property is transform, opacity or
 * filter — which is what keeps it honest on a phone.
 *
 * ── Who has to watch it
 * Nobody, twice. The sequence is marked seen in `sessionStorage` the moment it
 * finishes, so a reader moving around the site and coming back to the front
 * page lands straight on the front page. `Skip` and `Escape` jump to the end at
 * any point, and `prefers-reduced-motion` removes the whole thing — runway
 * included — before it can ever cost a scroll.
 */

/** Runway length, in viewport heights. Long enough to read as a sequence. */
const RUNWAY = 1.85;

const SEEN_KEY = "vt:overture-seen";

/** Progress through one phase of the sequence, clamped to 0…1. */
const seg = (p: number, from: number, to: number) =>
  Math.min(1, Math.max(0, (p - from) / (to - from)));

/** Smoothstep, so a phase eases in and out of its own span. */
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Whether this reader should be shown the sequence at all — read straight from
 * the browser rather than kept in React state, because it is a fact about the
 * environment, not something this component owns.
 *
 * Answered through `useSyncExternalStore` so it can be read during render on
 * the client while the server always renders the sequence: the alternative is a
 * `setState` in an effect, which is a second render pass for something that was
 * already known before the first one.
 */
const subscribeNever = () => () => {};

function readSkipped(): boolean {
  try {
    if (sessionStorage.getItem(SEEN_KEY) === "1") return true;
  } catch {
    /* Storage unavailable — treat as a first visit. */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Overture() {
  const runway = useRef<HTMLDivElement>(null);
  const skipped = useSyncExternalStore(subscribeNever, readSkipped, () => false);
  const [played, setPlayed] = useState(false);
  const done = skipped || played;

  /** Jump to the end of the runway — the Skip button and Escape both land here. */
  const skip = useCallback(() => {
    const height = runway.current?.offsetHeight ?? window.innerHeight;
    window.scrollTo({ top: height, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // Readers who have already seen it, and readers who asked for less motion,
    // never enter the runway: it is gone on the first paint after mount.
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
         land in a screen and a half of blank paper with no sequence left to
         play in it. The reader ends at the top of the front page, which is
         where the sequence has spent its whole length pointing. */
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

    let length = runway.current?.offsetHeight ?? window.innerHeight * RUNWAY;
    let frame = 0;
    let finished = false;

    const paint = () => {
      frame = 0;
      const p = length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 1;

      const mark = ease(seg(p, 0, 0.13));
      const nib = seg(p, 0.15, 0.29);
      const write = ease(seg(p, 0.27, 0.5));
      const sheet = ease(seg(p, 0.44, 0.62));
      const type = seg(p, 0.52, 0.8);
      const out = ease(seg(p, 0.76, 1));

      const set = (name: string, value: string) => root.style.setProperty(name, value);

      set("--p", String(p));
      set("--mark-o", String(mark * (1 - out)));
      set("--mark-y", `${(1 - mark) * 16 - out * 46}px`);
      set("--nib-draw", String(1 - nib));
      set("--nib-o", String(Math.min(1, nib * 4) * (1 - ease(seg(p, 0.5, 0.6)))));
      set("--write", String(write));
      set("--lock-y", `${-sheet * 15}vh`);
      set("--lock-s", String(1 - sheet * 0.34));
      set("--sheet-o", String(sheet * (1 - out)));
      set("--sheet-y", `${(1 - sheet) * 26}px`);
      set("--type", String(type));
      set("--scene-s", String(1 + out * 0.3));
      set("--scene-b", `${out * 7}px`);
      set("--hint-o", String(1 - Math.min(1, p * 7)));
      set("--veil", String(1 - out));
      set("--stage-y", `${(1 - out) * 40}px`);
      set("--stage-s", String(0.982 + out * 0.018));

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
      length = runway.current?.offsetHeight ?? window.innerHeight * RUNWAY;
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
          from the start for anyone who skips it, and taken out by `finish`
          — together with the scroll it consumed — the moment it is over. */}
      <div
        ref={runway}
        aria-hidden="true"
        className="overture-runway"
        /* Height, not a display utility: a Tailwind `block`/`hidden` here would
           sit in the utilities layer and quietly beat the reduced-motion rule
           in globals.css that has to remove this element. */
        style={{ height: done ? "0px" : `${RUNWAY * 100}svh` }}
      />

      <div
        className="overture"
        data-done={done ? "true" : "false"}
        aria-hidden="true"
      >
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
            aria-hidden="false"
          >
            <span className="kicker text-muted">Skip</span>
            <span className="h-px w-8 bg-rule-2" aria-hidden="true" />
          </button>
        )}
      </div>
    </>
  );
}

/**
 * The scene: two layers in the middle of an empty page.
 *
 * The lockup — the name, and the red rule a pen draws under it — is centred
 * exactly, and stays centred while it is the only thing on screen. The front
 * page forms as a second layer below it, and the lockup lifts and shrinks to
 * make room, so the two never fight for the same space and neither one is
 * pushed around by the other's layout. Both are absolutely placed for that
 * reason: at p = 0 the wordmark is in the centre of the page, full stop.
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
      {/* ── The lockup ── */}
      <div
        className="absolute left-1/2 top-1/2 w-[min(88vw,34rem)] px-6"
        style={{
          transform:
            "translate(-50%, -50%) translateY(var(--lock-y, 0vh)) scale(var(--lock-s, 1))",
        }}
      >
        <div
          className="display-tight flex items-baseline justify-center gap-[0.14em] text-[clamp(2.25rem,8vw,4rem)] whitespace-nowrap"
          style={{
            opacity: "var(--mark-o, 0)",
            transform: "translate3d(0, var(--mark-y, 16px), 0)",
          }}
        >
          <span>VALOR</span>
          <span className="text-red">TIMES</span>
        </div>

        {/* ── The pen, and the rule it writes ── */}
        <svg
          viewBox="0 0 520 118"
          className="mx-auto mt-1 block w-[min(78vw,27rem)]"
          fill="none"
          aria-hidden="true"
        >
          {/* The rule appears from under the nib rather than fading in, which
              is the difference between a line being drawn and a line arriving. */}
          <path
            d="M40 100 H480"
            stroke="var(--color-red)"
            strokeWidth="2.5"
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: "calc(1 - var(--write, 0))" }}
          />

          {/* The pen rides the end of its own line. It draws itself in first —
              nib, slit, barrel — and only then starts to move. */}
          <g
            style={{
              opacity: "var(--nib-o, 0)",
              transform: "translateX(calc(var(--write, 0) * 440px))",
            }}
          >
            <g
              transform="translate(40 100) rotate(-31)"
              stroke="var(--color-ink)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: "var(--nib-draw, 1)" }}
            >
              {/* Nib, with its slit and breather hole. */}
              <path d="M0 0 L-7.5 -23 L7.5 -23 Z" fill="var(--color-paper)" />
              <path d="M0 -3 V-15" strokeWidth="1.6" />
              <circle cx="0" cy="-18" r="2.4" strokeWidth="1.4" />
              {/* Barrel. */}
              <path
                d="M-7.5 -23 L-6.4 -62 Q0 -70 6.4 -62 L7.5 -23"
                fill="var(--color-paper)"
              />
              <path d="M-6.9 -37 H6.9" strokeWidth="1.4" />
            </g>
          </g>
        </svg>
      </div>

      {/* ── The front page, setting itself ── */}
      <svg
        viewBox="0 0 300 210"
        className="absolute left-1/2 top-1/2 w-[min(74vw,20rem)]"
        fill="none"
        aria-hidden="true"
        style={{
          opacity: "var(--sheet-o, 0)",
          transform:
            "translate(-50%, -50%) translateY(10vh) translateY(var(--sheet-y, 26px))",
        }}
      >
        <rect
          x="0.5"
          y="0.5"
          width="299"
          height="209"
          fill="var(--color-paper)"
          stroke="var(--color-rule-2)"
        />
        {/* Masthead bar and the red rule under it — the page's own version of
            the lockup above, which is the joke the sequence is built on. */}
        <rect x="20" y="16" width="120" height="9" fill="var(--color-ink)" />
        <rect
          x="20"
          y="31"
          width="260"
          height="1.5"
          fill="var(--color-red)"
          style={{
            transformOrigin: "20px 31px",
            transform: "scaleX(var(--type, 0))",
          }}
        />
        {/* The lead plate. */}
        <rect
          x="20"
          y="42"
          width="164"
          height="76"
          fill="var(--color-shell-deep)"
          style={{
            transformOrigin: "20px 42px",
            transform: "scaleY(calc(clamp(0, var(--type, 0) * 3, 1)))",
          }}
        />
        <Columns />
      </svg>
    </div>
  );
}

/** Columns of type, set line by line as the page is made up. */
function Columns() {
  const columns = [
    { x: 194, from: 42, lines: 7 },
    { x: 20, from: 128, lines: 6 },
    { x: 108, from: 128, lines: 6 },
    { x: 196, from: 128, lines: 6 },
  ];

  return (
    <>
      {columns.map((column) =>
        Array.from({ length: column.lines }, (_, line) => {
          const y = column.from + line * 12;
          /* Each line waits its turn, so the page fills the way a page fills. */
          const start = (y - 42) / 190;
          return (
            <rect
              key={`${column.x}-${y}`}
              x={column.x}
              y={y}
              width={line === column.lines - 1 ? 56 : 86}
              height="4"
              fill="var(--color-rule)"
              style={{
                transformOrigin: `${column.x}px ${y}px`,
                transform: `scaleX(calc(clamp(0, (var(--type, 0) - ${start.toFixed(
                  3,
                )}) * 4, 1)))`,
              }}
            />
          );
        }),
      )}
    </>
  );
}
