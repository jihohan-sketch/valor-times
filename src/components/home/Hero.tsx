import Image from "next/image";
import Link from "next/link";

import { isScan } from "@/components/home/HomeSections";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Byline } from "@/components/ui/Byline";
import { Kicker } from "@/components/ui/Kicker";
import { issueBySlug, issueLabel } from "@/data/issues";
import type { Article } from "@/data/types";

/**
 * The cover story, set the way a front page sets one: the headline takes the
 * full measure of the shell rather than a column of it, with the dek, byline
 * and picture underneath. The rest of the desk's featured stories run below it
 * as plain headlines, so a reader can see everything on the cover at once.
 */
export function Hero({ articles }: { articles: Article[] }) {
  const [article, ...others] = articles;
  if (!article) return null;

  const issue = issueBySlug[article.issueSlug];
  const photo = Boolean(article.image) && !isScan(article);

  // A long headline at 9rem becomes a wall; step the ceiling down instead.
  const scale =
    article.title.length > 46
      ? "text-[clamp(2.6rem,7vw,5.5rem)]"
      : article.title.length > 30
        ? "text-[clamp(3rem,9vw,7.75rem)]"
        : "text-[clamp(3.25rem,11vw,9.5rem)]";

  return (
    <section className="shell pt-6 md:pt-10" aria-labelledby="cover-story">
      {issue && (
        <div className="flex items-center justify-end border-b border-ink pb-3">
          <Link
            href={`/issues/${issue.slug}`}
            className="kicker tabular-nums text-muted transition-colors hover:text-red"
          >
            {issueLabel(issue)}
            <span className="ml-3">{issue.dateLabel}</span>
          </Link>
        </div>
      )}

      <div className="pt-8 md:pt-12">
        <Kicker category={article.category} />
      </div>

      <h1 id="cover-story" className={`display-tight mt-5 text-balance ${scale}`}>
        <Link href={`/article/${article.slug}`} className="link-draw inline">
          {article.title}
        </Link>
      </h1>

      <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
        <div className={`self-start ${photo ? "lg:col-span-4" : "lg:col-span-8"}`}>
          <p className="max-w-lg text-lg leading-relaxed text-ink-2 md:text-xl">
            {article.dek}
          </p>
          <div className="mt-8 border-t border-rule pt-5">
            <Byline article={article} size="md" />
          </div>
          <ArrowLink href={`/article/${article.slug}`} className="mt-8">
            Read story
          </ArrowLink>
        </div>

        {photo && (
          <Link
            href={`/article/${article.slug}`}
            className="block lg:col-span-8"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-shell lg:aspect-[16/9]">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
          </Link>
        )}
      </div>

      {others.length > 0 && (
        <div className="mt-12 border-t border-rule pt-5 md:mt-16">
          <p className="kicker text-muted">Also on the cover</p>
          <ul className="mt-4 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((story) => (
              <li key={story.slug}>
                <Link href={`/article/${story.slug}`} className="group block">
                  <span className="headline text-[1.05rem] leading-snug text-balance">
                    <span className="link-draw">{story.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
