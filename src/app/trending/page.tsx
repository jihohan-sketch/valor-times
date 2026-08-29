import type { Metadata } from "next";

import { Trending } from "@/components/home/Trending";
import { WriteForUs } from "@/components/home/WriteForUs";
import { getTrending } from "@/data";

export const metadata: Metadata = {
  title: "Trending",
  description: "The most-read stories in the Valor Times this week.",
};

export default function TrendingPage() {
  return (
    <>
      <header className="shell pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="border-b-2 border-ink pb-8">
          <span className="kicker text-red">Most read this week</span>
          <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">Trending</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
            Ranked by what students actually opened, argued about and sent to each
            other. Updated every Monday morning.
          </p>
        </div>
      </header>

      <Trending articles={getTrending(12)} />
      <WriteForUs />
    </>
  );
}
