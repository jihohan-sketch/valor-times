import type { Issue } from "./types";

/**
 * The seven issues in the newsroom Drive folder, newest first.
 *
 * Every field here is read off the PDF, not written for the site. `title` is
 * the masthead line as printed; `cover` is page one rendered whole; `pages`
 * are built from `pageCount` and live under /issues/<slug>/page-NN.jpg.
 *
 * On dates: the paper never prints one. `dateLabel` is the month the issue's
 * own contents pin it to — a Pepero Day sale running "until 11/11", a
 * Christmas event dated the 16th, an AP season described as over — and `date`
 * is the first of that month, used only for sorting. Nothing here claims a
 * publication day the paper did not give.
 *
 * On numbering: the file names in Drive run Vol4 No1–No5, but the mastheads
 * printed on the pages run No1, No3, No4, No5, No7. The masthead is what
 * readers held, so it wins; `sourceFile` and `numberingNote` record the
 * disagreement.
 */
export const issues: Issue[] = [
  {
    slug: "vol4-no7",
    title: "Vol4. No7.",
    volume: 4,
    number: 7,
    date: "2026-06-01",
    dateLabel: "June 2026",
    lead: "Finals & End of School Year",
    cover: "/issues/vol4-no7/cover.jpg",
    coverPhoto: "/issues/vol4-no7/cover-photo.jpg",
    coverAlt:
      "Two members of the Valor community pulling faces for the camera, drawn over in pink and yellow marker",
    pageCount: 7,
    driveUrl: "https://drive.google.com/file/d/1ZrweF0kOvtI4-iZPMhxnvP07AROGoXvG/view",
    sourceFile: "Valor Times Vol4. No5.pdf",
    numberingNote: "Filed in Drive as Vol4. No5; the masthead reads Vol4. No7.",
  },
  {
    slug: "vol4-no5",
    title: "Vol4. No5.",
    volume: 4,
    number: 5,
    date: "2026-05-01",
    dateLabel: "May 2026",
    lead: "Prom 2026",
    cover: "/issues/vol4-no5/cover.jpg",
    coverPhoto: "/issues/vol4-no5/cover-photo.jpg",
    coverAlt: "Gold foil balloons spelling PROM, with students posing beneath them",
    pageCount: 6,
    driveUrl: "https://drive.google.com/file/d/1L_Hh0glKPwy8q3DPO6QHgxKszPOnfiw8/view",
    sourceFile: "Valor Times Vol4. No4.pdf",
    numberingNote:
      "Filed in Drive as Vol4. No4 and saved from Canva as No6; the masthead reads Vol4. No5.",
  },
  {
    slug: "vol4-no4",
    title: "Vol4. No4.",
    volume: 4,
    number: 4,
    date: "2026-05-01",
    dateLabel: "May 2026",
    lead: "AP Exam Season is finally over!!",
    cover: "/issues/vol4-no4/cover.jpg",
    coverPhoto: "/issues/vol4-no4/cover-photo.jpg",
    coverAlt: "Two students making a heart shape over Mr. Chu, annotated in yellow marker",
    pageCount: 9,
    driveUrl: "https://drive.google.com/file/d/1ozjDDG4eGZHaZbh6XZnvOyNDmamudK9H/view",
    sourceFile: "Valor Times Vol4. No3.pdf",
    numberingNote: "Filed in Drive as Vol4. No3; the masthead reads Vol4. No4.",
  },
  {
    slug: "vol4-no3",
    title: "Vol4. No3.",
    volume: 4,
    number: 3,
    date: "2026-03-01",
    dateLabel: "March 2026",
    lead: "Missions Celebration Day",
    cover: "/issues/vol4-no3/cover.jpg",
    coverPhoto: "/issues/vol4-no3/cover-photo.jpg",
    coverAlt: "The Valor International School welcome centre and its terracotta rooftops",
    pageCount: 16,
    driveUrl: "https://drive.google.com/file/d/1vA40ZVWOPYnHBe7-6TS6zOj9mIvFkONC/view",
    sourceFile: "Valor Times Vol4. No2.pdf",
    numberingNote: "Filed in Drive as Vol4. No2; the masthead reads Vol4. No3.",
  },
  {
    slug: "vol4-no1",
    title: "Vol4. No1.",
    volume: 4,
    number: 1,
    date: "2026-02-01",
    dateLabel: "February 2026",
    lead: "Upcoming Residential Life / New Schedules",
    cover: "/issues/vol4-no1/cover.jpg",
    coverPhoto: "/issues/vol4-no1/cover-photo.jpg",
    coverAlt: "Two students spelling VALOR with their hands in front of a dorm window",
    pageCount: 11,
    driveUrl: "https://drive.google.com/file/d/1AtVjte8vWwLNdt4u3vqWTygXfpwPKTST/view",
    sourceFile: "Valor Times Vol4. No1.pdf",
  },
  {
    slug: "vol3-no21",
    title: "Vol3. No21.",
    volume: 3,
    number: 21,
    date: "2025-12-01",
    dateLabel: "December 2025",
    lead: "Upcoming School News",
    cover: "/issues/vol3-no21/cover.jpg",
    coverPhoto: "/issues/vol3-no21/cover-photo.jpg",
    coverAlt: "A student and a teacher pointing at the camera in a classroom",
    pageCount: 12,
    driveUrl: "https://drive.google.com/file/d/1WIhkmdoOvcR-ad11ITBRj3SWqKxXcc9c/view",
    sourceFile: "Valor Times Vol3. No21.pdf",
  },
  {
    slug: "vol3-no20",
    title: "Volume 3. No.20",
    volume: 3,
    number: 20,
    date: "2025-11-01",
    dateLabel: "November 2025",
    lead: "Upcoming Residential Life / New Schedules",
    cover: "/issues/vol3-no20/cover.jpg",
    coverPhoto: "/issues/vol3-no20/cover-photo.jpg",
    coverAlt: "A student and Mr. Knickerbocker throwing peace signs at the camera",
    pageCount: 10,
    driveUrl: "https://drive.google.com/file/d/1nvFnOw4z8doGad9Iq5U6qyzadKprr3P_/view",
    sourceFile: "Valor Times Vol 3. No.20.pdf",
  },
];

export const issueBySlug = Object.fromEntries(
  issues.map((issue) => [issue.slug, issue]),
) as Record<string, Issue>;

/** The real page images, in print order. */
export function issuePages(issue: Issue): { n: number; src: string }[] {
  return Array.from({ length: issue.pageCount }, (_, i) => ({
    n: i + 1,
    src: `/issues/${issue.slug}/page-${String(i + 1).padStart(2, "0")}.jpg`,
  }));
}
