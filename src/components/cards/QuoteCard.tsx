import Link from "next/link";

import { authorBySlug, type Article } from "@/data";
import { formatDateShort } from "@/lib/format";

/**
 * Text-first card for Opinions & Recommendations. No artwork on purpose —
 * the argument is the object, so the type carries the whole card.
 */
export function QuoteCard({
  article,
  index,
  width = "w-[80vw] sm:w-[52vw] lg:w-[32vw] xl:w-[27rem]",
}: {
  article: Article;
  index: number;
  width?: string;
}) {
  const author = authorBySlug[article.authorSlug];
  const isRec = article.tags.includes("recommendations");

  return (
    <article className={`group ${width}`}>
      <Link
        href={`/article/${article.slug}`}
        className="flex h-full min-h-[24rem] flex-col justify-between border-t-2 border-ink bg-shell p-6 transition-colors duration-300 hover:bg-red md:min-h-[27rem] md:p-8"
      >
        <div>
          <div className="flex items-baseline justify-between">
            <span className="kicker text-red transition-colors group-hover:text-paper">
              {isRec ? "Recommendation" : "Opinion"}
            </span>
            <span className="ordinal text-sm text-rule-2 transition-colors group-hover:text-paper/50">
              {String(index).padStart(2, "0")}
            </span>
          </div>

          <h3 className="display mt-6 text-[clamp(1.5rem,2.1vw,2rem)] text-balance transition-colors group-hover:text-paper">
            {article.title}
          </h3>

          <p className="mt-4 line-clamp-4 text-[0.95rem] text-ink-2 transition-colors group-hover:text-paper/85">
            {article.dek}
          </p>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4 border-t border-rule-2 pt-4 transition-colors group-hover:border-paper/30">
          <p className="text-sm">
            <span className="block font-semibold transition-colors group-hover:text-paper">
              {author?.name}
            </span>
            <span className="meta transition-colors group-hover:text-paper/70">
              {author?.role}
            </span>
          </p>
          <span className="meta shrink-0 transition-colors group-hover:text-paper/70">
            {formatDateShort(article.date)}
          </span>
        </div>
      </Link>
    </article>
  );
}
