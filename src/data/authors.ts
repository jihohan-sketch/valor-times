import type { Author } from "./types";

export const authors: Author[] = [
  {
    slug: "amara-oyelaran",
    name: "Amara Oyelaran",
    role: "Editor-in-Chief",
    bio: "Runs the Tuesday budget meeting and writes about school governance. Fourth year on the masthead.",
  },
  {
    slug: "daniel-suh",
    name: "Daniel Suh",
    role: "News Editor",
    bio: "Covers the board, the budget and anything involving a spreadsheet. Reads meeting minutes for fun.",
  },
  {
    slug: "priya-raghunathan",
    name: "Priya Raghunathan",
    role: "Culture Editor",
    bio: "Reviews the winter production, argues about setlists, and keeps a running list of hallway trends.",
  },
  {
    slug: "marcus-linde",
    name: "Marcus Linde",
    role: "Opinions Editor",
    bio: "Believes an argument is only worth printing if someone might disagree with it out loud.",
  },
  {
    slug: "hana-brennan",
    name: "Hana Brennan",
    role: "Science Correspondent",
    bio: "Translates papers into paragraphs. Spends most lab periods asking whether the sample size was big enough.",
  },
  {
    slug: "theo-alvarez",
    name: "Theo Alvarez",
    role: "Food Columnist",
    bio: "Has eaten every item on the cafeteria menu at least twice, which he describes as journalism.",
  },
  {
    slug: "june-okafor",
    name: "June Okafor",
    role: "Staff Illustrator",
    bio: "Draws the back page. Works in ink, complains about deadlines, never misses one.",
  },
  {
    slug: "sofia-marchetti",
    name: "Sofia Marchetti",
    role: "Staff Writer",
    bio: "Reports on clubs, elections and the parts of school life that happen after the last bell.",
  },
  {
    slug: "elias-nakamura",
    name: "Elias Nakamura",
    role: "Photo Editor",
    bio: "Rebuilt the darkroom. Will tell you your photo is underexposed, kindly.",
  },
];

export const authorBySlug = Object.fromEntries(
  authors.map((author) => [author.slug, author]),
) as Record<string, Author>;
