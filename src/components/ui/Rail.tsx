"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface RailProps {
  children: React.ReactNode;
  label: string;
  tone?: "default" | "inverted";
  className?: string;
}

/**
 * Horizontal, snap-scrolling row with keyboard-reachable arrows.
 * Children should be <li> elements with an explicit width and `snap-start`.
 */
export function Rail({
  children,
  label,
  tone = "default",
  className = "",
}: RailProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.82, behavior: "smooth" });
  };

  const arrowBase =
    tone === "inverted"
      ? "border-paper/30 text-paper hover:bg-paper hover:text-ink"
      : "border-ink text-ink hover:bg-ink hover:text-paper";

  return (
    <div className={className}>
      <ul
        ref={trackRef}
        onScroll={sync}
        aria-label={label}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-7 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0 lg:gap-10"
      >
        {children}
      </ul>

      <div className="mt-6 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => nudge(-1)}
          disabled={atStart}
          aria-label={`Scroll ${label} backward`}
          className={`flex size-10 items-center justify-center border transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-25 ${arrowBase}`}
        >
          <span aria-hidden>←</span>
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          disabled={atEnd}
          aria-label={`Scroll ${label} forward`}
          className={`flex size-10 items-center justify-center border transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-25 ${arrowBase}`}
        >
          <span aria-hidden>→</span>
        </button>
        <span
          className={`kicker ml-2 ${tone === "inverted" ? "text-paper/45" : "text-muted"}`}
        >
          Scroll
        </span>
      </div>
    </div>
  );
}
