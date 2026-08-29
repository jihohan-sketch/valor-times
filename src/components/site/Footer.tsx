import Link from "next/link";

import { Wordmark } from "@/components/ui/Wordmark";
import { categories } from "@/data";
import { site } from "@/lib/site";

const desks = [
  { label: "About the paper", href: "/about" },
  { label: "Masthead", href: "/about#masthead" },
  { label: "Corrections", href: "/about#corrections" },
  { label: "Pitch a story", href: "/about#contribute" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-ink text-paper">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark size="md" className="text-paper" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/65">
              {site.description} Published continuously since {site.founded}.
            </p>
            <p className="kicker mt-7 text-paper/45">{site.email}</p>
          </div>

          <nav className="md:col-span-3" aria-label="Sections">
            <h2 className="kicker text-paper/45">Sections</h2>
            <ul className="mt-5 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="link-wipe text-[0.95rem] text-paper/85 transition-colors hover:text-paper"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label="The paper">
            <h2 className="kicker text-paper/45">The paper</h2>
            <ul className="mt-5 space-y-2.5">
              {desks.map((desk) => (
                <li key={desk.label}>
                  <Link
                    href={desk.href}
                    className="link-wipe text-[0.95rem] text-paper/85 transition-colors hover:text-paper"
                  >
                    {desk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="kicker text-paper/45">Follow</h2>
            <ul className="mt-5 space-y-2.5">
              {site.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="link-wipe text-[0.95rem] text-paper/85 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/15 pt-6 text-xs text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            {site.domain} · Written, edited and illustrated by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
