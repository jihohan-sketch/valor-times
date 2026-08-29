/** Single source of truth for the masthead, navigation and metadata. */
export const site = {
  name: "Valor Times",
  shortName: "VT",
  tagline: "Reported, argued and drawn by students.",
  description:
    "Valor Times is a student newsroom covering news, culture, opinion, science, food and comics.",
  domain: "valortimes.org",
  url: "https://valortimes.org",
  founded: 2019,
  email: "editors@valortimes.org",
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Newsletter", href: "/about" },
  ],
} as const;
