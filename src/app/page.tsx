import { ArticleOfWeek } from "@/components/home/ArticleOfWeek";
import { CategorySection } from "@/components/home/CategorySection";
import { Hero } from "@/components/home/Hero";
import { IssueRibbon } from "@/components/home/IssueRibbon";
import { IssuesShelf } from "@/components/home/IssuesShelf";
import { LatestStories } from "@/components/home/LatestStories";
import { Overture } from "@/components/home/Overture";
import { WriteForUs } from "@/components/home/WriteForUs";
import {
  categories,
  getAllArticles,
  getArticleOfTheWeek,
  getHeroRotation,
  getLatest,
  issues,
  type CategorySlug,
} from "@/data";

/** Most stories any one section prints; the rest are a click away on its page. */
const SECTION_LIMIT = 3;

/**
 * Desks folded into another desk's block on the front page. Cuisine keeps its
 * own page and footer link; here it runs inside Culture & Lifestyle.
 */
const MERGED_INTO: Partial<Record<CategorySlug, CategorySlug>> = {
  cuisine: "culture",
};

export default function HomePage() {
  const catalog = getAllArticles();
  const cover = getHeroRotation(4);
  const pick = getArticleOfTheWeek();
  // The week's pick is already printed in full above; keep it out of Latest.
  const latest = getLatest(5, [
    ...cover.map((article) => article.slug),
    ...(pick ? [pick.slug] : []),
  ]);
  const [lead, ...rows] = latest;

  /* No story prints twice. Everything above the desks goes in first, in page
     order, and each desk then takes the next unshown stories from its own run —
     fewer than three if it runs out, never a repeat. */
  const shown = new Set<string>([
    ...cover.map((article) => article.slug),
    ...(pick ? [pick.slug] : []),
    ...latest.map((article) => article.slug),
  ]);
  const sections = categories
    .filter((category) => !MERGED_INTO[category.slug])
    .map((category) => {
      const desks = new Set<CategorySlug>([
        category.slug,
        ...categories
          .filter((other) => MERGED_INTO[other.slug] === category.slug)
          .map((other) => other.slug),
      ]);
      // The catalogue is newest-first already, so merged desks interleave by date.
      const articles = catalog
        .filter((article) => desks.has(article.category) && !shown.has(article.slug))
        .slice(0, SECTION_LIMIT);
      for (const article of articles) shown.add(article.slug);
      return { category, articles };
    });

  // How many stories each issue contributed, for the shelf.
  const storyCounts = Object.fromEntries(
    issues.map((issue) => [
      issue.slug,
      catalog.filter((article) => article.issueSlug === issue.slug).length,
    ]),
  );

  return (
    <>
      <Overture />

      {/*
        The page under the veil. It rises the last fraction of an inch as the
        opening dissolves, which is what makes the front page read as being
        uncovered rather than as arriving. Once the sequence is over — or for
        anyone who skipped it or has already seen it — the transform is dropped
        entirely and this is an ordinary wrapper.

        Order is the argument the page makes: one cover story, the week's pick,
        the run of new reporting, then the desks themselves, the printed run
        behind all of it, and the open call last.
      */}
      <div className="overture-stage">
        <Hero articles={cover} />

        <IssueRibbon issues={issues} />

        {pick && <ArticleOfWeek article={pick} />}

        <LatestStories lead={lead} rows={rows} />

        {sections.map(({ category, articles }) => (
          <CategorySection key={category.slug} category={category} articles={articles} />
        ))}

        <IssuesShelf issues={issues} storyCounts={storyCounts} />

        <WriteForUs />
      </div>
    </>
  );
}
