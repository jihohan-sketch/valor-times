"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger in milliseconds. Keep it under ~240ms — this is punctuation, not choreography. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Slides its children up once, the first time they enter the viewport.
 * Falls back to visible immediately when IntersectionObserver is unavailable
 * or the reader has asked for reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
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
      className={`reveal ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
