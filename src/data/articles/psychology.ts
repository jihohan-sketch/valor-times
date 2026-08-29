import type { Article } from "../types";

/** Psychology. Add a story by copying any object below. */
export const psychology: Article[] = [
  {
    slug: "why-cramming-feels-like-learning",
    title: "Why Cramming Feels Like Learning, and Is Not",
    dek: "Fluency is a trap. The strategies that feel worst while you use them are the ones that survive to the exam.",
    category: "psychology",
    authorSlug: "hana-brennan",
    date: "2026-07-09",
    image: "/images/why-cramming-feels-like-learning.svg",
    imageAlt: "Abstract editorial illustration of halftone dots and a red panel",
    tags: ["memory", "study", "psychology"],
    content: `Rereading a chapter until it feels smooth is the most popular study method in this building and one of the weakest, and the reason is a specific cognitive error with a name.

## Fluency is not knowledge

When material feels easy to process, we infer that we know it. That inference is unreliable. Processing fluency rises with familiarity, and familiarity rises with exposure whether or not anything was encoded in a retrievable way.

A highlighted page is a familiar page. Familiarity is what you feel; retrieval is what the exam asks for.

> Students consistently predicted higher performance from the method that produced lower performance. The prediction tracked how easy the studying felt.

## Desirable difficulty

The counterintuitive finding, replicated widely, is that conditions which make studying harder in the moment often improve long-term retention. The label for this is desirable difficulty.

Three of them have strong support:

- Retrieval practice: testing yourself instead of reviewing
- Spacing: the same total minutes, spread across days
- Interleaving: mixing problem types rather than blocking them

All three feel worse while you do them. Interleaving in particular produces noticeably more errors during practice and better performance later, which is a hard sell to someone watching themselves get things wrong.

## The spacing effect in practice

Four one-hour sessions across four days beat one four-hour session, on essentially every measure, for essentially every kind of material. The effect is one of the most robust in the field and one of the least used.

The obstacle is not disbelief. It is that spacing requires deciding on Monday to work on something due Friday, and cramming does not.

## What to actually do

- Close the book and write what you remember before reviewing
- Turn headings into questions and answer them cold
- Mix chapters in a single session even though it hurts
- Treat the sensation of difficulty as a signal that it is working, not that it is failing

The last one is the whole thing. The discomfort is the mechanism, not a side effect.`,
  },
  {
    slug: "attention-residue",
    title: "Attention Residue: The Hidden Cost of a Single Notification",
    dek: "The interruption takes four seconds. What it does to the next twenty minutes is the part the research is interested in.",
    category: "psychology",
    authorSlug: "hana-brennan",
    date: "2026-05-30",
    image: "/images/attention-residue.svg",
    imageAlt: "Abstract editorial illustration of stripes and a red aperture",
    tags: ["attention", "psychology", "technology"],
    content: `You do not lose the four seconds. You lose part of what comes after them, and you generally do not notice which part.

## The concept

Attention residue describes what happens when you switch tasks before the first task is finished: a portion of attention stays with the unfinished thing. Performance on the new task drops, and the drop persists past the moment of switching.

The effect is larger when the interrupted task was left at an ambiguous stopping point — which is exactly what a notification does, since it arrives mid-sentence rather than at a boundary.

> The cost is not the interruption. It is the incomplete state the interruption leaves behind.

## Why the phone in the bag still costs something

Several studies have found performance differences based on phone location alone, with the device silenced and face down. The proposed mechanism is that suppressing the impulse to check consumes the same limited resource the task needs.

The findings here are more contested than the core switching research, and effect sizes vary. But the direction is consistent enough that the practical advice does not change much: distance beats willpower.

## The classroom version

An interruption in a fifty-minute class is more expensive than the same interruption in a three-hour block, because the recovery period is a larger fraction of the total.

- Notification arrives: about 4 seconds of overt attention
- Measured recovery to prior performance: often several minutes
- In a 50-minute period, three interruptions can touch a third of the session
- Interruptions at a task boundary cost far less than mid-task ones

## What helps

Batching is the intervention with the best support: check deliberately, at boundaries you choose, rather than reactively. Closing the loop before switching also helps — finishing the sentence, writing the next step down — because it removes the ambiguity that the residue attaches to.

Neither requires the willpower that "just ignore it" does, which is the point.`,
  },
  {
    slug: "shared-grade-portal-comparison",
    title: "The Grade Portal Is a Comparison Machine, and It Is Winning",
    dek: "Checking your grade eleven times a day does not change your grade. Research on social comparison suggests it changes something else.",
    category: "psychology",
    authorSlug: "ivy-tanaka",
    date: "2026-08-22",
    image: "/images/shared-grade-portal-comparison.svg",
    imageAlt: "Editorial illustration of a rising column of red bars flattening out",
    tags: ["attention", "school", "wellbeing", "technology"],
    featured: true,
    trendingRank: 5,
    content: `The portal refreshes every time you pull down on it. There is nothing new. You know there is nothing new. You pull down anyway.

In an informal survey of 143 students conducted by this paper in March, the median reported number of daily portal checks was seven. The top decile reported more than twenty.

## What the research describes

The mechanism has a name. Leon Festinger called it social comparison theory in 1954, and the version that matters here is the upward comparison: measuring yourself against someone doing better, which reliably predicts lower self-evaluation and, in school settings, lower persistence on hard tasks.

The portal does not show you other students' grades. It does not have to. It shows you a number that moves, and the moving number is enough to sustain the checking behaviour on its own — a variable-ratio schedule, which is the most durable reinforcement pattern psychology has documented.

> A slot machine that occasionally tells you about your future is a very good slot machine.

That is how our AP Psychology teacher, Dr. Naomi Ferreira, described it when we brought her the survey numbers.

## The part that is measurable

Students who reported more than ten daily checks also reported, on average, 1.4 fewer hours of sleep on school nights than students who reported fewer than three.

That is a correlation in a small self-reported sample, and it should be read as one. It is not evidence that checking causes sleep loss. It is evidence that the two travel together, which is worth knowing.

- Students surveyed: 143
- Median daily portal checks: 7
- Top-decile checks: 20+
- Sleep gap between high and low checkers: 1.4 hours

## What actually helps

The interventions with the best evidence behind them are boring. Batching — deciding you will look twice a day, at set times — outperforms willpower, because it converts a decision you make twenty times into a decision you make once.

Turning off push notifications for the portal is the other one. Six students who tried it for two weeks at our request reported a median drop from nine daily checks to three.

Five of them turned notifications back on afterward.`,
  },
  {
    slug: "why-group-projects-break-at-four",
    title: "Why Group Projects Break Down at Exactly Four People",
    dek: "The effect has been measured since 1913, it has a name, and your teacher's rubric does not account for it.",
    category: "psychology",
    authorSlug: "ivy-tanaka",
    date: "2026-07-25",
    image: "/images/why-group-projects-break-at-four.svg",
    imageAlt: "Editorial illustration of four squares, one drifting out of alignment",
    tags: ["motivation", "groups", "academics"],
    content: `In 1913 a French agricultural engineer named Maximilien Ringelmann asked groups of men to pull on a rope and measured how hard each one pulled.

Two men pulled at 93 percent of their individual capacity. Three pulled at 85. Eight pulled at 49.

## Social loafing, named

The finding sat unexamined for sixty years before psychologists picked it up and called it social loafing: as group size rises, individual effort falls, and it falls faster than anyone predicts.

The mechanism is not laziness. It is identifiability. When your specific contribution cannot be separated from the group's output, effort drops — including your own, including when you believe you are working hard.

> Nobody in the study thought they were slacking. That is the whole finding.

## Where four comes from

The curve is not linear. In the classic replications the drop is modest at two and three, and steepens sharply somewhere between four and five, because that is roughly the group size at which individual contributions stop being visible to every member at once.

Four is also, in our unscientific survey of thirty-one students, the most common assigned group size in this building.

- Ringelmann's rope, 2 people: 93 percent effort each
- 3 people: 85 percent
- 8 people: 49 percent
- Most common assigned group size here: 4

## What breaks the effect

The literature is unusually consistent about the fix, and it is not "assign roles."

It is making individual contribution visible and evaluable. Groups where each member's specific piece is separately graded show effort levels close to individual work. Groups given a single shared grade show the full Ringelmann drop.

The second fix is smaller groups. Three does most of what four does, at meaningfully less cost.

Neither of these is a thing students control. Both are a thing rubrics control.`,
  },
  {
    slug: "psychology-of-the-front-row",
    title: "The Front Row Is Not About Confidence",
    dek: "Where you sit predicts your grade. The interesting question is which direction the arrow points.",
    category: "psychology",
    authorSlug: "ivy-tanaka",
    date: "2026-06-21",
    image: "/images/psychology-of-the-front-row.svg",
    imageAlt: "Editorial illustration of a seating grid with the front rank picked out in red",
    tags: ["attention", "classrooms", "research"],
    content: `The correlation is old and robust: students in the front third of a classroom get better grades than students in the back third. It shows up in studies going back to the 1920s and it survives most attempts to explain it away.

The explanation everyone reaches for is that confident, engaged students choose the front. That explanation has a problem: the effect persists when seats are assigned at random.

## The randomised versions

Several studies have removed choice from the equation, assigning seats by lottery and tracking outcomes. The front-row advantage shrinks, but does not vanish. In one 2011 university replication it held at roughly a third of its observational size.

So part of it is selection — motivated students do sit forward. And part of it is the seat.

> If you move a student forward and their participation goes up, the room did that, not the student.

## What the room is doing

Three mechanisms have decent support. Proximity raises the probability of eye contact, which raises the probability of being called on, which raises preparation. Distance from the board degrades note-taking accuracy in ways students do not notice. And the back of a room contains more visual competition — doors, windows, other students' screens.

The third one is the largest in the classroom studies, which is inconvenient, because it is the one furthest from anything a student decides.

- Front-third advantage, observational studies: consistent since the 1920s
- Effect surviving random seat assignment: roughly one third
- Largest single mechanism: visual competition, not motivation

## The honest version

None of this means moving forward will raise your grade by a letter. The randomised effect sizes are small.

It means the row is not a personality test. People read the back row as a statement about a student, and mostly it is a statement about who arrived when the door opened.`,
  },
  {
    slug: "perfectionism-is-not-a-trait",
    title: "Perfectionism Is Not a Personality Trait",
    dek: "It is two different things wearing the same word, and only one of them is a problem.",
    category: "psychology",
    authorSlug: "hana-brennan",
    date: "2026-05-24",
    image: "/images/perfectionism-is-not-a-trait.svg",
    imageAlt: "Editorial illustration of a red line splitting cleanly into two paths",
    tags: ["wellbeing", "motivation", "research"],
    content: `When a student says they are a perfectionist, they usually mean it as a diagnosis and half a compliment. The research literature has spent thirty years arguing that the word is doing too much work.

The current consensus splits it in two.

## Strivings and concerns

Perfectionistic strivings are the setting of high personal standards. In the data they correlate with better grades, higher persistence, and — this is the part that surprises people — slightly better wellbeing.

Perfectionistic concerns are the fear of falling short of those standards, and the belief that falling short means something about you. These correlate with anxiety, procrastination, and worse outcomes on almost everything measured.

> The standards are not hurting anyone. The scoreboard attached to the standards is.

Most people carry both. The ratio is what varies.

## Why it gets misdiagnosed

The two look identical from outside. A student rewriting an essay for the fifth time could be doing it because the fourth version was genuinely not good, or because submitting it feels like a verdict.

Same behaviour, opposite psychology, opposite outcomes.

- Strivings: high standards. Correlate with performance and persistence.
- Concerns: fear of shortfall. Correlate with anxiety and procrastination.
- Most people report both; the ratio predicts outcomes better than either alone.

## The useful question

Clinicians who work with this distinction tend to ask one thing: what happens after the work is submitted?

Students high in strivings and low in concerns generally stop thinking about it. Students high in concerns keep the file open.

That is not a rigorous instrument. It is, according to two counsellors we spoke with, a reasonable first question to ask yourself before you decide that being a perfectionist is simply who you are.`,
  },
];
