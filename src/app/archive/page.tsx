import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import {
  authorBySlug,
  categoryBySlug,
  getAllArticles,
  issues,
  type Article,
  type Issue,
} from "@/data";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every story Valor Times has published, grouped by the issue it ran in.",
};

interface Group {
  key: string;
  heading: string;
  sub: string;
  href: string;
  issue?: Issue;
  articles: Article[];
}

/**
 * Grouped by the issue each story was printed in, newest issue first — which
 * is how the paper actually exists. Anything filed through the desk without an
 * issue lands in a final "Web only" group.
 */
function byIssue(): Group[] {
  const catalog = getAllArticles();
  const groups: Group[] = issues.map((issue) => ({
    key: issue.slug,
    heading: issue.title,
    sub: issue.dateLabel,
    href: `/issues/${issue.slug}`,
    issue,
    articles: catalog
      .filter((article) => article.issueSlug === issue.slug)
      .sort((a, b) => a.page - b.page),
  }));

  const loose = catalog.filter(
    (article) => !issues.some((issue) => issue.slug === article.issueSlug),
  );
  if (loose.length > 0) {
    groups.push({
      key: "web-only",
      heading: "Web only",
      sub: "Filed straight to the site",
      href: "",
      articles: loose,
    });
  }

  return groups.filter((group) => group.articles.length > 0);
}

function Row({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group grid gap-x-8 gap-y-2 border-t border-rule py-4 transition-colors duration-300 hover:border-red md:grid-cols-[3.5rem_1fr_10rem] md:items-baseline md:py-5"
    >
      <span className="meta tabular-nums">
        {article.page ? `p. ${article.page}` : "—"}
      </span>
      <div>
        <h3 className="headline text-[1.0625rem] text-balance md:text-[1.15rem]">
          <span className="link-draw">{article.title}</span>
        </h3>
        <p className="meta mt-1.5 md:hidden">
          {categoryBySlug[article.category].name}
          <span className="mx-2 opacity-40">/</span>
          {authorBySlug[article.authorSlug]?.name}
        </p>
      </div>
      <div className="hidden text-right md:block">
        <Kicker category={article.category} href={false} />
        <p className="meta mt-1.5">{authorBySlug[article.authorSlug]?.name}</p>
      </div>
    </Link>
  );
}

/**
 * One issue, opened.
 *
 * A `<details>` rather than a client component: it opens on the first click
 * with no JavaScript at all, it is keyboard-operable and announced correctly
 * for free, and browser find-in-page reaches inside a closed one. The newest
 * two issues start open, so the page never opens on a wall of shut drawers.
 */
function IssueBlock({ group, open }: { group: Group; open: boolean }) {
  return (
    <Reveal as="section" className="mt-10 first:mt-0 md:mt-14">
      <details open={open} className="group/issue">
        <summary className="flex cursor-pointer list-none items-end gap-6 border-b-2 border-ink pb-4 [&::-webkit-details-marker]:hidden">
          {/* The cover, printed small — an issue is an object before it is a
              list of stories. */}
          {group.issue && (
            <span className="relative block aspect-[737/1048] w-16 shrink-0 overflow-hidden border border-rule-2 bg-shell-deep md:w-20">
              <Image
                src={group.issue.cover}
                alt=""
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </span>
          )}

          <span className="min-w-0 flex-1">
            <span className="kicker text-red">{group.sub}</span>
            <span className="display mt-2 block text-[clamp(1.6rem,3.2vw,2.5rem)]">
              {group.heading}
            </span>
            {group.issue && (
              <span className="meta mt-2 block truncate">{group.issue.lead}</span>
            )}
          </span>

          <span className="flex shrink-0 items-center gap-5 pb-1">
            <span className="meta tabular-nums">
              {String(group.articles.length).padStart(2, "0")} stories
              {group.issue && (
                <>
                  <span className="mx-2 opacity-40">/</span>
                  {group.issue.pageCount} pages
                </>
              )}
            </span>
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center border border-rule-2 text-ink transition-colors duration-200 group-hover/issue:border-ink"
            >
              <svg
                width="11"
                height="7"
                viewBox="0 0 12 8"
                fill="none"
                className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-open/issue:rotate-180"
              >
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
          </span>
        </summary>

        <div className="mt-4">
          {group.articles.map((article) => (
            <Row key={article.slug} article={article} />
          ))}

          {group.href && (
            <div className="mt-5 border-t border-rule pt-5">
              <Link
                href={group.href}
                className="label inline-flex items-center gap-3 text-red transition-opacity hover:opacity-70"
              >
                Read {group.heading} as it was printed
                <svg width="18" height="10" viewBox="0 0 20 10" fill="none" aria-hidden="true">
                  <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </details>
    </Reveal>
  );
}

export default function ArchivePage() {
  const groups = byIssue();
  const total = groups.reduce((sum, group) => sum + group.articles.length, 0);
  const pages = issues.reduce((sum, issue) => sum + issue.pageCount, 0);

  return (
    <div className="shell py-12 md:py-20">
      <header className="border-b-2 border-ink pb-10">
        <span className="kicker text-red">Everything we have printed</span>
        <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">Archive</h1>

        <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-2xl text-lg leading-relaxed text-ink-2">
            Every story the paper has run, filed under the issue it was printed
            in and in page order — because that is the order it was read in.
            Open an issue to see its contents, or open the issue itself to read
            the pages.
          </p>
          <dl className="flex gap-10">
            <div>
              <dt className="meta">Issues</dt>
              <dd className="display mt-1 text-4xl tabular-nums">{groups.length}</dd>
            </div>
            <div>
              <dt className="meta">Stories</dt>
              <dd className="display mt-1 text-4xl tabular-nums">{total}</dd>
            </div>
            <div>
              <dt className="meta">Pages</dt>
              <dd className="display mt-1 text-4xl tabular-nums">{pages}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mt-12 md:mt-16">
        {groups.map((group, i) => (
          <IssueBlock key={group.key} group={group} open={i < 2} />
        ))}
      </div>
    </div>
  );
}
