import { authorBySlug } from "./authors";
import type { MastheadGroup } from "./types";

/**
 * The masthead as the desk stands now.
 *
 * It follows the staff page printed at the back of Vol4. No12 (page 6), the
 * newest issue in the Drive folder. Order, wording and grouping are the
 * page's, not the site's: EDITOR IN CHIEF / MANAGING EDITOR / HEAD OF DESIGN
 * across the top, then JOURNALISTS, DESIGN/LAYOUT, and WEBSITE & SOCIAL MEDIA.
 * Names inside each block run in the order printed.
 *
 * Two departures from the page, both deliberate:
 * - Haakyoon Lee leads the Journalists block, and is spelled that way, by the
 *   desk's request. The page prints HAKYOON LEE in alphabetical order.
 * - The A/B desk sections are not printed on the page. They are carried over
 *   for people who already had one; newer names have none until the desk says.
 *
 * Some people sit in two blocks because the page prints them twice (Yujin Lee
 * as Managing Editor and Journalist, Caiden Kim as Journalist and on
 * Design/Layout). `mastheadCount` counts each person once.
 *
 * A title nobody holds is still carried here rather than deleted, and /about
 * skips any title with no name against it.
 *
 * `slug` links a name to its entry in `authors` so the site can reach the
 * stories that person filed. Anyone in `authors` but absent here wrote for an
 * earlier issue and is not on the current masthead.
 */
export const mastheadIssueSlug = "vol4-no12";

/** The page of that issue the staff list is printed on. */
export const mastheadPage = 6;

export const masthead: MastheadGroup[] = [
  {
    role: "Editor in Chief",
    members: [{ name: "Victoria Oh", slug: "victoria-oh" }],
  },
  {
    role: "Managing Editor",
    members: [{ name: "Yujin Lee", slug: "yujin-lee", section: "A" }],
  },
  {
    role: "Head of Design",
    members: [{ name: "Seohyun Choi", slug: "seohyun-choi", section: "B" }],
  },
  {
    role: "Journalists",
    // Haakyoon Lee leads the block by the desk's request; the rest follow the page.
    members: [
      { name: "Haakyoon Lee", slug: "hakyoon-lee", section: "A" },
      { name: "Anthony Kong", slug: "anthony-kong", section: "A" },
      { name: "Caiden Kim", slug: "caiden-kim", section: "B" },
      { name: "Dongyun Hwang", slug: "dongyun-hwang", section: "A" },
      { name: "Hailey Hong", slug: "hailey-hong" },
      { name: "Hannah Cho", slug: "hannah-cho", section: "B" },
      { name: "Hayeon Son", slug: "hayeon-son", section: "A" },
      { name: "Hyunji Song", slug: "hyunji-song", section: "B" },
      { name: "Jalen Park", slug: "jalen-park", section: "B" },
      { name: "Juwon Kim", slug: "juwon-kim", section: "A" },
      { name: "Lynn Cho", slug: "lynn-cho" },
      { name: "Seoyun Lee", slug: "seoyun-lee", section: "A" },
      { name: "Seoyeon Jeon", slug: "seoyeon-jeon", section: "A" },
      { name: "Sungyoon Park", slug: "sungyoon-park", section: "B" },
      { name: "Yujin Lee", slug: "yujin-lee", section: "A" },
      { name: "Yebynn Son", slug: "yebynn-son", section: "B" },
    ],
  },
  {
    role: "Design / Layout",
    members: [
      { name: "Caiden Kim", slug: "caiden-kim" },
      { name: "Healynn Cho", slug: "healynn-cho" },
      { name: "Jaehoo Lee", slug: "jaehoo-lee" },
      { name: "Jeongwon Lee", slug: "jeongwon-lee" },
      { name: "Yeonji Cha", slug: "yeonji-cha" },
    ],
  },
  {
    role: "Website & Social Media",
    members: [
      { name: "Sean Jiho Han", slug: "jiho-han" },
      { name: "Yeonwoo Jang", slug: "yeonwoo-jang" },
    ],
  },
];

/** Everyone printed on the masthead, counted once. */
export const mastheadCount = new Set(
  masthead.flatMap((group) => group.members.map((member) => member.slug)),
).size;

/** The bio from `authors`, when the site has one for that person. */
export function mastheadBio(slug: string): string | undefined {
  return authorBySlug[slug]?.bio;
}
