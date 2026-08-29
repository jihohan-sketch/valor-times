import Link from "next/link";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { authorBySlug, type Article, type Category } from "@/data";
import { readingTime } from "@/lib/format";

/**
 * Psychology: a typographic index. No artwork anywhere in the section — just
 * ordinals, headlines and a rule that runs red under the cursor.
 */
export function IndexSection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  return (
    <section className="shell py-16 md:py-24" aria-labelledby={`sec-${category.slug}`}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <span className="kicker text-red">{category.kicker}</span>
            <h2
              id={`sec-${category.slug}`}
              className="display mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)]"
            >
              {category.title}
            </h2>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
              {category.description}
            </p>
            <ArrowLink href={`/category/${category.slug}`} size="sm" className="mt-8">
              The whole desk
            </ArrowLink>
          </div>
        </Reveal>

        <ol className="lg:col-span-8">
          {articles.slice(0, 6).map((article, i) => (
            <Reveal key={article.slug} as="li" delay={Math.min(i * 50, 200)}>
              <Link
                href={`/article/${article.slug}`}
                className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-5 border-t border-rule py-6 transition-colors duration-300 hover:border-red md:grid-cols-[4.5rem_1fr_auto] md:gap-x-8 md:py-7"
              >
                <span className="ordinal text-[1.5rem] text-rule-2 transition-colors duration-300 group-hover:text-red md:text-[2.5rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <h3 className="display text-[clamp(1.3rem,2.5vw,2rem)] text-balance">
                    <span className="link-draw">{article.title}</span>
                  </h3>
                  <p className="mt-2.5 max-w-xl text-[0.95rem] text-ink-2">{article.dek}</p>
                  <p className="meta mt-3">
                    {authorBySlug[article.authorSlug]?.name}
                  </p>
                </div>

                <span className="meta hidden shrink-0 self-center tabular-nums md:block">
                  {readingTime(article.content)} min
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
