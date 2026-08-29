import type { Article } from "./types";

/**
 * The whole newsroom lives in this array.
 *
 * To publish a story: copy any object below, change the fields, and drop a new
 * image into /public/images (or point `image` at any URL). Nothing else in the
 * codebase needs to change — routes, category pages, search, trending and the
 * homepage all read from here.
 */
export const articles: Article[] = [
  // ─────────────────────────────────────────────────────────── News ──
  {
    slug: "district-rewrites-phone-policy",
    title: "The District Rewrote Its Phone Policy. Here Is What Actually Changed.",
    dek: "Pouches are out. Teacher discretion is in. After a year of pilot programs, three committee drafts and one very long public comment session, the new rules take effect in September.",
    category: "news",
    authorSlug: "daniel-suh",
    date: "2026-08-27",
    image: "/images/district-rewrites-phone-policy.svg",
    imageAlt: "Abstract editorial illustration of overlapping planes in red and black",
    tags: ["policy", "administration", "student life"],
    featured: true,
    trendingRank: 1,
    content: `The policy that governs where your phone sits between 8:10 a.m. and 3:25 p.m. is now four pages shorter than it was in June, and considerably harder to summarize in a single sentence.

That has not stopped people from trying. In the week since the board published the final text, the version circulating in group chats has been some form of "phones are banned now," which is not what the document says.

## What the document says

The new policy replaces a district-wide storage requirement with what the board calls a "classroom-level standard." Phones must be out of sight and silenced during instructional time. Where they are stored — a caddy, a bag, a pocket — is left to the individual teacher.

Passing periods and lunch are explicitly carved out. So is any use directed by a teacher for coursework, which was the single largest source of confusion under the pilot.

> We were writing exceptions faster than we were writing rules. At some point you have to admit the framework is wrong.

That was board member Renata Oyelowo during the July work session, arguing against the pouch model the district piloted in four classrooms last spring.

## Why the pouches lost

The pilot's own data did not help its case. Of the 118 students in pouch classrooms, staff logged 41 storage violations over eleven weeks — roughly one every other day per room. The comparison rooms, which used an ordinary phone caddy by the door, logged nine.

Administrators also flagged a practical problem nobody anticipated in the planning documents: the pouches took four to six minutes to distribute and collect. Across a six-period day, that is most of a class.

- Instructional time: phones silenced and out of sight
- Passing periods and lunch: unrestricted
- Teacher-directed use: permitted, at the teacher's discretion
- Repeat violations: referred to a dean rather than confiscated

## The part students noticed

The enforcement ladder is the section that generated the most public comment, and it is the section that changed the most between the second and final drafts.

Under the June draft, a third violation in a single term triggered an automatic parent conference. The final text removes the automatic trigger and replaces it with a dean referral, which is the same process the school already uses for tardies.

Assistant principal Dara Whitfield said the change was deliberate. "We heard from families that an automatic conference was going to fall hardest on the students who already have the least flexible schedules," she said. "The referral gives us room to look at the situation."

## What happens in September

Teachers received the final text during the August in-service and are expected to post their classroom standard by the end of the first week. Students should expect the standard to look different in different rooms, which the board acknowledges is the point and critics say is the problem.

The policy is scheduled for review in January.`,
  },
  {
    slug: "board-approves-late-start-schedule",
    title: "Board Approves a Late-Start Schedule, and the Buses Have Opinions",
    dek: "A 45-minute shift passed 5–2 on Tuesday. The transportation department now has fourteen weeks to redraw every route in the district.",
    category: "news",
    authorSlug: "amara-oyelaran",
    date: "2026-08-21",
    image: "/images/board-approves-late-start-schedule.svg",
    imageAlt: "Abstract editorial illustration of concentric arcs in red and black",
    tags: ["schedule", "board", "sleep"],
    trendingRank: 4,
    content: `The first bell moves to 8:55 a.m. in January. That is the short version of a proposal that took nineteen months, two consultants and a survey with a 71 percent response rate to get through a five-person majority.

## The vote

The measure passed 5–2, with the dissenting members citing transportation costs rather than the schedule itself. Neither argued against the underlying research.

That research is not new. Adolescent circadian rhythms shift later during puberty, which means a 7:30 a.m. start asks a sixteen-year-old to do calculus at what their body registers as the middle of the night.

> Nobody on this board disputes the science. We are arguing about buses. Let us be honest about which argument we are having.

## What it costs

The district runs three tiers of bus routes, staggered so the same drivers can cover elementary, middle and high school. Moving one tier moves all of them.

Transportation director Sam Ochieng told the board that a clean implementation requires either eleven additional drivers or a redesign that pushes elementary dismissal to 2:15 p.m. The board directed him to return in October with both options priced.

- Current first bell: 8:10 a.m.
- New first bell: 8:55 a.m.
- Dismissal moves from 3:25 p.m. to 4:05 p.m.
- Athletics practice windows shorten by roughly 30 minutes

## The athletics problem

Coaches raised the shortened practice window in public comment, and it is a real constraint: fields without lights become unusable in November at 4:45 p.m.

Athletic director Colleen Barr said her department has asked for lighting on the lower field as a capital request. That request has been submitted, unfunded, in each of the last four budget cycles.

## What comes next

October brings the transportation report. Families will receive route information in December. The schedule takes effect with the start of the second semester.`,
  },
  {
    slug: "record-turnout-student-election",
    title: "Record Turnout Reshapes the Student Government Election",
    dek: "Sixty-eight percent of the student body voted — the highest in at least a decade. The winning ticket ran on a single, unglamorous issue.",
    category: "news",
    authorSlug: "sofia-marchetti",
    date: "2026-08-18",
    image: "/images/record-turnout-student-election.svg",
    imageAlt: "Abstract editorial illustration of a halftone dot field beside a red block",
    tags: ["elections", "student government"],
    content: `The winning campaign did not have a slogan. It had a spreadsheet.

Nadia Ferreira and Owen Castellanos ran on club funding transparency, which is not a phrase that fits on a poster, and won with 54 percent in a four-way race.

## The turnout

Sixty-eight percent of eligible students cast a ballot, up from 41 percent last year and the highest figure in the records the activities office keeps, which go back ten years.

Activities coordinator Bea Lindqvist attributes most of the jump to a scheduling change: voting was open during both lunch periods across two days rather than one.

> When you make something take ninety seconds instead of a trip to the office, people do it. That is the whole finding.

## What they ran on

The Ferreira–Castellanos platform has three planks, all procedural:

- Publish the club budget allocation before the vote, not after
- Set a standing appeals window for clubs that get zero
- Move the funding meeting out of a period when half the club presidents are in class

None of it is thrilling. All of it addresses a complaint that has surfaced in student council minutes every year since 2021.

## The other campaigns

The second-place ticket, Marisol Duran and Kwame Ntiri, drew 27 percent on a platform centred on expanding the open-campus policy for juniors — an issue the administration has said repeatedly is not within student government's authority.

Duran said afterward that she intends to keep pushing it anyway, and has asked for a seat on the schedule review committee.

Results were certified Thursday. The new officers take their seats at the first council meeting in September.`,
  },
  {
    slug: "construction-delays-arts-wing",
    title: "Construction Delays Push the Arts Wing to October",
    dek: "A ventilation redesign added eleven weeks. Three departments are teaching out of temporary rooms until it clears inspection.",
    category: "news",
    authorSlug: "daniel-suh",
    date: "2026-08-12",
    image: "/images/construction-delays-arts-wing.svg",
    imageAlt: "Abstract editorial illustration of nested frames around a dark aperture",
    tags: ["construction", "facilities", "arts"],
    content: `The kiln was the problem.

More precisely, the exhaust system for the kiln was the problem, and by the time the mechanical engineer flagged it in May, the ductwork above the ceramics studio had already been installed to a specification that would not pass inspection.

## Eleven weeks

The redesign added eleven weeks to a project that was scheduled to open with the school year. Facilities director Amos Delgado said the district is not paying for the rework, which falls to the contractor under the design-build agreement.

That is the good news. The rest of it is logistics.

## Where classes are meeting

- Ceramics: the old woodshop, without a working kiln, through October
- Band: the auditorium, which has no storage and a stage that is booked for two assemblies
- Digital media: the library's north lab, on a shared schedule

Band director Ines Vukovic has been rolling instrument cases across the building twice a day. "It is fine," she said, in a tone that conveyed several other things.

> We planned for a September opening for two years. Planning for October took an afternoon. The problem is not the date, it is that we found out in May.

## What inspection still requires

The mechanical rough-in passed in early August. Remaining items are the fire alarm tie-in, the final electrical inspection and a certificate of occupancy walkthrough.

Delgado said an October 12 opening is "realistic but not guaranteed," which is the same phrasing he used about September in March.`,
  },
  {
    slug: "debate-team-nationals",
    title: "Debate Qualifies Three for Nationals, a Program First",
    dek: "The team has existed for six years. Until this spring, it had never sent more than one competitor past the district round.",
    category: "news",
    authorSlug: "sofia-marchetti",
    date: "2026-06-19",
    image: "/images/debate-team-nationals.svg",
    imageAlt: "Abstract editorial illustration of vertical columns in red, black and sand",
    tags: ["debate", "competition"],
    content: `Three qualifications in a single season is not a modest improvement over one. It is a different program.

Junia Oyelaran and Rafe Kaminski advanced in policy debate. Sole Ndiaye qualified in original oratory, on a speech about municipal water infrastructure that she has now delivered, by her own count, sixty-one times.

## How the season went

The team went 34–11 across five invitationals, its first winning record. Coach Miriam Adeyemi credits a structural change rather than a talent one: the team started meeting twice a week instead of once.

> You cannot build a case in fifty minutes on a Thursday. That was the entire problem and it took me four years to see it.

## The oratory

Ndiaye's speech makes an argument about deferred maintenance on water systems, which she began researching after a boil notice affected her neighbourhood for nine days in 2024.

She said the hardest part was not the research. It was cutting it to ten minutes.

- Policy: Oyelaran and Kaminski, 4th at districts
- Oratory: Ndiaye, 2nd at districts
- Team record: 34–11
- Nationals: Louisville, in June

The three leave for Louisville with a fundraising total of $6,400, which covers travel but not lodging. The booster club has opened a second drive.`,
  },
  {
    slug: "cafeteria-contract-vote",
    title: "The Cafeteria Contract Goes to a Vote After Two Years of Complaints",
    dek: "The district's food service agreement expires in December. For the first time, the review committee includes students.",
    category: "news",
    authorSlug: "amara-oyelaran",
    date: "2026-06-04",
    image: "/images/cafeteria-contract-vote.svg",
    imageAlt: "Abstract editorial illustration of a bold diagonal split with a red disc",
    tags: ["food service", "board", "contracts"],
    content: `The complaint file is 140 pages. The district has been collecting it since the current vendor took over in 2024, mostly through an online form that almost nobody knew existed until a student posted the link.

Now it is evidence in a contract review.

## The committee

The review committee has nine seats. Two of them, for the first time, belong to students — a change the board approved in April after a petition gathered 812 signatures.

Those seats went to Tomas Ricci and Amelia Boateng, both juniors, both of whom have spent the summer reading procurement documents.

> I did not expect to learn what a per-plate cost model is. I now have opinions about it.

## What the file says

The complaints cluster tightly. Sixty-one percent concern portion size, 22 percent concern the length of the line, and a smaller but persistent group concerns the vegetarian rotation, which has consisted of the same three entrees since the contract began.

The vendor, Halstead Dining Group, disputes the portion figure and says its plates meet federal requirements by weight. Both things can be true: the requirement is a minimum.

## The options

- Renew with Halstead on current terms
- Renew with amended terms on portions and menu rotation
- Rebid the contract, which takes roughly seven months

The committee reports to the board in October. A December vote is scheduled either way, because the current agreement ends whether or not anyone is ready.`,
  },

  // ──────────────────────────────────────────────────────── Culture ──
  {
    slug: "winter-drama-antigone-review",
    title: "In Antigone, the Spring Production Finally Finds Its Nerve",
    dek: "A staging that strips the set to four chairs and a wall, and trusts the cast to carry the rest. Mostly, they do.",
    category: "culture",
    authorSlug: "priya-raghunathan",
    date: "2026-05-22",
    image: "/images/winter-drama-antigone-review.svg",
    imageAlt: "Abstract editorial illustration of overlapping translucent planes",
    tags: ["theatre", "review"],
    featured: true,
    trendingRank: 5,
    content: `There are four chairs on the stage and a plywood wall painted the colour of a bruise. That is the entire set, and it is the best decision this production makes.

Director Callum Whitfield has staged Antigone twice before at this school, both times with columns. The columns were fine. They were also doing work the actors should have been doing.

## The performances

Imogen Vasquez plays Antigone without any of the tremble the part usually collects. Her line readings are flat in a way that takes about ten minutes to parse and then becomes the point: this is a person who decided something a while ago and has stopped arguing with herself about it.

The choice makes the confrontation scenes strange and better. When Creon shouts, she does not shout back.

> The play is not about whether she is right. Everyone in the theatre knows she is right. It is about how long a person can hold a position while the room empties.

Yusuf Adeyemi's Creon is less settled. He is excellent in the second half, when the character starts losing, and merely loud in the first, when he is winning. That may be a directing problem rather than an acting one.

## The chorus

The chorus is five students in street clothes, seated in the front row of the house until they are needed. They stand, speak, and sit back down among the audience.

It is a device that could easily be precious. It is not, because the staging never comments on it.

## What does not work

The lighting design fights the set. A production this stripped needs the light to do the scene changes, and instead there is a long, awkward blackout before the final movement that drains twenty seconds of accumulated tension.

The sound cues are also too literal. We do not need wind.

## Verdict

Uneven, occasionally over-designed at the edges, and anchored by a lead performance that is the most disciplined thing this program has put on stage in four years. Worth the ticket.`,
  },
  {
    slug: "thrift-economy-hallways",
    title: "The Hallway Thrift Economy Is Much Bigger Than You Think",
    dek: "We tracked 60 trades over three weeks. There is a pricing structure, an appraisal system, and one junior who functions as a central bank.",
    category: "culture",
    authorSlug: "priya-raghunathan",
    date: "2026-08-14",
    image: "/images/thrift-economy-hallways.svg",
    imageAlt: "Abstract editorial illustration of a red aperture over striped ground",
    tags: ["style", "students", "trends"],
    trendingRank: 2,
    content: `It starts, as these things do, with a jacket.

The jacket in question is a 1990s Carhartt work coat, faded to the colour of wet cardboard, and over the past eighteen months it has belonged to at least six students. Each transfer involved goods rather than money.

## The rules nobody wrote down

We asked twenty-two students who trade regularly to describe the norms. They agreed on more than we expected.

- Condition is disclosed. Undisclosed damage voids the trade.
- Sentimental provenance raises value. A garment with a story trades up.
- Cash is accepted but slightly frowned upon.
- Trades happen in person, usually near the east stairwell.

Nobody could say where the stairwell convention came from. It predates everyone currently enrolled.

## The appraiser

Junior Farrah Oyelowo has, without seeking it, become the person people ask before agreeing to a trade. She keeps no records and charges nothing.

> I just tell people what I think it is worth. If both of them think I am wrong, they trade anyway. That happens a lot.

Her authority appears to rest entirely on having been right about a pair of Doc Martens in 2024.

## Why it exists

The obvious answer is money, and money is part of it. The less obvious answer, which came up in almost every interview, is that buying something new means everyone can find it.

"If I buy a shirt online, four people have it by Friday," said sophomore Dev Ramachandran. "If I trade for one, nobody does."

## The economics teacher weighs in

Mr. Halloran, who teaches AP Economics, has been aware of the trading for two years and says he has resisted the urge to use it as a unit.

"The moment I put it on a worksheet, it dies," he said. "Some things you observe."`,
  },
  {
    slug: "senior-playlist-project",
    title: "We Asked 40 Seniors for One Song. Here Is the Playlist.",
    dek: "The rule was simple: one track, and you have to explain it in a sentence. The explanations turned out to be the interesting part.",
    category: "culture",
    authorSlug: "priya-raghunathan",
    date: "2026-06-11",
    image: "/images/senior-playlist-project.svg",
    imageAlt: "Abstract editorial illustration of a halftone field with red panel",
    tags: ["music", "seniors", "project"],
    content: `We expected the sentences to be about the songs. Almost none of them were.

Forty seniors, one track each, one line of explanation. What came back was less a playlist than a set of very short stories about rooms, cars and specific afternoons.

## The pattern

Twenty-nine of the forty explanations located the song in a place. Eleven located it in a person. Only four described what the music sounds like.

> It is the song that was on when my brother taught me to parallel park, badly, in the Kroger lot.

That was the most representative answer we received, in the sense that thirty-eight of the others had the same shape.

## The overlaps

Only two songs appeared twice, which surprised us given how much of the same music this class listens to.

- The two repeats were both from 2011, when this class was in kindergarten
- Fourteen tracks predate 2005
- Six were in a language other than English
- One was a marching band arrangement, submitted without irony

## The oldest pick

The oldest submission was recorded in 1968, chosen by Ezra Nwachukwu, whose entire explanation was: "My grandfather sang it wrong for twenty years and I like his version better."

## Listening to it in order

Played end to end, the collection is close to unlistenable — it lurches from ambient to drumline to a nine-minute live recording. Played as forty separate things, with the sentences read first, it is the best hour we spent this year.

The full list is posted outside the newsroom, with the sentences, which is the correct way to read it.`,
  },
  {
    slug: "darkroom-revival",
    title: "The Darkroom Is Back, and It Has a Waiting List",
    dek: "Twelve students signed up in September. Forty-one are enrolled now, and the chemistry budget has become a genuine problem.",
    category: "culture",
    authorSlug: "elias-nakamura",
    date: "2026-08-06",
    image: "/images/darkroom-revival.svg",
    imageAlt: "Abstract editorial illustration of nested frames with red rule",
    tags: ["photography", "clubs"],
    featured: true,
    content: `The room had been a storage closet since 2016. There were three enlargers under a tarp, all of them working, and about two hundred pounds of expired paper.

Getting it running again took a summer, two grants and a conversation with the facilities office about ventilation that lasted, in total, four months.

## Why now

The obvious theory is that film is fashionable again, and the enrollment numbers support it. The students give a different answer.

> I take four hundred photos a week on my phone and look at none of them. Here I get twelve and I have to care about all of them.

That is Nia Delacroix, a sophomore, who joined in October and now runs the Thursday session.

## The economics

Chemistry is the constraint. Developer, stop bath and fixer for forty-one students runs about $60 a month, which the club covers through print sales and a $15 annual dues that several members cannot afford and do not pay.

- Enrollment: 41, up from 12
- Enlargers: 3, one shared per 14 students
- Monthly chemistry cost: roughly $60
- Waiting list: 9

The waiting list exists because three enlargers cannot serve more than about forty people on a two-session week.

## What they are shooting

Mostly each other, and mostly badly, which is correct. The prints on the corridor wall outside the room are a fair sample: overexposed portraits, one genuinely good photograph of the loading dock at 6 a.m., and a series of nine frames of the same tree.

The tree series is by a freshman, Idris Camara, who says he is not finished with it.

## What they need

A fourth enlarger, which costs about $200 used, and a stable chemistry line in the department budget. Both requests are in for next year.`,
  },
  {
    slug: "library-display-behind-the-scenes",
    title: "Behind the Library's Most Talked-About Display",
    dek: "The books have been on that table since April. The librarian who put them there has a reading list, a rationale, and a request.",
    category: "culture",
    authorSlug: "sofia-marchetti",
    date: "2026-07-28",
    image: "/images/library-display-behind-the-scenes.svg",
    imageAlt: "Abstract editorial illustration of arcs radiating over a dark band",
    tags: ["library", "books", "reading"],
    content: `There are nineteen books on the table by the window. They have circulated 214 times since April, which is more than the rest of the fiction section combined over the same period.

Librarian Wren Achebe put them there without an announcement.

## The selection

The table has no sign beyond a card that reads "Read these and argue with me." Achebe says the lack of a theme is deliberate.

> The second you label a display, people decide whether it is for them before they walk over. I wanted them to have to pick a book up.

The nineteen titles include two graphic novels, a book about municipal accounting, three works in translation and a copy of a 1974 field guide to North American mushrooms that has been checked out eleven times.

## The mushroom book

Nobody, including Achebe, can explain the mushroom book.

"It goes out constantly," she said. "It has been back on the table for four days total since April. I have stopped trying to understand it."

## The argument part

The card is not decorative. Achebe keeps a notebook next to the table where students write disagreements, and she answers them.

- Longest entry: two and a half pages, on an ending
- Number of entries: 63
- Number she has answered: 63
- Number of arguments she says she lost: 4

## What she wants

More shelf space and a second table. The request is in the library's budget submission, where it has been for three years.`,
  },

  // ─────────────────────────────────────────────────────── Opinions ──
  {
    slug: "homework-is-not-rigor",
    title: "Homework Is Not the Same Thing as Rigor",
    dek: "We have confused the volume of work with the difficulty of it, and the students paying for that confusion are the ones with jobs.",
    category: "opinions",
    authorSlug: "marcus-linde",
    date: "2026-08-25",
    image: "/images/homework-is-not-rigor.svg",
    imageAlt: "Abstract editorial illustration of a diagonal split in ink and red",
    tags: ["academics", "workload", "editorial"],
    trendingRank: 3,
    content: `A hard class and a long class are different things, and we have spent about a decade pretending otherwise.

The clearest example is on the AP course roster, where two classes carry the same designation, the same exam and the same weight in a transcript, and assign work that differs by a factor of three.

## The measurement problem

When a department says a course is rigorous, what usually gets counted is minutes. Minutes are easy to count. Whether the minutes contained anything is not.

> If I assign forty problems that use one idea, I have assigned a long night. If I assign four that use four ideas, I have assigned a hard one. Only one of those shows up in a survey.

That was a teacher in this building, speaking on the condition that I not identify their department, which is itself a piece of evidence about how this conversation goes.

## Who pays

The cost is not evenly distributed, and this is the part that does not come up enough.

- A student with a 4 p.m. shift loses the evening, not the hour
- A student caring for siblings loses it earlier
- A student with neither loses an hour of sleep and finishes

We do not have a homework problem in the abstract. We have a homework problem that functions as a tax on the students with the least discretionary time, and it is levied by the same courses that appear most heavily on college applications.

## What I am not arguing

I am not arguing for less work. I am arguing that quantity has been standing in for a quality we are not measuring, and that the substitution is invisible because it is convenient.

A department that assigns forty problems can defend itself with the number. A department that assigns four has to defend the four.

## What would actually help

Publish the expected weekly workload per course before registration, in hours, from the department rather than from the rumour mill. Let students schedule a year they can survive.

That is not a radical proposal. It is a syllabus with a number on it.`,
  },
  {
    slug: "let-students-grade-the-schedule",
    title: "Let Students Grade the Schedule",
    dek: "The people who spend 1,080 hours a year inside a bell schedule have never been formally asked whether it works.",
    category: "opinions",
    authorSlug: "marcus-linde",
    date: "2026-07-16",
    image: "/images/let-students-grade-the-schedule.svg",
    imageAlt: "Abstract editorial illustration of columns in red and black",
    tags: ["schedule", "governance", "editorial"],
    content: `The schedule review committee has eleven members. Nine are staff, two are parents, and none of them sit through the schedule.

This is not a complaint about the committee, whose members have been thoughtful and available. It is a complaint about a design.

## The gap

There is a category of information that only shows up if you are inside the thing. The staff know the schedule as a document. Students know it as a physical experience with a specific texture — the fourth-period slump, the eleven minutes that lunch actually gives you once the line is counted, the Tuesday that has three assessments because nobody coordinates.

> Every teacher sees one sixth of a student's day and assumes the other five sixths look like theirs.

## What a student seat would catch

- Assessment clustering, which no single department can see
- The real length of a passing period between the two farthest rooms
- Which study halls are usable and which are storage rooms with desks
- Whether the late bus makes the tutoring block reachable

None of these require a survey. They require someone in the room who has walked it.

## The standard objection

The objection is that students would advocate for a shorter day, and it is not a serious objection. Ask a student council to make a real tradeoff and they make one; the club funding fight this spring was more disciplined than most budget hearings I have watched adults conduct.

We already trust students to sit on the food service review committee. That committee is going better for it.

## The ask

Two voting seats. Selected by the student council, serving a full year, with access to the same documents everyone else on the committee receives.

If the resulting schedule is worse, the experiment ends. I do not think it will be.`,
  },
  {
    slug: "case-for-fewer-clubs",
    title: "The Case for Joining Fewer Clubs",
    dek: "Eleven memberships and one real commitment is not a résumé. It is a list of rooms you walked through.",
    category: "opinions",
    authorSlug: "amara-oyelaran",
    date: "2026-06-27",
    image: "/images/case-for-fewer-clubs.svg",
    imageAlt: "Abstract editorial illustration of frames and a red rule",
    tags: ["clubs", "college", "editorial"],
    content: `I signed up for nine clubs as a sophomore. I attended four meetings total. I want to be specific about that, because I spent that year believing I was busy.

## What the list was for

The list was for an application, and everyone involved knew it. The clubs knew it — several of them exist primarily as lists. The counsellors knew it. I knew it.

What none of us said out loud is that a membership is not an experience. It is a row.

> I can tell within thirty seconds which activities a student actually did, because they can describe a problem they hit.

That is from a college admissions officer who visited in March and said this to a room of forty juniors, most of whom were writing it down while mentally reviewing their nine clubs.

## The thing that gets crowded out

Depth requires being bored inside something for long enough to find the interesting part. The interesting part is never in the first four meetings.

The darkroom club spent two months on ventilation paperwork before anyone developed a photograph. The debate team's turnaround came from meeting twice a week rather than once. Every good thing that happened in this building this year happened to somebody who stayed past the point where it stopped being fun.

- Nine memberships, four meetings: a list
- One membership, sixty meetings: a skill, and usually a friend
- The difference is not effort. It is concentration.

## What I would tell a freshman

Join four things in September. Quit two by November, out loud, without guilt — clubs would rather know. Stay in one long enough to be handed something you do not know how to do.

The row on the application is a byproduct. It has never been the point, and the people reading it can tell.`,
  },
  {
    slug: "ai-in-the-classroom",
    title: "We Need an Honest Conversation About AI in Class",
    dek: "Every student is using it. Every teacher knows. The policy pretends otherwise, and the pretending is doing the damage.",
    category: "opinions",
    authorSlug: "marcus-linde",
    date: "2026-08-08",
    image: "/images/ai-in-the-classroom.svg",
    imageAlt: "Abstract editorial illustration of planes and a red disc",
    tags: ["technology", "academic integrity", "editorial"],
    trendingRank: 6,
    content: `The academic integrity policy contains one sentence about generative AI. It says unauthorized use is prohibited. It does not define authorized use, which means the operative rule in this building is whatever an individual teacher said out loud in September, if they said anything.

## The current state

I asked thirty students in different courses what their teacher's rule was. Nine could state it. Four of those nine were in the same class.

That is not a compliance problem. That is a specification problem, and we are punishing students for it.

> I got a zero for using it to check my work. My friend in the other section is allowed to use it to draft. Same assignment, same department.

## Why "just ban it" fails

A ban that cannot be enforced is not a ban, it is a lottery. Detection tools do not work reliably, and the false positives land hardest on students who write in a plain style or in a second language.

We know this. Two districts nearby have already stopped using detection software for exactly this reason.

## Why "anything goes" also fails

There are genuine things you can only learn by struggling through a first draft badly. If a student never writes a bad paragraph, they never learn what makes it bad. That is a real cost and it is not sentimental.

The answer is not a blanket in either direction. It is a per-assignment declaration.

- Every assignment states its AI tier: none, assistive, or open
- Assistive use is disclosed in a line at the end, not hidden
- Disclosure never affects the grade; undisclosed use does
- The tier is chosen by the teacher, in writing, in advance

## The disclosure part matters most

A student who writes "I used a model to check my thesis for circular reasoning" has told me something useful about how they think. A student hiding the same thing has learned that the honest move is the risky one.

Right now our policy teaches the second lesson. It should be embarrassing that it does.`,
  },

  // ─────────────────────────────────────────── Science & Psychology ──
  {
    slug: "sleep-debt-teenage-brain",
    title: "What Sleep Debt Actually Does to the Teenage Brain",
    dek: "You cannot bank sleep on Saturday. The research on what a six-hour weeknight costs is more specific — and more inconvenient — than the posters suggest.",
    category: "science-psychology",
    authorSlug: "hana-brennan",
    date: "2026-08-24",
    image: "/images/sleep-debt-teenage-brain.svg",
    imageAlt: "Abstract editorial illustration of arcs radiating in indigo and red",
    tags: ["sleep", "neuroscience", "health"],
    featured: true,
    trendingRank: 7,
    content: `The most repeated fact about teenage sleep is that adolescents need eight to ten hours. It is true, and it is also the least useful thing you can tell someone at 1 a.m.

The more useful question is what specifically degrades, and in what order.

## The order things fail

Sleep restriction does not lower performance evenly. Studies using controlled restriction protocols consistently find that some functions hold up for days while others fall off almost immediately.

- Simple reaction time: degrades fast, within one short night
- Sustained attention: degrades fast, and does not feel like it is degrading
- Working memory: holds moderately, then drops sharply after several nights
- Emotional regulation: among the first to go
- Well-practised motor skills: surprisingly resilient

The pairing that causes trouble is the second one. Attention lapses arrive before the sense that anything is wrong, which is why self-assessment of alertness is famously unreliable in restricted-sleep studies.

> Participants rated themselves as adapting. Their performance did not adapt. It kept declining while the ratings flattened out.

## The weekend question

Recovery sleep restores some things and not others. Reaction time tends to bounce back quickly. Measures of sustained attention take longer, and some studies find residual deficits after a single recovery night.

There is a second problem with the weekend strategy, which is that sleeping until noon Saturday shifts the circadian phase later, making Sunday night harder. The pattern has a name — social jetlag — and it is measurable as the gap between weekday and weekend sleep midpoints.

## Why 7:30 a.m. is the wrong time

During puberty, the circadian phase shifts later by roughly one to three hours. Melatonin onset moves back. This is a biological change, not a habit, and it does not respond well to being told to go to bed earlier.

That is the mechanism behind the late-start research, and it is why districts that move the bell see effects that a bedtime campaign does not produce.

## What the evidence supports doing

- Anchor the wake time, not the bedtime; the wake time sets the clock
- Keep the weekend midpoint within about an hour of the weekday one
- Get bright light early; it advances the phase
- Treat a 20-minute nap as a real tool, and a 90-minute one as a schedule change

None of this is a substitute for a schedule that starts later. It is what you can do while the buses get redrawn.`,
  },
  {
    slug: "why-cramming-feels-like-learning",
    title: "Why Cramming Feels Like Learning, and Is Not",
    dek: "Fluency is a trap. The strategies that feel worst while you use them are the ones that survive to the exam.",
    category: "science-psychology",
    authorSlug: "hana-brennan",
    date: "2026-07-09",
    image: "/images/why-cramming-feels-like-learning.svg",
    imageAlt: "Abstract editorial illustration of halftone dots and a red panel",
    tags: ["memory", "study", "psychology"],
    trendingRank: 8,
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
    slug: "campus-bird-survey",
    title: "A Student Bird Survey Found 41 Species on Campus",
    dek: "Two years, 96 morning counts, one very cold February. The data is now with the county, and it has already changed a mowing schedule.",
    category: "science-psychology",
    authorSlug: "hana-brennan",
    date: "2026-06-15",
    image: "/images/campus-bird-survey.svg",
    imageAlt: "Abstract editorial illustration of arcs over a dark band",
    tags: ["ecology", "research", "students"],
    content: `The survey began because a freshman wanted to know what the loud bird outside the chemistry wing was. It was a northern flicker. By the time she found that out, she had a spreadsheet.

## The method

Two years of point counts, conducted at four fixed locations, three mornings a week, beginning fifteen minutes after sunrise. Ninety-six count sessions survived quality control out of 118 attempted.

The protocol was adapted from the standard breeding bird survey methodology, with help from a county naturalist who reviewed the data sheets each month.

- Species recorded: 41
- Species breeding on site: 12 confirmed
- Most abundant: European starling, unfortunately
- Rarest single sighting: a sora, once, in the retention pond

## The retention pond

The sora is the finding that got the county's attention. Soras are secretive marsh birds, and one turning up in a stormwater retention pond behind a high school parking lot is the kind of record that suggests the pond is doing more ecological work than its designers intended.

> We built that pond to hold water off the parking lot. Nobody designed it as habitat. It became habitat anyway.

## The mowing change

The survey found that the strip along the eastern fence held six species that appeared nowhere else on campus, all of them ground-nesting or scrub-dependent.

Grounds crews were mowing it in mid-June, in the middle of the nesting window. After a presentation to the facilities office in April, the mow date moved to August.

That is a real outcome from a student project and it took one meeting, because the students arrived with two years of dates.

## What happens now

The dataset has been submitted to the county's open ecological records. The team is recruiting for a third year and specifically wants someone willing to do winter counts, which are cold, quiet and where the interesting records tend to be.`,
  },
  {
    slug: "attention-residue",
    title: "Attention Residue: The Hidden Cost of a Single Notification",
    dek: "The interruption takes four seconds. What it does to the next twenty minutes is the part the research is interested in.",
    category: "science-psychology",
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

  // ──────────────────────────────────────────────────────── Cuisine ──
  {
    slug: "cafeteria-blind-taste-test",
    title: "We Blind-Tasted Every Cafeteria Entree. One Won Easily.",
    dek: "Nineteen dishes, twelve tasters, numbered cups and no labels. The result contradicts almost everything people say in the lunch line.",
    category: "cuisine",
    authorSlug: "theo-alvarez",
    date: "2026-08-19",
    image: "/images/cafeteria-blind-taste-test.svg",
    imageAlt: "Abstract editorial illustration of columns in amber, red and black",
    tags: ["cafeteria", "taste test", "food"],
    featured: true,
    trendingRank: 9,
    content: `The winner was the chicken and rice. It was not close.

This surprised the twelve tasters, eleven of whom had said before the test that the chicken and rice was, at best, the fourth-best thing on the menu.

## How we ran it

Nineteen entrees over four days, served in identical unmarked containers at the same temperature, scored 1 to 10 on taste, texture and whether the taster would choose it again. Tasters could not see the serving line and were not told what any dish was.

We got the kitchen's cooperation, which was essential and generously given. Head cook Marta Bilic plated everything herself.

- Entrees tested: 19
- Tasters: 12
- Scores collected: 684
- Dishes nobody could identify blind: 6

## The top five

1. Chicken and rice — 7.9
2. Black bean and corn bowl — 7.4
3. Cheese pizza — 7.1
4. Roasted vegetable pasta — 6.8
5. Turkey sandwich — 6.6

The black bean bowl finishing second is the more interesting result, because it is the dish that sits longest on the line and gets taken least.

> People do not avoid it because of how it tastes. They avoid it because it looks like the vegetarian option, and the vegetarian option has a reputation.

## The bottom

Last place, at 3.1, went to a fish sandwich that four tasters declined to finish. It has since been removed from the rotation, which the kitchen says was already planned.

Second to last was a dish that scored 4.0 blind and is one of the most frequently chosen items on the menu. We have chosen not to name it, on the grounds that people appear to be enjoying it and we do not want to ruin that.

## What it means for the contract

The findings landed in the middle of the food service contract review, and committee member Amelia Boateng asked for the raw scores.

The clearest takeaway is not about quality. It is that presentation and position on the line predict what students take far better than taste does, which is a solvable problem and does not require a new vendor.`,
  },
  {
    slug: "six-lunchboxes",
    title: "Six Students, Six Lunchboxes, One Very Long Table",
    dek: "We asked six people to bring what they actually eat and explain it. Nobody brought what they said they would.",
    category: "cuisine",
    authorSlug: "theo-alvarez",
    date: "2026-07-22",
    image: "/images/six-lunchboxes.svg",
    imageAlt: "Abstract editorial illustration of nested frames in sand and red",
    tags: ["food", "students", "culture"],
    content: `The plan was straightforward: six students, six home lunches, one table, and a conversation about what is in them.

The plan immediately failed, because five of the six upgraded. Only one person brought what they eat on an ordinary Wednesday, and she is the reason this piece is worth reading.

## The honest one

Junior Halima Sesay brought rice, leftover stew from Sunday, and a plastic fork that she noted was on its fourth use.

"It is Sunday's dinner," she said. "It is Sunday's dinner on Monday, Tuesday and sometimes Wednesday. That is the whole system."

> Everyone else cooked for this. I want that on the record.

## The upgrades

The other five, cheerfully caught, described what they had actually planned to bring:

- A sandwich made at 6:40 a.m., "usually a bit sad"
- Instant noodles and a boiled egg
- Whatever is in the fridge, in a container, unexamined
- A bag of crackers and a piece of fruit, most days
- Nothing, followed by cafeteria fries at 11:50

What arrived instead included a three-component bento, a genuinely excellent chicken adobo, and a container of dumplings that the maker admitted her mother had supervised.

## The dumplings

The dumplings were the best thing on the table, and the story attached to them was better. Sophomore Ling Wei Chua said the pleating technique took her two years to learn and that her first attempts, at eleven, were "structurally unsound."

She brought forty. They were gone in nine minutes.

## What we learned

Two things. First, everybody's real lunch is more boring than they want it to be, which is fine and universal. Second, the moment you ask someone to explain their food, they start telling you about a person.

Five of six explanations named a relative in the first sentence.`,
  },
  {
    slug: "physics-of-instant-noodles",
    title: "The Physics of Perfect Instant Noodles",
    dek: "Water temperature, timing and the one step almost everyone does in the wrong order. We tested eight variations.",
    category: "cuisine",
    authorSlug: "theo-alvarez",
    date: "2026-06-24",
    image: "/images/physics-of-instant-noodles.svg",
    imageAlt: "Abstract editorial illustration of a red disc over a diagonal split",
    tags: ["cooking", "technique", "food science"],
    content: `The instructions on the package are optimized for being printed on a package. They are not optimized for the noodles.

We ran eight variations of the same block, scored blind by six tasters, and there are three findings worth the space.

## Finding one: the water is not hot enough

A kettle that has just clicked off is at boiling. A kettle that clicked off ninety seconds ago, in a cold room, is not — and neither is the water once it hits a room-temperature ceramic bowl, which can pull the temperature down by ten degrees or more in the first few seconds.

Preheating the bowl with a splash of hot water, poured out before the noodles go in, produced the single largest improvement in the test. The noodles cook more evenly and the centre is not underdone.

- Preheated bowl: +1.4 average score
- No preheat: firm centre, soft exterior in every trial

## Finding two: the seasoning goes in last

Most packages tell you to add the seasoning at the start. Dissolved salt raises the boiling point slightly and, more importantly, the aromatics in the powder are volatile — they cook off during the steep.

Adding the packet after the noodles are done, then stirring, scored higher in five of six blind comparisons. The difference was described by tasters as "smells like more."

> The soup tastes the same. It smells completely different. Most of what you think is flavour is arriving through your nose.

## Finding three: stop steeping early

Package times assume you eat immediately. Nobody eats immediately. The noodles continue to soften in hot broth for several minutes after the timer.

Pulling them thirty to forty-five seconds early produced the correct texture at the moment of actual eating, every time.

## The assembled method

- Preheat the bowl, pour the water out
- Boil fresh water, use it immediately
- Steep 45 seconds under the package time
- Add seasoning, then stir
- Egg goes in at the halfway point, not the start

The egg finding was the least conclusive and the most argued about. We are revisiting it.`,
  },
  {
    slug: "bake-sale-economics",
    title: "Bake Sale Economics: What Actually Sells",
    dek: "Four years of fundraiser data from eleven clubs. Brownies are not the answer, and the pricing everyone uses is wrong.",
    category: "cuisine",
    authorSlug: "sofia-marchetti",
    date: "2026-05-28",
    image: "/images/bake-sale-economics.svg",
    imageAlt: "Abstract editorial illustration of halftone dots and a red block",
    tags: ["fundraising", "clubs", "economics"],
    content: `Eleven clubs kept records. Four years of them, mostly in shoeboxes, one in a genuinely impressive spreadsheet maintained by the robotics team.

Put together, the data says several things that contradict standard bake sale practice.

## Price points

Almost every table prices at one dollar. The data suggests this is leaving money on the table, and not by a small margin.

Sales at $1.50 dropped unit volume by about 12 percent and raised revenue by roughly 31 percent across the sales where both prices were tried. Two dollars was too far: volume fell off sharply.

- $1.00 — high volume, lowest revenue
- $1.50 — best revenue in 9 of 11 club records
- $2.00 — volume collapse, worse than $1.00 in most cases

## What sells

Brownies are the default and they are mid-table. The consistent winners were items that are annoying to make at home.

1. Anything individually wrapped
2. Savoury items, which almost nobody brings
3. Cookies that are visibly large
4. Rice krispie treats, inexplicably durable in the rankings

Savoury is the biggest gap. Across four years there were 31 recorded sales and only three included a savoury item. All three sold out.

> We brought samosas once, as a joke. We made more that afternoon than the entire fall.

## Location beats product

The strongest predictor in the whole dataset is not what is on the table. It is whether the table is between a door and a hallway students already walk down.

The main entrance table averaged 2.6 times the revenue of the cafeteria table selling the same items on the same day.

## The practical version

Set up where people already are. Price at $1.50. Bring one savoury thing. Wrap everything. Skip the brownies, or at least do not lead with them.`,
  },

  // ───────────────────────────────────────────────────────── Comics ──
  {
    slug: "comic-hall-pass",
    title: "Hall Pass: The Long Walk",
    dek: "Four panels. One laminated rectangle. An expedition that will take the entire passing period and possibly longer.",
    category: "comics",
    authorSlug: "june-okafor",
    date: "2026-08-26",
    image: "/images/comic-hall-pass.svg",
    imageAlt: "Four-panel comic strip rendered as a bold graphic composition",
    tags: ["comic", "weekly strip"],
    trendingRank: 10,
    content: `This week's strip runs above, in four panels.

## Panel notes

Panel one is the handoff: the pass changes hands with the ceremony of a relay baton. Panel two is the hallway, drawn at a deliberately absurd length, because that is how it feels at 10:42.

Panel three is the encounter with a hall monitor who examines the pass for longer than any document has ever been examined. Panel four is the return, seventeen minutes later, to a room that has moved on without you.

> I have redrawn panel three eleven times. The joke is entirely in how long she looks at it, and length is hard to draw.

## On the format

I have been working in four panels all year because three is too tidy and six invites me to explain things. Four gives you a setup, a complication, a beat, and a landing, which is the shape of most of what happens in a school day.

Next week: the vending machine that only accepts one specific dollar bill.`,
  },
  {
    slug: "comic-group-project",
    title: "Group Project, Chapter Four",
    dek: "In which the shared document gains a fifth contributor, forty minutes before the deadline, with formatting opinions.",
    category: "comics",
    authorSlug: "june-okafor",
    date: "2026-08-13",
    image: "/images/comic-group-project.svg",
    imageAlt: "Comic strip rendered as a bold graphic composition in red and black",
    tags: ["comic", "weekly strip", "series"],
    content: `Chapter four of the group project series runs above. The previous three are in the archive and this one works without them, though the running gag about the title slide will land harder if you have read chapter two.

## Panel notes

The document itself is the main character now, which was not the plan when I started this in March. Drawing a cursor as a person was a mistake I have decided to commit to.

Panel two is the only one I got right on the first attempt: four cursors, motionless, in a document with 900 words and a deadline in forty minutes.

> The formatting opinions arriving before any content is written is the truest thing in this strip and it happened to me twice this year.

## What is coming

Chapter five is the peer evaluation form, which is the only genuinely dark instalment in the series, and I am still deciding how far to take it.`,
  },
  {
    slug: "comic-the-substitute",
    title: "The Substitute",
    dek: "A single panel. He has the lesson plan. He has decided, quietly and completely, not to use it.",
    category: "comics",
    authorSlug: "june-okafor",
    date: "2026-07-30",
    image: "/images/comic-the-substitute.svg",
    imageAlt: "Single-panel comic rendered as a bold graphic composition",
    tags: ["comic", "single panel"],
    content: `A one-panel week, which I do when a joke will not survive being stretched.

## Panel notes

Everything is in the posture. The lesson plan is on the desk, face down, and he has already started a story about a job he had in 1998.

The students are drawn as an audience rather than a class, which is the whole gag: this is going better than the lesson would have.

> I gave him a coffee cup with no logo on it. Anything on the cup would have made him a specific person, and he needs to be all of them.

## On single panels

A single panel has to do everything at once, so it is the format where drawing badly hurts most. This one took longer than the four-panel strips do, which is annoying and always true.

Back to four panels next week.`,
  },
  {
    slug: "comic-finals-forecast",
    title: "Finals Week Forecast",
    dek: "A weather map of the coming week. Scattered panic in the north, a band of denial moving in from the east.",
    category: "comics",
    authorSlug: "june-okafor",
    date: "2026-06-08",
    image: "/images/comic-finals-forecast.svg",
    imageAlt: "Comic weather map rendered as a bold graphic composition",
    tags: ["comic", "seasonal"],
    content: `The finals forecast returns for its third year, updated for the new exam schedule.

## The map

The regions are the same as last year with two changes. The Library Basin has expanded considerably, reflecting the new study hours. The area formerly labelled Confidence has been reduced to a small circle near the art wing.

Tuesday shows a pressure system building over the science hallway. Thursday afternoon is clear, which is a joke about the fact that nothing is scheduled and everyone will spend it worrying anyway.

> Someone asked whether the forecast is accurate. It has been accurate three years running, which says something unflattering about how predictable this week is.

## Legend notes

- Diagonal hatching: sustained low-grade dread
- Solid black: an exam block
- The small red circle: the twenty minutes on Friday when it is over
- The arrow: your understanding of the material, leaving

Prints of the map are on the back page and, as always, taped inside several lockers by Wednesday.`,
  },
];
