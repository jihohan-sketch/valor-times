import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";

/**
 * The standing call for contributors. The one place on the site where red
 * fills the whole field rather than accenting it.
 */
export function WriteForUs() {
  return (
    <section className="bg-red text-paper" aria-labelledby="write-cta">
      <div className="shell py-20 md:py-32">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="lg:col-span-8">
              <span className="kicker text-paper/70">Open call</span>
              <h2
                id="write-cta"
                className="display-tight mt-5 text-[clamp(2.75rem,9vw,7rem)]"
              >
                Have a story?
              </h2>
              <p className="mt-6 max-w-lg text-xl leading-relaxed text-paper/85 md:text-2xl">
                Your voice belongs here. We take pitches from every year group
                and every desk — reported, argued, drawn or photographed.
              </p>
            </div>

            <div className="lg:col-span-4 lg:pb-3">
              <Link
                href="/write"
                className="group inline-flex w-full items-center justify-between gap-6 border-2 border-paper bg-transparent px-7 py-6 transition-colors duration-300 hover:bg-paper hover:text-red"
              >
                <span className="kicker-lg">Write for Valor Times</span>
                <svg
                  width="26"
                  height="12"
                  viewBox="0 0 26 12"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
                >
                  <path d="M0 6h24M19 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </Link>

              <p className="mt-5 text-sm leading-relaxed text-paper/70">
                No experience required. Send one paragraph to the editors and
                they will work the draft with you.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
