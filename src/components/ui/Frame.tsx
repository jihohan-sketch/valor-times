import Image from "next/image";

import { aspectOf } from "@/data/image-sizes";
import { isPlate, plateAspect } from "@/data/plate";
import type { Article } from "@/data/types";

/**
 * One story's artwork, framed the way that kind of artwork needs.
 *
 * A photograph fills its band and may be cropped to it — that is what the
 * cinematic ratios on the front page are for. A plate may not: plates are the
 * drawn Comics & Bible pages and the clippings of printed type that stand in
 * for a photo on stories that never had one, and both carry words. Cropping
 * one cuts a headline in half or loses the last panel of a strip. So plates
 * are contained on a paper mount in a frame sized to the plate itself — see
 * plateAspect — so nothing is cropped and no band of empty paper is left under
 * it. A photograph needs no such care: it is cropped to whatever the layout
 * asks for.
 *
 * `natural` frames the plate at the exact proportions of the file, for the one
 * place where nothing has to line up beside it — the top of an article.
 */
export function Frame({
  article,
  ratio,
  sizes,
  priority = false,
  natural = false,
}: {
  article: Article;
  /** Tailwind aspect class used for photographs, e.g. "aspect-[21/9]". */
  ratio: string;
  sizes: string;
  priority?: boolean;
  natural?: boolean;
}) {
  const plate = isPlate(article);

  const image = (
    <Image
      src={article.image}
      alt={article.imageAlt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      className={plate ? "object-contain" : "object-cover"}
    />
  );

  if (!plate) {
    return <div className={`zoom-frame relative ${ratio}`}>{image}</div>;
  }

  return (
    <div
      className={`relative bg-paper p-2.5 ring-1 ring-rule-2 transition-colors duration-300 group-hover:ring-ink md:p-4 ${
        natural ? "w-full" : plateAspect(article)
      }`}
      style={natural ? { aspectRatio: aspectOf(article.image) } : undefined}
    >
      {image}
    </div>
  );
}
