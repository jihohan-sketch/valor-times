import { CategoryRail } from "@/components/home/CategoryRail";
import { CuisineSection } from "@/components/home/CuisineSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { Hero } from "@/components/home/Hero";
import { LatestAndTrending } from "@/components/home/LatestAndTrending";
import { Newsletter } from "@/components/home/Newsletter";
import { OpinionsSection } from "@/components/home/OpinionsSection";
import { ScienceSection } from "@/components/home/ScienceSection";
import { Ticker } from "@/components/home/Ticker";
import {
  getByCategory,
  getFeatured,
  getHero,
  getLatest,
  getTrending,
} from "@/data";

export default function HomePage() {
  const lead = getHero();
  const secondary = getLatest(3, [lead.slug]);
  const abovefold = [lead.slug, ...secondary.map((a) => a.slug)];

  return (
    <>
      <Hero lead={lead} secondary={secondary} />
      <Ticker articles={getTrending(8)} />
      <LatestAndTrending
        latest={getLatest(9, abovefold)}
        trending={getTrending(6)}
      />

      <div className="mt-24 md:mt-28">
        <CategoryRail
          id="culture"
          title="Culture"
          description="Theatre, music, style, and the small rituals that make a campus feel like a place."
          category="culture"
          articles={getByCategory("culture", 5)}
        />
      </div>

      <OpinionsSection articles={getByCategory("opinions", 4)} />

      <ScienceSection articles={getByCategory("science-psychology", 4)} />

      <CuisineSection articles={getByCategory("cuisine", 4)} />

      <div className="mt-24 md:mt-28">
        <CategoryRail
          id="comics"
          title="Comics"
          description="The back page: weekly strips, one-panel jokes and illustrated reporting."
          category="comics"
          articles={getByCategory("comics", 4)}
          ratio="4/5"
        />
      </div>

      <FeaturedSection articles={getFeatured(3, [lead.slug])} />

      <Newsletter />
    </>
  );
}
