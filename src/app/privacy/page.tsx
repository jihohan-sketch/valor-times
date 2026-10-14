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
 * Google scope — change this page in the same commit and move LAST_UPDATED.
 * Google's OAuth branding review reads this page, and it is the published
 * account of what the paper does with people's information.
 *
 * Where each claim comes from:
 *   Google OAuth / Gmail   scripts/gmail-auth.mjs, src/lib/notify/
 *   comments, likes, views src/lib/engagement/
 *   IP addresses           src/lib/request-ip.ts, src/lib/rate-limit.ts
 *   editor cookie          src/lib/cms/auth.ts
 *   no third-party scripts next.config.ts (CSP) and next/font (self-hosted)
 */
const LAST_UPDATED = "October 15, 2026";

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
          The site uses Google sign-in (OAuth) for one thing only: the paper’s own Gmail
          account, {"timesvalor@gmail.com"}, authorizes the site to send a “new stories are
          up” email from that account. No reader’s Google account is ever connected to this
          site.
        </p>
      </>
    ),
  },
  {
    id: "google",
    title: "Google sign-in and Gmail",
    body: (
      <>
        <p>
          When a member of the newsroom connects the paper’s Gmail account, Google asks that
          account to approve these permissions, and these only:
        </p>
        <ul>
          <li>
            <strong>Send email on your behalf</strong> (<code>gmail.send</code>). This lets
            the site send the news email from the paper’s account. It cannot read, search,
            change or delete anything in the inbox.
          </li>
          <li>
            <strong>Your email address</strong> (<code>openid</code>, <code>email</code>). It is
            checked once, during setup, to confirm the right account signed in. It is not saved
            anywhere.
          </li>
        </ul>
        <p>
          We do not request the account’s name, profile picture, contacts, calendar or any
          other Google data.
        </p>
        <p>
          <strong>How it works.</strong> After the account approves, Google gives the site a
          “refresh token,” a key that lets it ask Google for short-lived permission to send
          each email. That token is stored as an encrypted environment variable on our host,
          Vercel, is used only by the site’s server, and is never shown in a web page. It is
          kept until the paper revokes access or replaces it. The account owner can revoke it
          at any time from{" "}
          <a className="link-draw text-ink" href="https://myaccount.google.com/permissions">
            myaccount.google.com/permissions
          </a>
          , which stops the site from sending email immediately.
        </p>
        <p>
          <strong>Limited use.</strong> {site.name}’s use and transfer of information received
          from Google APIs adheres to the{" "}
          <a className="link-draw text-ink" href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. Google data is used only to send the news
          email, is not shared with anyone, is not used for advertising, and is not used to
          train AI or machine-learning models.
        </p>
      </>
    ),
  },
  {
    id: "news-email",
    title: "The news email",
    body: (
      <>
        <p>
          When new stories are published, one email goes to a list of school email addresses
          and mailing lists from the Valor community. The list is kept as an encrypted
          environment variable on Vercel, not in the site’s public code, and it is used for
          nothing except this email. The email contains the new stories’ headlines, bylines,
          summaries and links. It has no tracking pixels and no tracking parameters on its
          links.
        </p>
        <p>
          The email is sent through Gmail, so Google handles the message and its recipient
          list under{" "}
          <a className="link-draw text-ink" href="https://policies.google.com/privacy">Google’s Privacy Policy</a>. To stop
          receiving it, email the webmaster (below).
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
        <p>
          The Gmail refresh token and the news email list are stored as encrypted environment
          variables on Vercel and kept until the paper replaces or removes them.
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
            <strong>Google</strong> provides the OAuth sign-in for the paper’s Gmail account and
            delivers the news email, under{" "}
            <a className="link-draw text-ink" href="https://policies.google.com/privacy">Google’s Privacy Policy</a>.
          </li>
          <li>
            <strong>GitHub</strong> stores the site’s code. When a new version goes live, an
            automated job tells the site which stories are new so it can send the news email.
            That message contains only story names, no personal information.
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
          To ask what we hold about you, to have a comment removed, to come off the news email
          list, or for anything else about your information, email the webmaster at{" "}
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
          The whole site is served over HTTPS only. Google credentials, the email list and the
          editors’ password live in encrypted server-side settings, never in the site’s code or
          in a web page. Gmail access is limited to sending, so even a leaked token could not
          read the paper’s inbox. The newsroom desk is password-protected with sign-in attempts
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
          have it removed. {site.name} is run by students of Valor Christian Learning
          Community.
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
