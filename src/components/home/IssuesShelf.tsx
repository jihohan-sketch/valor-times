import Image from "next/image";
import Link from "next/link";

import { Rail } from "@/components/ui/Rail";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowLink } from "@/components/ui/ArrowLink";
import type { Issue } from "@/data";

/**
 * The printed run, on the front page.
 *
 * Every story on this site was typeset on paper first, and until now you had
 * to find that through a dropdown. Sits on the warm shell so the homepage
 * moves paper -> shell -> ink rather than stacking two dark blocks; the covers
 * still read as objects against a ground that is not the page they sit on.
 */
export function IssuesShelf({
  issues,
  storyCounts,
}: {
  issues: Issue[];
  storyCounts: Record<string, number>;
}) {
  return (
    <section className="band bg-shell" aria-labelledby="printed-run">
      <div className="shell">
        <SectionHead
          id="printed-run"
          kicker="The printed run"
          title="Every issue, as it came off the page"
          description="Seven issues of Volume 3 and Volume 4. Real covers, real pages — open any one and read it at full size."
          href="/issues"
          linkLabel="All issues"
        />

        <Rail
          count={issues.length}
          label="Printed issues"
          className="mt-10 md:mt-14"
        >
          {issues.map((issue) => (
            <article key={issue.slug} className="w-[15rem] md:w-[17.5rem]">
              <Link href={`/issues/${issue.slug}`} className="group block">
                <div className="zoom-frame relative aspect-[737/1048] border border-rule-2 bg-paper transition-colors duration-300 group-hover:border-ink">
                  <Image
                    src={issue.cover}
                    alt={`Front page of Valor Times ${issue.title}`}
                    fill
                    sizes="(min-width: 768px) 17.5rem, 15rem"
                    className="object-cover object-top"
                  />
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-rule-2 pt-3">
                  <span className="kicker text-red">{issue.title}</span>
                  <span className="meta">{issue.dateLabel}</span>
                </div>

                <h3 className="headline mt-2 text-[1.0625rem] text-balance">
                  <span className="link-draw">{issue.lead}</span>
                </h3>

                <p className="meta mt-1.5 tabular-nums">
                  {issue.pageCount} pages · {storyCounts[issue.slug] ?? 0} stories
                </p>
              </Link>
            </article>
          ))}
        </Rail>

        <div className="mt-12 border-t border-rule-2 pt-8 md:hidden">
          <ArrowLink href="/issues" size="sm">
            All issues
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
