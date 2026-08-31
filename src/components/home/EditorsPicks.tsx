import Image from "next/image";
import Link from "next/link";

import { ViewCount } from "@/components/engagement/ViewCount";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { authorBySlug, categoryBySlug, type Article } from "@/data";
import { isMount } from "@/data/plate";

/**
 * The desk's own run of stories, ranked.
 *
 * It used to be called Trending, which it never was: nothing here is decided by
 * a view count — the order is `editorsRank`, typed by an editor. The live
 * readership figure still prints beside each line, but as a fact about the
 * story rather than as the reason it is on the list, and the standfirst says so
 * outright.
 *
 * Oversized ordinals, hairline separators, and a plate that fades in on hover
 * on wide screens — the only place the site uses that trick.
 *
 * `showHeader` is off on /editors-picks, which prints the same heading and the
 * same standfirst directly above this section — two of them read as a bug.
 */
export function EditorsPicks({
  articles,
  showHeader = true,
}: {
  articles: Article[];
  showHeader?: boolean;
}) {
  if (articles.length === 0) return null;

  return (
    <section
      className={`bg-ink text-paper ${showHeader ? "band" : "pb-[var(--space-band)] pt-8 md:pt-10"}`}
      aria-labelledby="editors-picks"
    >
      <div className="shell">
        {showHeader && (
          <Reveal>
            <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t-2 border-paper pt-5 md:pt-6">
              <div className="max-w-2xl">
                <span className="kicker text-paper/55">Chosen by the desk</span>
                <h2
                  id="editors-picks"
                  className="display mt-3 text-[length:var(--text-section)]"
                >
                  Editor&rsquo;s Picks
                </h2>
                <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-paper/70 md:text-base">
                  Not a popularity chart. These are the stories the editors would
                  hand a new reader first, in the order they would hand them over.
                </p>
              </div>
              <ArrowLink href="/editors-picks" tone="paper" size="sm" className="mb-1">
                The full list
              </ArrowLink>
            </header>
          </Reveal>
        )}

        <ol className={showHeader ? "mt-10 md:mt-14" : ""}>
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
                      <span className="shift-on-hover inline-block transition-colors duration-200 group-hover:text-red">
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
                    <div
                      className={`relative aspect-[3/2] w-40 overflow-hidden opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 lg:w-52 ${
                        isMount(article) ? "bg-paper p-1 ring-1 ring-rule-2" : "bg-shell-deep"
                      }`}
                    >
                      <Image
                        src={article.image}
                        alt=""
                        fill
                        loading="lazy"
                        sizes="208px"
                        className={
                          isMount(article)
                            ? "object-contain"
                            : "scale-105 object-cover object-center transition-transform duration-700 group-hover:scale-100"
                        }
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
