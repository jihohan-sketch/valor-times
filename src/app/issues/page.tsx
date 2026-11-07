import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

import { Reveal } from "@/components/ui/Reveal";
import { getAllArticles } from "@/data";
import { issueLabel, issues, missingIssues } from "@/data/issues";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Issues",
  description:
    "Every printed issue of The Valor Times, with covers and full pages, newest first.",
  path: "/issues",
});

export default function IssuesPage() {
  const catalog = getAllArticles();
  const countFor = (slug: string) =>
    catalog.filter((article) => article.issueSlug === slug).length;
  const pages = issues.reduce((total, issue) => total + issue.pageCount, 0);
  const missing = missingIssues();
  const missingList = new Intl.ListFormat("en", { type: "conjunction" }).format(
    missing.map(issueLabel),
  );

  return (
    <div className="shell py-12 md:py-20">
      <header className="border-b-2 border-ink pb-8">
        <span className="kicker text-red">The printed newspaper</span>

        {/* The one place the type is allowed to fill the page. */}
        <h1 className="display-tight mt-4 text-colossal leading-[0.82]">Issues</h1>

        <div className="mt-8 grid gap-x-12 gap-y-6 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-2xl text-lg leading-relaxed text-ink-2">
            Browse every printed issue, newest first. Each cover is the real
            front page, and opening an issue lets you read the pages as they
            were laid out.
          </p>
          <dl className="flex gap-10">
            <div>
              <dt className="meta">Issues</dt>
              <dd className="display mt-1 text-4xl tabular-nums">{issues.length}</dd>
            </div>
            <div>
              <dt className="meta">Printed pages</dt>
              <dd className="display mt-1 text-4xl tabular-nums">{pages}</dd>
            </div>
            <div>
              <dt className="meta">Stories</dt>
              <dd className="display mt-1 text-4xl tabular-nums">{catalog.length}</dd>
            </div>
          </dl>
        </div>
      </header>

      {missing.length > 0 && (
        <p className="meta mt-6 max-w-2xl border-l-2 border-rule pl-4">
          Not on this site: {missingList}. The numbering of the issues we have
          skips {missing.length === 1 ? "it" : "them"}, and we have no copy of{" "}
          {missing.length === 1 ? "it" : missing.length === 2 ? "either" : "any of them"}. If {missing.length === 1 ? "it was" : "one was"}{" "}
          printed, please send the PDF to{" "}
          <a href={`mailto:${site.webmaster.email}`} className="link-draw text-ink">
            {site.webmaster.name}
          </a>
          .
        </p>
      )}

      <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <Reveal key={issue.slug} as="li">
            <Link href={`/issues/${issue.slug}`} className="group block">
              <div className="relative aspect-[737/1048] overflow-hidden border border-rule bg-shell-deep">
                <Image
                  src={issue.cover}
                  alt={`Front page of The Valor Times ${issueLabel(issue)}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                />
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-rule pt-3">
                <p className="kicker text-red">{issueLabel(issue)}</p>
                <p className="meta tabular-nums">{issue.dateLabel}</p>
              </div>

              <h2 className="headline mt-2 text-xl text-balance">
                <span className="link-draw">{issue.lead}</span>
              </h2>

              <p className="meta mt-2 tabular-nums">
                {issue.pageCount} pages · {countFor(issue.slug)} stories
              </p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
