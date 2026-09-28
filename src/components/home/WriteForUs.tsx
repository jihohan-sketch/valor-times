import Link from "next/link";

import { site } from "@/lib/site";

/**
 * The standing call for contributors, and the last thing on the front page.
 * On the same cream as everything else; red is kept for the button alone, so
 * the one thing the block asks the reader to do is the one thing that stands
 * out.
 */
export function WriteForUs() {
  return (
    <section className="shell pt-16 pb-20 md:pt-24 md:pb-28" aria-labelledby="write-cta">
      <div className="grid gap-10 border-t border-ink pt-8 lg:grid-cols-12 lg:items-end lg:gap-14">
        <div className="lg:col-span-7">
          <h2
            id="write-cta"
            className="display-tight text-[clamp(2.5rem,7vw,5.5rem)]"
          >
            Have a story?
            <br />
            <span className="italic">Write it.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2 md:text-xl">
            Every desk is open to every grade, and you do not need experience or
            a friend on staff. One paragraph is a pitch.
          </p>
        </div>
        <div className="lg:col-span-5 lg:pb-2">
          <Link
            href="/write"
            className="group flex w-full items-center justify-between gap-6 bg-red px-7 py-5 text-paper transition-colors duration-200 hover:bg-ink"
          >
            <span className="label-lg">Pitch a story to the desk</span>
            <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden="true" className="shrink-0">
              <path d="M0 6h24M19 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </Link>
          <p className="mt-5 text-sm leading-relaxed text-ink-2">
            Editors read every pitch and work the draft with you. Corrections and
            tips go to the same address:{" "}
            <a
              href={`mailto:${site.email}`}
              className="underline decoration-rule-2 underline-offset-4 transition-colors hover:decoration-ink"
            >
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
