import Image from "next/image";
import Link from "next/link";

import { HeroRotator, type HeroSlide } from "@/components/home/HeroRotator";
import { isScan, PhotoOrPlaceholder } from "@/components/home/HomeSections";
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
      thumb: <PhotoOrPlaceholder article={article} ratio="aspect-[3/2]" sizes="112px" />,
      label: <Kicker category={article.category} href={false} />,
      byline: <Byline article={article} />,
    };
  });

  return (
    <section className="shell pt-6 md:pt-10" aria-labelledby="cover-story">
      {/* The issue line. It names the issue the cover comes from in so many
          words, so a reader landing here knows which edition is the newest
          without scrolling to the covers further down. */}
      {issue && (
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-ink pb-3">
          <Link href={`/issues/${issue.slug}`} className="group block">
            <span className="kicker block text-red">Current Issue</span>
            <span className="headline mt-1 flex flex-wrap items-baseline gap-x-3 text-[1.25rem] tabular-nums md:text-[1.5rem]">
              <span className="link-draw">{issueLabel(issue)}</span>
              <span className="meta text-[0.8125rem]">{issue.dateLabel}</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <ArrowLink href={`/issues/${issue.slug}`} size="sm" tone="red" className="pb-1">
              Read the full issue
            </ArrowLink>
            <Link
              href="/issues"
              className="label hidden text-muted transition-colors hover:text-red sm:inline"
            >
              Past issues
            </Link>
          </div>
        </div>
      )}

      <HeroRotator slides={slides} />
    </section>
  );
}
