import type { Metadata } from "next";
import Link from "next/link";

import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { authorBySlug, getAllArticles, issues, type Article } from "@/data";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every story Valor Times has published, grouped by the issue it ran in.",
};

/**
 * Grouped by the issue each story was printed in, newest issue first — which
 * is how the paper actually exists. Anything filed through the desk without an
 * issue lands in a final "Web only" group.
 */
function byIssue() {
  const catalog = getAllArticles();
  const groups = issues.map((issue) => ({
    key: issue.slug,
    heading: issue.title,
    sub: issue.dateLabel,
    href: `/issues/${issue.slug}`,
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
      className="group grid gap-x-8 gap-y-2 border-t border-rule py-5 transition-colors hover:border-red md:grid-cols-[4rem_1fr_9rem] md:items-baseline"
    >
      <span className="meta tabular-nums">
        {article.page ? `p. ${article.page}` : "—"}
      </span>
      <div>
        <h3 className="headline text-[1.0625rem] text-balance md:text-xl">
          <span className="link-draw">{article.title}</span>
        </h3>
        <p className="meta mt-1.5 md:hidden">
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

export default function ArchivePage() {
  const groups = byIssue();
  const total = groups.reduce((sum, group) => sum + group.articles.length, 0);

  return (
    <div className="shell py-12 md:py-20">
      <header className="border-b-2 border-ink pb-8">
        <span className="kicker text-red">Everything we have printed</span>
        <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">Archive</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          {total} stories across {issues.length} issues, newest first. Each group is one
          printed issue, in page order.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.key} className="mt-14">
          <h2 className="kicker-lg sticky top-20 z-10 flex items-baseline gap-4 bg-paper/95 py-3 backdrop-blur">
            {group.href ? (
              <Link href={group.href} className="transition-colors hover:text-red">
                {group.heading}
              </Link>
            ) : (
              group.heading
            )}
            <span className="text-muted">{group.sub}</span>
            <span className="ml-auto text-muted tabular-nums">
              {String(group.articles.length).padStart(2, "0")}
            </span>
          </h2>

          <ul className="mt-2">
            {group.articles.map((article) => (
              <Reveal key={article.slug} as="li">
                <Row article={article} />
              </Reveal>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
