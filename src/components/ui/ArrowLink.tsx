import Link from "next/link";

/**
 * The site's standing call to action: uppercase label, a rule that fills on
 * hover, and an arrow that steps forward.
 */
export function ArrowLink({
  href,
  children,
  tone = "ink",
  size = "md",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "red" | "paper";
  size?: "sm" | "md";
  className?: string;
}) {
  const colour =
    tone === "paper"
      ? "text-paper border-paper/35 hover:border-paper"
      : tone === "red"
        ? "text-red border-red/35 hover:border-red"
        : "text-ink border-ink/20 hover:border-ink";

  return (
    <Link
      href={href}
      className={`group/arrow inline-flex items-center gap-3 border-b-2 pb-2 transition-colors ${colour} ${className}`}
    >
      <span className={size === "sm" ? "kicker" : "kicker-lg"}>{children}</span>
      <svg
        width="20"
        height="10"
        viewBox="0 0 20 10"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/arrow:translate-x-1.5"
      >
        <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </Link>
  );
}
