"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

import { observeScene } from "@/lib/scroll-scene";

/**
 * Marks a block as scroll-linked: while it is on screen, `--pass` is written on
 * it, running 0 → 1 across its pass through the viewport. Everything that then
 * moves — a plate drifting inside its frame, a rule filling under a section
 * title — is a CSS rule reading that one number, so the movement costs no
 * JavaScript per frame and no layout.
 *
 * Under `prefers-reduced-motion` nothing is registered at all. `--pass` is never
 * written, and every rule reading it falls back to the 0.5 it is authored
 * against, which is the at-rest, mid-pass position. That is the whole
 * reduced-motion story for this layer: no special cases downstream.
 */
export function Scene({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return observeScene(node);
  }, []);

  return (
    <Tag ref={ref} className={`scene ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
