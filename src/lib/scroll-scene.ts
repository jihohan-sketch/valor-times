/**
 * One scroll listener and one animation frame for every scroll-linked element
 * on the page.
 *
 * Each registered element gets a custom property `--pass` written on it, running
 * 0 → 1 as the element crosses the viewport: 0 when its top edge is at the
 * bottom of the screen, 1 when its bottom edge has left the top. CSS does the
 * rest, so nothing here decides what the movement looks like — it only reports
 * where the reader is.
 *
 * Two things keep it cheap. Elements are only measured while an
 * IntersectionObserver says they are on screen, so a page of forty scenes costs
 * as much as the two or three the reader can actually see; and every measure
 * for a given frame happens in one batch inside a single rAF, so the layout is
 * read once rather than once per element.
 */

/** Elements currently on screen, and so worth measuring. */
const active = new Set<HTMLElement>();

let observer: IntersectionObserver | null = null;
let listening = false;
let frame = 0;

/** Reads one element's position and writes its `--pass`. */
function measureOne(el: HTMLElement, viewport: number) {
  const { top, height } = el.getBoundingClientRect();
  /* The distance the element travels from first touching the bottom of the
     screen to fully clearing the top: its own height plus one viewport. */
  const span = height + viewport;
  const p = span > 0 ? (viewport - top) / span : 0;
  el.style.setProperty("--pass", (p < 0 ? 0 : p > 1 ? 1 : p).toFixed(4));
}

function measure() {
  frame = 0;
  const viewport = window.innerHeight;
  for (const el of active) measureOne(el, viewport);
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(measure);
}

function ensureDriver() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}

function ensureObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) active.add(el);
        else active.delete(el);
      }
      /* A scene that just came on screen has a stale `--pass` from before it was
         last dropped, so take a reading now rather than at the next scroll. */
      schedule();
    },
    /* A margin of one viewport on both sides: a scene starts being measured
       just before it appears, so it is already in the right place when it
       does, rather than snapping into position on the first scroll event. */
    { rootMargin: "100% 0px 100% 0px" },
  );
  return observer;
}

/**
 * Starts writing `--pass` on an element. Returns the matching teardown.
 *
 * Callers that have asked for reduced motion should simply not call this: the
 * property is then never written, and every rule reading it falls back to the
 * 0.5 it is authored against — the mid-scroll, at-rest position.
 *
 * The name matters: `--p` is already taken, by the Overture's opening sequence,
 * and it is written on the document element, so it inherits into everything.
 */
export function observeScene(el: HTMLElement): () => void {
  if (typeof IntersectionObserver === "undefined") return () => {};

  ensureDriver();
  const io = ensureObserver();
  io.observe(el);

  /* Take the first reading now rather than on the first frame. A scene that is
     already on screen when it mounts would otherwise spend a frame at the
     `0.5` fallback and then jump to its real position — a visible twitch on a
     plate the reader is looking at. One layout read per scene, once. */
  measureOne(el, window.innerHeight);
  /* And again on the next frame. The reading above can land before the layout
     has settled — a web font still swapping, an image yet to be given its
     box — and the observer's first delivery is not guaranteed to be soon
     enough to be the thing that corrects it. */
  schedule();

  return () => {
    io.unobserve(el);
    active.delete(el);
  };
}
