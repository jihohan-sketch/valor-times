"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The opening.
 *
 * BLANK PAPER → SKETCH → EDITORIAL FURNITURE → THE VT MARK → THE MASTHEAD
 *
 * Three and a fifth seconds in which the paper draws itself. A white sheet, a
 * pen that scribbles for the shape and then commits to it, the section names
 * ruled in around the edges the way a page is roughed out, and then the
 * strokes flood with ink and resolve into the paper's actual VT monogram —
 * which does not fade out afterwards but flies up into the masthead and
 * becomes the logo in the bar, with the front page rising underneath it.
 *
 * ── Why the mark is never redrawn
 * The letterforms on screen are always `/mark/vt.png`, the real asset. Nothing
 * here is a lookalike traced in vectors. The sketch strokes are the mark's own
 * skeleton — measured off the artwork's pixels, not guessed — and they do two
 * jobs at once: the reader watches them being drawn as ink, and the same eight
 * paths are the `<mask>` through which the real file is revealed. So when the
 * ink floods, it floods *along the lines the pen just drew*, and the mark
 * appears to have been inside the drawing the whole time. It is one object
 * seen twice, not a scribble swapped for a logo.
 *
 * ── The hand-off
 * The last beat is a FLIP. The mark's box is measured, the masthead's mark is
 * measured, and the difference becomes one `translate`/`scale` transition. It
 * lands on the real logo to the pixel, the bar fades up around it, the front
 * page rises into place, and the intro is removed. There is no cut anywhere.
 *
 * ── Who has to watch it
 * Nobody twice, and nobody who has asked not to. `sessionStorage` marks it
 * seen, and `prefers-reduced-motion` skips it outright — both are read by the
 * inline script in the document head (see layout.tsx) so the decision is made
 * before the first paint rather than a frame into it. `Skip` and `Escape` end
 * it at any point.
 *
 * ── Cost
 * React renders once. Every beat is a CSS animation on a `transform`, an
 * `opacity` or a `stroke-dashoffset`; nothing lays out, and the only JavaScript
 * running during the sequence is a pair of timers and one `getBoundingClientRect`
 * at 2.45s. The front page is server-rendered underneath the whole time, so the
 * moment the veil clears it is already there — the intro costs the reader no
 * waiting, only the three seconds it asked for.
 */

const SEEN_KEY = "vt:overture-seen";

/** ── The clock, in milliseconds from the first frame ──
 *  Every delay below is quoted straight into an `animation-delay`, so this
 *  block is the whole timeline and the only place to retune it. */
const T = {
  /** The mark is measured against the masthead and takes off. */
  FLIGHT: 2620,
  /** Flight length. The veil, the bar and the front page all move inside it. */
  FLIGHT_DUR: 700,
  /** Everything is over; the intro leaves the document. Fifty milliseconds
   *  past the end of the flight — long enough for the flown mark to be sitting
   *  exactly on the masthead's own before the two are swapped, and short
   *  enough that nobody waits for it. */
  END: 3370,
  /** How long the whole thing takes to dissolve when a reader skips it. */
  SKIP_DUR: 300,
} as const;

/* ── The skeleton ──
   Where each stroke of the monogram actually runs, in the artwork's own 512
   coordinate space. These were read off the PNG's pixels rather than eyeballed:
   the thick V descends from (116,62) to the vertex at (233,452), the hairline
   V climbs back out to (386,62), the T's stem holds x≈321 for its whole drop,
   and the crossbar is a hairline at y≈101 with heavy slabs at both ends.

   `w` is the mask width — how wide the ink has to swell for that stroke to
   cover its share of the glyph. They are deliberately generous: the artwork is
   transparent everywhere outside the letterforms, so a mask that overshoots
   reveals nothing at all, while one that undershoots leaves a bald patch.

   `pen` is the sketch width: what the hand draws, before any ink.
   `at`/`dur` are when the pen draws it. `ink` is when the black floods it.
   `ox`/`oy`/`or` are the hand's error — a couple of pixels and a fraction of a
   degree off true, corrected during the converge beat so the strokes are
   already aligned by the time the ink finds them. */
