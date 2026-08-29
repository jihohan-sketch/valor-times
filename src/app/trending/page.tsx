import type { Metadata } from "next";

import { Trending } from "@/components/home/Trending";
import { WriteForUs } from "@/components/home/WriteForUs";
import { getTrending } from "@/data";

export const metadata: Metadata = {
  title: "Trending",
  description: "The twelve Valor Times stories the desk ranks first, in order.",
};

export default function TrendingPage() {
  return (
    <>
      <header className="shell pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="border-b-2 border-ink pb-8">
          <span className="kicker text-red">The desk&rsquo;s ranking</span>
          <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">Trending</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
            The twelve stories the desk would hand a new reader first, in order.
            The view count beside each one is live.
          </p>
        </div>
      </header>

      <Trending articles={getTrending(12)} showHeader={false} />
      <WriteForUs />
    </>
  );
}
