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
 * The cover story, set the way a front page sets one: the headline takes the
 * full measure of the shell rather than a column of it, which is the whole
 * reason display type reads as architecture instead of just large text. The
 * dek, byline and plate hang underneath in an asymmetric 4/8.
 *
 * The screen assembles rather than appears — rule, kicker, headline, dek and
 * byline arrive in reading order while the plate clears its own mask. It is
 * all CSS animation, so it costs no JavaScript and stops dead under
 * `prefers-reduced-motion`.
 */
export function Hero({ article }: { article: Article }) {
  const author = authorBySlug[article.authorSlug];
  const issue = issueBySlug[article.issueSlug];

  // A long headline at 9rem becomes a wall; step the ceiling down instead.
  const scale =
    article.title.length > 46
      ? "text-[clamp(2.6rem,7vw,5.5rem)]"
      : article.title.length > 30
        ? "text-[clamp(3rem,9vw,7.75rem)]"
        : "text-[clamp(3.25rem,11vw,9.5rem)]";

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

      {/* ── The headline owns the full measure ── */}
      <div className="load-line pt-8 md:pt-12" style={at(140)}>
        <Kicker category={article.category} />
      </div>

      <h1
        id="cover-story"
        className={`display-tight mt-5 text-balance ${scale}`}
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

      <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
        {/* ── Words ── */}
        {/* self-start: the plate is tall, and letting this column stretch to
            match it opened a hole between the dek and the byline. */}
        <div className="self-start lg:col-span-4">
          <p
            className="load-line max-w-lg text-lg leading-relaxed text-ink-2 md:text-xl"
            style={at(360)}
          >
            {article.dek}
          </p>

          <div className="load-line mt-8" style={at(470)}>
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
        <div className="lg:col-span-8">
          <Link
            href={`/article/${article.slug}`}
            className="group block -mr-5 md:-mr-10 xl:-mr-14"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div
              className="zoom-frame load-plate relative aspect-[4/3] lg:aspect-[16/9]"
              style={at(280)}
            >
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
