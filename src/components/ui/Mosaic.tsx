import type { CSSProperties } from "react";

interface MosaicProps {
  /** `<li>` items — MosaicCard renders its own, so pass those. */
  children: React.ReactNode;
  /** Accessible name for the board, e.g. "Culture and back-page artwork". */
  label: string;
  /** Number of pieces on the board, for the foot readout. */
  count: number;
  /** Sits at the foot beside the counter — a category link, usually. */
  action?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A board rather than a rail.
 *
 * Every other collection on the site is a fixed frame — a rail of 4:5 cards, a
 * grid of equal rows — and a fixed frame has to decide, for each piece of
 * artwork, what to throw away. That is the right trade almost everywhere: a run
 * of photographs cropped to one ratio reads as a run, and the paper's front
 * page is built out of exactly that. But it is the wrong trade for the two
 * desks whose artwork is not photographs — a drawn back page and a clipping of
 * printed type are documents, and the crop takes a panel or half a sentence.
 *
 * So this one is laid out the way a picture desk lays out a board: nothing is
 * cut to fit, each piece is pinned at its own proportions, and the columns take
 * whatever heights that produces. It is CSS multi-column rather than a grid
 * because a grid would have to be told each card's height in advance and the
 * whole point is that nothing here knows its height until the artwork does —
 * `break-inside: avoid` on the cards is the only instruction the browser needs.
 *
 * That also means it costs no JavaScript. The Rail beside it is a client
 * component because scrolling has to be measured and reported; a board is read
 * all at once, so this stays on the server and ships nothing.
 *
 * Reading order is column order — the browser fills the first column top to
 * bottom before starting the second — so the run this is handed should already
 * be in the order it wants to be read. See PictureDesk, which interleaves two
 * desks precisely so neither of them stacks into a column of its own.
 */
export function Mosaic({
  children,
  label,
  count,
  action,
  className = "",
  style,
}: MosaicProps) {
  return (
    <div className={className} style={style}>
      {/* Two columns even on a phone. One column is a list, and a list is what
          the rest of the page already does; the board only says anything at
          all once two pieces of different heights stand side by side. */}
      <ul
        aria-label={label}
        className="columns-2 gap-x-5 md:columns-3 md:gap-x-7 xl:columns-4 xl:gap-x-8"
      >
        {children}
      </ul>

      {/* The same foot the rails carry — a count, a hairline, a way out —
          minus the position readout, which a board has no use for. */}
      <div className="mt-4 flex items-center gap-5 md:gap-8">
        <span className="kicker shrink-0 tabular-nums text-muted">
          <span className="text-red">{pad(count)}</span> pinned
        </span>
        <div className="h-px flex-1 bg-rule" aria-hidden="true" />
        {action}
      </div>
    </div>
  );
}
