import { ArrowLink } from "@/components/ui/ArrowLink";

/**
 * The standing section header: a heavy rule, a small kicker, a display title,
 * a one-line description and an optional link into the full category.
 */
export function SectionHead({
  kicker,
  title,
  description,
  href,
  linkLabel,
  tone = "ink",
  size = "lg",
}: {
  kicker: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  tone?: "ink" | "paper";
  size?: "lg" | "md";
}) {
  const onPaper = tone === "paper";

  return (
    <header
      className={`border-t-2 pt-5 md:pt-6 ${onPaper ? "border-paper" : "border-ink"}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="max-w-2xl">
          <span className={`kicker ${onPaper ? "text-paper/60" : "text-red"}`}>
            {kicker}
          </span>
          <h2
            className={`display mt-3 ${
              size === "lg"
                ? "text-[clamp(2rem,4.4vw,3.4rem)]"
                : "text-[clamp(1.7rem,3vw,2.5rem)]"
            } ${onPaper ? "text-paper" : ""}`}
          >
            {title}
          </h2>
          {description && (
            <p
              className={`mt-3 max-w-xl text-[0.95rem] leading-relaxed md:text-base ${
                onPaper ? "text-paper/70" : "text-ink-2"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {href && (
          <ArrowLink href={href} tone={onPaper ? "paper" : "ink"} size="sm" className="mb-1">
            {linkLabel ?? "All stories"}
          </ArrowLink>
        )}
      </div>
    </header>
  );
}
