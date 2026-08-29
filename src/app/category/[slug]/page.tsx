import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Byline } from "@/components/ui/Byline";
import { Reveal } from "@/components/ui/Reveal";
import { StoryCard } from "@/components/ui/StoryCard";
import { StoryRow } from "@/components/ui/StoryRow";
import { categories, getByCategory, getCategory } from "@/data";
import type { CategorySlug } from "@/data/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Section not found" };

  return {
    title: category.title,
    description: category.description,
    openGraph: { title: category.title, description: category.description },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const articles = getByCategory(category.slug as CategorySlug);
  const [lead, ...rest] = articles;
  const grid = rest.slice(0, 6);
  const list = rest.slice(6);

  return (
    <>
      <header className="shell pt-12 md:pt-20">
        <div className="grid gap-8 border-b-2 border-ink pb-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="kicker text-red">Section</p>
            <h1 className="headline mt-4 text-[length:var(--text-mega)]">
              {category.title}
            </h1>
          </div>
          <div className="md:col-span-4">
            <p className="prose-body text-ink-soft">{category.description}</p>
            <p className="kicker mt-5 text-muted">
              {articles.length} {articles.length === 1 ? "story" : "stories"}
            </p>
          </div>
        </div>
      </header>

      {lead && (
        <section className="shell mt-12" aria-label="Lead story">
          <article className="group grid items-center gap-10 md:grid-cols-12 md:gap-14">
            <Link
              href={`/article/${lead.slug}`}
              tabIndex={-1}
              aria-hidden
              className="block overflow-hidden bg-newsprint md:col-span-7"
            >
              <div className="relative aspect-16/10 w-full">
                <Image
                  src={lead.image}
                  alt={lead.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-cover transition-transform duration-[1000ms] ease-out-expo group-hover:scale-[1.04]"
                />
              </div>
            </Link>
            <div className="md:col-span-5">
              <p className="kicker text-red">The latest</p>
              <h2 className="headline mt-3 text-[clamp(1.9rem,4vw,3rem)]">
                <Link href={`/article/${lead.slug}`} className="link-wipe">
                  {lead.title}
                </Link>
              </h2>
              <p className="prose-body mt-5 text-ink-soft">{lead.dek}</p>
              <Byline article={lead} variant="full" className="mt-6" />
            </div>
          </article>
        </section>
      )}

      {grid.length > 0 && (
        <section className="shell mt-20" aria-label="More stories">
          <div className="grid gap-10 border-t-2 border-ink pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((article, index) => (
              <Reveal key={article.slug} delay={(index % 3) * 90}>
                <StoryCard article={article} showDek />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {list.length > 0 && (
        <section className="shell mt-16" aria-label="Archive">
          <div className="divide-y divide-rule border-t border-rule">
            {list.map((article) => (
              <StoryRow key={article.slug} article={article} showDek />
            ))}
          </div>
        </section>
      )}

      <nav className="shell mt-24" aria-label="Other sections">
        <p className="kicker border-t-2 border-ink pt-4 text-muted">
          Other sections
        </p>
        <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
          {categories
            .filter((entry) => entry.slug !== category.slug)
            .map((entry) => (
              <Link
                key={entry.slug}
                href={`/category/${entry.slug}`}
                className="headline link-wipe text-2xl transition-colors duration-300 hover:text-red md:text-3xl"
              >
                {entry.name}
              </Link>
            ))}
        </div>
      </nav>
    </>
  );
}
