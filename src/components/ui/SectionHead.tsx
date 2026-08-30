import { ArrowLink } from "@/components/ui/ArrowLink";

/**
 * The standing section header: a heavy rule, a small kicker, a display title,
 * a one-line description and an optional link into the full category.
 *
 * Every section on the site is headed by this one component at one of two
 * sizes, which is the whole reason the page reads as a single publication
 * rather than as eight modules that happen to share a colour.
 */
export function SectionHead({
  id,
  kicker,
  title,
  description,
  href,
  linkLabel,
  note,
  tone = "ink",
  size = "lg",
}: {
  /** Set when a section labels itself with `aria-labelledby`. */
  id?: string;
  kicker: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  /** A counter or dateline printed above the link. */
  note?: React.ReactNode;
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
            id={id}
            className={`display mt-3 ${
              size === "lg"
                ? "text-[length:var(--text-section)]"
                : "text-[length:var(--text-section-sm)]"
            } ${onPaper ? "text-paper" : ""}`}
          >
            {title}
          </h2>
          {description && (
            <p
              className={`mt-4 max-w-xl text-[0.95rem] leading-relaxed md:text-base ${
                onPaper ? "text-paper/70" : "text-ink-2"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {(href || note) && (
          <div className="flex flex-col items-start gap-3 md:items-end">
            {note && (
              <span
                className={`kicker tabular-nums ${onPaper ? "text-paper/45" : "text-muted"}`}
              >
                {note}
              </span>
            )}
            {href && (
              <ArrowLink href={href} tone={onPaper ? "paper" : "ink"} size="sm">
                {linkLabel ?? "All stories"}
              </ArrowLink>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
