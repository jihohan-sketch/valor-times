import Image from "next/image";
import Link from "next/link";

import { authorBySlug, type Article } from "@/data";
import { isStrip } from "@/data/plate";
import { formatDateShort } from "@/lib/format";

/**
 * Artwork first, and by a long way. Used for Comics & Bible, where the plate
 * is the story and the type underneath is a caption rather than a headline.
 *
 * The plates are drawn pages, not photographs: they come out of the PDF tall
 * (up to 1200×1670) and a strip that is cropped has lost its last panel. So
 * the frame is portrait and the image is *contained* inside it, mounted on
 * paper. Whatever the plate's own proportions, all of it is on screen.
 */
export function GalleryCard({
  article,
  tone = "ink",
  width = "w-[74vw] sm:w-[44vw] lg:w-[27vw] xl:w-[23rem]",
}: {
  article: Article;
  tone?: "ink" | "paper";
  width?: string;
}) {
  const onPaper = tone === "paper";
  const author = authorBySlug[article.authorSlug];
  const strip = isStrip(article);

  return (
    <figure className={`group ${width}`}>
      <Link href={`/article/${article.slug}`} className="block">
        <div
          className={`relative aspect-[3/4] overflow-hidden bg-paper p-3 ring-1 md:p-4 ${
            onPaper ? "ring-paper/15" : "ring-ink/10"
          }`}
        >
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="(max-width: 640px) 74vw, (max-width: 1024px) 44vw, 368px"
            className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>

        <figcaption className="mt-4 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3
              className={`display text-[1.3rem] leading-tight text-balance md:text-[1.55rem] ${
                onPaper ? "text-paper" : ""
              }`}
            >
              <span className="link-draw">{article.title}</span>
            </h3>
            <p className={`meta mt-2 ${onPaper ? "text-paper/55" : ""}`}>
              <span className={onPaper ? "text-paper/90" : "text-ink-2"}>{author?.name}</span>
              <span className="mx-2 opacity-40">/</span>
              {formatDateShort(article.date)}
            </p>
          </div>
          <span className="kicker mt-1 shrink-0 text-red">
            {strip ? "Strip" : "Reading"}
          </span>
        </figcaption>
      </Link>
    </figure>
  );
}
