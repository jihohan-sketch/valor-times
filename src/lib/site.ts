/** Single source of truth for the masthead, navigation and metadata. */
export const site = {
  name: "The Valor Times",
  shortName: "VT",
  tagline: "Community news reported by the people who live it.",
  description:
    "The Valor Times covers local news, social issues, culture, opinion, science, food, comics and the Bible section.",
  domain: "valortimes.org",
  url: "https://valortimes.org",
  founded: 2023,
  email: "harim.oh@valorschool.org",
  /** Who built and maintains this site. Anything about the website itself —
      a bug, a missing issue, a feature — goes here, not to the desk. */
  webmaster: {
    name: "Jiho Han",
    role: "Site design & development",
    email: "jiho.han@valorschool.org",
  },
  instagram: "https://instagram.com/valortimes_",
  /** Where the paper actually is off-site. Nothing here is aspirational. */
  social: [
    { label: "Instagram", href: "https://instagram.com/valortimes_" },
  ],
} as const;
