import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { allArticles, authors, categories } from "@/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${site.name} is, who makes it, and how to get a story in it.`,
};

const principles = [
  {
    title: "Report first",
    body: "Nothing runs on this site because it sounds true. Every number in a story has a source we can name, and every claim about a person has been put to that person first.",
  },
  {
    title: "Sign the arguments",
    body: "Opinions carry a byline. If we publish a criticism of a decision, the person who made that decision gets the same number of words in reply.",
  },
  {
    title: "Correct in public",
    body: "When we get something wrong we say so at the top of the story, with the date, and we leave the correction there permanently.",
  },
  {
    title: "Cover the ordinary",
    body: "Most of school is not a scandal. It is a schedule, a lunch line and a room where a decision gets made quietly. That is the beat.",
  },
];

export default function AboutPage() {
  return (
    <>
      <header className="shell pt-12 md:pt-20">
        <div className="border-b-2 border-ink pb-10">
          <p className="kicker text-red">About</p>
          <h1 className="headline mt-4 max-w-4xl text-[length:var(--text-mega)]">
            A student newsroom that takes its own school seriously.
          </h1>
        </div>
      </header>

      <section className="shell mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="prose-body space-y-6 text-ink">
            <p className="first-letter:mr-2 first-letter:float-left first-letter:font-[family-name:var(--font-display)] first-letter:text-[4.2rem] first-letter:leading-[0.82] first-letter:font-semibold">
              {site.name} has been published since {site.founded}. It is written,
              edited, photographed and illustrated by students, and it exists
              because the decisions that shape a school day are made in rooms
              most students never see.
            </p>
            <p>
              We cover six desks — {categories.map((c) => c.name).join(", ")} —
              and we treat all of them as reporting. A blind taste test of the
              cafeteria menu and a vote on the bell schedule are the same kind of
              work: find out what is actually happening, write it down
              accurately, and put a name on it.
            </p>
            <p>
              The paper is independent. Faculty advise; they do not approve
              copy. Everything published here was chosen by the student editors
              listed below, who are also the people you should email when we get
              something wrong.
            </p>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 80}>
                <div className="border-t-2 border-ink pt-4">
                  <h2 className="headline text-xl">{principle.title}</h2>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                    {principle.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="relative aspect-4/5 w-full overflow-hidden bg-newsprint">
            <Image
              src="/images/about-newsroom.svg"
              alt="Abstract composition representing the newsroom"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <dl className="mt-8 divide-y divide-rule border-y border-rule">
            {[
              ["Founded", String(site.founded)],
              ["Stories published", `${allArticles.length}`],
              ["Desks", `${categories.length}`],
              ["Masthead", `${authors.length} students`],
              ["Contact", site.email],
            ].map(([term, value]) => (
              <div key={term} className="flex justify-between gap-6 py-3.5">
                <dt className="kicker text-muted">{term}</dt>
                <dd className="text-sm text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section id="masthead" className="shell mt-24 scroll-mt-24">
        <SectionHeader
          title="The Masthead"
          description="The editors and writers responsible for what appears on this site."
        />
        <div className="mt-9 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author, index) => (
            <Reveal key={author.slug} delay={(index % 3) * 80}>
              <div className="border-t border-rule pt-5">
                <h3 className="headline text-xl">{author.name}</h3>
                <p className="kicker mt-1.5 text-red">{author.role}</p>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
                  {author.bio}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="corrections"
        className="relative mt-24 grain overflow-hidden border-y border-rule bg-newsprint py-16 scroll-mt-24 md:py-20"
      >
        <div className="shell relative grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="headline text-[clamp(1.9rem,3.6vw,2.75rem)]">
              Corrections
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="prose-body text-ink-soft">
              If something on this site is wrong, tell us and we will fix it in
              public. Corrections appear at the top of the story with the date
              they were made, and they stay there. We do not quietly edit a
              published piece.
            </p>
            <p className="mt-5 text-sm text-muted">
              Send corrections to{" "}
              <a href={`mailto:${site.email}`} className="link-wipe text-ink">
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="contribute" className="shell mt-24 scroll-mt-24">
        <SectionHeader
          title="Write for us"
          description="No experience required. A tip is enough to start with."
        />
        <div className="mt-9 grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Pitch a story",
              body: "One paragraph: what happened, who would know about it, and why it matters this month rather than in general.",
            },
            {
              title: "Send a tip",
              body: "You do not have to write it. If something is going on, tell us and we will report it out. Tips can be anonymous.",
            },
            {
              title: "Write a reply",
              body: "Disagree with an opinion piece? We print responses at the same length as the original argument.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <div className="border-t-2 border-ink pt-4">
                <h3 className="headline text-2xl">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={`mailto:${site.email}`}
            className="group kicker inline-flex items-center gap-3 border-b-2 border-ink pb-1.5 transition-colors duration-300 hover:border-red hover:text-red"
          >
            {site.email}
            <span
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2"
            >
              →
            </span>
          </a>
          <Link
            href="/"
            className="kicker text-muted transition-colors hover:text-red"
          >
            Back to the front page
          </Link>
        </div>
      </section>
    </>
  );
}
