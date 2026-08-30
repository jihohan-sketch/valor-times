import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import { ViewTransition } from "react";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { buildSearchIndex } from "@/lib/search-index";
import { site } from "@/lib/site";

import "./globals.css";

export const dynamic = "force-dynamic";

/** Display face: high-contrast, set large and tight. Headlines only. */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

/** Text face: a grotesque that stays crisp from 11px kickers to body copy. */
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const searchIndex = buildSearchIndex();

  return (
    /* The inline script below stamps `data-overture` on this element before
       React hydrates, which is the whole point of it — so the attribute
       difference it creates is expected rather than a bug. */
    <html
      lang="en"
      className={`${instrument.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          The front page opens on a scroll-driven sequence (see Overture). A
          reader who has already watched it this session must never see another
          frame of it — so that decision is made here, before the first paint,
          rather than in an effect a frame later.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('vt:overture-seen')==='1'){document.documentElement.dataset.overture='done'}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <Header index={searchIndex} />
        {/*
          Route changes are a cut, and a cut between two pages of the same
          publication should read as turning a page rather than as replacing
          one. This boundary is what makes the browser run a view transition at
          all — React starts one when the content inside it changes, which on a
          navigation is everything below the masthead. What that transition
          then looks like is CSS: see `::view-transition-*` in globals.css,
          where the old page leaves quickly and the new one rises in behind it.

          The masthead itself is deliberately outside: it carries its own
          `view-transition-name` and is pinned still through the whole thing, so
          the reader keeps one fixed reference point while the page beneath it
          changes.
        */}
        <ViewTransition>
          <main id="main">{children}</main>
        </ViewTransition>
        <Footer />
      </body>
    </html>
  );
}
