import Image from "next/image";
import Link from "next/link";

import { HomeSection } from "@/components/home/HomeSections";
import type { Issue } from "@/data";
import { issueLabel } from "@/data/issues";

/** How many covers the front page stands up; the rest are on /issues. */
const SHOWN = 3;

/**
 * The printed run, on the front page: the newest covers, three to a row. The
 * scans of the paper belong here, where they are meant to be covers.
 */
export function IssuesShelf({
  issues,
  storyCounts,
}: {
  issues: Issue[];
  storyCounts: Record<string, number>;
}) {
  const latest = issues.slice(0, SHOWN);
  if (latest.length === 0) return null;

  return (
    <HomeSection id="printed-run" title="Issues" href="/issues" linkLabel="All issues">
      <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
        {latest.map((issue) => (
          <article key={issue.slug}>
            <Link href={`/issues/${issue.slug}`} className="group block">
              <div className="relative aspect-[737/1048] border border-rule-2 bg-paper transition-colors duration-200 group-hover:border-ink">
                <Image
                  src={issue.cover}
                  alt={`Front page of Valor Times ${issueLabel(issue)}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <span className="headline text-[1.0625rem]">
                  <span className="link-draw">{issueLabel(issue)}</span>
                </span>
                <span className="meta">{issue.dateLabel}</span>
              </div>
              <p className="mt-1.5 text-[0.95rem] text-ink-2 text-balance">{issue.lead}</p>
              <p className="meta mt-1.5 tabular-nums">
                {issue.pageCount} pages · {storyCounts[issue.slug] ?? 0} stories
              </p>
            </Link>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}
