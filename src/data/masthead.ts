import { authorBySlug } from "./authors";
import type { MastheadGroup } from "./types";

/**
 * The masthead exactly as printed on the last page of Vol4. No7 — the newest
 * issue in the Drive folder (filed there as "Valor Times Vol4. No5.pdf").
 *
 * Order, wording and grouping are the page's, not the site's: the page prints
 * MANAGING EDITOR / EDITOR IN CHIEF / HEAD OF LAYOUT across the top, then
 * JOURNALISTS and DESIGN/LAYOUT flanking the VT monogram, then SOCIAL MEDIA
 * & WEB EDITORS and PRODUCTION along the bottom. Names inside each block run
 * alphabetically, as they do in print. Nobody is added, dropped or retitled.
 *
 * `slug` links a name to its entry in `authors` so the site can reach the
 * stories that person filed. Anyone in `authors` but absent here wrote for an
 * earlier issue and is not on the current masthead.
 */
export const mastheadIssueSlug = "vol4-no7";

export const masthead: MastheadGroup[] = [
  {
    role: "Editor in Chief",
    members: [{ name: "Victoria Oh", slug: "victoria-oh" }],
  },
  {
    role: "Managing Editor",
    members: [{ name: "Seoyeon Jeon", slug: "seoyeon-jeon" }],
  },
  {
    role: "Head of Layout",
    members: [{ name: "Yena Seo", slug: "yena-seo" }],
  },
  {
    role: "Journalists",
    members: [
      { name: "Caiden Kim", slug: "caiden-kim" },
      { name: "Dongyun Hwang", slug: "dongyun-hwang" },
      { name: "Hakyoon Lee", slug: "hakyoon-lee" },
      { name: "Hanna Seo", slug: "hanna-seo" },
      { name: "Hannah Cho", slug: "hannah-cho" },
      { name: "Hayeon Son", slug: "hayeon-son" },
      { name: "Hyunji Song", slug: "hyunji-song" },
      { name: "Jalen Park", slug: "jalen-park" },
      { name: "Juwon Kim", slug: "juwon-kim" },
      { name: "Seoyun Lee", slug: "seoyun-lee" },
      { name: "Sungyoon Park", slug: "sungyoon-park" },
      { name: "Yujin Lee", slug: "yujin-lee" },
      { name: "Yebynn Son", slug: "yebynn-son" },
    ],
  },
  {
    role: "Design / Layout",
    members: [
      { name: "Healynn Cho", slug: "healynn-cho" },
      { name: "Jaehoo Lee", slug: "jaehoo-lee" },
      { name: "Jeongwon Lee", slug: "jeongwon-lee" },
      { name: "Kai Lee", slug: "kai-lee" },
      { name: "Soorin Choi", slug: "soorin-choi" },
      { name: "Yejin Cho", slug: "yejin-cho" },
      { name: "Yeonji Cha", slug: "yeonji-cha" },
    ],
  },
  {
    role: "Social Media & Web Editors",
    members: [
      { name: "Jiho Han", slug: "jiho-han" },
      { name: "Yeonwoo Jang", slug: "yeonwoo-jang" },
    ],
  },
  {
    role: "Production",
    members: [
      { name: "Jeyoung Hwang", slug: "jeyoung-hwang" },
      { name: "Yuchan Park", slug: "yuchan-park" },
    ],
  },
];

/** Everyone printed on the masthead, counted once. */
export const mastheadCount = masthead.reduce(
  (total, group) => total + group.members.length,
  0,
);

/** The bio from `authors`, when the site has one for that person. */
export function mastheadBio(slug: string): string | undefined {
  return authorBySlug[slug]?.bio;
}
