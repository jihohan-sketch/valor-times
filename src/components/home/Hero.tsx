import Image from "next/image";
import Link from "next/link";

import { HeroRotator, type HeroSlide } from "@/components/home/HeroRotator";
import { isScan } from "@/components/home/HomeSections";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Byline } from "@/components/ui/Byline";
import { Kicker } from "@/components/ui/Kicker";
import { issueBySlug, issueLabel } from "@/data/issues";
import type { Article } from "@/data/types";

/**
 * The cover story, set the way a front page sets one: the headline takes the
 * full measure of the shell rather than a column of it, with the dek, byline
 * and picture underneath. The rest of the issue runs below it as plain
 * headlines, so a reader can see what else is on the cover.
 *
 * Every story in the rotation is set here, on the server, exactly as a static
 * cover would set it; `HeroRotator` only decides which one is showing and
 * types the headline in.
 */
export function Hero({ articles }: { articles: Article[] }) {
  const [first] = articles;
  if (!first) return null;

  const issue = issueBySlug[first.issueSlug];

  const slides: HeroSlide[] = articles.map((article, i) => {
    const photo = Boolean(article.image) && !isScan(article);
    return {
      slug: article.slug,
      title: article.title,
      // A long headline at 9rem becomes a wall; step the ceiling down instead.
      scale:
        article.title.length > 46
          ? "text-[clamp(2.6rem,7vw,5.5rem)]"
          : article.title.length > 30
            ? "text-[clamp(3rem,9vw,7.75rem)]"
            : "text-[clamp(3.25rem,11vw,9.5rem)]",
      photo,
      kicker: <Kicker category={article.category} />,
      body: (
        <>
          <p className="max-w-lg text-lg leading-relaxed text-ink-2 md:text-xl">
            {article.dek}
          </p>
          <div className="mt-8 border-t border-rule pt-5">
            <Byline article={article} size="md" />
          </div>
          <ArrowLink href={`/article/${article.slug}`} className="mt-8">
            Read story
          </ArrowLink>
        </>
      ),
      image: photo ? (
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority={i === 0}
          fetchPriority={i === 0 ? "high" : "auto"}
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
      ) : null,
    };
  });

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

      <HeroRotator slides={slides} />
    </section>
  );
}
