import { getAuthor } from "@/data";
import type { Article } from "@/data/types";
import { formatDate, formatDateShort, readingTime } from "@/lib/format";

interface BylineProps {
  article: Article;
  variant?: "compact" | "full";
  tone?: "default" | "inverted";
  className?: string;
}

export function Byline({
  article,
  variant = "compact",
  tone = "default",
  className = "",
}: BylineProps) {
  const author = getAuthor(article.authorSlug);
  const muted = tone === "inverted" ? "text-paper/60" : "text-muted";

  if (variant === "full") {
    return (
      <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`}>
        <span className="kicker text-ink">By {author?.name ?? "Staff"}</span>
        <span className={`text-sm ${muted}`}>
          {formatDate(article.date)} · {readingTime(article.content)} min read
        </span>
      </div>
    );
  }

  return (
    <p className={`text-[0.8125rem] ${muted} ${className}`}>
      <span className="font-medium text-ink-soft">{author?.name ?? "Staff"}</span>
      <span aria-hidden> · </span>
      {formatDateShort(article.date)}
    </p>
  );
}
