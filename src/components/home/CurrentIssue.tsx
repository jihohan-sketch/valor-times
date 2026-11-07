import Image from "next/image";
import Link from "next/link";

import { PhotoOrPlaceholder } from "@/components/home/HomeSections";
import { Byline } from "@/components/ui/Byline";
import { Kicker } from "@/components/ui/Kicker";
import { issueLabel } from "@/data/issues";
import type { Article, Issue } from "@/data/types";

/**
 * Where "Read the printed edition" goes: the PDF in Drive when the issue has
 * one, otherwise the page-by-page reader on the issue's own page. Either way
 * it is the paper as printed, not the issue's table of contents.
 */
export function printedEditionHref(issue: Issue): { href: string; external: boolean } {
  return issue.driveUrl
    ? { href: issue.driveUrl, external: true }
    : { href: `/issues/${issue.slug}#printed-pages`, external: false };
}

/**
 * The current issue, whole: its printed front page, every story in it in page
 * order, and one way into the printed edition. Sits directly under the cover
 * story so a reader sees what this issue holds before anything older.
 */
export function CurrentIssue({ issue, stories }: { issue: Issue; stories: Article[] }) {
  if (stories.length === 0) return null;
  const printed = printedEditionHref(issue);
  const label = issueLabel(issue);

  const button = (
    <>
      Read the printed edition
      <svg width="18" height="10" viewBox="0 0 20 10" fill="none" aria-hidden="true">
        <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </>
  );
  const buttonClass =
    "label-lg inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-paper transition-colors duration-200 hover:bg-red";
  const coverClass =
    "relative block aspect-[737/1048] border border-rule-2 bg-paper transition-colors duration-200 hover:border-ink";
  const cover = (
    <Image
      src={issue.cover}
      alt={`Front page of The Valor Times ${label}`}
      fill
      sizes="(max-width: 768px) 60vw, 22vw"
      className="object-cover object-top"
    />
  );

  return (
    <section
      className="mt-12 border-t-2 border-ink pt-6 md:mt-16"
      aria-labelledby="current-issue"
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-4 lg:col-span-3">
          <p className="kicker text-red">In this issue</p>
          <h2 id="current-issue" className="headline mt-2 text-[1.5rem] tabular-nums md:text-[1.75rem]">
            {label}
          </h2>
          <p className="meta mt-1.5 tabular-nums">
            {issue.dateLabel} &middot; {issue.pageCount} pages &middot; {stories.length}{" "}
            {stories.length === 1 ? "story" : "stories"}
          </p>

          <div className="mt-6 max-w-[14rem] max-md:max-w-[11rem]">
            {printed.external ? (
              <a href={printed.href} target="_blank" rel="noreferrer" className={coverClass} tabIndex={-1} aria-hidden="true">
                {cover}
              </a>
            ) : (
              <Link href={printed.href} className={coverClass} tabIndex={-1} aria-hidden="true">
                {cover}
              </Link>
            )}
          </div>

          <div className="mt-6">
            {printed.external ? (
              <a href={printed.href} target="_blank" rel="noreferrer" className={buttonClass}>
                {button}
              </a>
            ) : (
              <Link href={printed.href} className={buttonClass}>
                {button}
              </Link>
            )}
            {printed.external && (
              <p className="meta mt-2">Opens the PDF in Google Drive</p>
            )}
          </div>
        </div>

        <ol className="grid content-start gap-x-10 md:col-span-8 lg:col-span-9 lg:grid-cols-2">
          {stories.map((story) => (
            <li key={story.slug} className="border-t border-rule first:border-t-0 lg:[&:nth-child(2)]:border-t-0">
              <Link href={`/article/${story.slug}`} className="group flex items-start gap-4 py-5">
                <div className="w-24 shrink-0 md:w-28">
                  <PhotoOrPlaceholder article={story} ratio="aspect-[3/2]" sizes="112px" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <Kicker category={story.category} href={false} />
                    <span className="meta tabular-nums">p. {story.page}</span>
                  </div>
                  <h3 className="headline mt-1.5 text-[1.05rem] leading-snug text-balance">
                    <span className="link-draw">{story.title}</span>
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[0.9rem] leading-relaxed text-ink-2">
                    {story.dek}
                  </p>
                  <div className="mt-2">
                    <Byline article={story} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
