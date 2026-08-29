import { CategorySection } from "@/components/home/CategorySection";
import { Hero } from "@/components/home/Hero";
import { LatestStories } from "@/components/home/LatestStories";
import { Trending } from "@/components/home/Trending";
import { WriteForUs } from "@/components/home/WriteForUs";
import { categories, getByCategory, getHero, getLatest, getTrending } from "@/data";

/** How many stories each section draws, by presentation. */
const SECTION_SIZE: Record<string, number> = {
  split: 5,
  list: 5,
  rail: 8,
  quotes: 8,
  pinned: 6,
  feature: 5,
  index: 6,
  gallery: 9,
};

export default function HomePage() {
  const hero = getHero();
  const latest = getLatest(9, [hero.slug]);
  const [lead, ...remainder] = latest;
  const rows = remainder.slice(0, 4);
  const briefs = remainder.slice(4, 8);
  const trending = getTrending(8);

  return (
    <>
      <Hero article={hero} />

      <LatestStories lead={lead} rows={rows} briefs={briefs} />

      <Trending articles={trending} />

      {categories.map((category) => (
        <CategorySection
          key={category.slug}
          category={category}
          articles={getByCategory(category.slug, SECTION_SIZE[category.layout] ?? 5)}
        />
      ))}

      <WriteForUs />
    </>
  );
}
