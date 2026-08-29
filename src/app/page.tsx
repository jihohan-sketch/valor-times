import { ArticleOfWeek } from "@/components/home/ArticleOfWeek";
import { CategorySection } from "@/components/home/CategorySection";
import { Hero } from "@/components/home/Hero";
import { IssueRibbon } from "@/components/home/IssueRibbon";
import { IssuesShelf } from "@/components/home/IssuesShelf";
import { LatestStories } from "@/components/home/LatestStories";
import { Trending } from "@/components/home/Trending";
import { WriteForUs } from "@/components/home/WriteForUs";
import {
  categories,
  getAllArticles,
  getArticleOfTheWeek,
  getByCategory,
  getHeroRotation,
  getLatest,
  getTrending,
  issues,
} from "@/data";

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
  const cover = getHeroRotation(4);
  const pick = getArticleOfTheWeek();
  // The week's pick is already printed in full above; keep it out of Latest.
  const latest = getLatest(9, [
    ...cover.map((article) => article.slug),
    ...(pick ? [pick.slug] : []),
  ]);
  const [lead, ...remainder] = latest;
  const rows = remainder.slice(0, 4);
  const briefs = remainder.slice(4, 8);
  const trending = getTrending(8);

  // How many stories each issue contributed, for the shelf.
  const catalog = getAllArticles();
  const storyCounts = Object.fromEntries(
    issues.map((issue) => [
      issue.slug,
      catalog.filter((article) => article.issueSlug === issue.slug).length,
    ]),
  );

  return (
    <>
      <Hero articles={cover} />

      <IssueRibbon issues={issues} />

      {pick && <ArticleOfWeek article={pick} />}

      <LatestStories lead={lead} rows={rows} briefs={briefs} />

      <IssuesShelf issues={issues} storyCounts={storyCounts} />

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
