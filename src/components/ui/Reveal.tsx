"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger in milliseconds. Keep it under ~240ms — this is punctuation, not choreography. */
  delay?: number;
  /**
   * Reveal artwork by clearing a mask rather than by sliding it up. A plate
   * that slides reads as a layout shift; a plate that un-masks reads as a page
   * being laid down, which is the only reason to animate it at all.
   */
  plate?: boolean;
  as?: ElementType;
  className?: string;
}

/**
 * Reveals its children once, the first time they enter the viewport.
 * Falls back to visible immediately when IntersectionObserver is unavailable
 * or the reader has asked for reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  plate = false,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  // Starts hidden on both the server and the client, so hydration matches.
  // Readers who asked for less motion are served by the reduced-motion rule in
  // globals.css, which reveals every .reveal regardless of this state.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;

    // No observer (very old browsers): reveal the node directly rather than
    // leaving it invisible forever. Writing the attribute here instead of
    // setting state keeps this out of React's render loop.
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.shown = "true";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref}
      data-shown={shown}
      className={`${plate ? "reveal-plate" : "reveal"} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {/* The plate's mask goes on an inner element, never on the observed one.
          A `clip-path` that collapses a block to nothing also collapses the
          rectangle its own IntersectionObserver measures against the viewport,
          so a plate that masked itself could never be told it had arrived: the
          observer reported a ratio of zero forever and the block stayed blank
          for good, taking whole sections of the front page down with it. The
          observed element now keeps its full box and only its contents are
          masked. */}
      {plate ? <div className="reveal-plate-mask">{children}</div> : children}
    </Tag>
  );
}
