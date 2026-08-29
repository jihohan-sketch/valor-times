"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface RailProps {
  children: React.ReactNode;
  /** Number of items, for the "03 / 08" counter. */
  count: number;
  /** Accessible name for the scroll region, e.g. "Culture & Lifestyle stories". */
  label: string;
  /** Sits beside the arrows — a category link, usually. */
  action?: React.ReactNode;
  tone?: "ink" | "paper";
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A horizontal editorial rail.
 *
 * Bleeds past the right edge of the shell so the next card is always partly
 * visible, snaps on touch, steps a card at a time from the arrows, and reports
 * position with a counter and a hairline progress bar. Keyboard users get the
 * arrows; the region itself is focusable and scrolls with the arrow keys.
 */
export function Rail({
  children,
  count,
  label,
  action,
  tone = "ink",
  className = "",
}: RailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 8 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 1);
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft >= max - 8);

    const first = el.firstElementChild as HTMLElement | null;
    if (first) {
      const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
      const step = first.offsetWidth + gap;
      if (step > 0) {
        setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / step))));
      }
    }
  }, [count]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    measure();
    el.addEventListener("scroll", measure, { passive: true });

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const step = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const distance = first ? first.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: distance * direction, behavior: "smooth" });
  };

  const onPaper = tone === "paper";
  /* Thumb never shrinks below a visible sliver, however many cards there are. */
  const thumb = Math.max(12, 100 / Math.max(1, count));
  const arrowBase =
    "grid h-11 w-11 place-items-center border transition-colors duration-200 disabled:cursor-default";
  const arrowTone = onPaper
    ? "border-paper/25 text-paper hover:border-paper hover:bg-paper hover:text-ink disabled:border-paper/10 disabled:text-paper/25 disabled:hover:bg-transparent"
    : "border-rule-2 text-ink hover:border-ink hover:bg-ink hover:text-paper disabled:border-rule disabled:text-rule-2 disabled:hover:bg-transparent";

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="rail -mr-5 gap-5 pr-5 md:-mr-10 md:gap-7 md:pr-10 xl:-mr-14 xl:pr-14"
      >
        {children}
      </div>

      {/* Position readout, progress rule and controls. */}
      <div className="mt-7 flex items-center gap-5 md:gap-8">
        <span
          className={`kicker tabular-nums ${onPaper ? "text-paper/60" : "text-muted"}`}
          aria-live="polite"
        >
          <span className={onPaper ? "text-paper" : "text-red"}>{pad(index + 1)}</span>
          {" / "}
          {pad(count)}
        </span>

        <div
          className={`relative h-0.5 flex-1 ${onPaper ? "bg-paper/20" : "bg-rule"}`}
          aria-hidden="true"
        >
          <span
            className={`absolute inset-y-0 left-0 block transition-transform duration-300 ease-out ${
              onPaper ? "bg-paper" : "bg-red"
            }`}
            style={{
              width: `${thumb}%`,
              /* Travel is the leftover track, expressed in thumb-widths. */
              transform: `translateX(${(progress * (100 - thumb) * 100) / thumb}%)`,
            }}
          />
        </div>

        {action}

        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label={`Scroll ${label} backwards`}
            className={`${arrowBase} ${arrowTone}`}
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
              <path d="M16 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label={`Scroll ${label} forwards`}
            className={`${arrowBase} ${arrowTone}`}
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
              <path d="M0 5h15M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
