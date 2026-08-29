# Valor Times

A student newspaper for **valortimes.org** — Next.js App Router, TypeScript, Tailwind CSS v4.

Every story on the site comes from one typed array, so publishing is a data edit, not a
code change. Routes, category pages, search, trending, the sitemap and the homepage all
read from the same source.

---

## Running it locally

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>. Other scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

---

## Publishing a story

Open `src/data/articles.ts`, copy any object in the array, and edit the fields:

```ts
{
  slug: "a-url-safe-slug",          // becomes /article/a-url-safe-slug
  title: "The headline",
  dek: "The standfirst under the headline.",
  category: "news",                 // see src/data/categories.ts
  authorSlug: "amara-oyelaran",     // see src/data/authors.ts
  date: "2026-08-27",               // ISO; sorting is newest-first
  image: "/images/your-photo.jpg",  // anything in /public, or a full URL
  imageAlt: "Description for screen readers",
  tags: ["policy", "administration"],
  featured: true,                   // optional: homepage hero / Featured rail
  trendingRank: 1,                  // optional: position in the Trending list
  content: `...`,                   // see below
}
```

That is the whole publishing step. The story appears on the homepage, in its category, in
search, in Related Stories and in `sitemap.xml` automatically.

### Writing the body

`content` is a plain template string with four conventions:

| Prefix | Renders as |
| --- | --- |
| `## ` | Section heading |
| `> ` | Pull quote |
| `- ` or `1. ` | List item (consecutive lines become one list) |
| *(anything else)* | Paragraph — the first one gets the drop cap |

Blank lines separate blocks. Reading time is calculated from the word count.

### Images

Article artwork lives in `public/images`. The placeholders are generated SVGs:

```bash
node scripts/generate-artwork.mjs my-story-slug
```

To use real photography instead, drop a `.jpg`/`.png` into `public/images` and point
`image` at it — nothing else changes. For images hosted elsewhere, add the host to
`images.remotePatterns` in `next.config.ts`.

### Editors, sections and site details

- `src/data/authors.ts` — the masthead (name, role, bio)
- `src/data/categories.ts` — the six sections and their accents
- `src/lib/site.ts` — name, tagline, domain, contact address, social links

---

## Structure

```
src/
  app/
    layout.tsx              masthead + nav + footer, fonts, metadata
    template.tsx            per-navigation transition
    page.tsx                homepage
    article/[slug]/         article pages (static, one per story)
    category/[slug]/        the six section pages
    about/                  about, masthead, corrections, contribute
    search/                 search + full archive (works without JS)
    not-found.tsx           404
    sitemap.ts robots.ts icon.svg
    globals.css             design tokens and utilities
  components/
    site/                   Masthead, SiteNav, Footer
    home/                   Hero, Ticker, LatestAndTrending, CategoryRail,
                            OpinionsSection, ScienceSection, CuisineSection,
                            FeaturedSection, Newsletter
    article/                ReadingProgress, ShareButtons, ArticleBody, RelatedStories
    ui/                     StoryCard, StoryRow, NumberedStory, Rail, Reveal,
                            SectionHeader, CategoryLabel, Byline, Wordmark
  data/                     types, categories, authors, articles, queries
  lib/                      site config, date/reading-time/body parsing
scripts/generate-artwork.mjs
```

Design tokens (colour, type, easing, animations) are defined once in
`src/app/globals.css` under `@theme`. Change the red there and it changes everywhere.

---

## Deploying to Vercel

The project is a stock Next.js app — Vercel needs no configuration beyond the defaults
(Framework: Next.js, Build: `npm run build`, Output: `.next`).

1. **Push to GitHub**

   ```bash
   gh repo create valor-times --private --source=. --push
   ```

   Or, with an existing empty repository:

   ```bash
   git remote add origin https://github.com/<you>/valor-times.git && git push -u origin main
   ```

2. **Import on Vercel** — <https://vercel.com/new>, pick the repository, deploy. You get a
   `*.vercel.app` URL to test against before touching the live domain.

3. **Point the domain when you are ready** — Project → Settings → Domains → add
   `valortimes.org` and `www.valortimes.org`, then set the records Vercel shows you at
   your registrar:

   | Record | Name | Value |
   | --- | --- | --- |
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

   Vercel issues the TLS certificate automatically once the records resolve. The existing
   site stays online until those DNS records are changed.

4. **Set the canonical URL** — `src/lib/site.ts` sets `url` to `https://valortimes.org`,
   which drives Open Graph tags, `sitemap.xml` and `robots.txt`. Update it if the domain
   changes.

Every push to `main` deploys to production; every pull request gets its own preview URL.
