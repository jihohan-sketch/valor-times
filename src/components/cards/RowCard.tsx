import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { Kicker } from "@/components/ui/Kicker";
import { isPlate, type Article } from "@/data";

/**
 * Horizontal card: square-ish plate on the left, text on the right.
 * The workhorse of the Latest run and of article discovery at the page foot.
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
    <article className="group border-t border-rule py-6 md:py-7">
      <Link href={`/article/${article.slug}`} className="flex gap-5 md:gap-8">
        {typeof index === "number" && (
          <span className="ordinal hidden w-10 shrink-0 pt-1 text-lg text-rule-2 md:block">
            {String(index).padStart(2, "0")}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <Kicker category={article.category} href={false} />
          <h3 className="headline mt-2.5 text-lg text-balance md:text-[1.4rem]">
            <span className="link-draw">{article.title}</span>
          </h3>
          {showDek && (
            <p className="mt-2 line-clamp-2 text-[0.95rem] text-ink-2 md:line-clamp-none">
              {article.dek}
            </p>
          )}
          <div className="mt-3">
            <Byline article={article} showViews />
          </div>
        </div>

        {article.image && (
          <div
            className={`relative aspect-square w-24 shrink-0 sm:w-32 md:w-44 ${
              isPlate(article)
                ? "bg-paper p-1.5 ring-1 ring-rule-2"
                : "zoom-frame"
            }`}
          >
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(max-width: 768px) 128px, 176px"
              className={isPlate(article) ? "object-contain" : "object-cover"}
            />
          </div>
        )}
      </Link>
    </article>
  );
}
