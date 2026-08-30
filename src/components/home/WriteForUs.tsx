import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

/**
 * The standing call for contributors, and the last thing on the front page.
 *
 * The one place on the site where red fills the whole field rather than
 * accenting it, which is what earns it the closing position: the page runs
 * paper → ink → paper → red, and stops on the only block that asks the reader
 * for something.
 *
 * The headline is the whole pitch in four words. "Have a story?" on its own was
 * a question with no verb in it; the answer belongs in the same breath.
 */
export function WriteForUs() {
  return (
    <section className="bg-red text-paper" aria-labelledby="write-cta">
      <div className="shell band-lg">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="lg:col-span-7">
              <span className="kicker text-paper/70">Open call</span>
              <h2
                id="write-cta"
                className="display-tight mt-6 text-[clamp(2.75rem,9vw,7rem)]"
              >
                Have a story?
                <br />
                <span className="italic">Write it.</span>
              </h2>
              <p className="mt-7 max-w-lg text-xl leading-relaxed text-paper/85 md:text-2xl">
                Every desk is open to every year group, and you do not need
                experience or a friend on staff. One paragraph is a pitch.
              </p>
            </div>

            <div className="lg:col-span-5 lg:pb-3">
              <Link
                href="/write"
                className="group flex w-full items-center justify-between gap-6 border-2 border-paper px-7 py-6 transition-colors duration-300 hover:bg-paper hover:text-red"
              >
                <span className="label-lg">Pitch a story to the desk</span>
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
                Editors read every pitch and work the draft with you. Corrections
                and tips go to the same address:{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="underline decoration-paper/40 underline-offset-4 transition-colors hover:decoration-paper"
                >
                  {site.email}
                </a>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
