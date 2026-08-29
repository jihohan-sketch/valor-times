import type { Metadata } from "next";
import Image from "next/image";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { allArticles, authors, categories } from "@/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${site.name} is, who makes it, and how to get a story in it.`,
};

const PRINCIPLES = [
  {
    title: "Report first",
    body: "Nothing runs because it sounds true. Every number has a source we can name, and every claim about a person has been put to that person first.",
  },
  {
    title: "Show the working",
    body: "If we counted something, we say how we counted it and how many we missed. A method paragraph is not an admission of weakness.",
  },
  {
    title: "Argue in the open",
    body: "Opinion is signed, labelled, and separated from reporting. If you disagree with a piece, the byline tells you exactly who to find.",
  },
  {
    title: "Correct fast",
    body: "Corrections run under the masthead, not under the writer. We would rather be embarrassed on Tuesday than wrong forever.",
  },
];

export default function AboutPage() {
  return (
    <>
      <header className="shell pt-12 pb-14 md:pt-20 md:pb-20">
        <div className="grid gap-10 border-b-2 border-ink pb-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <span className="kicker text-red">Since {site.founded}</span>
            <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">
              A newsroom, run by students
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-ink-2">
              {site.description} We publish {allArticles.length} stories from the
              printed issues — Vol. 3 and Vol. 4 — across {categories.length} desks,
              on a schedule set by the people who write them.
            </p>
            <ArrowLink href="/write" className="mt-9">
              Write for us
            </ArrowLink>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-shell-deep">
              <Image
                src="/images/about-newsroom.jpg"
                alt="The Valor Times printed masthead, with the VT monogram and staff list"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="shell pb-16 md:pb-24" aria-labelledby="principles">
        <h2 id="principles" className="kicker-lg">How we work</h2>
        <ol className="mt-8 grid gap-x-12 md:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.title} as="li" delay={i * 60}>
              <div className="border-t-2 border-ink pt-5">
                <span className="ordinal text-[2.5rem] text-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-3 text-2xl">{principle.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-shell py-16 md:py-24" aria-labelledby="masthead">
        <div className="shell">
          <h2 id="masthead" className="display text-[clamp(2rem,4.4vw,3.4rem)]">
            The masthead
          </h2>
          <ul className="mt-10 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <li key={author.slug} className="border-t border-rule-2 py-6">
                <p className="kicker text-red">{author.role}</p>
                <h3 className="display mt-2.5 text-2xl">{author.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{author.bio}</p>
              </li>
            ))}
          </ul>

          <p className="mt-14 max-w-xl text-ink-2">
            Corrections, tips and complaints:{" "}
            <a href={`mailto:${site.email}`} className="link-draw text-ink">
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
