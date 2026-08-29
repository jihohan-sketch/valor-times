import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  id?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  tone?: "default" | "inverted";
  className?: string;
}

/** The rule-and-label pattern that opens every homepage section. */
export function SectionHeader({
  title,
  id,
  description,
  href,
  linkLabel = "View all",
  tone = "default",
  className = "",
}: SectionHeaderProps) {
  const border = tone === "inverted" ? "border-paper/25" : "border-ink";
  const sub = tone === "inverted" ? "text-paper/65" : "text-muted";

  return (
    <div className={`border-t-2 ${border} pt-4 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h2 id={id} className="headline text-[1.75rem] md:text-[2.125rem]">
            {title}
          </h2>
          {description && (
            <p className={`mt-1.5 max-w-xl text-sm leading-relaxed ${sub}`}>
              {description}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="group kicker inline-flex items-center gap-2 pb-1 text-red"
          >
            {linkLabel}
            <span
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