const STROKES = [
  // The V's thick downstroke — the first mark anyone makes drawing this.
  { d: "M116 62C150 180 215 330 233 452", w: 92, pen: 9.5, at: 480, dur: 520, ink: 1540, ox: -6, oy: 3, or: -0.9 },
  // Back up the hairline to the top right.
  { d: "M233 452C280 330 340 190 386 62", w: 22, pen: 5.5, at: 700, dur: 440, ink: 1580, ox: 5, oy: -3, or: 0.8 },
  // The T's stem, straight down through the V.
  { d: "M321 96C318 200 324 340 321 452", w: 58, pen: 9, at: 880, dur: 400, ink: 1620, ox: 4, oy: 2, or: 0.6 },
  // The crossbar: one hairline ruled the full width.
  { d: "M92 101C200 98 360 104 470 100", w: 16, pen: 4.5, at: 1000, dur: 340, ink: 1660, ox: 0, oy: -4, or: -0.4 },
  // The V's top serif slab.
  { d: "M50 80L172 80", w: 50, pen: 6.5, at: 1080, dur: 300, ink: 1700, ox: -4, oy: -3, or: -0.5 },
  // The T's top serif slab.
  { d: "M344 80L432 80", w: 50, pen: 6.5, at: 1130, dur: 290, ink: 1725, ox: 4, oy: -3, or: 0.5 },
  // The foot the two letters share.
  { d: "M228 452L394 452", w: 20, pen: 5.5, at: 1180, dur: 280, ink: 1750, ox: 0, oy: 4, or: 0.4 },
  // The bracket curling off the end of the crossbar.
  { d: "M424 112C452 132 468 156 470 188", w: 34, pen: 5.5, at: 1230, dur: 270, ink: 1775, ox: 5, oy: 2, or: 0.9 },
] as const;

/* The scribble: one loose loop hunting for the shape before the hand commits.
   Drawn first, gone by the time the real strokes finish, and never inked — it
   is the only thing in the sequence that is not part of the mark, which is
   exactly why it has to leave. */
const SCRIBBLE =
  "M74 388C132 268 108 154 208 132C292 114 336 190 292 268C252 338 150 356 168 268C190 160 358 140 420 214C470 274 424 372 330 402C258 424 160 414 116 372";

/* ── The page being roughed out ──
   The desks, ruled in around the edge the way a layout is blocked before any
   story is set. Six names, two abstract columns, two ticks — and then they all
   converge inward and go, because the last thing this frame needs is furniture
   competing with the mark it is building. The middle two stand down on a
   phone, where there is no room for them beside the mark. */
const DESKS = [
  { label: "News", x: 13, y: 20, side: "l", at: 700, phone: true },
  { label: "Culture", x: 87, y: 27, side: "r", at: 760, phone: true },
  { label: "Opinion", x: 10, y: 46, side: "l", at: 820, phone: false },
  { label: "Science", x: 90, y: 54, side: "r", at: 880, phone: false },
  { label: "Student Voices", x: 16, y: 77, side: "l", at: 940, phone: true },
  { label: "Sports", x: 84, y: 84, side: "r", at: 1000, phone: true },
] as const;

/** Abstract columns — set copy at the size it reads from across a room. */
const COLUMNS = [
  { x: 22, y: 33, w: 5, lines: [100, 82, 94, 61], at: 820, phone: false },
  { x: 73, y: 65, w: 6, lines: [100, 74, 90, 55, 80], at: 900, phone: false },
] as const;

