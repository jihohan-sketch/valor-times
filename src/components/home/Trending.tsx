import Image from "next/image";
import Link from "next/link";

import { ViewCount } from "@/components/engagement/ViewCount";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { authorBySlug, categoryBySlug, type Article } from "@/data";

/**
 * The ranking. Oversized ordinals, hairline separators, and a plate that
 * fades in on hover on wide screens — the only place the site uses that trick.
 */
export function Trending({ articles }: { articles: Article[] }) {
  return (
    <section className="bg-ink py-16 text-paper md:py-24" aria-labelledby="trending">
      <div className="shell">
        <Reveal>
          <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t-2 border-paper pt-5 md:pt-6">
            <div>
              <span className="kicker text-paper/55">Most read this week</span>
              <h2 id="trending" className="display mt-3 text-[clamp(2rem,4.4vw,3.4rem)]">
                Trending Now
              </h2>
            </div>
            <ArrowLink href="/trending" tone="paper" size="sm" className="mb-1">
              Full ranking
            </ArrowLink>
          </header>
        </Reveal>

        <ol className="mt-10 md:mt-14">
          {articles.map((article, i) => {
            const author = authorBySlug[article.authorSlug];
            return (
              <Reveal key={article.slug} as="li" delay={Math.min(i * 45, 240)}>
                <Link
                  href={`/article/${article.slug}`}
                  className="group grid grid-cols-[3.25rem_1fr] items-center gap-x-5 border-t border-paper/15 py-5 transition-colors duration-300 hover:border-paper/45 md:grid-cols-[6rem_1fr_auto] md:gap-x-10 md:py-7"
                >
                  <span className="ordinal text-[2.5rem] text-paper/25 transition-colors duration-300 group-hover:text-red md:text-[4.25rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <span className="kicker text-red">
                      {categoryBySlug[article.category].name}
                    </span>
                    <h3 className="display mt-2 text-[clamp(1.25rem,2.6vw,2.1rem)] text-balance">
                      <span className="transition-colors duration-200 group-hover:text-red">
                        {article.title}
                      </span>
                    </h3>
                    <p className="meta mt-2 text-paper/50">
                      {author?.name}
                      <ViewCount
                        slug={article.slug}
                        className="before:mx-2 before:opacity-40 before:content-['/']"
                      />
                    </p>
                  </div>

                  {/* Plate appears only where there is room for it. */}
                  <div className="hidden md:block">
                    <div className="relative aspect-[3/2] w-40 overflow-hidden opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 lg:w-52">
                      <Image
                        src={article.image}
                        alt=""
                        fill
                        loading="lazy"
                        sizes="208px"
                        className="scale-105 object-cover transition-transform duration-700 group-hover:scale-100"
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
