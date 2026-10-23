import type { Metadata } from "next";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `What ${site.name} collects, why, where it is kept, and how to have it removed.`,
  alternates: { canonical: "/privacy" },
};

/**
 * Every sentence here has to be true of the code as it stands. Before you
 * change what the site collects — a sign-in, analytics, a database, a new
 * email sender — change this page in the same commit and move
 * LAST_UPDATED. It is the published account of what the paper does with
 * people's information.
 *
 * Where each claim comes from:
 *   comments, likes, views src/lib/engagement/
 *   IP addresses           src/lib/request-ip.ts, src/lib/rate-limit.ts
 *   editor cookie          src/lib/cms/auth.ts
 *   no third-party scripts next.config.ts (CSP) and next/font (self-hosted)
 */
const LAST_UPDATED = "October 23, 2026";

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "summary",
    title: "The short version",
    body: (
      <>
        <p>
          Reading {site.name} does not require an account, and readers never sign in. We do not
          run ads, analytics or tracking cookies, and we do not sell or rent anyone’s
          information.
        </p>
        <p>
          The site sends no email of its own, and no reader’s Google account is ever
          connected to it.
        </p>
      </>
    ),
  },
  {
    id: "readers",
    title: "What we collect from readers",
    body: (
      <>
        <p>
          <strong>Comments.</strong> If you post a comment we store the name you typed (or
          “Anonymous” if you left it blank), what you wrote, when you posted it, and a random
          browser ID (see below). Your name, comment and the time are shown publicly under the
          story. The browser ID is never shown. Please don’t put personal details, like your
          phone number or address, in a comment.
        </p>
        <p>
          <strong>Likes.</strong> When you like a story we store your random browser ID against
          that story, so the button can be a toggle and you can take the like back.
        </p>
        <p>
          <strong>Views.</strong> We keep a single view count per story. To avoid counting the
          same reader twice, your browser ID and the story are kept briefly in the
          server’s memory. They are never saved.
        </p>
        <p>
          <strong>Your browser ID.</strong> The first time you open a story, your own browser
          makes up a random code and keeps it in its local storage (<code>vt.reader</code>).
          It isn’t linked to your name, email or any account. It only lets your browser delete
          its own comments and undo its own likes. The name you last commented with is also
          kept in your browser (<code>vt.reader.name</code>) so you don’t have to retype it.
          Clearing your browser’s site data removes both.
        </p>
        <p>
          <strong>IP addresses.</strong> To stop spam and password guessing, the server briefly
          uses the IP address of a request to limit how often comments can be posted, views
          counted and editor sign-ins attempted. These counts live only in the server’s memory, are
          never written to storage, and are gone whenever the server restarts.
        </p>
        <p>
          <strong>Cookies.</strong> Readers get no cookies from this site. Editors who sign in
          to the newsroom desk get one cookie (<code>vt_admin</code>) that keeps them signed in
          for up to 12 hours.
        </p>
        <p>
          <strong>Email to us.</strong> If you email the desk or the webmaster, for example to
          pitch a story, your message is kept in that school inbox like any other email.
        </p>
      </>
    ),
  },
  {
    id: "storage",
    title: "Where it is stored and for how long",
    body: (
      <>
        <p>
          Comments, likes and view counts are stored on the servers that run the site, hosted
          by Vercel. There is no separate database. There is no fixed date on which they are
          deleted: a comment stays until you delete it, or the paper removes it, and a like
          stays until you undo it. Because of how the site is currently hosted, this data can
          also be cleared when the site is updated or restarted, so it should not be treated as
          a permanent record.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who else handles information",
    body: (
      <>
        <p>We do not sell, rent or trade personal information. These services are involved in running the site:</p>
        <ul>
          <li>
            <strong>Vercel</strong> hosts the website and stores the data described above. Like
            any web host, it processes request details such as IP addresses to deliver pages
            and keep the service secure, under{" "}
            <a className="link-draw text-ink" href="https://vercel.com/legal/privacy-policy">Vercel’s Privacy Policy</a>.
          </li>
          <li>
            <strong>GitHub</strong> stores the site’s code. It receives no information about
            readers.
          </li>
        </ul>
        <p>
          We use no other authentication, database, analytics or advertising services. The
          site’s fonts are served from our own domain, so loading a page does not contact
          Google Fonts or any other third party.
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    title: "Seeing or deleting your information",
    body: (
      <>
        <p>
          You can delete your own comments from the same browser you posted them with, and
          undo a like by pressing it again. Clearing this site’s data in your browser removes
          your browser ID and saved name.
        </p>
        <p>
          To ask what we hold about you, to have a comment removed, or for anything else about your information, email the webmaster at{" "}
          <a className="link-draw text-ink" href={`mailto:${site.webmaster.email}`}>{site.webmaster.email}</a>. Comments are
          not tied to an account, so tell us the story, the name you used and roughly when you
          posted so we can find it. Questions about the paper itself go to the desk at{" "}
          <a className="link-draw text-ink" href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "How information is protected",
    body: (
      <>
        <p>
          The whole site is served over HTTPS only. The editors’ password lives in encrypted
          server-side settings, never in the site’s code or in a web page. The newsroom desk is password-protected with sign-in attempts
          rate-limited, and the site blocks scripts from other websites from running on its
          pages. No system is perfectly secure, but we collect as little as we can so there is
          little to lose.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <>
        <p>
          If what the site collects or how it uses information changes, we will update this
          page and the “last updated” date at the top before the change goes live. This page
          is always available at{" "}
          <a className="link-draw text-ink" href="/privacy">{`${site.domain}/privacy`}</a>, linked from the
          bottom of every page.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <header className="shell pt-12 pb-10 md:pt-20 md:pb-14">
        <span className="kicker text-red">Last updated {LAST_UPDATED}</span>
        <h1 className="display-tight mt-5 text-[clamp(2.75rem,8vw,6rem)]">Privacy Policy</h1>
        <p className="mt-7 max-w-2xl text-xl leading-relaxed text-ink-2">
          What {site.name} collects, why, where it is kept, who else handles it, and how to
          have it removed. {site.name} is run by the student staff listed on the About page.
        </p>
      </header>

      <div className="shell pb-16 md:pb-24">
        <div className="grid gap-12 border-t-2 border-ink pt-8 lg:grid-cols-12 lg:gap-14">
          <nav aria-label="On this page" className="lg:col-span-3">
            <p className="kicker text-red">On this page</p>
            <ol className="mt-5 space-y-2.5">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-[0.95rem] text-ink-2 transition-colors hover:text-red"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-2xl lg:col-span-9">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-28 border-t border-rule pt-6 pb-10 first:border-t-0 first:pt-0"
              >
                <h2 id={`${section.id}-title`} className="display text-[clamp(1.75rem,3vw,2.25rem)]">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-ink-2 [&_code]:text-[0.9em] [&_li]:pl-1 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-5">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
