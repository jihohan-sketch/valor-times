import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import type { Article } from "@/data/types";

interface StoryRowProps {
  article: Article;
  /** Hide the thumbnail for dense, text-only lists. */
  withImage?: boolean;
  showDek?: boolean;
}

/** A horizontal list item: text on the left, small square of artwork on the right. */
export function StoryRow({
  article,
  withImage = true,
  showDek = false,
}: StoryRowProps) {
  return (
    <article className="group flex items-start justify-between gap-5 py-6">
      <div className="min-w-0 flex-1">
        <CategoryLabel category={article.category} static />
        <h3 className="headline mt-2 text-xl md:text-[1.375rem]">
          <Link href={`/article/${article.slug}`} className="link-wipe">
            {article.title}
          </Link>
        </h3>
        {showDek && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {article.dek}
          </p>
        )}
        <Byline article={article} className="mt-3" />
      </div>

      {withImage && (
        <Link
          href={`/article/${article.slug}`}
          tabIndex={-1}
          aria-hidden
          className="relative size-20 shrink-0 overflow-hidden bg-newsprint md:size-28"
        >
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.06]"
          />
        </Link>
      )}
    </article>
  );
}
