"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/ui/Wordmark";
import { categories } from "@/data";

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 110);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close both panels whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  // Lock the page behind an open panel, and wire up Escape.
  useEffect(() => {
    const open = menuOpen || searchOpen;
    document.body.style.overflow = open ? "hidden" : "";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-paper/92 backdrop-blur-md transition-[border-color,box-shadow] duration-500 ${
          scrolled ? "border-rule shadow-[0_1px_0_rgba(16,16,20,0.06)]" : "border-ink"
        }`}
      >
        <div className="shell flex h-14 items-center gap-3 md:h-[3.75rem]">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="group flex size-9 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span className="h-px w-5 bg-ink transition-transform duration-300" />
            <span className="h-px w-5 bg-ink transition-transform duration-300" />
          </button>

          <div
            className={`shrink-0 transition-all duration-500 ease-out-expo ${
              scrolled
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            <Wordmark size="sm" />
          </div>

          <nav
            aria-label="Sections"
            className="mx-auto hidden items-center gap-6 lg:flex xl:gap-9"
          >
            {categories.map((category) => {
              const href = `/category/${category.slug}`;
              return (
                <Link
                  key={category.slug}
                  href={href}
                  className={`kicker relative py-2 transition-colors duration-300 hover:text-red ${
                    isActive(href) ? "text-red" : "text-ink"
                  }`}
                >
                  {category.name}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -bottom-px h-0.5 origin-left bg-red transition-transform duration-500 ease-out-expo ${
                      isActive(href) ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-4 lg:ml-0">
            <Link
              href="/about"
              className={`kicker hidden transition-colors duration-300 hover:text-red lg:block ${
                isActive("/about") ? "text-red" : "text-ink"
              }`}
            >
              About
            </Link>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search articles"
              className="kicker group flex items-center gap-2 text-ink transition-colors duration-300 hover:text-red"
            >
              <SearchIcon />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      <div
        className={`fixed inset-0 z-60 bg-ink text-paper transition-opacity duration-400 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="shell flex h-14 items-center justify-between">
          <Wordmark size="sm" className="text-paper" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="kicker text-paper/70"
          >
            Close
          </button>
        </div>

        <nav className="shell mt-6 flex flex-col" aria-label="Sections">
          <Link
            href="/"
            className="headline border-t border-paper/15 py-4 text-3xl"
          >
            Home
          </Link>
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="headline border-t border-paper/15 py-4 text-3xl transition-[color,transform] duration-500 ease-out-expo hover:translate-x-1.5 hover:text-red"
              style={{
                transitionDelay: menuOpen ? `${60 + index * 35}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "none" : "translateY(10px)",
              }}
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="headline border-y border-paper/15 py-4 text-3xl"
          >
            About
          </Link>
        </nav>
      </div>

      {/* ── Search overlay ── */}
      <div
        className={`fixed inset-0 z-70 bg-paper transition-opacity duration-300 ${
          searchOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!searchOpen}
      >
        <div className="shell flex h-14 items-center justify-between border-b border-rule">
          <Wordmark size="sm" />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="kicker text-muted transition-colors hover:text-red"
          >
            Close · Esc
          </button>
        </div>

        <div className="shell pt-12 md:pt-24">
          <form onSubmit={submit}>
            <label htmlFor="site-search" className="kicker text-muted">
              Search Valor Times
            </label>
            <input
              id="site-search"
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: sleep, cafeteria, debate"
              autoComplete="off"
              className="headline mt-4 w-full border-b-2 border-ink bg-transparent pb-4 text-[clamp(1.75rem,5vw,3.5rem)] outline-none placeholder:text-rule-strong"
            />
            <button type="submit" className="sr-only">
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="kicker border border-rule px-3.5 py-2 text-ink-soft transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 group-hover:scale-110"
    >
      <circle cx="6.5" cy="6.5" r="4.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.2 10.2 13.6 13.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
