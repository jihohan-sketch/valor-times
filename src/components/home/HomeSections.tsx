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
 *   A: a lead story with its picture, and up to three text stories beside it.
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
export function hasPhoto(article: Article): boolean {
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

/**
 * What a card shows where a story has no photograph of its own (a text-only
 * story, or one whose artwork is a scan of the page): a paper-toned panel with
 * the paper's monogram, the same shape as a photo, so every card in a row
 * keeps the same layout.
 */
export function PhotoPlaceholder({ ratio }: { ratio: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden bg-shell ${ratio}`}
    >
      <Image src="/mark/vt.png" alt="" width={40} height={40} className="opacity-15" />
    </div>
  );
}

/** The story's photo, or the placeholder when it has none. */
export function PhotoOrPlaceholder({
  article,
  ratio,
  sizes,
}: {
  article: Article;
  ratio: string;
  sizes: string;
}) {
  return hasPhoto(article) ? (
    <Photo article={article} ratio={ratio} sizes={sizes} />
  ) : (
    <PhotoPlaceholder ratio={ratio} />
  );
}

/** The first paragraph of a story's body, as plain text, for a teaser. */
export function excerpt(article: Article): string {
  const first = article.content.split(/\n\s*\n/).find((block) => block.trim()) ?? "";
  return first.replace(/[#*_>`]/g, "").replace(/\s+/g, " ").trim();
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

/** Layout A: the lead with its picture on the left, up to three text stories on the right. */
export function LeadLayout({ articles }: { articles: Article[] }) {
  /* The lead is the story that can carry a picture. When the newest one is a
     scan of the page, the next story with a photograph leads instead and the
     scan runs as text on the right. */
  const lead = articles.find(hasPhoto) ?? articles[0];
  if (!lead) return null;
  const side = articles.filter((article) => article !== lead).slice(0, 3);
  /* Two stories in text alone end well short of the lead's picture, so the
     first one carries a picture of its own; three fill the column already. */
  const pictured = side.length < 3 ? side[0] : undefined;

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
            /* Wider beside a side column, so the picture does not run on far
               past the stories next to it. */
            <Photo
              article={lead}
              ratio={side.length > 0 ? "aspect-[3/2] lg:aspect-[2/1]" : "aspect-[3/2]"}
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
                {article === pictured && (
                  <div className="mb-4 hidden lg:block">
                    <PhotoOrPlaceholder article={article} ratio="aspect-[3/2]" sizes="33vw" />
                  </div>
                )}
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

/** Layout B: three equal cards, a picture (or its placeholder) on top of each. */
export function GridLayout({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
      {articles.map((article) => (
        <article key={article.slug} className="group">
          <Link href={`/article/${article.slug}`} className="block">
            <div className="mb-5">
              <PhotoOrPlaceholder
                article={article}
                ratio="aspect-[3/2]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
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
 * Comics & Bible: three to a row, the drawing filling the card from the top
 * like the photos on every other card, with no mount around it.
 */
export function ComicsGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
      {articles.map((article) => (
        <article key={article.slug} className="group">
          <Link href={`/article/${article.slug}`} className="block">
            {/* 4:3 because most strips are landscape: those show nearly whole,
                and a portrait page loses its foot rather than its sides. Held
                to the top-left corner, because a strip reads from there: a
                wide one gives up its right edge, not its opening caption. */}
            {article.image && (
              <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-shell">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-left-top"
                />
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

/**
 * The Article of the Week: the picture on one side, and on the other the
 * headline, byline and the story's opening lines with a way in, centred
 * against the picture so neither column ends in empty paper.
 */
export function PickLayout({ article }: { article: Article }) {
  const href = `/article/${article.slug}`;

  return (
    <article className="group grid gap-8 md:grid-cols-2 md:items-center md:gap-10">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <PhotoOrPlaceholder
          article={article}
          ratio="aspect-[3/2]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </Link>
      <div>
        <h3 className="display text-[length:var(--text-title)] text-balance">
          <Link href={href} className="link-draw">
            {article.title}
          </Link>
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg">
          {article.dek}
        </p>
        <div className="mt-5">
          <Byline article={article} size="md" />
        </div>
        <p className="mt-6 line-clamp-3 border-t border-rule pt-5 text-[0.95rem] leading-relaxed text-ink-2">
          {excerpt(article)}
        </p>
        <ArrowLink href={href} size="sm" className="mt-6">
          Read the story
        </ArrowLink>
      </div>
    </article>
  );
}
