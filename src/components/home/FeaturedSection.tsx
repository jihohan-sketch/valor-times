import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/data/types";

/** Long-form picks, laid out as alternating full-width rows. */
export function FeaturedSection({ articles }: { articles: Article[] }) {
  return (
    <section className="shell mt-24 md:mt-28" aria-labelledby="featured">
      <SectionHeader
        id="featured"
        title="Featured"
        description="The pieces we would hand you first."
      />

      <div className="mt-4">
        {articles.map((article, index) => (
          <Reveal key={article.slug}>
            <article className="group grid items-center gap-8 border-b border-rule py-10 md:grid-cols-12 md:gap-14 md:py-14">
              <Link
                href={`/article/${article.slug}`}
                tabIndex={-1}
                aria-hidden
                className={`block overflow-hidden bg-newsprint md:col-span-5 ${
                  index % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <div className="relative aspect-3/2 w-full">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-[1000ms] ease-out-expo group-hover:scale-[1.05]"
                  />
                </div>
              </Link>

              <div className="md:col-span-7">
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="headline text-xl text-rule-strong transition-colors duration-500 group-hover:text-red"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <CategoryLabel category={article.category} />
                </div>
                <h3 className="headline mt-3 text-[clamp(1.75rem,3.6vw,2.75rem)]">
                  <Link href={`/article/${article.slug}`} className="link-wipe">
                    {article.title}
                  </Link>
                </h3>
                <p className="prose-body mt-4 max-w-2xl text-ink-soft">
                  {article.dek}
                </p>
                <Byline article={article} variant="full" className="mt-5" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
