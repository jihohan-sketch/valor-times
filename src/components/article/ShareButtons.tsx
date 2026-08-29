"use client";

import { useState } from "react";

/** Share controls. Copy falls back to a prompt-free message if the API is absent. */
export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* dismissed — fall through to copy */
      }
    }
    void copy();
  };

  const cls =
    "kicker flex items-center gap-2 border border-rule-2 px-4 py-2.5 transition-colors hover:border-ink hover:bg-ink hover:text-paper";

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="kicker mr-1 text-muted">Share</span>

      <a
        className={cls}
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <a
        className={cls}
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
      >
        Email
      </a>
      <button type="button" onClick={share} className={cls}>
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
