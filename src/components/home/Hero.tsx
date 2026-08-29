"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import { ViewCount } from "@/components/engagement/ViewCount";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Kicker } from "@/components/ui/Kicker";
import { authorBySlug } from "@/data/authors";
import { issueBySlug } from "@/data/issues";
import type { Article } from "@/data/types";
import { readingTime } from "@/lib/format";

/** Inline delay for the load choreography. */
const at = (ms: number) => ({ "--load-delay": `${ms}ms` }) as CSSProperties;

/** How long a cover story holds before the next one takes the front page. */
const DWELL_MS = 8000;

/**
 * The cover story, set the way a front page sets one: the headline takes the
 * full measure of the shell rather than a column of it, which is the whole
 * reason display type reads as architecture instead of just large text. The
 * dek, byline and plate hang underneath in an asymmetric 4/8.
 *
 * A paper has one front page and several stories that deserve it, so the slot
 * rotates. Each turn re-runs the load choreography — rule, kicker, headline,
 * dek and byline arriving in reading order while the plate clears its own mask
 * — so a change of story reads as the page being reset rather than as a
 * carousel sliding. It is all CSS animation, so it costs no JavaScript and
 * stops dead under `prefers-reduced-motion`, where the rotation stops too:
 * motion nobody asked for should never move type nobody has finished reading.
 *
 * Rotation also holds while a reader is hovering, tabbing through the block,
 * or has the tab in the background.
 */
