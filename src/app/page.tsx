import { Hero } from "@/components/home/Hero";
import {
  ComicsGrid,
  GridLayout,
  HomeSection,
  LeadLayout,
  PickLayout,
} from "@/components/home/HomeSections";
import { IssuesShelf } from "@/components/home/IssuesShelf";
import { Overture } from "@/components/home/Overture";
import { WriteForUs } from "@/components/home/WriteForUs";
import {
  categories,
  getAllArticles,
  getArticleOfTheWeek,
  getHeroRotation,
  getLatest,
  issueBySlug,
  issueLabel,
  issues,
  type CategorySlug,
} from "@/data";

/** Most stories a section prints; the rest are a click away on its page. */
const SECTION_LIMIT = 3;

/** A lead-layout desk can run its lead and three stories beside it. */
const LEAD_LIMIT = 4;

/**
 * How far back a desk reaches before it counts as old news: two months before
 * the newest story on the site. A desk prints only stories from inside that
 * window, and reaches past it only to make up `SECTION_LIMIT` when the window
 * holds fewer than that.
 */
const RECENT_MONTHS = 2;

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
  const rotation = getHeroRotation();
  /* What the cover prints on first load: the lead and the three under it. The
     rest of the rotation is free to run further down the page as well. */
  const cover = rotation.slice(0, 4);
  const pick = getArticleOfTheWeek();

  // The catalogue is newest-first, so the first story carries the newest date.
  const cutoff = new Date(`${catalog[0]?.date ?? "1970-01-01"}T00:00:00Z`);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - RECENT_MONTHS);
  const recentFrom = cutoff.toISOString().slice(0, 10);

  /* No story prints twice. The cover and the week's pick go in first; then the
     desks take their own newest stories, so a desk is never left with last
     term's news because a cross-desk list above took its fresh ones; and
     Latest Stories takes whatever is newest of what is left. */
  const shown = new Set<string>([
    ...cover.map((article) => article.slug),
    ...(pick ? [pick.slug] : []),
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
      const run = catalog.filter(
        (article) => desks.has(article.category) && !shown.has(article.slug),
      );
      const limit = LAYOUT[category.slug] === "lead" ? LEAD_LIMIT : SECTION_LIMIT;
      const recent = run.filter((article) => article.date >= recentFrom);
      const articles =
        recent.length >= SECTION_LIMIT
          ? recent.slice(0, limit)
          : run.slice(0, SECTION_LIMIT);
      for (const article of articles) shown.add(article.slug);
      return { category, articles };
    });
  const latest = getLatest(SECTION_LIMIT, [...shown]);

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

      {/* The page under the intro; it rises as the opening dissolves. */}
      <div className="overture-stage">
        <Hero articles={rotation} />

        {pick && (
          <HomeSection
            id="article-of-the-week"
            title="Article of the Week"
            href={`/article/${pick.slug}`}
            linkLabel="Read the story"
          >
            {issueBySlug[pick.issueSlug] && (
              <p className="meta -mt-3 mb-6 tabular-nums md:-mt-4">
                From {issueLabel(issueBySlug[pick.issueSlug])} &middot;{" "}
                {issueBySlug[pick.issueSlug].dateLabel}
              </p>
            )}
            <PickLayout article={pick} />
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
      </div>
    </>
  );
}
