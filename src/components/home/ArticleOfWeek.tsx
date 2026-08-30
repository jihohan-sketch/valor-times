import Image from "next/image";
import Link from "next/link";

import { ViewCount } from "@/components/engagement/ViewCount";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { Scene } from "@/components/ui/Scene";
import { authorBySlug, issueBySlug, isPlate, type Article } from "@/data";
import { plateAspect } from "@/data/plate";
import { formatDate, readingTime } from "@/lib/format";

/** How much of the opening runs before the reader has to follow the link. */
const TEASER_CHARS = 240;

/** Blocks `parseContent` treats as furniture rather than prose. */
const FURNITURE = /^(##\s|>\s|-\s|\d+\.\s)/;

/**
 * The opening prose of the story, trimmed at a word boundary.
 *
 * Runs on from one paragraph to the next until it has enough to be worth
 * reading — some stories open on a single short line, and one line under a red
 * rule reads as a mistake rather than as a teaser. Headings, pull quotes and
 * list items are skipped on the way in and stop the run once it has started,
 * so the teaser is always continuous prose rather than a subhead lifted out of
 * context.
 */
function opening(content: string): string {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const first = blocks.findIndex((block) => !FURNITURE.test(block));
  if (first === -1) return "";

  const prose: string[] = [];
  for (const block of blocks.slice(first)) {
    if (FURNITURE.test(block)) break;
    prose.push(block);
    if (prose.join(" ").length >= TEASER_CHARS) break;
  }

  const text = prose.join(" ");
  if (!text) return "";
  if (text.length <= TEASER_CHARS) return text;

  const cut = text.slice(0, TEASER_CHARS);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}\u2026`;
}

/**
 * The week's pick, given a band of its own between the cover and the run of
 * latest stories.
 *
 * It has to read as a deliberate promotion rather than as one more card, so it
 * takes four things nothing else on the page takes: the tinted shell ground, a
 * solid red plaque naming the slot outright, a rule that runs the full measure
 * with the words set over it, and the only headline on the site allowed to sit
 * in italic display. The plate leads on the left — the cover puts its artwork
 * right and the Latest lead puts it on top, so this arrangement appears nowhere
 * else — and the words run beside it with the opening paragraph on a red rule.
 */
export function ArticleOfWeek({ article }: { article: Article }) {
  const author = authorBySlug[article.authorSlug];
  const issue = issueBySlug[article.issueSlug];
  const teaser = opening(article.content);
  const plate = isPlate(article);

  return (
    <section
      className="border-y-2 border-ink bg-shell"
      aria-labelledby="article-of-the-week"
    >
      <div className="shell band">
        <Reveal>
          <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-rule-2 pb-6">
            <p className="kicker inline-flex items-center gap-3 bg-red px-4 py-3 text-paper">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-paper"
                aria-hidden="true"
              />
              Article of the Week
            </p>

            {issue && (
              <Link
                href={`/issues/${issue.slug}`}
                className="kicker tabular-nums text-muted transition-colors hover:text-red"
              >
                {issue.title}
                <span className="ml-3">Page {article.page}</span>
              </Link>
            )}
          </header>
        </Reveal>

        <div className="mt-9 grid gap-x-14 gap-y-10 md:mt-12 lg:grid-cols-12 lg:items-center">
          {/* ── Plate ── */}
          <Reveal className="lg:col-span-5" plate>
            <Scene>
            <Link href={`/article/${article.slug}`} className="group block" tabIndex={-1} aria-hidden="true">
              <div
                className={`relative ${
                  plate
                    ? `${plateAspect(article)} bg-paper p-3 ring-1 ring-rule-2 md:p-4`
                    : "zoom-frame aspect-[4/3]"
                }`}
              >
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className={plate ? "object-contain" : "object-cover"}
                />
              </div>
            </Link>
            </Scene>
          </Reveal>

          {/* ── Words ── */}
          <Reveal className="lg:col-span-7" delay={80}>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-red" aria-hidden="true" />
              <Kicker category={article.category} />
            </div>

            <h2
              id="article-of-the-week"
              className="display-tight mt-5 text-balance text-[clamp(2.3rem,5vw,4.25rem)]"
            >
              <Link href={`/article/${article.slug}`} className="link-draw inline">
                {article.title}
              </Link>
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2 md:text-xl">
              {article.dek}
            </p>

            {teaser && (
              <p className="mt-6 max-w-xl border-l-2 border-red pl-5 text-[0.95rem] leading-relaxed text-ink-2 md:text-base">
                {teaser}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-rule-2 pt-5">
              <p className="text-sm font-semibold">{author?.name ?? "Valor Times Staff"}</p>
              <p className="meta">{author?.role}</p>
              <p className="meta ml-auto tabular-nums">
                {formatDate(article.date)}
                <span className="mx-2 opacity-40">/</span>
                {readingTime(article.content)} min read
                <ViewCount
                  slug={article.slug}
                  className="before:mx-2 before:opacity-40 before:content-['/']"
                />
              </p>
            </div>

            <ArrowLink href={`/article/${article.slug}`} className="mt-9">
              Read the story
            </ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
