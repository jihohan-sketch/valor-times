import Image from "next/image";
import Link from "next/link";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Kicker } from "@/components/ui/Kicker";
import { authorBySlug, type Article } from "@/data";
import { formatDate, readingTime } from "@/lib/format";

/**
 * The cover story. Owns the first viewport: an oversized serif headline on the
 * left, a plate that runs off the right edge of the page, and nothing else.
 */
export function Hero({ article }: { article: Article }) {
  const author = authorBySlug[article.authorSlug];

  return (
    <section className="shell pt-6 pb-16 md:pt-10 md:pb-24" aria-labelledby="cover-story">
      {/* Issue line */}
      <div className="flex items-center justify-between border-b border-ink pb-3">
        <span className="kicker">The Cover Story</span>
        <span className="kicker text-muted tabular-nums">{formatDate(article.date)}</span>
      </div>

      <div className="grid gap-10 pt-8 md:pt-12 lg:grid-cols-12 lg:gap-12">
        {/* ── Words ── */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <Kicker category={article.category} />

            <h1
              id="cover-story"
              className="display-tight mt-5 text-[clamp(2.5rem,6.2vw,4.9rem)] text-balance"
            >
              <Link href={`/article/${article.slug}`} className="link-draw">
                {article.title}
              </Link>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink-2 md:text-xl">
              {article.dek}
            </p>
          </div>

          <div className="mt-9 md:mt-12">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-rule pt-5">
              <p className="text-sm font-semibold">{author?.name}</p>
              <p className="meta">{author?.role}</p>
              <p className="meta ml-auto tabular-nums">
                {readingTime(article.content)} min read
              </p>
            </div>

            <ArrowLink href={`/article/${article.slug}`} className="mt-8">
              Read story
            </ArrowLink>
          </div>
        </div>

        {/* ── Plate, running off the right edge ── */}
        <div className="lg:col-span-7">
          <Link
            href={`/article/${article.slug}`}
            className="group block -mr-5 md:-mr-10 xl:-mr-14"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="zoom-frame relative aspect-[4/3] lg:aspect-[5/4] xl:aspect-[16/11]">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
