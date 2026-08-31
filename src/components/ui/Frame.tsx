import Image from "next/image";

import { aspectOf } from "@/data/image-sizes";
import { isMount, plateAspect } from "@/data/plate";
import type { Article } from "@/data/types";

/**
 * One story's artwork, framed the way that kind of artwork needs.
 *
 * A photograph fills its band and is cropped to it — that is what the cinematic
 * ratios on the front page are for — and so is a clipping of printed type. A
 * clipping contained in a card is a whole newspaper page shrunk to the width of
 * a thumbnail: an unreadable grey rectangle standing next to a photograph, with
 * a band of empty paper above and below it. Cropping one costs the edges of a
 * headline; containing one costs the reader the picture entirely, and the story
 * page still prints the clipping whole.
 *
 * The drawn Comics & Bible pages are the exception and are contained on a paper
 * mount sized to the plate itself — see isMount and plateAspect. A crop there
 * takes the last panel off a strip, which is the joke.
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
  const plate = isMount(article);

  const image = (
    <Image
      src={article.image}
      alt={article.imageAlt}
      fill
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      className={plate ? "object-contain" : "object-cover object-center"}
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
