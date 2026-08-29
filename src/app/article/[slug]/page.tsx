import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/article/ArticleBody";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { RelatedStories } from "@/components/article/RelatedStories";
import { ShareButtons } from "@/components/article/ShareButtons";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { Reveal } from "@/components/ui/Reveal";
import {
  allArticles,
  getArticle,
  getAuthor,
  getRelated,
} from "@/data";
import { formatDate, readingTime } from "@/lib/format";
import { site } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Story not found" };

  const author = getAuthor(article.authorSlug);

  return {
    title: article.title,
    description: article.dek,
    authors: author ? [{ name: author.name }] : undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      publishedTime: article.date,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const author = getAuthor(article.authorSlug);
  const related = getRelated(article, 3);
  const path = `/article/${article.slug}`;

  return (
    <>
      <ReadingProgress />

      <article>
        <header className="shell pt-10 md:pt-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <CategoryLabel category={article.category} className="text-red" />
              <h1 className="headline mt-4 text-[length:var(--text-hero)]">
                {article.title}
              </h1>
              <p className="prose-body mt-6 max-w-3xl text-ink-soft">
                {article.dek}
              </p>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-between gap-6 border-y border-rule py-5">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="kicker text-ink">
                By {author?.name ?? "Staff"}
              </span>
              {author && (
                <span className="text-sm text-muted">{author.role}</span>
              )}
              <span aria-hidden className="text-rule-strong">
                |
              </span>
              <span className="text-sm text-muted">
                {formatDate(article.date)} · {readingTime(article.content)} min
                read
              </span>
            </div>
            <ShareButtons
              title={article.title}
              path={path}
              orientation="horizontal"
            />
          </div>
        </header>

        <figure className="shell mt-10">
          <div className="relative aspect-16/9 w-full overflow-hidden bg-newsprint">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-xs text-muted">
            {article.imageAlt} · Artwork for {site.name}
          </figcaption>
        </figure>

        <div className="shell mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-28">
              <ShareButtons title={article.title} path={path} />
            </div>
          </aside>

          <div className="lg:col-span-8">
            <ArticleBody content={article.content} />

            <div className="mt-14 flex flex-wrap gap-2.5">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="kicker border border-rule px-3.5 py-2 text-ink-soft transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {author && (
              <Reveal className="mt-14">
                <div className="relative grain overflow-hidden border border-rule bg-newsprint p-7 md:p-9">
                  <p className="kicker text-red">About the writer</p>
                  <p className="headline mt-3 text-2xl">{author.name}</p>
                  <p className="kicker mt-1.5 text-muted">{author.role}</p>
                  <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">
                    {author.bio}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </article>

      <RelatedStories articles={related} />
    </>
  );
}
