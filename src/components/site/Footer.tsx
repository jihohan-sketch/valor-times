import Image from "next/image";
import Link from "next/link";

import { Wordmark } from "@/components/site/Wordmark";
import { categories } from "@/data";
import { site } from "@/lib/site";

const PAPER_LINKS = [
  { href: "/issues", label: "Issues" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/write", label: "Write for Us" },
  { href: "/editors-picks", label: "Editor’s Picks" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden border-t-2 border-ink bg-paper md:mt-32">
      {/* The monogram, printed oversized and almost off the page. */}
      <Image
        src="/mark/vt.png"
        alt=""
        aria-hidden="true"
        width={512}
        height={512}
        className="pointer-events-none absolute -bottom-24 -right-16 hidden w-[26rem] select-none opacity-[0.055] lg:block"
      />

      <div className="shell relative py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
              {site.description} In print since {site.founded}.
            </p>
            <dl className="mt-6 space-y-2">
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <dt className="meta text-muted">The desk</dt>
                <dd className="meta">
                  <a href={`mailto:${site.email}`} className="link-draw text-ink-2">
                    {site.email}
                  </a>
                </dd>
              </div>
              {/* The desk handles the paper; the website is a different inbox. */}
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <dt className="meta text-muted">The website</dt>
                <dd className="meta">
                  <a
                    href={`mailto:${site.webmaster.email}`}
                    className="link-draw text-ink-2"
                  >
                    {site.webmaster.email}
                  </a>
                </dd>
              </div>
            </dl>
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
                    target="_blank"
                    rel="noopener noreferrer"
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
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.95rem] text-ink-2 transition-colors hover:text-red"
                >
                  Email the desk
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.webmaster.email}`}
                  className="text-[0.95rem] text-ink-2 transition-colors hover:text-red"
                >
                  Email the webmaster
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-rule pt-7 md:mt-20 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="space-y-2.5">
            <p className="meta">
              © {year} {site.name}. Written, edited and drawn by students.
            </p>
            {/* The colophon. The paper is the students’; the site is its own
                piece of work, and it signs itself. */}
            <p className="meta flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="kicker text-red">Colophon</span>
              <span>
                Designed, built and maintained by{" "}
                <a
                  href={`mailto:${site.webmaster.email}`}
                  className="link-draw font-semibold text-ink"
                >
                  {site.webmaster.name}
                </a>
                . Code and design © {year}, all rights reserved.
              </span>
            </p>
          </div>
          <p className="kicker shrink-0 text-muted">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
