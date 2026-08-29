import type { Author } from "./types";

export const authors: Author[] = [
  {
    slug: "victoria-oh",
    name: "Victoria Oh",
    role: "Editor in Chief",
    bio: "Runs the paper. Tips, complaints and pitches go to harim.oh@valorschool.org.",
  },
  {
    slug: "seoyeon-jeon",
    name: "Seoyeon Jeon",
    role: "Managing Editor",
    bio: "Keeps the issue moving from draft to layout. Also at seoyeon.jeon@valorschool.org.",
  },
  {
    slug: "yena-seo",
    name: "Yena Seo",
    role: "Head of Layout",
    bio: "Owns the crumpled-paper grid. If a page looks like a page, that is her.",
  },
  {
    slug: "jiho-han",
    name: "Jiho Han",
    role: "Web Editor",
    bio: "Builds and maintains valortimes.org. Wants the site to read like the printed paper, not a dashboard.",
  },
  {
    slug: "yeonwoo-jang",
    name: "Yeonwoo Jang",
    role: "Social Media & Web Editor",
    bio: "Runs the Instagram with Jiho. If you saw it on @valortimes_ first, that was the point.",
  },
  {
    slug: "hailey-hong",
    name: "Hailey Hong",
    role: "Social Media / Bible",
    bio: "Posts, captions, and the Bible section when the back page needs a reading.",
  },
  {
    slug: "hanna-seo",
    name: "Hanna Seo",
    role: "Journalist",
    bio: "School news — AP season, prom, finals, the week itself.",
  },
  {
    slug: "jalen-park",
    name: "Jalen Park",
    role: "Journalist",
    bio: "Social issues, national news, and the arguments that do not fit a news lede.",
  },
  {
    slug: "hayeon-son",
    name: "Hayeon Son",
    role: "Journalist",
    bio: "School events, missions, and the science that actually affects a school day.",
  },
  {
    slug: "yujin-lee",
    name: "Yujin Lee",
    role: "Journalist",
    bio: "Celebrity news, gift guides, and the F1 column when a championship is on the line.",
  },
  {
    slug: "dongyun-hwang",
    name: "Dongyun Hwang",
    role: "Journalist",
    bio: "Culture that does not translate, and the social issues that sit under it.",
  },
  {
    slug: "seoyun-lee",
    name: "Seoyun Lee",
    role: "Journalist",
    bio: "Opinions with a point. Matcha, study modes, Lord of the Flies.",
  },
  {
    slug: "caiden-kim",
    name: "Caiden Kim",
    role: "Journalist",
    bio: "Lifestyle, satire, and the staff interview that actually gets answers.",
  },
  {
    slug: "sungyoon-park",
    name: "Sungyoon Park",
    role: "Journalist",
    bio: "Recommendations — albums, films, a Christmas standard, a Bills game.",
  },
  {
    slug: "juwon-kim",
    name: "Juwon Kim",
    role: "Journalist",
    bio: "Opinions, plastic, straws, and the movie you should watch in December.",
  },
  {
    slug: "hannah-cho",
    name: "Hannah Cho",
    role: "Journalist / Comics",
    bio: "The back page, sleep advice, and the Bible comics when the issue needs ink.",
  },
  {
    slug: "hyunji-song",
    name: "Hyunji Song",
    role: "Journalist",
    bio: "Public health and science — bones, dreams, organelles.",
  },
  {
    slug: "yebynn-son",
    name: "Yebynn Son",
    role: "Journalist",
    bio: "Psychology: first impressions, procrastination, the small machinery of a hallway.",
  },
  {
    slug: "seohyun-choi",
    name: "Seohyun Choi",
    role: "Journalist",
    bio: "Psychology correspondent. Peak-end rule, conformity, why you keep saying yes.",
  },
  {
    slug: "kai-lee",
    name: "Kai Lee",
    role: "Design / Layout",
    bio: "Layouts pages and still files a music rec when the desk is short.",
  },
  {
    slug: "healynn-cho",
    name: "Healynn Cho",
    role: "Design / Layout",
    bio: "Design desk.",
  },
  {
    slug: "jaehoo-lee",
    name: "Jaehoo Lee",
    role: "Design / Layout",
    bio: "Design desk.",
  },
  {
    slug: "jeongwon-lee",
    name: "Jeongwon Lee",
    role: "Design / Layout",
    bio: "Design desk.",
  },
  {
    slug: "soorin-choi",
    name: "Soorin Choi",
    role: "Design / Layout",
    bio: "Design desk.",
  },
  {
    slug: "yejin-cho",
    name: "Yejin Cho",
    role: "Design / Layout",
    bio: "Design desk.",
  },
  {
    slug: "yeonji-cha",
    name: "Yeonji Cha",
    role: "Design / Layout",
    bio: "Design desk.",
  },
  {
    slug: "jeyoung-hwang",
    name: "Jeyoung Hwang",
    role: "Production",
    bio: "Gets the issue out the door.",
  },
  {
    slug: "yuchan-park",
    name: "Yuchan Park",
    role: "Production",
    bio: "Production desk. Comics and Bible when needed.",
  },
  {
    slug: "hakyoon-lee",
    name: "Hakyoon Lee",
    role: "Journalist",
    bio: "Staff writer.",
  },
  {
    slug: "staff",
    name: "Valor Times Staff",
    role: "Newsroom",
    bio: "Unsigned pieces and the back page when a byline did not survive layout.",
  },
];

export const authorBySlug = Object.fromEntries(
  authors.map((author) => [author.slug, author]),
) as Record<string, Author>;
