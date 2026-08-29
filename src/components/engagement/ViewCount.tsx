"use client";

import { useEffect, useState } from "react";

import { fetchCounts, formatCount, type Counts } from "@/lib/engagement/counts";

/**
 * The small "1,204 views" that sits in a meta line beside a byline or a date.
 *
 * It renders nothing until the number arrives, and nothing at all if the
 * request fails or the story has no readers yet — an empty counter says less
 * than no counter. Every instance on a screen resolves from one shared request.
 */
export function ViewCount({
  slug,
  className = "",
  /** Also print the comment count when there is one. */
  withComments = false,
}: {
  slug: string;
  className?: string;
  withComments?: boolean;
}) {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let live = true;
    fetchCounts(slug, (result) => {
      if (live) setCounts(result);
    });
    return () => {
      live = false;
    };
  }, [slug]);

  if (!counts || counts.views === 0) return null;

  return (
    <span className={`tabular-nums ${className}`}>
      {formatCount(counts.views)} {counts.views === 1 ? "view" : "views"}
      {withComments && counts.comments > 0 && (
        <>
          {" · "}
          {formatCount(counts.comments)}{" "}
          {counts.comments === 1 ? "comment" : "comments"}
        </>
      )}
    </span>
  );
}
