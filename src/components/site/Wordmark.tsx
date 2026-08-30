import Image from "next/image";
import Link from "next/link";

/**
 * The masthead lockup: the paper's own VT monogram, then the name.
 * `compact` is the scrolled state in the sticky bar.
 */
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
      className={`group/mark inline-flex items-center gap-[0.5em] whitespace-nowrap ${
        tone === "paper" ? "text-paper" : "text-ink"
      }`}
    >
      <span
        aria-hidden="true"
        /* The opening sequence measures this element and lands its own copy of
           the mark exactly on it. See Overture.tsx. */
        data-vt-mark=""
        className={`relative block shrink-0 transition-[width,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          compact ? "h-6 w-6 md:h-7 md:w-7" : "h-7 w-7 md:h-9 md:w-9"
        } ${tone === "paper" ? "invert" : ""}`}
      >
        <Image
          src="/mark/vt.png"
          alt=""
          fill
          sizes="36px"
          priority
          className="object-contain"
        />
      </span>

      <span
        className={`display-tight inline-flex items-baseline gap-[0.14em] transition-[font-size] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          compact ? "text-[1.35rem] md:text-[1.6rem]" : "text-[1.6rem] md:text-[2.1rem]"
        }`}
      >
        <span>VALOR</span>
        <span className="text-red">TIMES</span>
      </span>
    </Link>
  );
}
