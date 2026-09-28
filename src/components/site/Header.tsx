"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SearchOverlay } from "@/components/site/SearchOverlay";
import { Wordmark } from "@/components/site/Wordmark";
import { categoryBySlug, primaryCategories } from "@/data/categories";
import { issueLabel, issues } from "@/data/issues";
import type { CategorySlug } from "@/data/types";
import type { SearchEntry } from "@/lib/search-index";

interface MenuLink {
  href: string;
  label: string;
  /** Printed small and grey after the label, e.g. an issue's month. */
  note?: string;
}

interface MenuGroup {
  id: string;
  label: string;
  links: MenuLink[];
  /** Category groups set large in the mobile drawer; the rest set as a list. */
  sections?: boolean;
}

const sectionLinks = (...slugs: CategorySlug[]): MenuLink[] =>
  slugs.map((slug) => ({ href: `/category/${slug}`, label: categoryBySlug[slug].title }));

/**
 * Every section and page, grouped the way the top bar groups them. The desktop
 * mega menu prints all of it at once; the mobile drawer prints the same list.
 */
const MENU: MenuGroup[] = [
  { id: "news", label: "News", sections: true, links: sectionLinks("news", "social-issues") },
  {
    id: "culture",
    label: "Culture",
    sections: true,
    links: sectionLinks("culture", "cuisine", "comics"),
  },
  { id: "opinions", label: "Opinions", sections: true, links: sectionLinks("opinions") },
  {
    id: "science",
    label: "Science",
    sections: true,
    links: sectionLinks("health-science", "psychology"),
  },
  {
    id: "issues",
    label: "Issues",
    links: [
      ...issues.slice(0, 3).map((issue) => ({
        href: `/issues/${issue.slug}`,
        label: issueLabel(issue),
        note: issue.dateLabel,
      })),
      { href: "/issues", label: "All issues" },
    ],
  },
  {
    id: "paper",
    label: "Paper",
    links: [
      { href: "/editors-picks", label: "Editor\u2019s Picks" },
      { href: "/archive", label: "Archive" },
      { href: "/about", label: "About" },
      { href: "/write", label: "Write for Us" },
    ],
  },
];

/** Which column each top-bar item lights up. */
const NAV_GROUP: Record<string, string> = {
  "/category/news": "news",
  "/category/culture": "culture",
  "/category/opinions": "opinions",
  "/category/health-science": "science",
  "/issues": "issues",
  "/editors-picks": "paper",
};

/** Grace period for the pointer to cross from the bar into the panel. */
const CLOSE_DELAY = 150;

