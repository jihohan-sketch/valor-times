import type { Author } from "./types";

/**
 * Everyone who has carried a byline on the site, current staff and past.
 *
 * `role` follows the printed masthead for anyone on the current one — see
 * `masthead.ts`, which is the authority on titles and grouping. People who
 * wrote for an earlier volume stay here so their stories keep a byline, but
 * they are not listed on the About page masthead.
 */
export const authors: Author[] = [
  {
    slug: "victoria-oh",
    name: "Victoria Oh",
    role: "Editor in Chief",
    bio: "Leads the paper and oversees every issue. Send tips, complaints, and pitches to harim.oh@valorschool.org.",
  },
  {
    slug: "seoyeon-jeon",
    name: "Seoyeon Jeon",
    role: "Journalist",
    bio: "Keeps each issue moving from draft to layout. Email: seoyeon.jeon@valorschool.org.",
  },
  {
    slug: "jiho-han",
    name: "Jiho Han",
    role: "Social Media & Web Editor",
    bio: "Builds and maintains valortimes.org, with the aim of making the site read like the printed paper.",
  },
  {
    slug: "yeonwoo-jang",
    name: "Yeonwoo Jang",
    role: "Social Media & Web Editor",
    bio: "Runs the paper’s Instagram, @valortimes_, with Jiho.",
  },
  {
    slug: "hailey-hong",
    name: "Hailey Hong",
    role: "Social Media / Bible",
    bio: "Handles posts and captions, and writes for the Bible section.",
  },
  {
    slug: "hanna-seo",
    name: "Hanna Seo",
    role: "Journalist",
    bio: "Covers school news, including AP season, prom, and finals.",
  },
  {
    slug: "jalen-park",
    name: "Jalen Park",
    role: "Journalist",
    bio: "Writes about social issues and national news.",
  },
  {
    slug: "hayeon-son",
    name: "Hayeon Son",
    role: "Journalist",
    bio: "Covers school events and missions, and writes about science that affects the school day.",
  },
  {
    slug: "yujin-lee",
    name: "Yujin Lee",
    role: "Managing Editor",
    bio: "Manages editing for each issue. Also writes about celebrity news, gift guides, and F1.",
  },
  {
    slug: "dongyun-hwang",
    name: "Dongyun Hwang",
    role: "Journalist",
    bio: "Writes about culture and the social issues connected to it.",
  },
  {
    slug: "seoyun-lee",
    name: "Seoyun Lee",
    role: "Journalist",
    bio: "Writes opinion pieces on topics from matcha and study modes to Lord of the Flies.",
  },
  {
    slug: "caiden-kim",
    name: "Caiden Kim",
    role: "Journalist",
    bio: "Writes lifestyle pieces, satire, and staff interviews.",
  },
  {
    slug: "sungyoon-park",
    name: "Sungyoon Park",
    role: "Journalist",
    bio: "Writes recommendations on albums, films, a Christmas classic, and a Bills game.",
  },
  {
    slug: "juwon-kim",
    name: "Juwon Kim",
    role: "Journalist",
    bio: "Writes opinion pieces on plastic and straws, plus December movie picks.",
  },
  {
    slug: "hannah-cho",
    name: "Hannah Cho",
    role: "Journalist",
    bio: "Writes for the back page, including sleep advice and the Bible comics.",
  },
  {
    slug: "hyunji-song",
    name: "Hyunji Song",
    role: "Journalist",
    bio: "Covers public health and science, from bones and dreams to organelles.",
  },
  {
    slug: "yebynn-son",
    name: "Yebynn Son",
    role: "Journalist",
    bio: "Writes about psychology, including first impressions and procrastination.",
  },
  {
    slug: "seohyun-choi",
    name: "Seohyun Choi",
    role: "Head of Layout",
    bio: "Leads layout for each issue. Also writes about psychology.",
  },
  {
    slug: "kai-lee",
    name: "Kai Lee",
    role: "Design / Layout",
    bio: "Lays out pages and occasionally writes music recommendations.",
  },
  {
    slug: "healynn-cho",
    name: "Healynn Cho",
    role: "Design / Layout",
    bio: "Works on design and layout for each issue.",
  },
  {
    slug: "jaehoo-lee",
    name: "Jaehoo Lee",
    role: "Design / Layout",
    bio: "Works on design and layout for each issue.",
  },
  {
    slug: "jeongwon-lee",
    name: "Jeongwon Lee",
    role: "Design / Layout",
    bio: "Works on design and layout for each issue.",
  },
  {
    slug: "soorin-choi",
    name: "Soorin Choi",
    role: "Design / Layout",
    bio: "Works on design and layout for each issue.",
  },
  {
    slug: "yejin-cho",
    name: "Yejin Cho",
    role: "Design / Layout",
    bio: "Works on design and layout for each issue.",
  },
  {
    slug: "yeonji-cha",
    name: "Yeonji Cha",
    role: "Design / Layout",
    bio: "Works on design and layout for each issue.",
  },
  {
    slug: "jeyoung-hwang",
    name: "Jeyoung Hwang",
    role: "Production",
    bio: "Handles production and gets each issue out the door.",
  },
  {
    slug: "yuchan-park",
    name: "Yuchan Park",
    role: "Production",
    bio: "Works on production, and on comics and the Bible section when needed.",
  },
  {
    slug: "hakyoon-lee",
    name: "Haakyoon Lee",
    role: "Journalist",
    bio: "Staff writer for The Valor Times.",
  },
  {
    slug: "yena-seo",
    name: "Yena Seo",
    role: "Journalist",
    bio: "Writes about public health and science.",
  },
  {
    slug: "anthony-kong",
    name: "Anthony Kong",
    role: "Journalist",
    bio: "Writes recommendations and takes the photos that go with them.",
  },
  {
    slug: "uibin-lee",
    name: "Uibin Lee",
    role: "Journalist",
    bio: "Writes music recommendations, including the R&B double review in Vol4. No1.",
  },
  {
    slug: "jongchan-yoon",
    name: "Jongchan Yoon",
    role: "Journalist",
    bio: "Wrote about football for the sports page in Volume 3, No. 20.",
  },
  {
    slug: "miel-park",
    name: "Miel Park",
    role: "Journalist",
    bio: "Writes about food and delivery, including the Anseong list in Volume 3, No. 20.",
  },
  {
    slug: "staff",
    name: "Valor Times Staff",
    role: "Newsroom",
    bio: "Unsigned pieces, and back-page items whose byline was lost in layout.",
  },
];

export const authorBySlug = Object.fromEntries(
  authors.map((author) => [author.slug, author]),
) as Record<string, Author>;
