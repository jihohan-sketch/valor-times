import { categoryBySlug } from "./categories";
import type { Article } from "./types";

/**
 * True for stories whose artwork is a page rather than a photograph: the drawn
 * Comics & Bible plates, and the clippings of printed type that stand in for a
 * photo on stories that never had one. Both carry words, so layouts must
 * contain them rather than crop them to a band.
 *
 * This lives apart from the `@/data` barrel so client components can ask the
 * question without pulling the newsroom desk's file store into the bundle.
 */
export function isPlate(article: Pick<Article, "category" | "plate">): boolean {
  return (
    article.plate === true || categoryBySlug[article.category]?.layout === "gallery"
  );
}

/**
 * True for the drawn comic strips, false for the Bible readings that run
 * beside them on the back page. The strips carry the "comics" tag; a reading
 * is tagged only "Bible".
 */
export function isStrip(article: Pick<Article, "tags">): boolean {
  return article.tags.includes("comics");
}

/**
 * True when the artwork is a clipping of printed type rather than a drawn
 * comics page. The two behave differently in a frame: clippings come out of
 * the PDF at almost exactly 3:2, the comics pages are portrait, nearer 3:4.
 */
export function isClipping(article: Pick<Article, "plate">): boolean {
  return article.plate === true;
}

/**
 * The frame a plate fits without either cropping the type or leaving a band of
 * empty paper under it. Photographs need no equivalent — they are cropped to
 * whatever frame the layout wants, so a frame containing plates should be
 * sized for the plates.
 */
export function plateAspect(
  article: Pick<Article, "plate">,
): "aspect-[3/2]" | "aspect-[3/4]" {
  return isClipping(article) ? "aspect-[3/2]" : "aspect-[3/4]";
}
