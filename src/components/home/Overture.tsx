"use client";

import Image from "next/image";
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
 * A white page with the paper's VT monogram blind-embossed into it — there, but
 * barely, the way a mark pressed into stock catches the light without any ink
 * in it. The reader's scroll inks it: a red press bar travels down the mark and
 * leaves it solid black behind, and once it is whole it lifts away and the
 * front page is already there beneath it, where the scroll left it.
 *
 * It used to be a hand drawing the name: a pen, a scribble, the letters written
 * through it, a rule ruled underneath. That was a picture *of* a masthead being
 * made, and the trouble with a picture of the masthead is that it is not the
 * masthead — the paper has a real mark, and the reader was being shown a
 * drawing of one instead. So the sequence now opens on the thing itself.
 *
 * ── How it works
 * A tall invisible runway sits above the homepage. The reader's scroll through
 * it *is* the sequence: one number, `--p` (0 → 1), which every part of the
 * scene reads. Nothing runs on a timer, so it can never get ahead of the reader
 * or fall behind them. The runway is short — a mark is read at a glance, and
 * there is nothing here to watch being made.
 *
 * React renders once. After that a rAF-throttled scroll handler writes a
 * handful of custom properties onto <html> and the compositor does the rest —
 * no re-render, no layout, and every animated property is a transform, an
 * opacity or a filter.
 *
 * ── Who has to watch it
 * Nobody, twice. The sequence is marked seen in `sessionStorage` the moment it
 * finishes, so a reader moving around the site and coming back to the front
 * page lands straight on the front page, and `Skip` or `Escape` jump to the end
 * at any point.
 *
 * ── Reduced motion
 * This sequence deliberately ignores `prefers-reduced-motion`, which is a
 * decision the paper made rather than an oversight — so it is written down here
 * rather than left to be discovered.
 *
 * Almost none of it is motion in the sense the setting means. There is no
 * autoplay, no loop and no parallax: the mark arrives exactly as far as the
 * reader's own scroll brings it and stops dead when they stop, which is direct
 * manipulation rather than animation. The closing lift and blur are the only
 * exceptions, and they last a fifth of one screen.
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
 * Runway length, in viewport heights. Shorter than it was when a hand had to
 * draw the name: there is one thing to look at now, and a reader recognises
 * their own paper's mark in rather less than a screen.
 */
const RUNWAY = 0.9;

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

    const paint = () => {
      frame = 0;
      const p = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 1;

      /* The mark inks in, holds, and lifts out. Nothing overlaps: the ink is
         laid before the press bar leaves, and the bar is gone well before the
         lockup starts to move, so there is only ever one thing happening. */
      const fill = ease(seg(p, 0.03, 0.6));
      const settle = ease(seg(p, 0, 0.34));
      const out = ease(seg(p, 0.74, 1));

      const set = (name: string, value: string) => root.style.setProperty(name, value);

      /* The ink line, expressed twice: `--ink-cut` is how much of the mark is
         still unlaid, `--ink-edge` is where that boundary sits. They are the
         same number from two ends, computed here rather than in a CSS calc so
         the glyph inset above is applied once, in the place it is explained. */
      const cut = (1 - fill) * (100 - GLYPH_TOP);
      set("--ink-cut", `${cut}%`);
      set("--ink-edge", `${100 - cut}%`);

      /* The bar exists only while it has ink to lay: it strikes the top of the
         mark, runs down it, and is gone by the time the last of the black
         lands. A bar still sitting on a finished mark is a progress indicator,
         which is not what this is. */
      set("--bar-o", String(ease(seg(p, 0.03, 0.09)) * (1 - ease(seg(p, 0.52, 0.62)))));

      /* One opacity and one translate carry both ends of the lockup: it settles
         the last few pixels onto its line on the way in and lifts out of frame
         on the way out, and because both drive the same two properties neither
         can fight the other for the same pixel. */
      set("--mark-o", String(1 - out));
      set("--lock-y", `${(1 - settle) * 10 - out * 56}px`);

      /* ── The hand-off ──
         The lockup lifts out while the front page rises the last fraction of an
         inch into place under it, so the two read as one movement rather than
         as a swap. */
      set("--p", String(p));
      set("--hint-o", String(1 - Math.min(1, p * 7)));
      set("--veil", String(1 - out));
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

/* ── The plate ──
   Where the glyph actually sits inside vt.png, as a percentage of the file.
   Measured off the pixels, not guessed: the artwork is a 512px square with the
   monogram inset roughly 7% at the sides and 10% top and bottom.

   The ink line has to travel between exactly these, or the press bar spends the
   first tenth of its run laying ink onto empty margin and the mark appears to
   start late. */
const GLYPH_TOP = 10.2;

/**
 * The scene: the mark, inked in.
 *
 * Just the monogram — not the masthead lockup. The name is printed at the top
 * of every page of this site and on the front page the reader is about to be
 * handed; setting it a fourth time, at 80px, in the one frame that has the
 * whole screen to itself, is the paper repeating itself. The monogram is the
 * one piece of the identity that can stand alone, so it is the one that does.
 *
 * It is drawn twice, stacked exactly. Underneath, the whole mark at 10% — the
 * blind emboss, the impression a press leaves in stock it has not inked. On
 * top, the same mark at full black, clipped to whatever the ink line has
 * reached. Scrolling moves that line down, and the mark fills in behind it.
 *
 * Two copies rather than one animated fill because the emboss has to be there
 * at p = 0: a reader who lands on a genuinely blank sheet does not know there
 * is anything to scroll for, and the mark showing faintly is the invitation.
 * It also means nothing can flash — the server renders this with no custom
 * properties set, and every fallback below is the unscrolled state.
 *
 * Absolutely centred, so nothing in it can push anything else around as it
 * arrives: at p = 0 the mark is in the middle of the page and it stays there
 * until it lifts away.
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
      {/* Square, and sized off the viewport rather than the type ladder: this
          is the one place on the site the mark is not standing next to a word,
          so it has nothing to be measured against but the page. */}
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[clamp(7rem,26vw,13rem)]"
        style={{
          opacity: "var(--mark-o, 1)",
          transform: "translate(-50%, -50%) translateY(var(--lock-y, 0px))",
          willChange: "opacity, transform",
        }}
      >
        {/* The emboss. */}
        <Image
          src="/mark/vt.png"
          alt=""
          fill
          sizes="(max-width: 800px) 26vw, 208px"
          priority
          className="object-contain opacity-[0.1]"
        />

        {/* The ink, laid down to the line. */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: "inset(0 0 var(--ink-cut, 89.8%) 0)",
            willChange: "clip-path",
          }}
        >
          <Image
            src="/mark/vt.png"
            alt=""
            fill
            sizes="(max-width: 800px) 26vw, 208px"
            priority
            className="object-contain"
          />
        </div>

        {/* The press bar, riding the line it is laying. Wider than the mark and
            hairline-thin: it reads as a rule passing over the plate rather than
            as a loading bar filling up, which is the difference between the
            paper printing itself and a spinner. */}
        <div
          aria-hidden="true"
          className="absolute -left-[7%] -right-[7%] h-px bg-red"
          style={{
            top: "var(--ink-edge, 10.2%)",
            opacity: "var(--bar-o, 0)",
            willChange: "top, opacity",
          }}
        />
      </div>
    </div>
  );
}
