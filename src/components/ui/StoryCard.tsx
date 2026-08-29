import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import type { Article } from "@/data/types";

const headlineSize = {
  sm: "text-xl",
  md: "text-2xl md:text-[1.75rem]",
  lg: "text-3xl md:text-4xl",
} as const;

interface StoryCardProps {
  article: Article;
  size?: keyof typeof headlineSize;
  showDek?: boolean;
  /** Aspect ratio of the artwork. */
  ratio?: "3/2" | "4/5" | "16/9";
  priority?: boolean;
  className?: string;
}

export function StoryCard({
  article,
  size = "md",
  showDek = false,
  ratio = "3/2",
  priority = false,
  className = "",
}: StoryCardProps) {
  const ratioClass = {
    "3/2": "aspect-3/2",
    "4/5": "aspect-4/5",
    "16/9": "aspect-video",
  }[ratio];

  return (
    <article className={`group flex flex-col ${className}`}>
      <Link
        href={`/article/${article.slug}`}
        tabIndex={-1}
        aria-hidden
        className="block overflow-hidden bg-newsprint"
      >
        <div className={`relative ${ratioClass} w-full`}>
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 30vw"
            className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.045]"
          />
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <CategoryLabel category={article.category} static />
        <h3 className={`headline mt-2 ${headlineSize[size]}`}>
          <Link href={`/article/${article.slug}`} className="link-wipe">
            {article.title}
          </Link>
        </h3>
        {showDek && (
          <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink-soft">
            {article.dek}
          </p>
        )}
        <Byline article={article} className="mt-3.5" />
      </div>
    </article>
  );
}
