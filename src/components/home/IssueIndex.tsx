import Link from "next/link";

import { HomeSection } from "@/components/home/HomeSections";
import { Kicker } from "@/components/ui/Kicker";
import { authorBySlug, categoryBySlug, type Article, type Issue } from "@/data";
import { issueLabel } from "@/data/issues";

/**
 * Every story on the front page, filed under the issue it ran in, in page
 * order. Each issue is a `<details>`, as on /archive, so it opens without
 * JavaScript; only the newest starts open, so the section stays one drawer
 * tall plus a row of shut ones.
 */
export function IssueIndex({
  issues,
  articles,
}: {
  issues: Issue[];
  articles: Article[];
}) {
  const groups = issues
    .map((issue) => ({
      issue,
      articles: articles
        .filter((article) => article.issueSlug === issue.slug)
        .sort((a, b) => a.page - b.page),
    }))
    .filter((group) => group.articles.length > 0);
  if (groups.length === 0) return null;

  return (
    <HomeSection id="by-issue" title="Stories by Issue" href="/archive" linkLabel="Full archive">
      <div className="border-b border-rule">
        {groups.map(({ issue, articles: stories }, i) => (
          <details key={issue.slug} open={i === 0} className="group/issue border-t border-rule">
            <summary className="flex cursor-pointer list-none items-baseline gap-6 py-5 [&::-webkit-details-marker]:hidden">
              <span className="headline min-w-0 flex-1 text-[length:var(--text-title-sm)]">
                {issueLabel(issue)}
              </span>
              <span className="meta hidden tabular-nums sm:inline">{issue.dateLabel}</span>
              <span className="meta tabular-nums">
                {String(stories.length).padStart(2, "0")} stories
              </span>
              <svg
                width="11"
                height="7"
                viewBox="0 0 12 8"
                fill="none"
                aria-hidden="true"
                className="shrink-0 self-center transition-transform duration-300 group-open/issue:rotate-180"
              >
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </summary>

            <ul className="pb-6">
              {stories.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/article/${article.slug}`}
                    className="group grid gap-x-8 gap-y-1.5 border-t border-rule py-3.5 transition-colors duration-300 hover:border-red md:grid-cols-[3.5rem_1fr_10rem] md:items-baseline"
                  >
                    <span className="meta tabular-nums">
                      {article.page ? `p. ${article.page}` : "—"}
                    </span>
                    <div>
                      <h3 className="headline text-[1.0625rem] text-balance">
                        <span className="link-draw">{article.title}</span>
                      </h3>
                      <p className="meta mt-1 md:hidden">
                        {categoryBySlug[article.category].name}
                        <span className="mx-2 opacity-40">/</span>
                        {authorBySlug[article.authorSlug]?.name}
                      </p>
                    </div>
                    <div className="hidden text-right md:block">
                      <Kicker category={article.category} href={false} />
                      <p className="meta mt-1">{authorBySlug[article.authorSlug]?.name}</p>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t border-rule pt-4">
                <Link
                  href={`/issues/${issue.slug}`}
                  className="label text-red transition-opacity hover:opacity-70"
                >
                  Read {issueLabel(issue)} as it was printed →
                </Link>
              </li>
            </ul>
          </details>
        ))}
      </div>
    </HomeSection>
  );
}
