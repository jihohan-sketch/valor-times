import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleFooterNav } from "@/components/article/ArticleFooterNav";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { RelatedStories } from "@/components/article/RelatedStories";
import { ShareButtons } from "@/components/article/ShareButtons";
import { Reveal } from "@/components/ui/Reveal";
import {
  allArticles,
  authorBySlug,
  categoryBySlug,
  getArticle,
  getByCategory,
  getRelated,
  getSiblings,
} from "@/data";
import { formatDate, readingTime } from "@/lib/format";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return allArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Not found" };

  return {
    title: article.title,
    description: article.dek,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      url: `${site.url}/article/${article.slug}`,
      publishedTime: article.date,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const author = authorBySlug[article.authorSlug];
  const category = categoryBySlug[article.category];
  const related = getRelated(article, 6);
  const more = getByCategory(article.category, 7).filter(
    (entry) => entry.slug !== article.slug,
  );
  const { previous, next } = getSiblings(article);

  return (
    <article>
      <ReadingProgress />

      {/* ── Masthead block ── */}
      <header className="shell pt-10 md:pt-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/category/${category.slug}`}
            className="kicker inline-flex items-center gap-3 text-red transition-opacity hover:opacity-60"
          >
            <span className="h-px w-8 bg-red" aria-hidden="true" />
            {category.title}
          </Link>

          <h1 className="display-tight mt-6 text-[clamp(2.25rem,5.4vw,4.25rem)] text-balance">
            {article.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-ink-2 md:text-xl">
            {article.dek}
          </p>

          <div className="mt-9 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-rule pt-5">
            <div>
              <p className="text-sm font-semibold">{author?.name}</p>
              <p className="meta mt-0.5">{author?.role}</p>
            </div>
            <p className="meta tabular-nums">{formatDate(article.date)}</p>
            <p className="meta tabular-nums">{readingTime(article.content)} min read</p>
          </div>
        </div>
      </header>

      {/* ── Plate ── */}
      {article.image && (
        <figure className="shell mt-10 md:mt-14">
          <div className="relative aspect-[16/9] overflow-hidden bg-shell-deep md:aspect-[21/9]">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="meta mt-3 max-w-3xl">{article.imageAlt}</figcaption>
        </figure>
      )}

      {/* ── Body ── */}
      <div className="shell mt-12 md:mt-16">
        <div className="mx-auto max-w-3xl">
          <ArticleBody content={article.content} />

          {article.tags.length > 0 && (
            <div className="mt-14 border-t border-rule pt-6">
              <p className="kicker text-muted">Filed under</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="inline-block border border-rule-2 px-3.5 py-1.5 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 border-t border-rule pt-6">
            <ShareButtons title={article.title} path={`/article/${article.slug}`} />
          </div>

          {author && (
            <aside className="mt-12 border-t-2 border-ink pt-6">
              <p className="kicker text-red">The reporter</p>
              <p className="display mt-3 text-2xl">{author.name}</p>
              <p className="meta mt-1">{author.role}</p>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ink-2">
                {author.bio}
              </p>
            </aside>
          )}

          <Reveal className="mt-14">
            <ArticleFooterNav previous={previous} next={next} />
          </Reveal>
        </div>
      </div>

      <RelatedStories related={related} category={category} more={more} />
    </article>
  );
}
