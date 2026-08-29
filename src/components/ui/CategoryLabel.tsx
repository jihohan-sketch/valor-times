import Link from "next/link";

import { categoryBySlug } from "@/data";
import type { CategorySlug } from "@/data/types";

const accentClass: Record<string, string> = {
  red: "bg-accent-red",
  ink: "bg-accent-ink",
  clay: "bg-accent-clay",
  moss: "bg-accent-moss",
  indigo: "bg-accent-indigo",
  amber: "bg-accent-amber",
};

interface CategoryLabelProps {
  category: CategorySlug;
  /** Inverted sits on dark backgrounds. */
  tone?: "default" | "inverted";
  className?: string;
  /** Non-interactive version, for use inside another link. */
  static?: boolean;
}

export function CategoryLabel({
  category,
  tone = "default",
  className = "",
  static: isStatic = false,
}: CategoryLabelProps) {
  const meta = categoryBySlug[category];
  const text = tone === "inverted" ? "text-paper/80" : "text-ink";
  const inner = (
    <>
      <span
        aria-hidden
        className={`inline-block size-[7px] ${accentClass[meta.accent]}`}
      />
      {meta.name}
    </>
  );

  const classes = `kicker inline-flex items-center gap-2 ${text} ${className}`;

  if (isStatic) return <span className={classes}>{inner}</span>;

  return (
    <Link
      href={`/category/${meta.slug}`}
      className={`${classes} transition-colors hover:text-red`}
    >
      {inner}
    </Link>
  );
}
