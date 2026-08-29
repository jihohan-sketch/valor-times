import Link from "next/link";

import { RowCard } from "@/components/cards/RowCard";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { getLatest } from "@/data";

export default function NotFound() {
  return (
    <div className="shell py-16 md:py-28">
      <div className="border-b-2 border-ink pb-12">
        <span className="kicker text-red">Error 404</span>
        <h1 className="display-tight mt-5 text-[clamp(3rem,11vw,8rem)]">
          Page not found
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-2">
          The story you were after has moved, been renamed, or never made it past
          the budget meeting.
        </p>
        <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
          <ArrowLink href="/">Back to the front page</ArrowLink>
          <ArrowLink href="/archive">Browse the archive</ArrowLink>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="kicker-lg">Latest instead</h2>
        <div className="mt-5 grid gap-x-14 md:grid-cols-2">
          {getLatest(4).map((article) => (
            <RowCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
