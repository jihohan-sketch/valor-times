import Link from "next/link";

import { Wordmark } from "@/components/site/Wordmark";
import { categories } from "@/data";
import { site } from "@/lib/site";

const PAPER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
  { href: "/write", label: "Write for Us" },
  { href: "/trending", label: "Trending" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-paper md:mt-32">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
              {site.description} Printed at Valor International School since{" "}
              {site.founded}.
            </p>
            <p className="meta mt-6">
              <a href={`mailto:${site.email}`} className="link-draw text-ink-2">
                {site.email}
              </a>
            </p>
          </div>

          <nav aria-label="Sections" className="md:col-span-3">
            <p className="kicker text-red">Sections</p>
            <ul className="mt-5 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-[0.95rem] text-ink-2 transition-colors hover:text-red"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="The paper" className="md:col-span-2">
            <p className="kicker text-red">The paper</p>
            <ul className="mt-5 space-y-2.5">
              {PAPER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] text-ink-2 transition-colors hover:text-red"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Elsewhere" className="md:col-span-2">
            <p className="kicker text-red">Elsewhere</p>
            <ul className="mt-5 space-y-2.5">
              {site.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-[0.95rem] text-ink-2 transition-colors hover:text-red"
                  >
                    {link.label}
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 9 9"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M1 8L8 1M8 1H2.5M8 1v5.5" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-rule pt-7 md:mt-20 md:flex-row md:items-center md:justify-between">
          <p className="meta">
            © {new Date().getFullYear()} {site.name}. Written, edited and drawn by
            students.
          </p>
          <p className="kicker text-muted">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
