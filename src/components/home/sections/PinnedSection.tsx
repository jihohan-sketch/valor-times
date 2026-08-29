import Link from "next/link";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Byline } from "@/components/ui/Byline";
import { Frame } from "@/components/ui/Frame";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import type { Article, Category } from "@/data";

/**
 * Cuisine: a pinned lead on the left, and a rail of wide plates beside it that
 * keeps running past the edge of the page.
 */
export function PinnedSection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  const [lead, ...rest] = articles;
  if (!lead) return null;

  return (
    <section
      className="overflow-hidden bg-shell py-16 md:py-24"
      aria-labelledby={`sec-${category.slug}`}
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Pinned lead */}
          <Reveal className="lg:col-span-5">
            <span className="kicker text-red">{category.kicker}</span>
            <h2
              id={`sec-${category.slug}`}
              className="display mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)]"
            >
              {category.title}
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
              {category.description}
            </p>

            <article className="group mt-9 border-t-2 border-ink pt-7">
              <Link href={`/article/${lead.slug}`} className="block">
                <Frame
                  article={lead}
                  ratio="aspect-[3/2]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <h3 className="display mt-5 text-[clamp(1.5rem,2.4vw,2.15rem)] text-balance">
                  <span className="link-draw">{lead.title}</span>
                </h3>
                <p className="mt-3 text-[0.95rem] text-ink-2">{lead.dek}</p>
                <div className="mt-4">
                  <Byline article={lead} />
                </div>
              </Link>
            </article>

            <ArrowLink href={`/category/${category.slug}`} size="sm" className="mt-8">
              More from the lunch line
            </ArrowLink>
          </Reveal>

          {/* Rail of wide plates */}
          <Reveal className="lg:col-span-7" delay={80}>
            <div className="lg:pt-2">
              <Rail count={rest.length} label={`More ${category.title} stories`}>
                {rest.map((article, i) => (
                  <article
                    key={article.slug}
                    className="group w-[80vw] sm:w-[54vw] lg:w-[26rem]"
                  >
                    <Link href={`/article/${article.slug}`} className="block">
                      <Frame
                        article={article}
                        ratio="aspect-[16/10]"
                        sizes="(max-width: 1024px) 80vw, 416px"
                      />
                      <div className="mt-4 flex items-start gap-4">
                        <span className="ordinal shrink-0 pt-1 text-sm text-red">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3 className="headline text-lg text-balance md:text-xl">
                            <span className="link-draw">{article.title}</span>
                          </h3>
                          <div className="mt-2.5">
                            <Byline article={article} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </Rail>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
