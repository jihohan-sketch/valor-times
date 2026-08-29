import Link from "next/link";

import { site } from "@/lib/site";

const sizes = {
  sm: "text-[1.05rem] md:text-[1.15rem]",
  md: "text-3xl md:text-4xl",
  lg: "text-[clamp(2.4rem,9vw,6.5rem)]",
} as const;

interface WordmarkProps {
  size?: keyof typeof sizes;
  className?: string;
  /** Renders as plain text instead of a link (for the footer / masthead). */
  asLink?: boolean;
}

export function Wordmark({
  size = "md",
  className = "",
  asLink = true,
}: WordmarkProps) {
  const mark = (
    <span
      className={`headline block font-black uppercase leading-none tracking-[-0.03em] ${sizes[size]} ${className}`}
    >
      Valor<span className="text-red">&nbsp;</span>Times
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link href="/" aria-label={`${site.name} home`} className="inline-block">
      {mark}
    </Link>
  );
}
