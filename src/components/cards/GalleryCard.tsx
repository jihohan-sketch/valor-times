import Image from "next/image";
import Link from "next/link";

import { authorBySlug, type Article } from "@/data";
import { formatDateShort } from "@/lib/format";

/**
 * Artwork first, and by a long way. Used for Comics & Bible, where the plate
 * is the story and the type underneath is a caption rather than a headline.
 */
export function GalleryCard({
  article,
  tone = "ink",
  width = "w-[86vw] sm:w-[58vw] lg:w-[40vw] xl:w-[34rem]",
}: {
  article: Article;
  tone?: "ink" | "paper";
  width?: string;
}) {
  const onPaper = tone === "paper";
  const author = authorBySlug[article.authorSlug];
  const isStrip = article.slug.startsWith("comic-");

  return (
    <figure className={`group ${width}`}>
      <Link href={`/article/${article.slug}`} className="block">
        <div
          className={`zoom-frame relative aspect-[3/2] bg-paper ring-1 ${
            onPaper ? "ring-paper/15" : "ring-ink/10"
          }`}
        >
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 58vw, 544px"
            className="object-cover"
          />
        </div>

        <figcaption className="mt-4 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3
              className={`display text-[1.4rem] leading-tight text-balance md:text-[1.75rem] ${
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
            {isStrip ? "Strip" : "Reading"}
          </span>
        </figcaption>
      </Link>
    </figure>
  );
}
