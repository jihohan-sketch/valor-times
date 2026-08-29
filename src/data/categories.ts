import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "news",
    name: "News",
    title: "News",
    description:
      "Reporting on the decisions, budgets and policies that shape the school day — and the people making them.",
    accent: "red",
  },
  {
    slug: "culture",
    name: "Culture",
    title: "Culture",
    description:
      "Theatre, music, style, and the small rituals that make a campus feel like a place rather than a building.",
    accent: "clay",
  },
  {
    slug: "opinions",
    name: "Opinions",
    title: "Opinions",
    description:
      "Arguments from the student body and the masthead. Signed, debatable, and open to a reply.",
    accent: "ink",
  },
  {
    slug: "science-psychology",
    name: "Science & Psychology",
    title: "Science & Psychology",
    description:
      "What the research says about attention, sleep, memory and the strange machinery of being seventeen.",
    accent: "indigo",
  },
  {
    slug: "cuisine",
    name: "Cuisine",
    title: "Cuisine",
    description:
      "Lunch lines, family recipes, bake-sale economics and the serious business of eating well between classes.",
    accent: "amber",
  },
  {
    slug: "comics",
    name: "Comics",
    title: "Comics",
    description:
      "Weekly strips, one-panel jokes and illustrated reporting from the back page.",
    accent: "moss",
  },
];

export const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<Category["slug"], Category>;
