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
    kicker: "On the record",
    description:
      "AP season, prom, missions, residential life — the week as it actually happened at VIS.",
    layout: "split",
    primaryNav: true,
  },
  {
    slug: "social-issues",
    name: "Social Issues",
    title: "Social Issues",
    kicker: "The wider room",
    description:
      "AI in class, teen burnout, plastic, gamification — the arguments that sit under the news.",
    layout: "list",
  },
  {
    slug: "culture",
    name: "Culture",
    title: "Culture & Lifestyle",
    kicker: "After the bell",
    description:
      "Jeong, nunchi, albums, films, F1, gift guides — after the bell and on the bus home.",
    layout: "rail",
    primaryNav: true,
  },
  {
    slug: "opinions",
    name: "Opinions",
    title: "Recommendations & Opinions",
    kicker: "Signed & arguable",
    description:
      "Signed arguments from the staff. Matcha, straws, study modes, interviews with teachers who are leaving or staying.",
    layout: "quotes",
    primaryNav: true,
  },
  {
    slug: "cuisine",
    name: "Cuisine",
    title: "Cuisine",
    kicker: "Lunch period",
    description:
      "Malatang rankings, Anseong delivery, and the donut worth the airport detour.",
    layout: "pinned",
  },
  {
    slug: "health-science",
    name: "Science",
    title: "Public Health & Science",
    kicker: "Show your work",
    description:
      "CRISPR, nitroplasts, bones, sleep, 순공시간 — science that shows up in a Valor week.",
    layout: "feature",
    primaryNav: true,
  },
  {
    slug: "psychology",
    name: "Psychology",
    title: "Psychology",
    kicker: "Inside your head",
    description:
      "First impressions, conformity, procrastination, the peak-end rule at the close of a year.",
    layout: "index",
  },
  {
    slug: "comics",
    name: "Comics & Bible",
    title: "Comics & Bible",
    kicker: "The back page",
    description:
      "The back page: comics, satire, sheep, and the Bible section that closes the issue.",
    layout: "gallery",
  },
];

export const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<Category["slug"], Category>;

/** Nav row one. Everything else lives behind the More menu. */
export const primaryCategories = categories.filter((c) => c.primaryNav);
export const secondaryCategories = categories.filter((c) => !c.primaryNav);
