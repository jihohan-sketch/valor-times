"use client";

import { useEngagement } from "@/components/engagement/EngagementProvider";
import { formatCount } from "@/lib/engagement/counts";

/**
 * Liking a story takes one press and no account. The heart fills, the count
 * steps, and pressing again takes it back — the whole contract of an anonymous
 * like is that it stays reversible by the browser that left it.
 */
export function LikeButton({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const { liked, likes, like, ready } = useEngagement();

  const onPaper = tone === "paper";
  const idle = onPaper
    ? "border-paper/30 text-paper hover:border-paper"
    : "border-rule-2 text-ink hover:border-ink";
  const active = "border-red bg-red-wash text-red";

  return (
    <button
      type="button"
      onClick={() => void like()}
      disabled={!ready}
      aria-pressed={liked}
      aria-label={liked ? "Remove your like" : "Like this story"}
      className={`group/like inline-flex items-center gap-3 border px-4 py-2.5 transition-colors duration-200 disabled:opacity-40 ${
        liked ? active : idle
      }`}
    >
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        aria-hidden="true"
        fill={liked ? "currentColor" : "none"}
        className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/like:scale-110"
      >
        <path
          d="M8.5 14.2 2.4 8.4a3.6 3.6 0 0 1 5.1-5.1l1 1 1-1a3.6 3.6 0 0 1 5.1 5.1L8.5 14.2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="kicker">{liked ? "Liked" : "Like"}</span>
      {likes > 0 && (
        <span className="kicker tabular-nums opacity-60">{formatCount(likes)}</span>
      )}
    </button>
  );
}
