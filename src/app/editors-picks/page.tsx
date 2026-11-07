import type { Metadata } from "next";

import { EditorsPicks } from "@/components/home/EditorsPicks";
import { WriteForUs } from "@/components/home/WriteForUs";
import { getEditorsPicks, getEditorsPicksMode } from "@/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Editor's Picks",
  description: "Stories from across The Valor Times, chosen by the editors or rotated weekly.",
  path: "/editors-picks",
});

/* What the header says depends on how the list was made, so the page never
   claims a hand-picked list it does not have. See `editors-picks.ts`. */
const COPY = {
  "hand-picked": {
    kicker: "Chosen by the editors",
    body: "Stories from across the paper that the editors want you to read. The view count next to each one is live, but the list is not ranked by popularity.",
  },
  issue: {
    kicker: "This week",
    body: "This week's list is the newest issue, in the order it was printed.",
  },
  rotation: {
    kicker: "Changes every Monday",
    body: "A rotating set of stories from across the paper. A new set is drawn automatically every Monday; it is not ranked by views.",
  },
} as const;

export default function EditorsPicksPage() {
  const picks = getEditorsPicks(12);
  const copy = COPY[getEditorsPicksMode()];

  return (
    <>
      <header className="shell pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="border-b-2 border-ink pb-8">
          <span className="kicker text-red">{copy.kicker}</span>
          <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">
            Editor&rsquo;s Picks
          </h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <p className="max-w-2xl text-lg leading-relaxed text-ink-2">{copy.body}</p>
            <p className="kicker text-muted tabular-nums">
              {picks.length} {picks.length === 1 ? "story" : "stories"}
            </p>
          </div>
        </div>
      </header>

      <EditorsPicks articles={picks} showHeader={false} />
      <WriteForUs />
    </>
  );
}