export function Header({ index }: { index: SearchEntry[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  /* The column the mega menu is highlighting, or null while it is shut. */
  const [megaGroup, setMegaGroup] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* Set while Escape hands focus back to the bar, so that focus does not reopen it. */
  const holdShut = useRef(false);

  // Compact the bar after the first screenful of scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes every panel. Tracking the path we last rendered for
  // resets the panels during render instead of in an effect, which would queue
  // a second render pass on every route change.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMegaGroup(null);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const openMega = (group: string) => {
    cancelClose();
    if (holdShut.current) {
      holdShut.current = false;
      return;
    }
    setMegaGroup(group);
  };
  const closeMegaSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setMegaGroup(null), CLOSE_DELAY);
  };
  useEffect(() => cancelClose, []);

  // Escape shuts the mega menu wherever focus is.
  useEffect(() => {
    if (!megaGroup) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      cancelClose();
      setMegaGroup(null);
      /* Focus inside the panel would be left on a link that just vanished;
         hand it back to the bar item for that column instead. */
      if (document.activeElement?.closest("#mega-menu")) {
        const href = Object.keys(NAV_GROUP).find((key) => NAV_GROUP[key] === megaGroup);
        const item = document.querySelector<HTMLElement>(
          `a[aria-controls="mega-menu"][href="${href}"]`,
        );
        if (item) {
          holdShut.current = true;
          item.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [megaGroup]);

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
        /* The opening sequence keeps the bar down until the mark reaches it. */
        data-site-header=""
        /* Named for the page transition, which pins it: the page below changes,
           the masthead does not. See `::view-transition-group(site-header)`. */
        style={{ viewTransitionName: "site-header" }}
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
          <nav
            aria-label="Sections"
            className="hidden items-center gap-8 lg:flex"
            onMouseEnter={cancelClose}
            onMouseLeave={closeMegaSoon}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) closeMegaSoon();
            }}
          >
            {[
              ...primaryCategories.map((category) => ({
                href: `/category/${category.slug}`,
                label: category.name as React.ReactNode,
              })),
              { href: "/issues", label: "Issues" },
              { href: "/editors-picks", label: <>Editor&rsquo;s Picks</> },
            ].map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={isActive(item.href)}
                highlighted={megaGroup !== null && megaGroup === NAV_GROUP[item.href]}
                expanded={megaGroup !== null}
                onOpen={() => openMega(NAV_GROUP[item.href])}
              >
                {item.label}
              </NavLink>
            ))}

            {/* ── Mega menu ──
                Positioned against the sticky header, so it hangs off the header's
                bottom edge and covers the page rather than pushing it down. It sits
                inside the nav so its links follow the bar's items in tab order and
                one set of hover and focus handlers covers both. */}
            <div
              id="mega-menu"
              onFocus={(event) => {
                const group = event.target.closest<HTMLElement>("[data-group]")?.dataset.group;
                if (group) openMega(group);
              }}
              className={`absolute inset-x-0 top-full z-50 border-t-2 border-red bg-paper shadow-[0_18px_50px_-24px_rgba(13,13,16,0.35)] ${
                megaGroup
                  ? "animate-[sheet-in_0.22s_cubic-bezier(0.16,1,0.3,1)]"
                  : "pointer-events-none invisible opacity-0"
              }`}
            >
              <div className="shell grid grid-cols-6 gap-8 py-9">
                {MENU.map((group) => (
                  <div key={group.id} data-group={group.id}>
                    <p
                      className={`kicker transition-colors duration-200 ${
                        megaGroup === group.id ? "text-red" : "text-muted"
                      }`}
                    >
                      {group.label}
                    </p>
                    <ul className="mt-4 space-y-3.5">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="headline block text-[1.0625rem] transition-colors hover:text-red"
                          >
                            {link.label}
                            {link.note && (
                              <span className="meta mt-0.5 block font-normal">{link.note}</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
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
              {MENU.map((group, g) => (
                <div key={group.id} className={g === 0 ? "" : "mt-10"}>
                  <p className="kicker text-muted">{group.label}</p>
                  <ul className="mt-5">
                    {group.links.map((link) => (
                      <li key={link.href} className="border-t border-rule">
                        <Link
                          href={link.href}
                          className={
                            group.sections
                              ? "display flex items-baseline justify-between py-4 text-[1.75rem]"
                              : "headline flex items-baseline justify-between gap-4 py-3.5 text-lg"
                          }
                        >
                          {link.label}
                          {link.note && <span className="meta shrink-0">{link.note}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      <SearchOverlay index={index} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

/**
 * A section link in the top bar.
 *
 * The rule under it is one element in two states rather than two elements: it
 * sweeps out from the left on hover and stays put on the section you are
 * already in, so hovering the current section does not stack a second rule on
 * top of the first.
 */
function NavLink({
  href,
  active,
  highlighted,
  expanded,
  onOpen,
  children,
}: {
  href: string;
  active: boolean;
  /** Its column is the one lit in the open mega menu. */
  highlighted: boolean;
  expanded: boolean;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-controls="mega-menu"
      aria-expanded={expanded}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      className={`kicker group/nav relative py-1 transition-colors duration-200 hover:text-red ${
        active || highlighted ? "text-red" : "text-ink"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-red transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
        }`}
      />
    </Link>
  );
}
