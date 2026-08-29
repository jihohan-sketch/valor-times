"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ReaderPage {
  n: number;
  src: string;
}

/**
 * The printed pages, and a surface for actually reading them.
 *
 * The grid alone was the site's worst failure: seventy-one real pages rendered
 * at a third of a column, where the body copy is roughly one pixel tall. The
 * pages are the reason the archive exists, so opening one is a first-class
 * mode — full bleed, keyboard-driven, with the spread you would get holding it.
 */
export function IssueReader({
  issueTitle,
  pages,
}: {
  issueTitle: string;
  pages: ReaderPage[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    const index = open;
    setOpen(null);
    // Send focus back to the thumbnail the reader came from.
    if (index !== null) triggers.current[index]?.focus();
  }, [open]);

  const step = useCallback(
    (delta: number) => {
      setOpen((current) => {
        if (current === null) return current;
        const next = current + delta;
        return next < 0 || next > pages.length - 1 ? current : next;
      });
    },
    [pages.length],
  );

  // Keyboard is the primary control once the reader is open.
  useEffect(() => {
    if (open === null) return;

    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          close();
          break;
        case "ArrowRight":
        case "PageDown":
          event.preventDefault();
          step(1);
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          step(-1);
          break;
        case "Home":
          event.preventDefault();
          setOpen(0);
          break;
        case "End":
          event.preventDefault();
          setOpen(pages.length - 1);
          break;
        case "Tab":
          // Keep tabbing inside the dialog.
          {
            const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
              "button:not([disabled])",
            );
            if (!focusables || focusables.length === 0) break;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
          break;
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, step, pages.length]);

  // Lock the page behind the reader without letting the layout jump.
  useEffect(() => {
    if (open === null) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    dialogRef.current?.focus();
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  const page = open === null ? null : pages[open];

  return (
    <>
      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((entry, index) => (
          <li key={entry.n}>
            <button
              type="button"
              ref={(node) => {
                triggers.current[index] = node;
              }}
              onClick={() => setOpen(index)}
              aria-label={`Read page ${entry.n} of ${pages.length}`}
              className="group block w-full cursor-zoom-in text-left"
            >
              <div className="zoom-frame relative aspect-[737/1048] border border-rule transition-colors duration-300 group-hover:border-ink">
                <Image
                  src={entry.src}
                  alt={`Page ${entry.n} of Valor Times ${issueTitle}`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover object-top"
                />
                {/* Affordance: the thumbnail has to say it opens. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center bg-ink/85 py-3 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  <span className="kicker text-paper">Read page</span>
                </span>
              </div>
              <span className="meta mt-2 block tabular-nums">Page {entry.n}</span>
            </button>
          </li>
        ))}
      </ul>

      {page && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Valor Times ${issueTitle}, page ${page.n} of ${pages.length}`}
          tabIndex={-1}
          className="reader-veil fixed inset-0 z-100 flex flex-col bg-ink/97 outline-none backdrop-blur-sm"
        >
          {/* ── Bar ── */}
          <div className="flex shrink-0 items-center justify-between gap-6 px-5 py-4 md:px-8">
            <p className="kicker text-paper/70">
              {issueTitle}
              <span className="ml-4 tabular-nums text-paper">
                {String(page.n).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
              </span>
            </p>

            <button
              type="button"
              onClick={close}
              className="kicker flex items-center gap-2.5 py-2 text-paper/70 transition-colors hover:text-paper"
            >
              Close
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>

          {/* ── The page ── */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-4 md:px-20">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={open === 0}
              aria-label="Previous page"
              className="absolute left-1 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ink/70 text-paper/80 backdrop-blur transition-[color,transform,background-color] duration-300 hover:text-paper disabled:pointer-events-none disabled:opacity-20 md:h-14 md:w-14 md:rounded-none md:bg-transparent md:text-paper/60 md:backdrop-blur-none md:hover:-translate-x-1 md:hover:text-paper"
            >
              <svg width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden="true">
                <path d="M26 7H2M8 1L2 7l6 6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <Image
              key={page.src}
              src={page.src}
              alt={`Page ${page.n} of Valor Times ${issueTitle}, as printed`}
              width={1200}
              height={1707}
              priority
              sizes="(min-width: 768px) 70vh, 92vw"
              className="reader-page h-full max-h-full w-auto max-w-full bg-paper object-contain shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)]"
            />

            <button
              type="button"
              onClick={() => step(1)}
              disabled={open === pages.length - 1}
              aria-label="Next page"
              className="absolute right-1 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ink/70 text-paper/80 backdrop-blur transition-[color,transform,background-color] duration-300 hover:text-paper disabled:pointer-events-none disabled:opacity-20 md:h-14 md:w-14 md:rounded-none md:bg-transparent md:text-paper/60 md:backdrop-blur-none md:hover:translate-x-1 md:hover:text-paper"
            >
              <svg width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden="true">
                <path d="M0 7h24M18 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          {/* ── Filmstrip ── */}
          <div className="shrink-0 border-t border-paper/15 px-4 py-3 md:px-8">
            <ul className="no-scrollbar flex gap-2 overflow-x-auto">
              {pages.map((entry, index) => (
                <li key={entry.n}>
                  <button
                    type="button"
                    onClick={() => setOpen(index)}
                    aria-label={`Go to page ${entry.n}`}
                    aria-current={index === open ? "true" : undefined}
                    className={`relative block h-16 w-[2.85rem] shrink-0 overflow-hidden border transition-[border-color,opacity] duration-300 ${
                      index === open
                        ? "border-red opacity-100"
                        : "border-paper/25 opacity-45 hover:opacity-90"
                    }`}
                  >
                    <Image
                      src={entry.src}
                      alt=""
                      fill
                      sizes="46px"
                      className="object-cover object-top"
                    />
                  </button>
                </li>
              ))}
            </ul>
            <p className="meta mt-2.5 hidden text-paper/45 md:block">
              Arrow keys to turn the page · Esc to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
