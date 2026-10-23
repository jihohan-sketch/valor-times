"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

/** One story on the cover, set by `Hero` on the server. */
export interface HeroSlide {
  slug: string;
  title: string;
  /** The headline's type size, chosen from its length. */
  scale: string;
  /** Whether the story carries a photograph rather than a page scan. */
  photo: boolean;
  kicker: React.ReactNode;
  /** Dek, byline and the "Read story" link. */
  body: React.ReactNode;
  image: React.ReactNode;
}

/** From one story arriving to the next, the turn included. */
const SLIDE_MS = 15_000;

/** How long the page takes to lift off and turn over. Matches `.hero-sheet`. */
const TURN_MS = 1300;
/** Reduced motion: a plain crossfade, nothing turns. */
const FADE_MS = 450;

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const query = matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function reducedMotion() {
  return matchMedia(MOTION_QUERY).matches;
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function tabHidden() {
  return document.visibilityState === "hidden";
}

/**
 * Turns the cover over every fifteen seconds, like the page of a paper: the
 * story showing lifts at its free edge and folds over on its left edge, its
 * shadow sweeping across the next story, which is already lying underneath.
 * The motion lives in `.hero-sheet` in globals.css.
 *
 * Every story is laid out at once, stacked in a single grid cell with all but
 * one hidden, so the cover is always as tall as its tallest story and nothing
 * below it moves when the story changes. During a turn two are visible: the
 * outgoing page on top, the incoming one under it — and the incoming one is
 * already the live heading, so a click mid-turn lands on the story arriving.
 *
 * The first story is server-rendered whole and only moves when it is due to
 * leave, so the page arrives complete. The turn waits while a pointer is over
 * the cover, focus is inside it, or the tab is hidden: a story never changes
 * under a reader's click.
 */
export function HeroRotator({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  /** The page being turned away, while it is still in motion. */
  const [from, setFrom] = useState<number | null>(null);
  const [due, setDue] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, reducedMotion, () => false);
  const hidden = useSyncExternalStore(subscribeVisibility, tabHidden, () => false);

  const slide = slides[index];

  /* The clock starts when a story arrives — the moment the page over it
     starts to lift — so arrival to arrival is fifteen seconds. */
  useEffect(() => {
    if (count < 2) return;
    const timer = setTimeout(() => setDue(true), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, count]);

  // Due, and nobody is reading it: turn the page.
  useEffect(() => {
    if (!due || from !== null || hovered || focused || hidden) return;
    const timer = setTimeout(() => {
      setFrom(index);
      setIndex((index + 1) % count);
      setDue(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [due, from, hovered, focused, hidden, index, count]);

  // The turned page is gone once it has swung edge-on.
  useEffect(() => {
    if (from === null) return;
    const timer = setTimeout(() => setFrom(null), reduced ? FADE_MS : TURN_MS);
    return () => clearTimeout(timer);
  }, [from, reduced]);

  if (!slide) return null;

  const others =
    count > 1
      ? Array.from({ length: Math.min(3, count - 1) }, (_, k) => slides[(index + 1 + k) % count])
      : [];

  return (
    <div
      className="relative"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      {/* Fifteen seconds, drawn along the rule under the issue line. */}
      {count > 1 && (
        <span key={index} aria-hidden="true" className="hero-progress" />
      )}

      <div className="hero-book grid">
        {slides.map((entry, i) => {
          const active = i === index;
          const turning = i === from;
          // Pictures load for the stories in view and the one coming next.
          const near = active || turning || i === (index + 1) % count;
          const Title = active ? "h1" : "p";
          const sheet = turning ? "turning" : active ? (from !== null ? "under" : "shown") : "hidden";

          return (
            <div
              key={entry.slug}
              className={`hero-sheet [grid-area:1/1] ${active || turning ? "" : "invisible"}`}
              data-state={sheet}
              aria-hidden={active ? undefined : true}
              inert={!active}
            >
              <div className="pt-8 md:pt-12">{entry.kicker}</div>

              <Title
                id={active ? "cover-story" : undefined}
                className={`display-tight mt-5 text-balance ${entry.scale}`}
              >
                <Link href={`/article/${entry.slug}`} className="link-draw inline">
                  {entry.title}
                </Link>
              </Title>

              <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
                <div className={`self-start ${entry.photo ? "lg:col-span-4" : "lg:col-span-8"}`}>
                  {entry.body}
                </div>

                {entry.photo && (
                  <Link
                    href={`/article/${entry.slug}`}
                    className="block lg:col-span-8"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-shell lg:aspect-[16/9]">
                      <div className="hero-picture absolute inset-0" data-state={sheet}>
                        {near && entry.image}
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {others.length > 0 && (
        <div className="mt-12 border-t border-rule pt-5 md:mt-16">
          <p className="kicker text-muted">Also on the cover</p>
          <ul className="mt-4 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((story, k) => (
              // Two lines held open, so a shorter headline does not pull the page up.
              <li
                key={story.slug}
                className="hero-listing min-h-[2.9rem]"
                style={{ animationDelay: `${k * 90}ms` }}
              >
                <Link href={`/article/${story.slug}`} className="group block">
                  <span className="headline line-clamp-2 text-[1.05rem] leading-snug text-balance">
                    <span className="link-draw">{story.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
