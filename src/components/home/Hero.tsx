import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { Reveal } from "@/components/ui/Reveal";
import type { Article } from "@/data/types";

interface HeroProps {
  lead: Article;
  secondary: Article[];
}

/** The front-page lead, plus the three stories that share the fold with it. */
export function Hero({ lead, secondary }: HeroProps) {
  return (
    <section className="shell pt-10 md:pt-14" aria-labelledby="lead-story">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="group order-2 lg:order-1 lg:col-span-5 lg:pt-2">
          <CategoryLabel category={lead.category} className="text-red" />

          <h1
            id="lead-story"
            className="headline mt-4 text-[length:var(--text-hero)]"
          >
            <Link href={`/article/${lead.slug}`} className="link-wipe">
              {lead.title}
            </Link>
          </h1>

          <p className="prose-body mt-6 max-w-xl text-ink-soft">{lead.dek}</p>

          <Byline article={lead} variant="full" className="mt-7" />

          <Link
            href={`/article/${lead.slug}`}
            className="kicker mt-8 inline-flex items-center gap-3 border-b-2 border-ink pb-1.5 transition-colors duration-300 hover:border-red hover:text-red"
          >
            Read the story
            <span
              aria-hidden
              className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2"
            >
              →
            </span>
          </Link>
        </div>

        <Link
          href={`/article/${lead.slug}`}
          tabIndex={-1}
          aria-hidden
          className="order-1 block overflow-hidden bg-newsprint lg:order-2 lg:col-span-7"
        >
          <div className="relative aspect-4/3 w-full lg:aspect-16/10">
            <Image
              src={lead.image}
              alt={lead.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-[1100ms] ease-out-expo hover:scale-[1.03]"
            />
          </div>
        </Link>
      </div>

      <div className="mt-14 grid gap-x-10 gap-y-10 border-t-2 border-ink pt-8 md:grid-cols-3 md:divide-x md:divide-rule">
        {secondary.map((article, index) => (
          <Reveal key={article.slug} delay={index * 90}>
            <div className={index > 0 ? "md:pl-10" : ""}>
              <CategoryLabel category={article.category} />
              <h2 className="headline mt-2.5 text-[1.4rem] md:text-2xl">
                <Link href={`/article/${article.slug}`} className="link-wipe">
                  {article.title}
                </Link>
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                {article.dek}
              </p>
              <Byline article={article} className="mt-3.5" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
