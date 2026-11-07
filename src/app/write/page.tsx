import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

import { Reveal } from "@/components/ui/Reveal";
import { PitchActions } from "@/components/write/PitchActions";
import { categories } from "@/data";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Write for Us",
  description: "Pitch a story to The Valor Times. Every section is open to every grade.",
  path: "/write",
});

/**
 * The pitch email, pre-filled with the four things an editor needs in order to
 * answer. A blank compose window is the reason most pitches never get sent.
 *
 * The prompt is composed here and the two ways of sending it are built in
 * `PitchActions`, which is a client component because one of them copies to
 * the clipboard. See the note at the top of that file for why a bare
 * `mailto:` was not enough on its own.
 */
const PITCH_BODY = [
  "What happened:",
  "",
  "Why it matters now:",
  "",
  "Who I would need to talk to:",
  "",
  "Section I think it fits:",
  "",
  "Name and grade:",
  /* CRLF, not "\n". RFC 6068 §5 requires the line breaks in a mailto body to
     be encoded as %0D%0A, and Outlook on Windows takes it literally: given
     bare %0A it drops the breaks and the reader gets the whole prompt as one
     run-on paragraph, which is worse than no prompt at all. Every other client
     accepts CRLF too, so there is nothing to trade off. */
].join("\r\n");

/* Left open on purpose: the reader finishes the line with what the story is,
   and an editor scanning the inbox reads the subject rather than the sender. */
const PITCH_SUBJECT = "Pitch: ";

/** The four things a pitch has to answer, printed beside the open call. */
const PITCH_CHECKLIST = [
  "What happened, in one sentence.",
  "Why it matters now.",
  "Who you would need to talk to.",
  "Which section you think it belongs in.",
];

/**
 * What actually happens to a pitch. Nothing here promises a turnaround time,
 * a deadline or a desk-editor assignment the paper has not committed to —
 * earlier copy invented all three.
 */
const STEPS = [
  {
    title: "Send a short pitch",
    body: "Not a full draft — just a paragraph. Say what happened, why it matters now, and who you would need to talk to. Three or four sentences is enough.",
  },
  {
    title: "An editor reads it",
    body: "Pitches go to the editors on the masthead. If the idea is not a fit for the issue being put together, they will usually say why and what would help.",
  },
  {
    title: "You write the story",
    body: "Editors will read your draft and push for the details that still need checking: another source, a number, or a person you have not spoken with yet.",
  },
  {
    title: "It runs under your name",
    body: "Every piece carries a byline, and your name appears on the masthead of the issue it runs in.",
  },
];

export default function WritePage() {
  return (
    <>
      <header className="shell pt-12 pb-14 md:pt-20 md:pb-20">
        <div className="grid gap-12 pb-4 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <span className="kicker text-red">Open to every grade</span>
            <h1 className="display-tight mt-5 text-[clamp(2.75rem,9vw,6.5rem)]">
              Write for The Valor Times
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-ink-2">
              You do not need experience or a friend on staff. You need one short
              paragraph and something you have actually noticed around school.
            </p>

            <PitchActions
              email={site.email}
              subject={PITCH_SUBJECT}
              body={PITCH_BODY}
            />
          </div>

          <aside className="lg:col-span-5">
            <div className="border-t-2 border-ink pt-6">
              <h2 className="kicker text-red">Include these four things</h2>
              <ul className="mt-5">
                {PITCH_CHECKLIST.map((item, i) => (
                  <li
                    key={item}
                    className="flex gap-5 border-b border-rule-2 py-4 last:border-b-0"
                  >
                    <span className="ordinal shrink-0 text-lg text-red tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-ink-2">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="meta mt-5">
                Keep it to three or four sentences. Save the full draft for later.
              </p>
            </div>
          </aside>
        </div>
      </header>

      <section className="shell pb-16 md:pb-24" aria-labelledby="how">
        <div className="border-t-2 border-ink pt-5">
          <span className="kicker text-red">The process</span>
          <h2 id="how" className="display mt-3 text-[length:var(--text-section-sm)]">
            How it works
          </h2>
        </div>
        <ol className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} as="li" delay={i * 60}>
              <div className="border-t border-rule-2 pt-5">
                <span className="ordinal text-[2.5rem] text-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-3 text-2xl">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="band bg-shell" aria-labelledby="desks">
        <div className="shell">
          <span className="kicker text-red">Eight sections</span>
          <h2
            id="desks"
            className="display mt-3 text-[length:var(--text-section)]"
          >
            Every section is open
          </h2>
          <p className="mt-5 max-w-xl text-ink-2">
            Pick the section that fits, or pitch something that fits none of
            them. Those are often the best ideas.
          </p>
          <ul className="mt-10 grid gap-x-12 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <li key={category.slug} className="border-t border-rule-2 py-5">
                <h3 className="headline text-lg">{category.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {category.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
