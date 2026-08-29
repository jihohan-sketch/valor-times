import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryRow } from "@/components/ui/StoryRow";
import type { Article } from "@/data/types";

/** One long feature paired with a dense list of the rest of the desk. */
export function ScienceSection({ articles }: { articles: Article[] }) {
  const [lead, ...rest] = articles;
  if (!lead) return null;

  return (
    <section className="shell mt-24 md:mt-28" aria-labelledby="science">
      <SectionHeader
        id="science"
        title="Science & Psychology"
        description="What the research says about attention, sleep, memory and the strange machinery of being seventeen."
        href="/category/science-psychology"
        linkLabel="All research"
      />

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <article className="group">
            <Link
              href={`/article/${lead.slug}`}
              tabIndex={-1}
              aria-hidden
              className="block overflow-hidden bg-newsprint"
            >
              <div className="relative aspect-16/10 w-full">
                <Image
                  src={lead.image}
                  alt={lead.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-[1000ms] ease-out-expo group-hover:scale-[1.04]"
                />
              </div>
            </Link>
            <h3 className="headline mt-6 text-3xl md:text-[2.5rem]">
              <Link href={`/article/${lead.slug}`} className="link-wipe">
                {lead.title}
              </Link>
            </h3>
            <p className="prose-body mt-5 max-w-2xl text-ink-soft">{lead.dek}</p>
            <Byline article={lead} variant="full" className="mt-6" />
          </article>
        </Reveal>

        <div className="lg:col-span-5">
          <div className="divide-y divide-rule border-t-2 border-ink">
            {rest.map((article, index) => (
              <Reveal key={article.slug} delay={index * 80}>
                <StoryRow article={article} showDek />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
