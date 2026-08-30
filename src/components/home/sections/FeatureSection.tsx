import Link from "next/link";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { authorBySlug, type Article, type Category } from "@/data";
import { formatDate, readingTime } from "@/lib/format";

/**
 * Public Health & Science: one story given almost the whole section, with the
 * headline set over the plate, and the rest of the desk listed underneath.
 */
export function FeatureSection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  const [lead, ...rest] = articles;
  if (!lead) return null;
  const author = authorBySlug[lead.authorSlug];

  return (
    <section className="shell band" aria-labelledby={`sec-${category.slug}`}>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t-2 border-ink pt-5">
          <div>
            <span className="kicker text-red">{category.kicker}</span>
            <h2
              id={`sec-${category.slug}`}
              className="display mt-3 text-[length:var(--text-section)]"
            >
              {category.title}
            </h2>
          </div>
          <ArrowLink href={`/category/${category.slug}`} size="sm" className="mb-1">
            All research
          </ArrowLink>
        </div>
      </Reveal>

      {/* The giant */}
      <Reveal className="mt-10 md:mt-12">
        <article className="group">
          <Link href={`/article/${lead.slug}`} className="block">
            <Reveal plate>
              <Frame
                article={lead}
                ratio="aspect-[4/3] md:aspect-[21/9]"
                sizes="100vw"
              />
            </Reveal>

            <div className="grid gap-6 pt-7 md:grid-cols-12 md:gap-10">
              <h3 className="display text-[clamp(1.9rem,4vw,3.2rem)] text-balance md:col-span-7">
                <span className="link-draw">{lead.title}</span>
              </h3>
              <div className="md:col-span-5">
                <p className="text-base leading-relaxed text-ink-2 md:text-lg">{lead.dek}</p>
                <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-rule pt-4">
                  <div>
                    <dt className="kicker text-muted">Reporter</dt>
                    <dd className="mt-1.5 text-sm font-semibold">{author?.name}</dd>
                  </div>
                  <div>
                    <dt className="kicker text-muted">Filed</dt>
                    <dd className="mt-1.5 text-sm font-semibold tabular-nums">
                      {formatDate(lead.date)}
                    </dd>
                  </div>
                  <div>
                    <dt className="kicker text-muted">Length</dt>
                    <dd className="mt-1.5 text-sm font-semibold tabular-nums">
                      {readingTime(lead.content)} min
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Link>
        </article>
      </Reveal>

      {/* Supporting index */}
      <div className="mt-12 grid gap-x-10 md:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
        {rest.slice(0, 4).map((article, i) => (
          <Reveal key={article.slug} delay={i * 55}>
            <article className="group border-t-2 border-ink pt-5">
              <Link href={`/article/${article.slug}`} className="block">
                <span className="ordinal text-sm text-red">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <h3 className="headline mt-3 text-[1.0625rem] text-balance md:text-lg">
                  <span className="link-draw">{article.title}</span>
                </h3>
                <p className="mt-2.5 line-clamp-3 text-sm text-ink-2">{article.dek}</p>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
