"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SearchOverlay } from "@/components/site/SearchOverlay";
import { Wordmark } from "@/components/site/Wordmark";
import { primaryCategories, secondaryCategories } from "@/data/categories";
import type { SearchEntry } from "@/lib/search-index";

const MORE_LINKS = [
  { href: "/issues", label: "Issues" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
  { href: "/write", label: "Write for Us" },
];

export function Header({ index }: { index: SearchEntry[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Compact the bar after the first screenful of scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes every panel.
  useEffect(() => {
    setMoreOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Click-away and Escape for the More menu.
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-paper/95 backdrop-blur transition-[box-shadow,border-color] duration-300 ${
          scrolled ? "border-b border-rule shadow-[0_1px_0_0_rgba(13,13,16,0.04)]" : "border-b border-transparent"
        }`}
      >
        <div
          className={`shell flex items-center justify-between gap-8 transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? "py-3" : "py-4 md:py-6"
          }`}
        >
          <Wordmark compact={scrolled} />

          {/* ── Desktop navigation ── */}
          <nav aria-label="Sections" className="hidden items-center gap-8 lg:flex">
            {primaryCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`kicker relative py-1 transition-colors hover:text-red ${
                  isActive(`/category/${category.slug}`) ? "text-red" : "text-ink"
                }`}
              >
                {category.name}
                {isActive(`/category/${category.slug}`) && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-red" />
                )}
              </Link>
            ))}
            <Link
              href="/trending"
              className={`kicker py-1 transition-colors hover:text-red ${
                isActive("/trending") ? "text-red" : "text-ink"
              }`}
            >
              Trending
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="kicker flex items-center gap-2.5 px-1 py-2 transition-colors hover:text-red"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* ── More menu (desktop) ── */}
            <div ref={moreRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setMoreOpen((open) => !open)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className="kicker flex items-center gap-2 px-1 py-2 transition-colors hover:text-red"
              >
                More
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`}
                >
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 border-t-2 border-red bg-paper p-6 shadow-[0_18px_50px_-24px_rgba(13,13,16,0.35)] animate-[sheet-in_0.22s_cubic-bezier(0.16,1,0.3,1)]">
                  <p className="kicker text-muted">Sections</p>
                  <ul className="mt-4 space-y-3.5">
                    {secondaryCategories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={`/category/${category.slug}`}
                          className="headline block text-[1.0625rem] transition-colors hover:text-red"
                        >
                          {category.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="kicker mt-7 text-muted">Paper</p>
                  <ul className="mt-4 space-y-3.5">
                    {MORE_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="headline block text-[1.0625rem] transition-colors hover:text-red"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ── Mobile menu trigger ── */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="kicker flex items-center gap-2.5 px-1 py-2 lg:hidden"
            >
              <span className="flex flex-col gap-[5px]" aria-hidden="true">
                <span className="block h-[1.5px] w-5 bg-ink" />
                <span className="block h-[1.5px] w-5 bg-ink" />
              </span>
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>

        {/* Hairline that fills as the reader moves down a section-heavy page. */}
        <span
          aria-hidden="true"
          className={`block h-0.5 origin-left bg-red transition-transform duration-500 ${
            scrolled ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </header>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-100 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/50"
            tabIndex={-1}
          />
          <div className="relative flex h-full max-h-[100dvh] flex-col overflow-y-auto bg-paper animate-[sheet-in_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="shell flex items-center justify-between py-4">
              <Wordmark compact />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="kicker flex items-center gap-2.5 py-2 text-muted"
              >
                Close
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </div>

            <nav aria-label="All sections" className="shell flex-1 pb-16 pt-6">
              <p className="kicker text-muted">Sections</p>
              <ul className="mt-5">
                {[...primaryCategories, ...secondaryCategories].map((category, i) => (
                  <li key={category.slug} className="border-t border-rule">
                    <Link
                      href={`/category/${category.slug}`}
                      className="display flex items-baseline justify-between py-4 text-[1.75rem]"
                    >
                      {category.title}
                      <span className="kicker text-red">{String(i + 1).padStart(2, "0")}</span>
                    </Link>
                  </li>
                ))}
                <li className="border-t border-rule">
                  <Link href="/trending" className="display flex py-4 text-[1.75rem]">
                    Trending
                  </Link>
                </li>
              </ul>

              <p className="kicker mt-10 text-muted">Paper</p>
              <ul className="mt-5">
                {MORE_LINKS.map((link) => (
                  <li key={link.href} className="border-t border-rule">
                    <Link href={link.href} className="headline block py-3.5 text-lg">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <SearchOverlay index={index} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
