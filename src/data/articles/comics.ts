import type { Article } from "../types";

/**
 * The back page: the comic strips and the Bible section. These pages are drawn
 * rather than typed, so each entry carries the strip itself as its image and
 * transcribes the lettering printed inside the panels.
 */
export const comics: Article[] = [
  {
    slug: "comics-bible-philippians",
    title: "Comics / Bible: Philippians 4:13",
    dek: '"I can do all things through Christ who strengthens me." A six-panel strip about a hard test.',
    category: "comics",
    authorSlug: "hannah-cho",
    date: "2026-06-01",
    issueSlug: "vol4-no7",
    page: 4,
    image: "/photos/comics-bible-philippians.jpg",
    imageAlt:
      "Six-panel comic: a student struggling with a test, praying, and finishing it with strength",
    tags: ["comics", "Bible"],
    content: `TODAY'S VERSE: "I can do all things through Christ who strengthens me." — Philippians 4:13

The panels, in order:

- "This test is so hard… I don't think I can do it."
- "I need to remember what God says."
- "Lord, help me trust You and do my best. You give me strength!"
- LATER… "He gave me strength and helped me do my best!"
- "With Jesus, we can face anything! He strengthens us every step of the way!"`,
  },
  {
    slug: "noahs-ark-bible-section",
    title: "Bible Section: Noah's Ark",
    dek: "Build an ark, Noah. Bring 2 of every animal.",
    category: "comics",
    authorSlug: "dongyun-hwang",
    date: "2026-02-01",
    issueSlug: "vol4-no1",
    page: 7,
    image: "/photos/noahs-ark-bible-section.jpg",
    imageAlt: "A drawn Bible-section page telling the story of Noah's Ark in panels",
    tags: ["comics", "Bible"],
    content: `The lettering printed across the panels, in order:

- "Build an ark, Noah! Bring 2 of every animal"
- "Time for the animals to come aboard!"
- "It's raining so much!"
- "God will keep us safe!"
- "Look, the rain stopped!"`,
  },
  {
    slug: "bible-section-the-lord-is-my-shepherd",
    title: "Bible Section: Psalm 23:1",
    dek: '"The Lord is my shepherd; I lack nothing." Also: can you find all the purple?',
    category: "comics",
    authorSlug: "hailey-hong",
    date: "2025-12-01",
    issueSlug: "vol3-no21",
    page: 9,
    image: "/photos/bible-section-the-lord-is-my-shepherd.jpg",
    imageAlt: "An illustrated Bible-section panel of a shepherd and a flock of sheep",
    tags: ["comics", "Bible"],
    content: `"The Lord is my shepherd; I lack nothing." — Psalm 23:1

The page is drawn as a set of pastoral panels — a shepherd calling "COME!", a flock crossing green hills, a still lake captioned "peace" — with a hidden-object game printed in the corner: "can you find all the purple?"`,
  },
  {
    slug: "bible-verse-of-the-month",
    title: "Bible Verse of the Month",
    dek: "Matthew 6:6. Prayer is talking to God with your heart.",
    category: "comics",
    authorSlug: "dongyun-hwang",
    date: "2025-11-01",
    issueSlug: "vol3-no20",
    page: 9,
    image: "/photos/bible-verse-of-the-month.jpg",
    imageAlt: "Hands resting on an open Bible",
    tags: ["Bible"],
    content: `> "But when you pray, go into your room, close the door and pray to your Father, who is unseen. Then your Father, who sees what is done in secret, will reward you."

MATTHEW 6:6 (NIV)

Prayer is talking to God with your heart. Even at school or home, pause for a moment and say, "Thank You, God."`,
  },
  {
    slug: "bible-comics-how-to-pray",
    title: "Bible Comics: How to Pray",
    dek: "Three steps — praise, repent, ask help — drawn across four panels.",
    category: "comics",
    authorSlug: "hailey-hong",
    date: "2025-11-01",
    issueSlug: "vol3-no20",
    page: 8,
    image: "/photos/bible-comics-how-to-pray.jpg",
    imageAlt: "A four-panel comic titled How to Pray, in orange and yellow",
    tags: ["comics", "Bible"],
    content: `HOW to PRAY

- STEP 1 — Praise. "Start with praise." / "Thank You, God, always."
- STEP 2 — Repent. "I'm sorry for the times I hurt others…"
- STEP 3 — Ask help. "Please help me to be kind and brave." / "Amen"`,
  },
];