export function Overture() {
  const shell = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  /* One latch for the whole component: the sequence ends exactly once, whether
     it ran out or a reader cut it short. */
  const ending = useRef(false);

  /** Take the intro out of the document and hand the page over. */
  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* Private mode. The intro simply plays again next time. */
    }
    document.documentElement.dataset.overture = "done";
    setGone(true);
  }, []);

  /** Skip and Escape: dissolve what is on screen and land on the front page. */
  const skip = useCallback(() => {
    if (ending.current) return;
    ending.current = true;
    /* `landing` is what brings the bar and the front page up — a skip is the
       same hand-off as the full sequence, just without the flight. */
    document.documentElement.dataset.overture = "landing";
    if (shell.current) shell.current.dataset.skip = "true";
    window.setTimeout(finish, T.SKIP_DUR);
  }, [finish]);

  useEffect(() => {
    const root = document.documentElement;

    /* Already watched this session, or the reader has asked for less motion.
       Both were caught by the inline script in the head, so the intro has been
       `display: none` since before the first paint and no beat of it will ever
       run — `data-run` never flips, and every animation above is scoped to it.

       It is left mounted rather than unmounted here on purpose. Dropping it
       would mean deciding during render that the client renders something the
       server did not, which is a hydration mismatch for a node the reader
       cannot see either way. Inert markup is the cheaper of the two. */
    if (root.dataset.overture === "done") return;

    root.dataset.overture = "running";

    /* An opening nobody is watching is not an opening. A page opened into a
       background tab gets the front page instead — the browser hands a hidden
       tab no frames but keeps its clock running, so the alternative is a reader
       arriving at a sequence that already played itself out behind their back,
       frozen on whichever frame it had reached. Checked before anything below
       is scheduled, so nothing is left running for a sequence that never was.

       The cost, named: someone who opens the site in a background tab and comes
       to it a minute later never sees the intro. Holding it for them would mean
       a white sheet waiting in a tab they have not opened yet, and a stranger
       surprise than simply landing on the paper. */
    if (document.hidden) {
      skip();
      return;
    }

    /* A reload mid-sequence would otherwise restore the scroll into the middle
       of a page the reader cannot see. Every play starts at the top. */
    window.scrollTo(0, 0);

    const timers: number[] = [];

    /* Roll. Every beat of Scenes 1–5 is a CSS animation scoped to this
       attribute, so this one line is the start gun and they can never begin
       half-started or out of step with each other.

       It is set here, in a passive effect, rather than from a
       `requestAnimationFrame`: a rAF start gun never goes off in a tab that is
       handed no frames, while the timers below would run on regardless. The
       check above means we are only ever here with a visible tab, and the
       visibility handler further down covers a reader who leaves mid-sequence —
       but a start gun that cannot misfire in the first place is worth more than
       either of them. */
    if (shell.current) shell.current.dataset.run = "true";

    /* ── The hand-off ──
       Measure the mark where it is, measure the masthead's logo where it
       belongs, and turn the difference into one transform. Everything else in
       this beat — the veil clearing, the bar arriving, the front page rising —
       hangs off `data-overture="landing"` and runs inside the same 700ms. */
    timers.push(
      window.setTimeout(() => {
        if (ending.current) return;
        ending.current = true;

        const from = mark.current?.getBoundingClientRect();
        const to = document
          .querySelector("[data-vt-mark]")
          ?.getBoundingClientRect();

        if (mark.current && from && to && from.width > 0 && to.width > 0) {
          mark.current.style.setProperty(
            "--fx",
            `${to.left + to.width / 2 - (from.left + from.width / 2)}px`,
          );
          mark.current.style.setProperty(
            "--fy",
            `${to.top + to.height / 2 - (from.top + from.height / 2)}px`,
          );
          mark.current.style.setProperty("--fs", String(to.width / from.width));
        }

        root.dataset.overture = "landing";
        if (shell.current) shell.current.dataset.fly = "true";
      }, T.FLIGHT),
    );

    timers.push(window.setTimeout(finish, T.END));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };

    /* And the same if they leave for another tab halfway through. `skip` is
       exactly the right ending for it: the hand-off, without the flight. */
    const onVisibility = () => {
      if (document.hidden) skip();
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [finish, skip]);

  if (gone) return null;

  return (
    <div ref={shell} className="overture" data-run="false" data-fly="false" data-skip="false">
      {/* The sheet. Warm rather than white, and lit slightly from the middle,
          so it reads as stock under a lamp instead of as a blank div. */}
      <div className="ov-veil" aria-hidden="true" />

      {/* ── The page being roughed out ── */}
      <div className="ov-desks" aria-hidden="true">
        {DESKS.map((desk) => (
          <div
            key={desk.label}
            className={`ov-desk ${desk.phone ? "" : "ov-phone-hide"}`}
            data-side={desk.side}
            style={{
              [desk.side === "r" ? "right" : "left"]: `${desk.side === "r" ? 100 - desk.x : desk.x}%`,
              top: `${desk.y}%`,
              /* The stagger, as a variable rather than an `animation-delay` —
                 see the note beside `.ov-desk` in globals.css for why. */
              "--in": `${desk.at}ms`,
            } as React.CSSProperties}
          >
            <span className="kicker">{desk.label}</span>
            <span
              className="ov-desk-rule"
              style={{ "--in": `${desk.at + 90}ms` } as React.CSSProperties}
            />
          </div>
        ))}

        {COLUMNS.map((column) => (
          <div
            key={`${column.x}-${column.y}`}
            className={`ov-column ${column.phone ? "" : "ov-phone-hide"}`}
            style={{ left: `${column.x}%`, top: `${column.y}%`, width: `${column.w}%` }}
          >
            {column.lines.map((width, line) => (
              <span
                key={line}
                style={
                  {
                    width: `${width}%`,
                    "--in": `${column.at + line * 55}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        ))}

        {/* Two ticks in the paper's red — a sub-editor's marks, nothing more. */}
        <span
          className="ov-tick ov-phone-hide"
          style={{ left: "31%", top: "62%", "--in": "950ms" } as React.CSSProperties}
        />
        <span
          className="ov-tick"
          style={{ left: "66%", top: "17%", "--in": "1010ms" } as React.CSSProperties}
        />
      </div>

      {/* ── The mark ──
          One box, drawn twice and stacked: the pen on top, the real artwork
          underneath, masked by the pen's own lines. This is the element that
          flies into the masthead. */}
      <div ref={mark} className="ov-mark" aria-hidden="true">
        <svg viewBox="0 0 512 512" className="ov-svg" role="presentation">
          <defs>
            {/* The hand. A little turbulence displacing the sketch layer is
                what keeps the strokes from reading as vector art — the lines
                waver by a pixel or two the way an inked line does. It is never
                applied to the artwork below, which stays exact. */}
            <filter id="ov-hand" x="-12%" y="-12%" width="124%" height="124%">
              <feTurbulence type="fractalNoise" baseFrequency="0.011 0.021" numOctaves="2" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            {/* The ink. The same eight paths as the sketch, swollen to the
                width of the letterforms they belong to; the flood behind them
                closes the last of the glyph once they have all landed. */}
            <mask id="ov-ink" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
              {STROKES.map((stroke) => (
                <path
                  key={stroke.d}
                  className="ov-ink-path"
                  d={stroke.d}
                  pathLength={1}
                  stroke="#fff"
                  strokeWidth={stroke.w}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ animationDelay: `${stroke.ink}ms` }}
                />
              ))}
              <rect className="ov-flood" x="0" y="0" width="512" height="512" fill="#fff" />
            </mask>
          </defs>

          {/* The paper's actual monogram, revealed through the drawing. */}
          <image
            className="ov-plate"
            href="/mark/vt.png"
            x="0"
            y="0"
            width="512"
            height="512"
            mask="url(#ov-ink)"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* The pen. */}
          <g className="ov-hand" filter="url(#ov-hand)">
            <path
              className="ov-scribble"
              d={SCRIBBLE}
              pathLength={1}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {STROKES.map((stroke) => (
              <path
                key={stroke.d}
                className="ov-pen"
                d={stroke.d}
                pathLength={1}
                fill="none"
                strokeWidth={stroke.pen}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={
                  {
                    "--ox": `${stroke.ox}px`,
                    "--oy": `${stroke.oy}px`,
                    "--or": `${stroke.or}deg`,
                    "--at": `${stroke.at}ms`,
                    "--dur": `${stroke.dur}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </g>
        </svg>
      </div>

      {/* ── The name ──
          Held for four hundred milliseconds, then handed over. Set exactly as
          the masthead sets it, because in four hundred milliseconds it is
          about to become the masthead. */}
      <div className="ov-lockup" aria-hidden="true">
        <span className="ov-name display-tight">
          <span>VALOR</span>
          <span className="text-red">TIMES</span>
        </span>
        <span className="ov-sub kicker">Student Journalism</span>
      </div>

      <button type="button" onClick={skip} className="ov-skip">
        <span className="kicker text-muted">Skip</span>
        <span className="ov-skip-rule" aria-hidden="true" />
      </button>
    </div>
  );
}
