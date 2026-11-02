import type { Category } from "./types";

/**
 * Section order here is the order they appear on the homepage and in the
 * navigation. `layout` decides how each one is drawn — no two neighbouring
 * sections use the same presentation.
 */
export const categories: Category[] = [
  {
    slug: "news",
    name: "News",
    title: "School News",
    kicker: "On campus",
    description:
      "AP season, prom, missions, residential life, and everything else happening at Valor.",
    layout: "split",
    primaryNav: true,
  },
  {
    slug: "social-issues",
    name: "Social Issues",
    title: "Social Issues",
    kicker: "The bigger picture",
    description:
      "AI in class, teen burnout, plastic, gamification: the bigger questions behind the news.",
    layout: "list",
  },
  {
    slug: "culture",
    name: "Culture",
    title: "Culture & Lifestyle",
    kicker: "After class",
    description:
      "Jeong, nunchi, albums, films, F1, and gift guides. Life outside the classroom.",
    layout: "rail",
    primaryNav: true,
  },
  {
    slug: "opinions",
    name: "Opinions",
    title: "Recommendations & Opinions",
    kicker: "Our take",
    description:
      "Signed opinions and recommendations on matcha, straws, and study habits, plus interviews with teachers who are leaving or staying.",
    layout: "quotes",
    primaryNav: true,
  },
  {
    slug: "cuisine",
    name: "Cuisine",
    title: "Cuisine",
    kicker: "Food",
    description:
      "Malatang rankings, delivery in Anseong, and a donut worth the airport detour.",
    layout: "pinned",
  },
  {
    slug: "health-science",
    name: "Science",
    title: "Public Health & Science",
    kicker: "Explained",
    description:
      "CRISPR, nitroplasts, bones, sleep, and 순공시간. The science that shows up in a week at Valor.",
    layout: "feature",
    primaryNav: true,
  },
  {
    slug: "psychology",
    name: "Psychology",
    title: "Psychology",
    kicker: "Mind & behavior",
    description:
      "Why we think and act the way we do: first impressions, conformity, procrastination, and the peak-end rule.",
    layout: "index",
  },
  {
    slug: "comics",
    name: "Comics & Bible",
    title: "Comics & Bible",
    kicker: "Back page",
    description:
      "Comics, satire, and the Bible section that closes each issue.",
    layout: "gallery",
  },
];

export const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<Category["slug"], Category>;

/** Nav row one. Everything else lives behind the More menu. */
export const primaryCategories = categories.filter((c) => c.primaryNav);
export const secondaryCategories = categories.filter((c) => !c.primaryNav);
