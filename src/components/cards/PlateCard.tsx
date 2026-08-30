import Image from "next/image";
import Link from "next/link";

import { authorBySlug, type Article } from "@/data";
import { aspectOf } from "@/data/image-sizes";
import { isStrip } from "@/data/plate";
import { formatDateShort } from "@/lib/format";

/**
 * A drawn plate in a grid rather than on a rail.
 *
 * Same rule as GalleryCard — the artwork is a document, so it is never cropped
 * — but with the freedom a grid gives that a shelf does not: the frame simply
 * takes the file's own `aspect-ratio` and the row is as tall as its tallest
 * card. Nothing is contained inside a guessed box, so no plate carries a band
 * of dead paper above and below it.
 */
export function PlateCard({ article }: { article: Article }) {
  const author = authorBySlug[article.authorSlug];

  return (
    <figure className="group">
      <Link href={`/article/${article.slug}`} className="block">
        <div
          className="card-lift relative bg-paper p-3 ring-1 ring-rule-2 transition-colors duration-300 group-hover:ring-ink md:p-4"
          style={{ aspectRatio: aspectOf(article.image) }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
            />
          </div>
        </div>

        <figcaption className="mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3 className="display text-[1.3rem] leading-tight text-balance md:text-[1.5rem]">
              <span className="link-draw">{article.title}</span>
            </h3>
            <p className="meta mt-2">
              <span className="text-ink-2">{author?.name}</span>
              <span className="mx-2 opacity-40">/</span>
              {formatDateShort(article.date)}
            </p>
          </div>
          <span className="kicker mt-1 shrink-0 text-red">
            {isStrip(article) ? "Strip" : "Reading"}
          </span>
        </figcaption>
      </Link>
    </figure>
  );
}
