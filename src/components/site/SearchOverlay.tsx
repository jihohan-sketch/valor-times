"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { SearchEntry } from "@/lib/search-index";
import { formatDateShort } from "@/lib/format";

/** Weighted scoring: a title hit beats a tag hit beats an author hit. */
function score(entry: SearchEntry, terms: string[]): number {
  const title = entry.title.toLowerCase();
  const dek = entry.dek.toLowerCase();
  const tags = entry.tags.join(" ").toLowerCase();
  const meta = `${entry.categoryName} ${entry.author}`.toLowerCase();

  let total = 0;
  for (const term of terms) {
    if (!entry.haystack.includes(term)) return 0;
    if (title.startsWith(term)) total += 12;
    if (title.includes(term)) total += 8;
    if (tags.includes(term)) total += 4;
    if (meta.includes(term)) total += 3;
    if (dek.includes(term)) total += 2;
  }
  return total;
}

/**
 * Every term here is checked against the catalog — a suggestion that returns
 * nothing is a dead button. "Cafeteria" and "Equity" used to sit in this list
 * and matched no story at all.
 */
const SUGGESTIONS = ["Sleep", "Prom", "Comics", "Missions", "Psychology", "Christmas"];

export function SearchOverlay({
  index,
  open,
  onClose,
}: {
  index: SearchEntry[];
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return index
      .map((entry) => ({ entry, s: score(entry, terms) }))
      .filter((row) => row.s > 0)
      .sort((a, b) => b.s - a.s || b.entry.date.localeCompare(a.entry.date))
      .slice(0, 12)
      .map((row) => row.entry);
  }, [index, query]);

  // Focus the field on open, restore the page scroll on close.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes; Tab is trapped inside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Clear the box when the overlay closes, during render rather than after it.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setQuery("");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 animate-[veil-in_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label="Search Valor Times"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/50 backdrop-blur-[2px]"
        tabIndex={-1}
      />

      <div
        ref={panelRef}
        className="relative flex h-full max-h-[100dvh] flex-col bg-paper animate-[sheet-in_0.32s_cubic-bezier(0.16,1,0.3,1)] md:max-h-[86dvh]"
      >
        <div className="shell flex shrink-0 items-center justify-between py-5 md:py-7">
          <span className="kicker text-red">Search</span>
          <button
            type="button"
            onClick={onClose}
            className="kicker flex items-center gap-2.5 text-muted transition-colors hover:text-ink"
          >
            Close
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>

        <div className="shell shrink-0 border-b-2 border-ink pb-5 md:pb-7">
          <label htmlFor="vt-search" className="sr-only">
            Search by title, category, author or keyword
          </label>
          <input
            ref={inputRef}
            id="vt-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="WHAT ARE YOU LOOKING FOR?"
            autoComplete="off"
            className="display w-full bg-transparent text-[clamp(1.75rem,5.2vw,4rem)] leading-none outline-none placeholder:text-rule-2"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="shell py-7 md:py-9">
            {query.trim() === "" ? (
              <div>
                <p className="kicker text-muted">Try</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {SUGGESTIONS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="border border-rule-2 px-4 py-2 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <p className="mt-9 max-w-md text-sm text-muted">
                  Search across every headline, category, byline and keyword in
                  the archive.
                </p>
              </div>
            ) : results.length === 0 ? (
              <p className="text-lg text-muted">
                Nothing matched <span className="text-ink">“{query}”</span>. Try a
                category, an author, or a single word.
              </p>
            ) : (
              <>
                <p className="kicker mb-6 text-muted">
                  {results.length} {results.length === 1 ? "result" : "results"}
                </p>
                <ul>
                  {results.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/article/${entry.slug}`}
                        onClick={onClose}
                        className="group flex items-center gap-5 border-t border-rule py-4 md:gap-8 md:py-5"
                      >
                        {entry.image && (
                          <div
                            className={`relative aspect-[3/2] w-20 shrink-0 md:w-28 ${
                              entry.plate
                                ? "bg-paper p-1 ring-1 ring-rule-2"
                                : "zoom-frame"
                            }`}
                          >
                            <Image
                              src={entry.image}
                              alt=""
                              fill
                              sizes="112px"
                              className={entry.plate ? "object-contain" : "object-cover"}
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="kicker text-red">{entry.categoryName}</span>
                          <h3 className="headline mt-1.5 text-[1.0625rem] md:text-xl">
                            <span className="link-draw">{entry.title}</span>
                          </h3>
                          <p className="meta mt-1.5">
                            {entry.author}
                            <span className="mx-2 opacity-40">/</span>
                            {formatDateShort(entry.date)}
                          </p>
                        </div>
                        <svg
                          width="20"
                          height="10"
                          viewBox="0 0 20 10"
                          fill="none"
                          aria-hidden="true"
                          className="hidden shrink-0 text-rule-2 transition-all duration-300 group-hover:translate-x-1 group-hover:text-red sm:block"
                        >
                          <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
