import Link from "next/link";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Byline } from "@/components/ui/Byline";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Scene } from "@/components/ui/Scene";
import type { Article, Category } from "@/data";

/**
 * Social Issues: a tinted ground, a heading column that stays put while the
 * list scrolls past it, and reporting set as running text rather than cards.
 */
export function ListSection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  const [lead, ...rest] = articles;
  if (!lead) return null;

  return (
    <section className="band bg-shell" aria-labelledby={`sec-${category.slug}`}>
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Heading column */}
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <span className="kicker text-red">{category.kicker}</span>
            <h2
              id={`sec-${category.slug}`}
              className="display mt-4 text-[length:var(--text-section)]"
            >
              {category.title}
            </h2>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
              {category.description}
            </p>
            <ArrowLink href={`/category/${category.slug}`} size="sm" className="mt-8">
              All reporting
            </ArrowLink>
          </div>
        </Reveal>

        {/* The list */}
        <div className="lg:col-span-8">
          {/* Lead carries the only plate in the section. */}
          <Reveal>
            <article className="group border-t-2 border-ink pt-7">
              <Link href={`/article/${lead.slug}`} className="block">
                <Reveal plate>
                  <Scene>
                    <Frame
                      article={lead}
                      ratio="aspect-[21/9]"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  </Scene>
                </Reveal>
                <h3 className="display mt-6 text-[clamp(1.6rem,3vw,2.5rem)] text-balance">
                  <span className="link-draw">{lead.title}</span>
                </h3>
                <p className="mt-3 max-w-2xl text-ink-2">{lead.dek}</p>
                <div className="mt-4">
                  <Byline article={lead} />
                </div>
              </Link>
            </article>
          </Reveal>

          {/* The rest, as running headlines. */}
          <div className="mt-10">
            {rest.slice(0, 4).map((article, i) => (
              <Reveal key={article.slug} delay={i * 55}>
                <article className="group border-t border-rule-2 py-6">
                  <Link
                    href={`/article/${article.slug}`}
                    className="flex items-start gap-5 md:gap-8"
                  >
                    <span className="ordinal shrink-0 pt-1 text-sm text-red">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="headline text-[1.15rem] text-balance md:text-[1.5rem]">
                        <span className="link-draw">{article.title}</span>
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[0.95rem] text-ink-2">
                        {article.dek}
                      </p>
                      <div className="mt-3">
                        <Byline article={article} />
                      </div>
                    </div>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
