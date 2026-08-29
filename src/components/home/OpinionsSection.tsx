import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getAuthor } from "@/data";
import type { Article } from "@/data/types";

/** Opinions run on a black field — signed arguments, no photographs. */
export function OpinionsSection({ articles }: { articles: Article[] }) {
  const [lead, ...rest] = articles;
  if (!lead) return null;

  const leadAuthor = getAuthor(lead.authorSlug);

  return (
    <section className="mt-24 bg-ink py-16 text-paper md:py-24" aria-labelledby="opinions">
      <div className="shell">
        <SectionHeader
          id="opinions"
          title="Opinions"
          description="Signed arguments from the student body and the masthead. We print replies."
          href="/category/opinions"
          linkLabel="All opinions"
          tone="inverted"
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <article className="group">
              <p className="kicker text-red">The argument</p>
              <h3 className="headline mt-4 text-[clamp(2rem,4.4vw,3.5rem)]">
                <Link href={`/article/${lead.slug}`} className="link-wipe">
                  {lead.title}
                </Link>
              </h3>
              <p className="prose-body mt-6 max-w-2xl text-paper/70">
                {lead.dek}
              </p>
              <p className="kicker mt-7 text-paper/50">
                {leadAuthor?.name} · {leadAuthor?.role}
              </p>
            </article>
          </Reveal>

          <div className="lg:col-span-5">
            <ul className="divide-y divide-paper/15 border-t border-paper/15">
              {rest.map((article, index) => {
                const author = getAuthor(article.authorSlug);
                return (
                  <li key={article.slug}>
                    <Reveal delay={index * 80}>
                      <article className="group py-6">
                        <h4 className="headline text-xl md:text-[1.375rem]">
                          <Link
                            href={`/article/${article.slug}`}
                            className="link-wipe"
                          >
                            {article.title}
                          </Link>
                        </h4>
                        <p className="mt-2.5 text-sm leading-relaxed text-paper/60">
                          {article.dek}
                        </p>
                        <p className="kicker mt-3.5 text-paper/40">
                          {author?.name}
                        </p>
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