export function Hero({ articles }: { articles: Article[] }) {
  const stories = articles.length > 0 ? articles : [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motionOk, setMotionOk] = useState(false);
  const region = useRef<HTMLElement>(null);

  const article = stories[Math.min(index, stories.length - 1)];
  const rotates = stories.length > 1 && motionOk;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // A story nobody can see should not be spending its turn.
  useEffect(() => {
    const sync = () => setPaused(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const go = useCallback(
    (next: number) => setIndex((next + stories.length) % stories.length),
    [stories.length],
  );

  /* The turn ends when the rule below finishes filling. Driving the rotation
     off that one animation — rather than a timer racing it — is what keeps the
     bar honest: pause the animation and the story stays put, because the
     animation is the only thing that can end the turn. */
  const advance = useCallback(() => go(index + 1), [go, index]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (stories.length < 2) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  };

  if (!article) return null;

  const author = authorBySlug[article.authorSlug];
  const issue = issueBySlug[article.issueSlug];

  // A long headline at 9rem becomes a wall; step the ceiling down instead.
  const scale =
    article.title.length > 46
      ? "text-[clamp(2.6rem,7vw,5.5rem)]"
      : article.title.length > 30
        ? "text-[clamp(3rem,9vw,7.75rem)]"
        : "text-[clamp(3.25rem,11vw,9.5rem)]";

  return (
    <section
      ref={region}
      className="shell pt-6 pb-12 md:pt-10 md:pb-16"
      aria-labelledby="cover-story"
      aria-roledescription={stories.length > 1 ? "carousel" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!region.current?.contains(event.relatedTarget as Node)) setPaused(false);
      }}
      onKeyDown={onKeyDown}
    >
      {/* Issue line */}
      <div
        className="load-line flex items-center justify-between border-b border-ink pb-3"
        style={at(0)}
      >
        <span className="kicker">The Cover Story</span>
        {issue ? (
          <Link
            href={`/issues/${issue.slug}`}
            className="kicker tabular-nums text-muted transition-colors hover:text-red"
          >
            {issue.title}
            <span className="ml-3">{issue.dateLabel}</span>
          </Link>
        ) : (
          <span className="kicker text-muted tabular-nums">{article.date}</span>
        )}
      </div>

      {/* Each turn is a fresh page: the key restarts the load choreography. */}
      <div key={article.slug}>
        <div className="load-line pt-8 md:pt-12" style={at(140)}>
          <Kicker category={article.category} />
        </div>

        <h1 id="cover-story" className={`display-tight mt-5 text-balance ${scale}`}>
          <span className="line-mask">
            <Link
              href={`/article/${article.slug}`}
              className="load-line link-draw inline"
              style={at(230)}
            >
              {article.title}
            </Link>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
          {/* ── Words ── */}
          {/* self-start: the plate is tall, and letting this column stretch to
              match it opened a hole between the dek and the byline. */}
          <div className="self-start lg:col-span-4">
            <p
              className="load-line max-w-lg text-lg leading-relaxed text-ink-2 md:text-xl"
              style={at(360)}
            >
              {article.dek}
            </p>

            <div className="load-line mt-8" style={at(470)}>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-rule pt-5">
                <p className="text-sm font-semibold">{author?.name}</p>
                <p className="meta">{author?.role}</p>
                <p className="meta ml-auto tabular-nums">
                  {readingTime(article.content)} min read
                  <ViewCount
                    slug={article.slug}
                    className="before:mx-2 before:opacity-40 before:content-['/']"
                  />
                </p>
              </div>

              <ArrowLink href={`/article/${article.slug}`} className="mt-8">
                Read story
              </ArrowLink>
            </div>
          </div>

          {/* ── Plate, running off the right edge ── */}
          <div className="lg:col-span-8">
            <Link
              href={`/article/${article.slug}`}
              className="group block -mr-5 md:-mr-10 xl:-mr-14"
              tabIndex={-1}
              aria-hidden="true"
            >
              <div
                className="zoom-frame load-plate relative aspect-[4/3] lg:aspect-[16/9]"
                style={at(280)}
              >
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {stories.length > 1 && (
        <CoverIndex
          stories={stories}
          index={index}
          rotates={rotates}
          running={rotates && !paused}
          onSelect={go}
          onElapsed={advance}
        />
      )}

      <p className="sr-only" aria-live="polite">
        Cover story {index + 1} of {stories.length}: {article.title}
      </p>
    </section>
  );
}

/**
 * The rotation made legible: the other front-page stories listed by name with
 * their own ordinals, the current one carrying a rule that fills as its turn
 * runs out. A reader should be able to see what else is on the cover and take
 * it out of turn — a carousel that hides its contents behind dots is asking
 * people to gamble on what the next slide holds.
 */
function CoverIndex({
  stories,
  index,
  rotates,
  running,
  onSelect,
  onElapsed,
}: {
  stories: Article[];
  index: number;
  /** False under reduced motion, where the cover simply holds its first story. */
  rotates: boolean;
  running: boolean;
  onSelect: (next: number) => void;
  onElapsed: () => void;
}) {
  return (
    <div className="mt-12 border-t border-rule pt-4 md:mt-16">
      <div className="flex items-center justify-between gap-6">
        <span className="kicker text-muted">Also on the cover</span>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onSelect(index - 1)}
            aria-label="Previous cover story"
            className="grid h-9 w-9 place-items-center border border-rule-2 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <svg width="15" height="9" viewBox="0 0 16 10" fill="none" aria-hidden="true">
              <path d="M16 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onSelect(index + 1)}
            aria-label="Next cover story"
            className="grid h-9 w-9 place-items-center border border-rule-2 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <svg width="15" height="9" viewBox="0 0 16 10" fill="none" aria-hidden="true">
              <path d="M0 5h15M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
      </div>

      <ol className="mt-4 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
        {stories.map((story, position) => {
          const current = position === index;
          return (
            <li key={story.slug}>
              <button
                type="button"
                onClick={() => onSelect(position)}
                aria-current={current ? "true" : undefined}
                className="group/cover w-full pt-3 text-left"
              >
                {/* The rule is the clock: it fills across the current story's turn. */}
                <span className="relative block h-0.5 w-full bg-rule" aria-hidden="true">
                  {current &&
                    (rotates ? (
                      <span
                        /* Restarts when this story takes its turn, holds where
                           it stands while paused, and hands the turn on when
                           it reaches the end. */
                        key={index}
                        onAnimationEnd={onElapsed}
                        className="cover-timer absolute inset-y-0 left-0 block w-full origin-left bg-red"
                        style={
                          {
                            "--dwell": `${DWELL_MS}ms`,
                            animationPlayState: running ? "running" : "paused",
                          } as CSSProperties
                        }
                      />
                    ) : (
                      <span className="absolute inset-y-0 left-0 block w-full bg-red" />
                    ))}
                </span>

                <span
                  className={`mt-3 flex gap-3 transition-opacity duration-300 ${
                    current ? "opacity-100" : "opacity-45 group-hover/cover:opacity-100"
                  }`}
                >
                  <span className="ordinal pt-0.5 text-xs text-muted">
                    {String(position + 1).padStart(2, "0")}
                  </span>
                  <span className="headline line-clamp-2 text-[0.9rem] leading-snug">
                    {story.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
