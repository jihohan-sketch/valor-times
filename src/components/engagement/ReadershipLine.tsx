"use client";

import { formatCount } from "@/lib/engagement/counts";
import { useEngagement } from "@/components/engagement/EngagementProvider";

/**
 * The readership figures, set to sit inside the article's meta rule alongside
 * the byline and the reading time. It holds no space until the numbers land,
 * so the header never reflows under the reader's eye.
 */
export function ReadershipLine() {
  const { views, likes, comments, ready } = useEngagement();
  if (!ready || views === 0) return null;

  const parts = [
    `${formatCount(views)} ${views === 1 ? "view" : "views"}`,
    likes > 0 ? `${formatCount(likes)} ${likes === 1 ? "like" : "likes"}` : null,
    comments.length > 0
      ? `${formatCount(comments.length)} ${comments.length === 1 ? "comment" : "comments"}`
      : null,
  ].filter(Boolean);

  return <p className="meta tabular-nums">{parts.join(" · ")}</p>;
}
