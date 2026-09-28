import { Hero } from "@/components/home/Hero";
import {
  ComicsGrid,
  GridLayout,
  HomeSection,
  LeadLayout,
} from "@/components/home/HomeSections";
import { IssuesShelf } from "@/components/home/IssuesShelf";
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
 * Which of the two layouts each desk gets: a lead with two text stories beside
 * it (A), or three equal cards (B). Comics & Bible keeps its pictures whole.
 */
const LAYOUT: Partial<Record<CategorySlug, "lead" | "grid" | "comics">> = {
  news: "lead",
  "social-issues": "lead",
  "health-science": "lead",
  culture: "grid",
  opinions: "grid",
  psychology: "grid",
  comics: "comics",
};

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
  const latest = getLatest(SECTION_LIMIT, [
    ...cover.map((article) => article.slug),
    ...(pick ? [pick.slug] : []),
  ]);

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
      <Hero articles={cover} />

      {pick && (
        <HomeSection
          id="article-of-the-week"
          title="Article of the Week"
          href={`/article/${pick.slug}`}
          linkLabel="Read the story"
        >
          <LeadLayout articles={[pick]} />
        </HomeSection>
      )}

      {latest.length > 0 && (
        <HomeSection id="latest" title="Latest Stories" href="/archive" linkLabel="Full archive">
          <GridLayout articles={latest} />
        </HomeSection>
      )}

      {sections.map(({ category, articles }) => {
        if (articles.length === 0) return null;
        const layout = LAYOUT[category.slug] ?? "grid";
        return (
          <HomeSection
            key={category.slug}
            id={`sec-${category.slug}`}
            title={category.title}
            href={`/category/${category.slug}`}
          >
            {layout === "lead" ? (
              <LeadLayout articles={articles} />
            ) : layout === "comics" ? (
              <ComicsGrid articles={articles} />
            ) : (
              <GridLayout articles={articles} />
            )}
          </HomeSection>
        );
      })}

      <IssuesShelf issues={issues} storyCounts={storyCounts} />

      <WriteForUs />
    </>
  );
}
