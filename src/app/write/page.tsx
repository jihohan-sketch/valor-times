import type { Metadata } from "next";

import { Reveal } from "@/components/ui/Reveal";
import { categories } from "@/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Write for Us",
  description:
    "Pitch a story to Valor Times. Every desk is open to every year group.",
};

const STEPS = [
  {
    title: "Send one paragraph",
    body: "Not a draft — a paragraph. What happened, why it matters now, and who you would need to talk to. Three or four sentences is plenty.",
  },
  {
    title: "We reply by Thursday",
    body: "Every pitch gets an answer. If it is not right for this issue we will tell you why, and usually what would make it right.",
  },
  {
    title: "An editor works it with you",
    body: "You will be assigned a desk editor who reads the draft, asks the awkward questions and helps you find the second source.",
  },
  {
    title: "It runs with your name on it",
    body: "Every piece is bylined. Corrections, if we need them, run under our name — not yours.",
  },
];

export default function WritePage() {
  return (
    <>
      <header className="shell pt-12 pb-14 md:pt-20 md:pb-20">
        <div className="border-b-2 border-ink pb-10">
          <span className="kicker text-red">Open call</span>
          <h1 className="display-tight mt-5 text-[clamp(2.75rem,9vw,6.5rem)]">
            Write for Valor Times
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-ink-2">
            You do not need experience, a class period, or a friend on staff. You
            need one paragraph and something you have actually noticed.
          </p>
          <a
            href={`mailto:${site.email}?subject=Pitch`}
            className="group mt-9 inline-flex items-center gap-4 bg-red px-7 py-5 text-paper transition-colors duration-300 hover:bg-ink"
          >
            <span className="kicker-lg">Pitch a story</span>
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            >
              <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </a>
        </div>
      </header>

      <section className="shell pb-16 md:pb-24" aria-labelledby="how">
        <h2 id="how" className="kicker-lg">How it works</h2>
        <ol className="mt-8 grid gap-x-12 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} as="li" delay={i * 60}>
              <div className="border-t-2 border-ink pt-5">
                <span className="ordinal text-[2.5rem] text-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-3 text-2xl">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-shell py-16 md:py-24" aria-labelledby="desks">
        <div className="shell">
          <h2 id="desks" className="display text-[clamp(2rem,4.4vw,3.4rem)]">
            Every desk is open
          </h2>
          <p className="mt-4 max-w-xl text-ink-2">
            Pick the one that fits, or pitch something that fits none of them —
            those are usually the best ones.
          </p>
          <ul className="mt-10 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <li key={category.slug} className="border-t border-rule-2 py-5">
                <h3 className="headline text-lg">{category.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {category.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
