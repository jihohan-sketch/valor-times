import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { Kicker } from "@/components/ui/Kicker";
import { isPlate, type Article } from "@/data";

/**
 * Horizontal card: text on the left, a square plate on the right.
 * The workhorse of the Latest run and of article discovery at the page foot.
 *
 * The ordinal in the gutter turns red and the whole row shifts a few pixels
 * toward its own link on hover — the same gesture the ranked lists use, so a
 * numbered row behaves the same way wherever it appears.
 */
export function RowCard({
  article,
  index,
  showDek = true,
}: {
  article: Article;
  /** Optional two-digit ordinal printed in the gutter. */
  index?: number;
  showDek?: boolean;
}) {
  return (
    <article className="group border-t border-rule transition-colors duration-300 hover:border-ink">
      <Link
        href={`/article/${article.slug}`}
        className="flex gap-5 py-6 md:gap-8 md:py-7"
      >
        {typeof index === "number" && (
          <span className="ordinal hidden w-10 shrink-0 pt-1 text-lg text-rule-2 transition-colors duration-300 group-hover:text-red md:block">
            {String(index).padStart(2, "0")}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <Kicker category={article.category} href={false} />
          <h3 className="headline mt-3 text-[1.0625rem] text-balance md:text-[length:var(--text-title-sm)]">
            <span className="link-draw">{article.title}</span>
          </h3>
          {showDek && (
            <p className="mt-2.5 line-clamp-2 text-[0.95rem] leading-relaxed text-ink-2 md:line-clamp-3">
              {article.dek}
            </p>
          )}
          <div className="mt-3.5">
            <Byline article={article} showViews />
          </div>
        </div>

        {article.image && (
          <div
            className={`relative aspect-square w-24 shrink-0 self-start sm:w-32 md:w-40 ${
              isPlate(article)
                ? "bg-paper p-1.5 ring-1 ring-rule-2 transition-colors duration-300 group-hover:ring-ink"
                : "zoom-frame"
            }`}
          >
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className={isPlate(article) ? "object-contain" : "object-cover"}
            />
          </div>
        )}
      </Link>
    </article>
  );
}
