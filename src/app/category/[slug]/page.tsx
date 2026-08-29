import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategorySection } from "@/components/home/CategorySection";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { RowCard } from "@/components/cards/RowCard";
import { Reveal } from "@/components/ui/Reveal";
import { categories, getByCategory, getCategory, type CategorySlug } from "@/data";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Not found" };
  return { title: category.title, description: category.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const articles = getByCategory(category.slug as CategorySlug);
  const [lead, ...rest] = articles;

  return (
    <>
      {/* ── Section masthead ── */}
      <header className="shell pt-10 pb-10 md:pt-16 md:pb-14">
        <div className="border-b-2 border-ink pb-8 md:pb-10">
          <span className="kicker text-red">{category.kicker}</span>
          <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">
            {category.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-2xl text-lg leading-relaxed text-ink-2">
              {category.description}
            </p>
            <p className="kicker text-muted tabular-nums">
              {String(articles.length).padStart(2, "0")} stories
            </p>
          </div>
        </div>
      </header>

      {/* ── The desk, in its own house style ── */}
      {lead && (
        <div className="shell">
          <div className="grid gap-x-14 gap-y-10 pb-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <FeatureCard article={lead} size="lg" priority />
            </Reveal>
            <div className="lg:col-span-5">
              {rest.slice(0, 4).map((article, i) => (
                <Reveal key={article.slug} delay={i * 55}>
                  <RowCard article={article} index={i + 2} showDek={false} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}

      {rest.length > 4 && (
        <div className="shell pb-16 md:pb-24">
          <div className="border-t-2 border-ink pt-6">
            <h2 className="kicker-lg">The rest of the desk</h2>
            <div className="mt-5 grid gap-x-10 md:grid-cols-2 lg:gap-x-14">
              {rest.slice(4).map((article, i) => (
                <Reveal key={article.slug} delay={Math.min(i * 45, 180)}>
                  <RowCard article={article} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* A neighbouring desk, presented in its own layout. */}
      <NeighbourSection current={category.slug} />
    </>
  );
}

/** Shows the next section along, so a category page always leads somewhere. */
function NeighbourSection({ current }: { current: string }) {
  const index = categories.findIndex((category) => category.slug === current);
  const neighbour = categories[(index + 1) % categories.length];
  if (!neighbour || neighbour.slug === current) return null;

  return (
    <CategorySection
      category={neighbour}
      articles={getByCategory(neighbour.slug, 8)}
    />
  );
}
