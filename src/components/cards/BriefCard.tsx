import Link from "next/link";

import { Kicker } from "@/components/ui/Kicker";
import type { Article } from "@/data";
import { formatDateShort } from "@/lib/format";

/** Text-only brief. No image, no dek — a headline and where it came from. */
export function BriefCard({ article }: { article: Article }) {
  return (
    <article className="group border-t border-rule py-4 transition-colors duration-300 hover:border-ink">
      <Link href={`/article/${article.slug}`} className="block">
        <div className="flex items-baseline justify-between gap-4">
          <Kicker category={article.category} href={false} />
          <span className="meta shrink-0 tabular-nums">
            {formatDateShort(article.date)}
          </span>
        </div>
        <h3 className="headline mt-2.5 text-[1.0625rem] text-balance">
          <span className="link-draw">{article.title}</span>
        </h3>
      </Link>
    </article>
  );
}
