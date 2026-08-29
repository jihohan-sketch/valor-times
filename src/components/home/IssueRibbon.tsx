import Link from "next/link";

import type { Issue } from "@/data";

/**
 * A running index of the printed run, set as a masthead ribbon.
 *
 * It does two jobs: it breaks the white of the front page with a hard black
 * band before the reader has scrolled a full screen, and it says out loud that
 * this site is an archive of a physical paper. The track is duplicated so the
 * loop has no seam; `--animate-marquee` stops under `prefers-reduced-motion`,
 * which leaves a legible static list rather than a broken one.
 */
export function IssueRibbon({ issues }: { issues: Issue[] }) {
  const run = [...issues, ...issues];

  return (
    <section
      aria-label="The printed run"
      className="group/ribbon relative overflow-hidden border-y-2 border-ink bg-ink py-5 text-paper"
    >
      {/* Fade the ends so the loop reads as continuous, not clipped. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent md:w-32"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent md:w-32"
      />

      <div className="flex w-max animate-marquee items-center group-hover/ribbon:[animation-play-state:paused] motion-reduce:animate-none">
        {run.map((issue, i) => (
          <Link
            key={`${issue.slug}-${i}`}
            href={`/issues/${issue.slug}`}
            aria-hidden={i >= issues.length ? "true" : undefined}
            tabIndex={i >= issues.length ? -1 : undefined}
            className="group/item flex shrink-0 items-baseline gap-4 px-6 md:gap-6 md:px-10"
          >
            <span className="display text-[1.75rem] whitespace-nowrap transition-colors duration-300 group-hover/item:text-red md:text-[2.5rem]">
              {issue.title}
            </span>
            <span className="kicker whitespace-nowrap text-paper/40">
              {issue.lead}
            </span>
            <span
              aria-hidden="true"
              className="ml-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-red md:ml-4"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
