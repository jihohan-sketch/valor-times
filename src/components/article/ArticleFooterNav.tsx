import Link from "next/link";

import type { Article } from "@/data";

/** Previous / next through the reverse-chronological run. */
export function ArticleFooterNav({
  previous,
  next,
}: {
  previous?: Article;
  next?: Article;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="More articles"
      className="grid border-t-2 border-ink md:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/article/${previous.slug}`}
          className="group flex flex-col gap-3 border-b border-rule py-8 pr-6 transition-colors hover:bg-shell md:border-b-0 md:border-r md:pl-0 md:pr-10"
        >
          <span className="kicker flex items-center gap-2.5 text-red">
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1.5"
            >
              <path d="M16 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Previous article
          </span>
          <span className="display text-[clamp(1.25rem,2.2vw,1.75rem)] text-balance">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span className="hidden md:block" />
      )}

      {next && (
        <Link
          href={`/article/${next.slug}`}
          className="group flex flex-col items-start gap-3 py-8 transition-colors hover:bg-shell md:items-end md:pl-10 md:text-right"
        >
          <span className="kicker flex items-center gap-2.5 text-red">
            Next article
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            >
              <path d="M0 5h15M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="display text-[clamp(1.25rem,2.2vw,1.75rem)] text-balance">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
