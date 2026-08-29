import Link from "next/link";

/** The masthead lockup. `compact` is the scrolled state in the sticky bar. */
export function Wordmark({
  compact = false,
  tone = "ink",
}: {
  compact?: boolean;
  tone?: "ink" | "paper";
}) {
  return (
    <Link
      href="/"
      aria-label="Valor Times — home"
      className={`display-tight inline-flex items-baseline gap-[0.14em] whitespace-nowrap transition-[font-size] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        tone === "paper" ? "text-paper" : "text-ink"
      } ${compact ? "text-[1.35rem] md:text-[1.6rem]" : "text-[1.6rem] md:text-[2.1rem]"}`}
    >
      <span>VALOR</span>
      <span className="text-red">TIMES</span>
    </Link>
  );
}
