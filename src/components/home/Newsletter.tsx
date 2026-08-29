import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";

/** The one place on the site where red fills the whole field. */
export function Newsletter() {
  return (
    <section className="mt-24 bg-red text-paper" aria-labelledby="newsletter">
      <div className="shell grid gap-8 py-16 md:grid-cols-12 md:items-end md:py-20">
        <div className="md:col-span-7">
          <p className="kicker text-paper/70">The Friday edition</p>
          <h2
            id="newsletter"
            className="headline mt-4 text-[clamp(2rem,4.6vw,3.5rem)]"
          >
            One email a week. Everything worth reading, nothing else.
          </h2>
        </div>

        <Reveal className="md:col-span-5">
          <p className="max-w-md text-[0.95rem] leading-relaxed text-paper/80">
            The week&rsquo;s reporting, one opinion worth arguing with, and the
            comic — sent Friday afternoon, before the buses.
          </p>
          <Link
            href="/about#contribute"
            className="group mt-7 inline-flex items-center gap-3 border-b-2 border-paper pb-1.5 kicker transition-opacity duration-300 hover:opacity-75"
          >
            Subscribe
            <span
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
