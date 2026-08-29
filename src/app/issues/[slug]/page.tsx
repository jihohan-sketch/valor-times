import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { IssueReader } from "@/components/issue/IssueReader";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { authorBySlug, getAllArticles } from "@/data";
import { issueBySlug, issuePages, issues } from "@/data/issues";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return issues.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = issueBySlug[slug];
  if (!issue) return { title: "Not found" };

  return {
    title: `Valor Times ${issue.title}`,
    description: `${issue.lead} — ${issue.dateLabel}, ${issue.pageCount} pages.`,
    openGraph: {
      type: "article",
      title: `Valor Times ${issue.title}`,
      description: `${issue.lead} — ${issue.dateLabel}.`,
      url: `${site.url}/issues/${issue.slug}`,
      images: [{ url: issue.cover }],
    },
  };
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = issueBySlug[slug];
  if (!issue) notFound();

  const inThisIssue = getAllArticles()
    .filter((article) => article.issueSlug === issue.slug)
    .sort((a, b) => a.page - b.page);

  const index = issues.findIndex((entry) => entry.slug === issue.slug);
  const newer = index > 0 ? issues[index - 1] : undefined;
  const older = index < issues.length - 1 ? issues[index + 1] : undefined;

  return (
    <div className="pb-20">
      {/* ── Masthead ── */}
      <header className="shell pt-10 md:pt-16">
        <Link
          href="/issues"
          className="kicker inline-flex items-center gap-3 text-red transition-opacity hover:opacity-60"
        >
          <span className="h-px w-8 bg-red" aria-hidden="true" />
          All issues
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start">
          <div>
            <h1 className="display-tight text-[clamp(2.5rem,7vw,5rem)] text-balance">
              {issue.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2 md:text-xl">
              {issue.lead}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-rule pt-5 sm:grid-cols-4">
              <div>
                <dt className="meta">Published</dt>
                <dd className="mt-1 text-sm font-semibold tabular-nums">
                  {issue.dateLabel}
                </dd>
              </div>
              <div>
                <dt className="meta">Pages</dt>
                <dd className="mt-1 text-sm font-semibold tabular-nums">
                  {issue.pageCount}
                </dd>
              </div>
              <div>
                <dt className="meta">Stories</dt>
                <dd className="mt-1 text-sm font-semibold tabular-nums">
                  {inThisIssue.length}
                </dd>
              </div>
              <div>
                <dt className="meta">Original</dt>
                <dd className="mt-1 text-sm font-semibold">
                  <a
                    href={issue.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-draw"
                  >
                    PDF in Drive
                  </a>
                </dd>
              </div>
            </dl>

            {issue.numberingNote && (
              <p className="meta mt-5 max-w-xl border-l-2 border-rule pl-4">
                {issue.numberingNote}
              </p>
            )}
          </div>

          {/* The real front page. */}
          <figure>
            <div className="relative aspect-[737/1048] overflow-hidden border border-rule bg-shell-deep shadow-[0_24px_60px_-32px_rgba(13,13,16,0.45)]">
              <Image
                src={issue.cover}
                alt={`Front page of Valor Times ${issue.title}`}
                fill
                priority
                sizes="(min-width: 768px) 22rem, 90vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="meta mt-3">
              Page one, as printed. Source file: {issue.sourceFile}
            </figcaption>
          </figure>
        </div>
      </header>

      {/* ── The cover photograph, lifted out of the page ── */}
      <section className="shell mt-16">
        <h2 className="kicker-lg border-b border-rule pb-3">The cover photograph</h2>
        <figure className="mt-6">
          <div className="relative aspect-[16/9] overflow-hidden bg-shell-deep">
            <Image
              src={issue.coverPhoto}
              alt={issue.coverAlt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="meta mt-3 max-w-3xl">{issue.coverAlt}</figcaption>
        </figure>
      </section>

      {/* ── Contents ── */}
      <section className="shell mt-16">
        <h2 className="kicker-lg border-b border-rule pb-3">In this issue</h2>
        <ul className="mt-2">
          {inThisIssue.map((article) => (
            <Reveal key={article.slug} as="li">
              <Link
                href={`/article/${article.slug}`}
                className="group grid gap-x-8 gap-y-2 border-t border-rule py-5 transition-colors hover:border-red md:grid-cols-[4rem_1fr_9rem] md:items-baseline"
              >
                <span className="meta tabular-nums">p. {article.page}</span>
                <div>
                  <h3 className="headline text-[1.0625rem] text-balance md:text-xl">
                    <span className="link-draw">{article.title}</span>
                  </h3>
                  <p className="meta mt-1.5">
                    {authorBySlug[article.authorSlug]?.name}
                  </p>
                </div>
                <div className="hidden text-right md:block">
                  <Kicker category={article.category} href={false} />
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── Every page, as it was laid out ── */}
      <section className="shell mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-3">
          <h2 className="kicker-lg">Read the printed pages</h2>
          <p className="meta">
            Open any page full size · arrow keys to turn
          </p>
        </div>
        <IssueReader issueTitle={issue.title} pages={issuePages(issue)} />
      </section>

      {/* ── Previous / next issue ── */}
      <nav className="shell mt-20 grid gap-px border-t border-rule pt-8 sm:grid-cols-2">
        {older ? (
          <Link href={`/issues/${older.slug}`} className="group py-4">
            <p className="kicker text-muted">Previous issue</p>
            <p className="headline mt-2 text-lg">
              <span className="link-draw">{older.title}</span>
            </p>
            <p className="meta mt-1">{older.lead}</p>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link href={`/issues/${newer.slug}`} className="group py-4 sm:text-right">
            <p className="kicker text-muted">Next issue</p>
            <p className="headline mt-2 text-lg">
              <span className="link-draw">{newer.title}</span>
            </p>
            <p className="meta mt-1">{newer.lead}</p>
          </Link>
        )}
      </nav>
    </div>
  );
}
