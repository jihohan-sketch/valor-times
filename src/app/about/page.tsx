import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import {
  categories,
  getAllArticles,
  issueBySlug,
  masthead,
  mastheadBio,
  mastheadCount,
  mastheadIssueSlug,
  type MastheadGroup,
  type MastheadMember,
} from "@/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${site.name} is, who makes it, and how to get a story in it.`,
};

const PRINCIPLES = [
  {
    title: "Report first",
    body: "Nothing runs because it sounds true. Every number has a source we can name, and every claim about a person has been put to that person first.",
  },
  {
    title: "Show the working",
    body: "If we counted something, we say how we counted it and how many we missed. A method paragraph is not an admission of weakness.",
  },
  {
    title: "Argue in the open",
    body: "Opinion is signed, labelled, and separated from reporting. If you disagree with a piece, the byline tells you exactly who to find.",
  },
  {
    title: "Correct fast",
    body: "Corrections run under the masthead, not under the writer. We would rather be embarrassed on Tuesday than wrong forever.",
  },
];

/* The three single-name titles the paper prints across the top of the page. */
const LEAD_ROLES = ["Editor in Chief", "Managing Editor", "Head of Layout"];

export default function AboutPage() {
  const issue = issueBySlug[mastheadIssueSlug];
  const catalog = getAllArticles();

  /* Who has filed something, so a name can link to their work. */
  const filed = new Map<string, number>();
  for (const article of catalog) {
    filed.set(article.authorSlug, (filed.get(article.authorSlug) ?? 0) + 1);
  }

  /* A title nobody holds is carried in the data but not printed here: the desk
     keeps the post on its books while it is vacant, and a card with a role and
     no name under it reads as a page that failed to load. The row simply runs
     one title shorter until somebody takes it. */
  const leads = LEAD_ROLES.map((role) =>
    masthead.find((group) => group.role === role),
  ).filter((group): group is MastheadGroup => Boolean(group?.members.length));

  const desks = masthead.filter(
    (group) => !LEAD_ROLES.includes(group.role) && group.members.length > 0,
  );

  return (
    <>
      <header className="shell pt-12 pb-14 md:pt-20 md:pb-20">
        <div className="grid gap-12 pb-4 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <span className="kicker text-red">Since {site.founded}</span>
            <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">
              A newsroom, run by students
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-ink-2">
              {site.description} We publish {catalog.length} stories from the
              printed issues — Vol. 3 and Vol. 4 — across {categories.length} desks,
              made by the {mastheadCount} people whose names are on the back
              page.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-4">
              <ArrowLink href="/write">Write for us</ArrowLink>
              <ArrowLink href="/issues">Read the printed issues</ArrowLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure>
              <Link
                href={`/issues/${mastheadIssueSlug}`}
                className="group block"
                aria-label={`The masthead page of ${issue?.title ?? "the newest issue"}`}
              >
                <div className="relative aspect-[737/1048] overflow-hidden border border-rule bg-paper transition-colors duration-300 group-hover:border-ink">
                  <Image
                    src={`/issues/${mastheadIssueSlug}/page-07.jpg`}
                    alt={`The masthead page printed at the back of Valor Times ${issue?.title ?? "Vol4. No7."}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain"
                  />
                </div>
              </Link>
              <figcaption className="meta mt-3">
                The masthead as printed at the back of {issue?.title ?? "Vol4. No7."}
                {issue ? ` — ${issue.dateLabel}` : ""}
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      <section className="shell pb-16 md:pb-24" aria-labelledby="principles">
        <div className="border-t-2 border-ink pt-5">
          <span className="kicker text-red">The standard</span>
          <h2 id="principles" className="display mt-3 text-[length:var(--text-section-sm)]">
            How we work
          </h2>
        </div>
        <ol className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.title} as="li" delay={i * 60}>
              <div className="border-t border-rule-2 pt-5">
                <span className="ordinal text-[2.5rem] text-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-3 text-2xl">{principle.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── The masthead, set the way the paper sets it ──
          Order, grouping and wording are the printed page's, not the site's:
          three titles across the top, then the desks. Nobody is added, dropped
          or retitled here — where the site and the page image beside it
          disagree, the desk has moved since the issue went to press.
          See src/data/masthead.ts. */}
      <section className="band bg-shell" aria-labelledby="masthead">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b-2 border-ink pb-6">
            <div>
              <span className="kicker text-red">Who makes it</span>
              <h2
                id="masthead"
                className="display mt-3 text-[length:var(--text-section)]"
              >
                The masthead
              </h2>
            </div>
            <p className="kicker text-muted tabular-nums">
              {String(mastheadCount).padStart(2, "0")} names
              <span className="mx-2 opacity-40">/</span>
              as printed in {issue?.title ?? "Vol4. No7."}
            </p>
          </div>

          {/* The three titles the page prints across its top rule. */}
          <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {leads.map((group, i) => {
              const member = group.members[0];
              const count = filed.get(member.slug) ?? 0;
              return (
                <Reveal key={group.role} as="li" delay={i * 60}>
                  <article className="group h-full border-t-2 border-ink bg-paper p-6 transition-shadow duration-500 hover:shadow-[0_26px_60px_-40px_rgba(13,13,16,0.5)] md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <p className="kicker text-red">{group.role}</p>
                      <Monogram name={member.name} />
                    </div>
                    <h3 className="display mt-5 text-[clamp(1.75rem,3vw,2.5rem)]">
                      <MemberName member={member} count={count} />
                    </h3>
                    {mastheadBio(member.slug) && (
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-2">
                        {mastheadBio(member.slug)}
                      </p>
                    )}
                    {count > 0 && (
                      <p className="meta mt-4 tabular-nums">
                        {count} {count === 1 ? "story" : "stories"} on the site
                      </p>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </ul>

          {/* Journalists, Design/Layout, Social Media & Web, Production. */}
          <ul className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {desks.map((group, i) => (
              <Reveal key={group.role} as="li" delay={i * 60}>
                <div className="border-t-2 border-ink pt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="kicker text-red">{group.role}</p>
                    <span className="kicker text-muted tabular-nums">
                      {String(group.members.length).padStart(2, "0")}
                    </span>
                  </div>
                  <ul className="mt-4">
                    {group.members.map((member) => {
                      const count = filed.get(member.slug) ?? 0;
                      return (
                        <li
                          key={member.slug}
                          className="flex items-baseline justify-between gap-4 border-t border-rule-2 py-3 first:border-t-0 first:pt-0"
                        >
                          <span className="headline text-[1.05rem] leading-snug">
                            <MemberName member={member} count={count} />
                          </span>
                          {count > 0 && (
                            <span className="meta shrink-0 tabular-nums">
                              {String(count).padStart(2, "0")}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ul>

          <p className="mt-14 max-w-xl text-ink-2">
            Corrections, tips and complaints:{" "}
            <a href={`mailto:${site.email}`} className="link-draw text-ink">
              {site.email}
            </a>
          </p>
          {/* Anything about the website rather than the paper goes to whoever
              built it, so the desk’s inbox stays about stories. */}
          <p className="mt-3 max-w-xl text-ink-2">
            Questions about this website, or something you want added to it:{" "}
            <a
              href={`mailto:${site.webmaster.email}`}
              className="link-draw text-ink"
            >
              {site.webmaster.email}
            </a>{" "}
            — {site.webmaster.name}, who designed and built it.
          </p>
        </div>
      </section>
    </>
  );
}

/** Initials, set the way the paper sets its own monogram. */
function Monogram({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span
      aria-hidden="true"
      className="display grid h-11 w-11 shrink-0 place-items-center border border-rule-2 text-lg text-muted transition-colors duration-300 group-hover:border-ink group-hover:text-ink"
    >
      {initials}
    </span>
  );
}

/** A name links to its stories when there are any, and is plain type when not. */
function MemberName({
  member,
  count,
}: {
  member: MastheadMember;
  count: number;
}) {
  if (count === 0) return <>{member.name}</>;
  return (
    <Link
      href={`/search?q=${encodeURIComponent(member.name)}`}
      className="link-draw"
    >
      {member.name}
    </Link>
  );
}
