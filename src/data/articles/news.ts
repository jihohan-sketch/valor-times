import type { Article } from "../types";

/**
 * School news, transcribed from the printed issues. Body copy is the paper's
 * own — nothing here is rewritten, condensed or invented. Where the page
 * printed a subhead, it is kept as a "## " heading.
 */
export const news: Article[] = [
  {
    slug: "finals-end-of-year",
    title: "Finals & End of School Year",
    dek: "Final exams begin next week, and the break behind them is the only thing left between students and summer.",
    category: "news",
    authorSlug: "hanna-seo",
    date: "2026-06-01",
    issueSlug: "vol4-no7",
    page: 1,
    image: "/photos/finals-end-of-year.jpg",
    imageAlt:
      "Two members of the Valor community pulling faces for the camera, drawn over in pink and yellow marker",
    tags: ["finals", "school year"],
    featured: true,
    editorsRank: 1,
    content: `The school year is finally coming to close, with final exams set to begin next week. For students, the days ahead will become one of the most demanding and exhausting periods of time this school year. Students can be seen studying intensely, being aware that this set of finals are three full trimesters of learning. Since these are the final exams of the year, students are expected to approach them with diligence and use their remaining time wisely. The pressure is intense. However, there is also a growing sense that the finish line is near. After months of preparation and effort, this week of testing is all that stands between students and the long awaited break and going off to summer.

When the exams finally come to an end, students and staff can finally start to relax and start making summer plans. Being excited to get out of the school and enjoying the summer break just waiting for us to come. The end of the year becomes more serious to those who are in the higher grade due to bring them one step closer to graduation and taking the next step in their life. The days ahead will not be easy, but the break waiting at the end will make the effort worth it. Good luck to everyone on their Finals, and happy Summer break!`,
  },
  {
    slug: "prom-2026",
    title: "Prom 2026",
    dek: "Held at Once Upon a Nature: dresses, suits, raffle tickets and an awards ceremony to close the night.",
    category: "news",
    authorSlug: "hanna-seo",
    date: "2026-05-01",
    issueSlug: "vol4-no5",
    page: 1,
    image: "/photos/prom-2026.jpg",
    imageAlt: "Gold foil balloons spelling PROM, with two students posing beneath them",
    tags: ["prom", "school events"],
    featured: true,
    editorsRank: 2,
    content: `Held at the beautiful café Once Upon a Nature, the venue provided a cozy and elegant atmosphere that made the evening feel extra special. Students arrived dressed to impress, many accompanied by their partners. The room was filled with stunning dresses, suits, and stylish outfits that showcased everyone's unique personalities. It was wonderful to see everyone looking their best and celebrating together.

Throughout the evening, students participated in a variety of fun games that brought lots of energy and laughter to the event. Raffle tickets were also handed out, giving everyone a chance to win exciting prizes. To finish off the night, an awards ceremony was held, where students nominated their classmates for different categories and celebrated each other's achievements and personalities.

More than anything, prom was an opportunity for students to relax, spend time with friends, and create lasting memories before the school year comes to an end. With great company, fun activities, and a beautiful venue, it was safe to say the event was a success.

Overall, Prom 2026 was a wonderful experience, and it is sure to be remembered by everyone who attended for years to come.`,
  },
  {
    slug: "ap-season-over",
    title: "AP Exam Season is finally over!!",
    dek: "Weeks of FRQs and last-minute cramming end, and the conversation turns to summer, graduation and prom.",
    category: "news",
    authorSlug: "hanna-seo",
    date: "2026-05-01",
    issueSlug: "vol4-no4",
    page: 1,
    image: "/photos/ap-season-over.jpg",
    plate: true,
    imageAlt: "The front page of Volume 4, No. 4, with the School News lead story",
    tags: ["AP", "exams"],
    featured: true,
    editorsRank: 3,
    content: `AP Season is Finally Over!!

AP exam season has officially come to an end, which brought relief to students across campus after weeks of studying, reviewing, and stressing over FRQs and multiple-choice questions. Classrooms that were once filled with review packets and last-minute cramming are finally starting to feel more calm.

For many students, AP exams represented months of preparation and hard work. Staying up late to finish practice problems and even quizzing friends before exams, the past few weeks pushed students to stay focused and disciplined. While every AP subject came with its own challenges, many students are now simply happy to have completed the exams smoothly.

With exams over, conversations are beginning to change from study guides and score predictions to summer plans, graduation, prom, and enjoying the final weeks of the school year. Even though AP scores won't be released until later, students can finally take a break and appreciate the effort they put in throughout the year.`,
  },
  {
    slug: "mission-site-photo-dump-lipa",
    title: "Mission Site Photo Dump — LIPA",
    dek: "A page of photographs from the Lipa team, printed without a word of copy.",
    category: "news",
    authorSlug: "staff",
    date: "2026-03-01",
    issueSlug: "vol4-no3",
    page: 8,
    image: "/photos/mission-site-photo-dump-lipa.jpg",
    imageAlt: "Collage of photographs from the Lipa mission site, captioned LIPA Photo Dump",
    tags: ["missions", "Philippines", "photography"],
    content: `The paper gave page eight of Vol4. No3. to the Lipa team and printed nothing but their photographs — a collage of the trip, captioned only "Mission Site Photo Dump - LIPA".

The page is reproduced whole in the issue reader.`,
  },
  {
    slug: "mission-trip-site-korea",
    title: "Mission Trip Site: Korea",
    dek: "Four teams, three countries, and a trip the paper reports back on after the fact.",
    category: "news",
    authorSlug: "seoyun-lee",
    date: "2026-03-01",
    issueSlug: "vol4-no3",
    page: 4,
    image: "/photos/mission-trip-site-korea.jpg",
    plate: true,
    imageAlt: "The School News page reporting on the completed mission trips",
    tags: ["missions", "Korea", "Philippines", "Thailand"],
    content: `Our school recently completed a mission trip that brought students and teachers together to serve different communities. Participants were divided into four teams, traveling to the Philippines (Lucena and Lipa), Korea, and Thailand.

Each group took part in various volunteer activities to support local communities.

In the Philippines, students in the Lucena and Lipa groups spent time teaching children, organizing games, and assisting with community programs. Their efforts helped create a positive and encouraging environment for the children.

Meanwhile, the Korea group participated in local service activities, working together to support people in need within their own community. Similarly, the Thailand group contributed through volunteering and outreach, engaging with local residents and providing assistance where possible.

Beyond helping others, the mission trip also allowed students to grow personally. Working in different environments helped participants develop teamwork, communication, and leadership skills. Many students also gained a deeper appreciation for different cultures and ways of life. One participant shared, "This experience taught me the importance of helping others and being grateful. It was something I will never forget."

Overall, the mission trip was both meaningful and memorable. Through their efforts, students made a positive impact while also learning valuable life lessons. The trip reflects our school's commitment to service and global awareness.`,
  },
  {
    slug: "missions-celebration-day",
    title: "Missions Celebration Day",
    dek: "Twelve student-run booths on 11 February, raising funds for the Philippines, Korea, Kenya and Thailand.",
    category: "news",
    authorSlug: "hayeon-son",
    date: "2026-03-01",
    issueSlug: "vol4-no3",
    page: 1,
    image: "/photos/missions-celebration-day.jpg",
    imageAlt: "The Valor International School welcome centre and its terracotta rooftops",
    tags: ["missions", "school events"],
    editorsRank: 8,
    content: `VIS will be hosting Missions Celebration Day, a school-wide event that supports students as they prepare for upcoming mission trips. The event brings together students, families, and members of the local community to celebrate service and servant leadership.

Missions Celebration Day will feature 12 booths run by students, all planned and organized by the students themselves. The booths will be selling a variety of items, including food, stationery, and handmade products. Through this process, we aim for students to develop creativity, organization, and a strong sense of responsibility.

The event will be taking place on Wednesday on the 11th of February from 9:00 to 11:30 a.m., creating a lively and welcoming atmosphere on campus.

Funds raised during Missions Celebration Day will support mission projects in the Philippines, Korea, Kenya, and Thailand.

Beyond fundraising, the event offers a valuable hands-on learning experience. Students will be learning the importance of service, teamwork, and leadership while gaining a deeper understanding of their role as responsible members of the Valor community. By working together toward a shared goal, they would experience how individual efforts can combine to make a meaningful impact on communities around the world, and how they themselves could make a contribution in changing the world.`,
  },
  {
    slug: "deck-the-doors-winners",
    title: '"Deck the Doors" Christmas Door Decorating Contest: Winners Announced',
    dek: "C2 House takes Best Overall. C1 House most creative, MB 4006 most interactive, MB 4005 honourable mention.",
    category: "news",
    authorSlug: "staff",
    date: "2025-12-01",
    issueSlug: "vol3-no21",
    page: 8,
    image: "/photos/deck-the-doors-winners.jpg",
    imageAlt: "A dorm entrance decorated with a Christmas tree and garlands for the contest",
    tags: ["residential life", "Christmas", "contest"],
    content: `The "Deck the Doors" Christmas Door Decorating Contest have been announced!

The contest was able to help us get into the truly festive Christmas spirit as we await the birth of Christ, the hope of the world, and provided a wonderful opportunity to collaborate with your roommates, showcase your creative flair, and make some fun, lasting memories.

## Important Dates

- Contest Period: December 1st – December 8th (Please plan accordingly with your roommates to gather any necessary supplies over the upcoming weekend!)
- Judging Day: December 9th (Judges will make their rounds throughout the day)
- Winners Announced: December 10th during the Talent Show!

## Prizes will be awarded for

- Best Theme
- Most Creative
- Most Interactive

## The winners

- BEST OVERALL: C2 HOUSE
- MOST CREATIVE: C1 HOUSE
- MOST INTERACTIVE: MB 4006
- HONORABLE MENTION: MB 4005`,
  },
  {
    slug: "mission-trip-site-kenya",
    title: "Mission Trip Site: Kenya",
    dek: "The least-popular site by distance, and a country that leads on conservation, renewables and tourism.",
    category: "news",
    authorSlug: "victoria-oh",
    date: "2025-12-01",
    issueSlug: "vol3-no21",
    page: 4,
    image: "/photos/mission-trip-site-kenya.jpg",
    imageAlt: "An acacia tree standing alone on the Kenyan savannah beneath a wide sky",
    tags: ["missions", "Kenya", "travel"],
    content: `In light of upcoming mission trips, we're starting off with mission trip site Kenya. While one of the least-popular mission sites due to the geographical distance, here are some fun places within Kenya!

From the sweeping savannahs of the Maasai Mara to the snow-capped peaks of Mount Kenya, Kenya is quite literally the epitome of homage to the animal kingdom. A paradise for adventurers and nature-lovers alike, Kenya is a country that leads the world by example, showcasing not only economic strength but also focusing heavily on wildlife conservation efforts, investment in renewable resources, and extensive work toward fostering a greener environment.

A global leader in energy efficiency, wildlife, and animal protection, Kenya, a developing nation located in East Africa, is a country that has been gaining increasing attention over the past decade.

Known for its diverse and scenic landscapes, lush wildlife, and unique natural attractions, Kenya attracted approximately 1.9 million tourists in 2023. This number has steadily increased, showing signs of Kenya's recovering economy and growth since the COVID-19 pandemic. In fact, in 2024, Kenya had over 2.4 million tourist arrivals (a 14.6% increase compared to the previous year), and this number is only projected to grow in the near future.

These immersive and interactive experiences, combined with Kenya's commitment to wildlife conservation and sustainable, eco-friendly tourism, make the country not only a remarkable vacation spot but also a place to find solace, reconnect with Mother Nature, and discover inner peace. Whether you're seeking thrilling safaris, serene beaches, or authentic cultural experiences, Kenya is ready to welcome you to a journey you'll never forget.`,
  },
  {
    slug: "christmas-community-event",
    title: "Upcoming School News",
    dek: "The Christmas Community Event lands at the Samjung Hotel on 16 December, with YANA, Miral and IFCJ.",
    category: "news",
    authorSlug: "hayeon-son",
    date: "2025-12-01",
    issueSlug: "vol3-no21",
    page: 1,
    image: "/photos/christmas-community-event.jpg",
    imageAlt: "A student and a teacher pointing at the camera in a classroom",
    tags: ["Christmas", "school events", "service"],
    featured: true,
    editorsRank: 6,
    content: `VIS and VPS will be hosting a special Christmas Community Event on Tuesday, December 16th at the Samjung Hotel in Gangnam, Seoul. This annual gathering will bring together students, families, and staff to celebrate the season and support meaningful causes. The event will feature the Christmas Market, where students and groups will present various items and activities, and a joint program with YANA and their ambassador, Shin Ae-ra.

YANA is an organization dedicated to supporting children in residential care by providing mentoring, emotional support, and opportunities that encourage healthy development. Their work closely aligns with the heart of our school's service efforts. This year, all funds raised at the event will support both our missions initiatives and the One2One sponsorship program. Through One2One, the support raised will directly benefit YANA's work with children, helping them continue their important role in the community. In addition, partners from Miral Welfare Foundation and IFCJ will join us at the event to share about their work in Korea.

The Christmas Community Event aims to bring our community together in generosity and purpose, reminding us of the impact we can make when we work collectively. VIS is also preparing a Silent Auction and Raffle, and we warmly welcome donations from our families and broader community to help make this event meaningful and successful.`,
  },
  {
    slug: "vis-bubbly-donations",
    title: "VIS Bubbly Donations",
    dek: "Two letters back to the club: one from Ezer after a fire in the Philippines, one from Beirut.",
    category: "news",
    authorSlug: "staff",
    date: "2025-11-01",
    issueSlug: "vol3-no20",
    page: 4,
    image: "/photos/vis-bubbly-donations.jpg",
    plate: true,
    imageAlt: "The Club News page carrying two thank-you letters to the Bubbly Club",
    tags: ["clubs", "service", "missions"],
    content: `## From Ezer

Dear Bubbly Club members at Valor,

Grace and peace to you in the name of our Lord Jesus Christ. On behalf of Ezer, I thank you for your generous gift to support a young girl and her brother in the Philippines after the fire that destroyed their home and many others.

Your gift will provide not only food, clothing, and temporary shelter, but will also be used toward rebuilding their house. This means so much, as the siblings had been relying on about fifteen relatives nearby whose homes were also lost in the fire.

Your generosity is a witness of Christ's love in action, reminding this family that they are not forgotten. May the Lord bless you richly and multiply your kindness for His glory.

With gratitude in Christ,
Dr. Thomas Cho, Ezer

## From Lebanon

Dear VIS Bubbly,

I want to sincerely thank you for supporting our family and our mission to Lebanon.

I grew up as a missionary kid in The Gambia, West Africa. At the time, I didn't understand why our family had to move to another country, but looking back now, I'm deeply grateful that we did. Those years in Africa gave me invaluable experiences and shaped in me a global perspective that continues to impact my life today.

Now, I find myself walking in my parents' footsteps — making disciples in Lebanon and throughout the Middle East. But even beyond what my parents modeled for me, I'm thankful that God has called my family and me to a nation that is war-torn and in deep spiritual and economic darkness. Lebanon is in desperate need of hope, and we believe that the light of Christ will shine all the brighter in this time.

Our family will be returning to Beirut on October 29th, where I will be teaching the Bible to 6th-8th graders. It's a joy and privilege to share God's love and His Word with a predominantly Muslim audience, and to see hearts touched by the gospel.

Thank you so much for your generous donation toward what God is doing in Lebanon. Your partnership is a tangible expression of His grace extended to this region. May the Lord continue to bless you abundantly, fill you with His grace, and empower you in all that you do — for the sake of His glory.

With heartfelt gratitude,
Joel Lee`,
  },
  {
    slug: "residential-life-new-schedules",
    title: "Upcoming Residential Life / New Schedules",
    dek: "Bible study opens, D-pod and Vision Hall are renovated, and a Destresso Day is being built for finals.",
    category: "news",
    authorSlug: "jalen-park",
    date: "2025-11-01",
    issueSlug: "vol3-no20",
    page: 1,
    image: "/photos/residential-life-new-schedules.jpg",
    imageAlt: "A student and Mr. Knickerbocker throwing peace signs at the camera",
    tags: ["residential life", "school events"],
    content: `As autumn or winter begins, Valor's Residential Life team is preparing an exciting lineup of events designed to bring the dorm community closer together, from new events to vision hall revision, the programs aim to create a more engaging and supportive environment for students.

What's new?

## 1. Bible study is officially open

When life throws rocks at you, when friends are being annoying, when you don't know what to do, you need a bible. The Bible contains lots of life wisdom and quotes that can enhance your quality of life. So, bible study is open! Bible study will be divided into boys' and girls' time. Girls' bible study will be held at the student center at 3 pm every Monday. Boy's bible study will take place at the Student Center, 6:40 pm every Thursday.

## 2. The New D-pod and Vision Hall

Students need a well-furnished study area and resting area. Therefore, the Valor residential life team had decided to renovate D-pod and Vision Hall! From now on, D-pod will be a study area, and students have to keep the order of the study area just like the library. Vision Hall is now a new resting place for students! New furniture, new vibe, new community!

## 3. Destresso Day!

As finals are coming, Valor is planning a destress day! Destresso day is when all students are free from classes and are encouraged to relieve their stress. There will be stations with fun activities! They are building new stations that are more engaging, entertaining, and fun!

## Reminders this month

- For those planning to take AP tests, please remember to submit forms!
- Pepero day sales run by STUCO will continue until 11/11 in front of the Cafeteria every lunch time. All proceeds go towards funding for mission trips and school events.

*** If you have any events, reminders, or announcements you want to see in Valor Times, please contact us!`,
  },
];
