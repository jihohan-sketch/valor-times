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

/** From one story arriving to the next. */
const SLIDE_MS = 15_000;

/* One turn of the cover, about six seconds end to end:
     0.0s  the picture and dek fade away and the headline starts to erase
     1.5s  the headline is gone; the label follows it out
     2.0s  the next label rises in
     2.5s  the next headline starts to type
     5.1s  it is set; the dek, byline and picture settle in under it
   Typing and erasing take the same time whatever the headline's length, so a
   short one does not snap past and a long one does not drag. */
const ERASE_TOTAL = 1500;
const GAP_MS = 450;
const LEAD_MS = 500;
const TYPE_TOTAL = 2600;
/** Reduced motion: a plain crossfade, nothing typed. */
const FADE_MS = 450;

type Phase = "typing" | "shown" | "erasing";
type Fade = "in" | "out" | "leaving";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function typeStep(title: string) {
  return clamp(TYPE_TOTAL / Math.max(1, title.length), 28, 140);
}

function eraseStep(title: string) {
  return clamp(ERASE_TOTAL / Math.max(1, title.length), 14, 90);
}

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

/** The newest few letters, still settling: the last one lightest. */
const FRESH = [0.85, 0.6, 0.3];

/**
 * Turns the cover over every fifteen seconds: the picture and dek fade, the
 * headline erases, and the next story's headline types itself in before the
 * rest of it settles underneath. The motion lives in `.hero-*` in globals.css.
 *
 * Every story is laid out at once, stacked in a single grid cell with all but
 * one hidden, so the cover is always as tall as its tallest story and nothing
 * below it moves when the story changes. The headline types into its own full
 * text — the untyped remainder is there, just invisible — so the lines wrap
 * where they will finally wrap from the first letter.
 *
 * The first story is server-rendered whole and only starts to move when it is
 * due to leave, so the page arrives complete. The turn waits while a pointer is
 * over the cover, focus is inside it, or the tab is hidden: a story never
 * changes under a reader's click.
 */
export function HeroRotator({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(slides[0]?.title.length ?? 0);
  const [due, setDue] = useState(false);
  const [leaving, setLeaving] = useState(false);
  /* The first story arrives already set, so it gets no caret; every story
     after it was typed, and its caret blinks out once it is done. */
  const [turned, setTurned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, reducedMotion, () => false);
  const hidden = useSyncExternalStore(subscribeVisibility, tabHidden, () => false);

  const slide = slides[index];
  const phase: Phase = leaving
    ? "erasing"
    : slide && typed < slide.title.length
      ? "typing"
      : "shown";

  /* The clock starts when a story arrives, so arrival to arrival is fifteen
     seconds, typing and erasing included. */
  useEffect(() => {
    if (count < 2) return;
    const title = slides[index].title;
    const exit = reduced ? FADE_MS : title.length * eraseStep(title) + GAP_MS;
    const timer = setTimeout(() => setDue(true), SLIDE_MS - exit);
    return () => clearTimeout(timer);
  }, [index, count, slides, reduced]);

  // Due, and nobody is reading it: start the turn.
  useEffect(() => {
    if (!due || phase !== "shown" || hovered || focused || hidden) return;
    const timer = setTimeout(() => setLeaving(true), 0);
    return () => clearTimeout(timer);
  }, [due, phase, hovered, focused, hidden]);

  useEffect(() => {
    if (!slide) return;

    if (phase === "typing") {
      // The label rises first; the headline starts once it is in.
      const delay = typed === 0 ? LEAD_MS : typeStep(slide.title);
      const timer = setTimeout(() => setTyped((n) => n + 1), delay);
      return () => clearTimeout(timer);
    }

    if (phase === "erasing") {
      const advance = () => {
        const next = (index + 1) % count;
        setIndex(next);
        setTyped(reduced ? slides[next].title.length : 0);
        setDue(false);
        setLeaving(false);
        setTurned(true);
      };
      const timer = reduced
        ? setTimeout(advance, FADE_MS)
        : typed > 0
          ? setTimeout(() => setTyped((n) => n - 1), eraseStep(slide.title))
          : setTimeout(advance, GAP_MS);
      return () => clearTimeout(timer);
    }
  }, [phase, typed, index, count, slide, slides, reduced]);

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

      <div className="grid">
        {slides.map((entry, i) => {
          const active = i === index;
          // Pictures load for the story showing and the one coming next.
          const near = active || i === (index + 1) % count;
          const shown = active ? typed : entry.title.length;
          const Title = active ? "h1" : "p";

          const label: Fade = !active ? "out" : phase === "erasing" ? "leaving" : "in";
          const rest: Fade = !active
            ? "out"
            : phase === "erasing"
              ? "leaving"
              : phase === "shown"
                ? "in"
                : "out";
          // Under reduced motion nothing is typed, so the headline fades instead.
          const headline: Fade = active && reduced && phase === "erasing" ? "leaving" : "in";

          const settled = entry.title.slice(0, Math.max(0, shown - FRESH.length));
          const fresh = active && phase !== "shown"
            ? entry.title.slice(Math.max(0, shown - FRESH.length), shown)
            : "";
          const caret = active && !reduced && (phase !== "shown" || turned);

          return (
            <div
              key={entry.slug}
              className={`[grid-area:1/1] ${active ? "" : "invisible"}`}
              aria-hidden={active ? undefined : true}
              inert={!active}
            >
              <div
                className="hero-fade pt-8 md:pt-12"
                data-state={label}
                style={{ "--hero-leave-delay": "0.9s" } as React.CSSProperties}
              >
                {entry.kicker}
              </div>

              <Title
                id={active ? "cover-story" : undefined}
                className={`display-tight mt-5 text-balance ${entry.scale} ${reduced ? "hero-fade" : ""}`}
                data-state={headline}
              >
                <Link href={`/article/${entry.slug}`} className="link-draw inline">
                  <span className="sr-only">{entry.title}</span>
                  <span aria-hidden="true">
                    {fresh ? settled : entry.title.slice(0, shown)}
                    {[...fresh].map((letter, k) => (
                      <span
                        key={`${shown}-${k}`}
                        style={{ opacity: FRESH[fresh.length - 1 - k] }}
                      >
                        {letter}
                      </span>
                    ))}
                    {caret && (
                      <span
                        className="hero-caret"
                        data-state={phase === "shown" ? "rest" : "busy"}
                      />
                    )}
                    <span className="invisible">{entry.title.slice(shown)}</span>
                  </span>
                </Link>
              </Title>

              <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
                <div
                  className={`hero-fade self-start ${entry.photo ? "lg:col-span-4" : "lg:col-span-8"}`}
                  data-state={rest}
                >
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
                      <div className="hero-picture absolute inset-0" data-state={rest}>
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
