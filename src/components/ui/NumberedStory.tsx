import Link from "next/link";

import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { getAuthor } from "@/data";
import type { Article } from "@/data/types";

interface NumberedStoryProps {
  article: Article;
  index: number;
}

/** A ranked entry in the Trending column. The numeral does the visual work. */
export function NumberedStory({ article, index }: NumberedStoryProps) {
  const author = getAuthor(article.authorSlug);

  return (
    <article className="group flex gap-5 border-t border-rule py-5 first:border-t-0 first:pt-0">
      <span
        aria-hidden
        className="headline w-10 shrink-0 text-4xl leading-none text-rule-strong transition-colors duration-500 group-hover:text-red"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <CategoryLabel category={article.category} static />
        <h3 className="headline mt-1.5 text-lg leading-tight md:text-xl">
          <Link href={`/article/${article.slug}`} className="link-wipe">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 text-[0.8125rem] text-muted">
          {author?.name ?? "Staff"}
        </p>
      </div>
    </article>
  );
}
