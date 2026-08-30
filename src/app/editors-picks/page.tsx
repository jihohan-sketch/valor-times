import type { Metadata } from "next";

import { EditorsPicks } from "@/components/home/EditorsPicks";
import { WriteForUs } from "@/components/home/WriteForUs";
import { getEditorsPicks } from "@/data";

export const metadata: Metadata = {
  title: "Editor's Picks",
  description:
    "The Valor Times stories the editors would hand a new reader first, in their order.",
};

export default function EditorsPicksPage() {
  const picks = getEditorsPicks(12);

  return (
    <>
      <header className="shell pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="border-b-2 border-ink pb-8">
          <span className="kicker text-red">Chosen by the desk</span>
          <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">
            Editor&rsquo;s Picks
          </h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <p className="max-w-2xl text-lg leading-relaxed text-ink-2">
              A chosen list, not a chart. The editors rank these by hand — the
              readership figure printed beside each one is live, but it is a fact
              about the story, not the reason the story is here.
            </p>
            <p className="kicker text-muted tabular-nums">
              {String(picks.length).padStart(2, "0")} stories
            </p>
          </div>
        </div>
      </header>

      <EditorsPicks articles={picks} showHeader={false} />
      <WriteForUs />
    </>
  );
}
