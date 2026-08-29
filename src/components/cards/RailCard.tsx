import Image from "next/image";
import Link from "next/link";

import { Byline } from "@/components/ui/Byline";
import { Kicker } from "@/components/ui/Kicker";
import { isPlate, type Article } from "@/data";

/** Image-first card sized for a horizontal rail. */
export function RailCard({
  article,
  showKicker = true,
  ratio = "portrait",
  width = "w-[76vw] sm:w-[46vw] lg:w-[30vw] xl:w-[25rem]",
}: {
  article: Article;
  showKicker?: boolean;
  ratio?: "portrait" | "landscape";
  width?: string;
}) {
  /* Plates are shown whole, never cropped. They keep the rail's frame rather
     than their own, because ragged card heights read worse than a mount. */
  const plate = isPlate(article);
  const frame = ratio === "portrait" ? "aspect-[4/5]" : "aspect-[3/2]";

  return (
    <article className={`group ${width}`}>
      <Link href={`/article/${article.slug}`} className="block">
        {article.image && (
          <div
            className={`relative ${frame} ${
              plate ? "bg-paper p-3 ring-1 ring-rule-2" : "zoom-frame"
            }`}
          >
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(max-width: 640px) 76vw, (max-width: 1024px) 46vw, 400px"
              className={plate ? "object-contain" : "object-cover"}
            />
          </div>
        )}
        <div className="mt-4">
          {showKicker && <Kicker category={article.category} href={false} />}
          <h3 className="headline mt-2 text-lg text-balance md:text-xl">
            <span className="link-draw">{article.title}</span>
          </h3>
          <p className="mt-2 line-clamp-2 text-[0.9rem] text-ink-2">{article.dek}</p>
          <div className="mt-3">
            <Byline article={article} />
          </div>
        </div>
      </Link>
    </article>
  );
}
