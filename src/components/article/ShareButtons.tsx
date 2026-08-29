"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  path: string;
  orientation?: "vertical" | "horizontal";
}

export function ShareButtons({
  title,
  path,
  orientation = "vertical",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = () =>
    typeof window === "undefined" ? path : `${window.location.origin}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url: url() });
      } catch {
        /* dismissed by the user — nothing to do */
      }
      return;
    }
    void copy();
  };

  const buttonClass =
    "flex size-10 items-center justify-center border border-rule text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper";

  return (
    <div
      className={
        orientation === "vertical"
          ? "flex flex-row items-center gap-2.5 lg:flex-col lg:items-start"
          : "flex flex-row items-center gap-2.5"
      }
    >
      <span className="kicker mr-1 text-muted lg:mr-0 lg:mb-1">Share</span>

      <a
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Share on X"
        className={buttonClass}
      >
        <span aria-hidden className="text-sm font-semibold">
          X
        </span>
      </a>

      <button
        type="button"
        onClick={nativeShare}
        aria-label="Share this article"
        className={buttonClass}
      >
        <span aria-hidden className="text-sm">
          ↗
        </span>
      </button>

      <button
        type="button"
        onClick={copy}
        aria-label="Copy link to this article"
        className={buttonClass}
      >
        <span aria-hidden className="text-sm">
          {copied ? "✓" : "🔗"}
        </span>
      </button>

      <span
        aria-live="polite"
        className={`kicker text-red transition-opacity duration-300 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        Copied
      </span>
    </div>
  );
}
