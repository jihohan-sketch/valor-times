import Link from "next/link";

import { HeroBook, type BookPage } from "@/components/home/HeroBook";
import { isScan } from "@/components/home/HomeSections";
import { authorName } from "@/data";
import { categoryBySlug } from "@/data/categories";
import { issueBySlug, issueLabel } from "@/data/issues";
import type { Article } from "@/data/types";

/**
 * The cover of the newest issue, as a book on a table: its printed front page
 * is the cover, the inside cover lists what is in it, every story has a page
 * of its own, and the back cover closes it. `HeroBook` turns the pages; this
 * sets them, on the server, from the same data as every other page.
 */
export function Hero({ articles }: { articles: Article[] }) {
  const [first] = articles;
  if (!first) return null;

  const issue = issueBySlug[first.issueSlug];
  const label = issue ? issueLabel(issue) : "";
  const dateLabel = issue?.dateLabel ?? "";

  // Cover and contents come first, so the stories start on page 2.
  const stories: BookPage[] = articles.map((article, i) => ({
    kind: "story",
    slug: article.slug,
    title: article.title,
    dek: article.dek,
    category: categoryBySlug[article.category].name,
    author: authorName(article),
    dateLabel,
    image:
      article.image && !isScan(article)
        ? { src: article.image, alt: article.imageAlt }
        : undefined,
    folio: i + 2,
  }));

  const pages: BookPage[] = [
    issue
      ? { kind: "cover", src: issue.cover, alt: `Front page of The Valor Times, ${label}` }
      : { kind: "blank" },
    {
      kind: "contents",
      issue: label,
      dateLabel,
      items: stories.flatMap((page) =>
        page.kind === "story"
          ? [{ slug: page.slug, title: page.title, category: page.category, folio: page.folio }]
          : [],
      ),
    },
    ...stories,
  ];
  // Leaves have two sides: the last one is the closing page and the back cover.
  if (pages.length % 2 === 1) pages.push({ kind: "blank" });
  pages.push(
    { kind: "end", issue: label, dateLabel, href: issue ? `/issues/${issue.slug}` : "/issues" },
    { kind: "back" },
  );

  return (
    <section className="bk-stage px-4 pb-14 pt-8 md:pb-20 md:pt-12" aria-labelledby="cover-story">
      {issue && (
        <div className="mx-auto mb-8 flex max-w-[1040px] justify-center md:mb-12">
          <Link
            href={`/issues/${issue.slug}`}
            className="kicker tabular-nums text-[color:var(--bk-ink-soft)] transition-colors hover:text-red"
          >
            {label}
            <span className="ml-3">{dateLabel}</span>
          </Link>
        </div>
      )}

      <HeroBook pages={pages} title={`${label}: ${first.title}`} />
    </section>
  );
}
