import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Kicker } from "@/components/ui/Kicker";
import { authorBySlug, issueBySlug, type Article } from "@/data";
import { readingTime } from "@/lib/format";

/** Inline delay for the load choreography. */
const at = (ms: number) => ({ "--load-delay": `${ms}ms` }) as CSSProperties;

/**
 * The cover story. Owns the first viewport: an oversized serif headline on the
 * left, a plate that runs off the right edge of the page, and nothing else.
 *
 * The first screen assembles rather than appears — rule, kicker, headline, dek
 * and byline arrive in reading order while the plate clears its own mask. All
 * of it is CSS animation, so it costs no JavaScript and stops dead under
 * `prefers-reduced-motion`.
 */
export function Hero({ article }: { article: Article }) {
  const author = authorBySlug[article.authorSlug];
  const issue = issueBySlug[article.issueSlug];

  return (
    <section className="shell pt-6 pb-16 md:pt-10 md:pb-24" aria-labelledby="cover-story">
      {/* Issue line */}
      <div
        className="load-line flex items-center justify-between border-b border-ink pb-3"
        style={at(0)}
      >
        <span className="kicker">The Cover Story</span>
        {issue ? (
          <Link
            href={`/issues/${issue.slug}`}
            className="kicker tabular-nums text-muted transition-colors hover:text-red"
          >
            {issue.title}
            <span className="ml-3">{issue.dateLabel}</span>
          </Link>
        ) : (
          <span className="kicker text-muted tabular-nums">{article.date}</span>
        )}
      </div>

      <div className="grid gap-10 pt-8 md:pt-12 lg:grid-cols-12 lg:gap-12">
        {/* ── Words ── */}
        <div className="flex flex-col justify-between lg:col-span-6">
          <div>
            <div className="load-line" style={at(140)}>
              <Kicker category={article.category} />
            </div>

            <h1
              id="cover-story"
              className="display-tight mt-5 text-[clamp(2.75rem,7vw,6.25rem)] text-balance"
            >
              <span className="line-mask">
                <Link
                  href={`/article/${article.slug}`}
                  className="load-line link-draw inline"
                  style={at(230)}
                >
                  {article.title}
                </Link>
              </span>
            </h1>

            <p
              className="load-line mt-7 max-w-lg text-lg leading-relaxed text-ink-2 md:text-xl"
              style={at(360)}
            >
              {article.dek}
            </p>
          </div>

          <div className="load-line mt-9 md:mt-12" style={at(470)}>
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
        <div className="lg:col-span-6">
          <Link
            href={`/article/${article.slug}`}
            className="group block -mr-5 md:-mr-10 xl:-mr-14"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div
              className="zoom-frame load-plate relative aspect-[4/3] lg:aspect-[5/4] xl:aspect-[4/3]"
              style={at(280)}
            >
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
