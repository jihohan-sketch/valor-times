import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/lib/site";

const edition = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date());

/** The printed-paper masthead. Scrolls away; <SiteNav> takes over below it. */
export function Masthead() {
  return (
    <div className="border-b border-rule bg-paper">
      <div className="shell flex items-center justify-between gap-4 border-b border-rule py-2.5">
        <p className="kicker text-muted">{edition}</p>
        <p className="kicker hidden text-muted md:block">
          {site.tagline}
        </p>
        <p className="kicker text-muted">
          Vol. {site.founded ? new Date().getFullYear() - site.founded : 1} · No. 12
        </p>
      </div>

      <div className="shell py-7 text-center md:py-10">
        <Wordmark size="lg" className="text-ink" />
        <p className="kicker mt-4 text-muted md:mt-5">
          Independent student journalism · {site.domain}
        </p>
      </div>
    </div>
  );
}
