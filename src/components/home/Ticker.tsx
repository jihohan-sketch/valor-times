import Link from "next/link";

import type { Article } from "@/data/types";

/** A slow marquee of the stories people are reading right now. */
export function Ticker({ articles }: { articles: Article[] }) {
  const items = [...articles, ...articles];

  return (
    <div className="mt-16 overflow-hidden border-y border-ink bg-ink py-3 text-paper">
      <div className="flex items-center gap-6">
        <span className="kicker shrink-0 bg-red px-3 py-1.5 text-paper">
          Most read
        </span>
        <div className="relative flex-1 overflow-hidden">
          <ul className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
            {items.map((article, index) => (
              <li key={`${article.slug}-${index}`} className="flex items-center gap-10">
                <Link
                  href={`/article/${article.slug}`}
                  className="whitespace-nowrap text-sm text-paper/85 transition-colors hover:text-paper"
                >
                  {article.title}
                </Link>
                <span aria-hidden className="text-red">
                  ●
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
