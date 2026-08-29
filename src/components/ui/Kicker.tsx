import Link from "next/link";

import { categoryBySlug } from "@/data/categories";
import type { CategorySlug } from "@/data/types";

/** The red category label that opens almost every piece of furniture on the site. */
export function Kicker({
  category,
  href = true,
  className = "",
  tone = "red",
}: {
  category: CategorySlug;
  /** Set false inside another link — nested anchors are invalid. */
  href?: boolean;
  className?: string;
  tone?: "red" | "paper" | "ink";
}) {
  const entry = categoryBySlug[category];
  const colour =
    tone === "paper"
      ? "text-paper/90"
      : tone === "ink"
        ? "text-ink"
        : "text-red";
  const label = <span className={`kicker ${colour} ${className}`}>{entry.name}</span>;

  if (!href) return label;

  return (
    <Link
      href={`/category/${entry.slug}`}
      className="inline-block transition-opacity hover:opacity-60"
    >
      {label}
    </Link>
  );
}
