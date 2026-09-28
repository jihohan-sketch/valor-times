import Image from "next/image";
import Link from "next/link";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Byline } from "@/components/ui/Byline";
import type { Article } from "@/data/types";

/**
 * The front page's building blocks. Every section is one of two layouts under
 * one title row, so the page reads as a newspaper's index rather than as a
 * showcase of different modules:
 *
 *   A: a lead story with its picture, and two text-only stories beside it.
 *   B: three equal cards in a row.
 *
 * Nothing here animates; hover states on links are the only motion.
 */

/**
 * True when a story's artwork is a scan of the printed paper rather than a
 * photograph. Those are unreadable as thumbnails, so the front page runs the
 * story as text instead; the issue pages are where the scans belong.
 */
export function isScan(article: Article): boolean {
  if (article.plate) return true;
  const alt = article.imageAlt.toLowerCase();
  return (
    alt.includes("page carrying") ||
    alt.includes("front page of") ||
    /^the .*\bpage\b/.test(alt)
  );
}

/** A picture worth putting on the front page: present, and not a page scan. */
function hasPhoto(article: Article): boolean {
  return Boolean(article.image) && !isScan(article);
}

/** One title row: a thin rule, the section's name, and the way into the rest. */
export function SectionTitle({
  id,
  title,
  href,
  linkLabel = "All stories",
}: {
  id: string;
  title: string;
  href: string;
  linkLabel?: string;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-t border-ink pt-4">
      <h2 id={id} className="display text-[length:var(--text-section-sm)]">
        {title}
      </h2>
      <ArrowLink href={href} size="sm" className="mb-1">
        {linkLabel}
      </ArrowLink>
    </header>
  );
}

/** Every section on the page sits in the same box with the same gap above it. */
export function HomeSection({
  id,
  title,
  href,
  linkLabel,
  children,
}: {
  id: string;
  title: string;
  href: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="shell pt-16 md:pt-24" aria-labelledby={id}>
      <SectionTitle id={id} title={title} href={href} linkLabel={linkLabel} />
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}

function Photo({ article, ratio, sizes }: { article: Article; ratio: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden bg-shell ${ratio}`}>
      <Image
        src={article.image}
        alt={article.imageAlt}
        fill
        sizes={sizes}
        className="object-cover object-center"
      />
    </div>
  );
}

/** Layout A: the lead with its picture on the left, two text stories on the right. */
export function LeadLayout({ articles }: { articles: Article[] }) {
  /* The lead is the story that can carry a picture. When the newest one is a
     scan of the page, the next story with a photograph leads instead and the
     scan runs as text on the right. */
  const lead = articles.find(hasPhoto) ?? articles[0];
  if (!lead) return null;
  const side = articles.filter((article) => article !== lead).slice(0, 2);

  return (
    <div className={`grid gap-10 ${side.length > 0 ? "lg:grid-cols-12 lg:gap-12" : ""}`}>
      <article className={`group ${side.length > 0 ? "lg:col-span-8" : ""}`}>
        <Link
          href={`/article/${lead.slug}`}
          className={`block ${
            side.length === 0 && hasPhoto(lead) ? "grid gap-8 md:grid-cols-2 md:gap-10" : ""
          }`}
        >
          {hasPhoto(lead) && (
            <Photo
              article={lead}
              ratio="aspect-[3/2]"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          )}
          <div className={hasPhoto(lead) && side.length > 0 ? "mt-6" : ""}>
            <h3 className="display text-[length:var(--text-title)] text-balance">
              <span className="link-draw">{lead.title}</span>
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg">
              {lead.dek}
            </p>
            <div className="mt-5">
              <Byline article={lead} size="md" />
            </div>
          </div>
        </Link>
      </article>

      {side.length > 0 && (
        <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-12">
          {side.map((article) => (
            <article
              key={article.slug}
              className="group border-t border-rule py-6 first:border-t-0 first:pt-0 max-lg:first:border-t max-lg:first:pt-6"
            >
              <Link href={`/article/${article.slug}`} className="block">
                <h3 className="headline text-[length:var(--text-title-sm)] text-balance">
                  <span className="link-draw">{article.title}</span>
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-2">{article.dek}</p>
                <div className="mt-3">
                  <Byline article={article} />
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/** Layout B: three equal cards, picture on top where there is one. */
export function GridLayout({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
      {articles.map((article) => (
        <article key={article.slug} className="group">
          <Link href={`/article/${article.slug}`} className="block">
            {hasPhoto(article) && (
              <div className="mb-5">
                <Photo
                  article={article}
                  ratio="aspect-[3/2]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <h3 className="headline text-[length:var(--text-title-sm)] text-balance">
              <span className="link-draw">{article.title}</span>
            </h3>
            <p className="mt-2.5 line-clamp-3 text-[0.95rem] leading-relaxed text-ink-2">
              {article.dek}
            </p>
            <div className="mt-3">
              <Byline article={article} />
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

/**
 * Comics & Bible: the drawing is the story, so each card shows it whole on a
 * paper mount rather than cropped, three to a row.
 */
export function ComicsGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
      {articles.map((article) => (
        <article key={article.slug} className="group">
          <Link href={`/article/${article.slug}`} className="block">
            {article.image && (
              <div className="relative mb-5 aspect-[3/4] bg-paper p-3 ring-1 ring-rule-2 transition-colors duration-200 group-hover:ring-ink">
                <div className="relative h-full w-full">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <h3 className="headline text-[length:var(--text-title-sm)] text-balance">
              <span className="link-draw">{article.title}</span>
            </h3>
            <div className="mt-3">
              <Byline article={article} />
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
