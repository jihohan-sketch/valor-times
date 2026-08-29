import { ViewCount } from "@/components/engagement/ViewCount";
import { authorBySlug, type Article } from "@/data";
import { formatDate, formatDateShort, readingTime } from "@/lib/format";

/** Author · date · reading time · readers, in the two densities the site uses. */
export function Byline({
  article,
  size = "sm",
  showReadingTime = false,
  showViews = false,
  tone = "muted",
}: {
  article: Article;
  size?: "sm" | "md";
  showReadingTime?: boolean;
  /** Prints how many have read it, once the count arrives. */
  showViews?: boolean;
  tone?: "muted" | "paper";
}) {
  const author = authorBySlug[article.authorSlug];
  const colour = tone === "paper" ? "text-paper/75" : "text-muted";
  const scale = size === "md" ? "text-sm" : "text-xs";

  return (
    <p className={`${scale} ${colour} font-medium tracking-[0.03em]`}>
      <span className={tone === "paper" ? "text-paper" : "text-ink-2"}>
        {author?.name ?? "Valor Times Staff"}
      </span>
      <span className="mx-2 opacity-40">/</span>
      {size === "md" ? formatDate(article.date) : formatDateShort(article.date)}
      {showReadingTime && (
        <>
          <span className="mx-2 opacity-40">/</span>
          {readingTime(article.content)} min read
        </>
      )}
      {showViews && (
        <ViewCount slug={article.slug} className="before:mx-2 before:opacity-40 before:content-['/']" />
      )}
    </p>
  );
}
