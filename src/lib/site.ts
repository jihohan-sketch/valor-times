/** Single source of truth for the masthead, navigation and metadata. */
export const site = {
  name: "Valor Times",
  shortName: "VT",
  tagline: "The student paper of Valor International School.",
  description:
    "Valor Times is the student newspaper of Valor International School, covering school news, culture, opinion, science, food, comics and the Bible section.",
  domain: "valortimes.org",
  url: "https://valortimes.org",
  founded: 2023,
  email: "harim.oh@valorschool.org",
  instagram: "https://instagram.com/valortimes_",
  social: [
    { label: "Instagram", href: "https://instagram.com/valortimes_" },
    { label: "Newsletter", href: "/about" },
  ],
} as const;
