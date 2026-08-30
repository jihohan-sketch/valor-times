import { ArticleOfWeek } from "@/components/home/ArticleOfWeek";
import { CategorySection } from "@/components/home/CategorySection";
import { EditorsPicks } from "@/components/home/EditorsPicks";
import { Hero } from "@/components/home/Hero";
import { IssueRibbon } from "@/components/home/IssueRibbon";
import { IssuesShelf } from "@/components/home/IssuesShelf";
import { LatestStories } from "@/components/home/LatestStories";
import { Overture } from "@/components/home/Overture";
import { PictureDesk } from "@/components/home/PictureDesk";
import { WriteForUs } from "@/components/home/WriteForUs";
import {
  categories,
  getAllArticles,
  getArticleOfTheWeek,
  getByCategory,
  getEditorsPicks,
  getHeroRotation,
  getLatest,
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
  const picks = getEditorsPicks(8);

  /* The picture desk's board, built out of what the frames above could not
     take. Culture runs eight stories on its rail, so the board takes the next
     nine — the ones that would otherwise never get a frame at all — and stands
     them beside the back page's plates, which the board shows all at once and
     face on rather than sideways one at a time. See PictureDesk. */
  const railed = new Set(
    getByCategory("culture", SECTION_SIZE.rail).map((article) => article.slug),
  );
  const leftovers = getByCategory("culture")
    .filter((article) => !railed.has(article.slug))
    .slice(0, 9);
  const plates = getByCategory("comics", SECTION_SIZE.gallery);

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
      <Overture />

      {/*
        The page under the veil. It rises the last fraction of an inch as the
        opening dissolves, which is what makes the front page read as being
        uncovered rather than as arriving. Once the sequence is over — or for
        anyone who skipped it or has already seen it — the transform is dropped
        entirely and this is an ordinary wrapper.

        Order is the argument the page makes: one cover story, the week's pick,
        the run of new reporting, the desk's own ranking, then the desks
        themselves, the picture desk's board of everything they had to crop,
        the printed run behind all of it, and the open call last.
      */}
      <div className="overture-stage">
        <Hero articles={cover} />

        <IssueRibbon issues={issues} />

        {pick && <ArticleOfWeek article={pick} />}

        <LatestStories lead={lead} rows={rows} briefs={briefs} />

        <EditorsPicks articles={picks} />

        {categories.map((category) => (
          <CategorySection
            key={category.slug}
            category={category}
            articles={getByCategory(category.slug, SECTION_SIZE[category.layout] ?? 5)}
          />
        ))}

        <PictureDesk culture={leftovers} backPage={plates} />

        <IssuesShelf issues={issues} storyCounts={storyCounts} />

        <WriteForUs />
      </div>
    </>
  );
}
