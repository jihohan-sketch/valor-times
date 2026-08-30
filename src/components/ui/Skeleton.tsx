/**
 * The shape of a page, printed in rules, while its data is on the way.
 *
 * Deliberately not a shimmer: a pulsing grey block is a spinner wearing a
 * costume, and it says nothing about what is coming. These are the real rules
 * and the real measures of the page being loaded, so the layout does not jump
 * when the words arrive — the type simply lands on the lines already drawn.
 */
export function Skeleton({ variant }: { variant: "article" | "section" }) {
  if (variant === "article") {
    return (
      <div className="shell pt-10 md:pt-16" aria-hidden="true">
        <div className="mx-auto max-w-3xl">
          <Bar className="h-2.5 w-28 bg-red/25" />
          <Bar className="mt-7 h-9 w-full md:h-14" />
          <Bar className="mt-3 h-9 w-4/5 md:h-14" />
          <Bar className="mt-8 h-4 w-11/12" />
          <Bar className="mt-3 h-4 w-3/4" />
          <div className="mt-9 border-t border-rule pt-5">
            <Bar className="h-3 w-56" />
          </div>
        </div>
        <div className="mt-10 aspect-[16/9] w-full bg-shell md:mt-14 md:aspect-[21/9]" />
        <div className="mx-auto mt-12 max-w-3xl md:mt-16">
          {/* Written out rather than interpolated: Tailwind scans source text,
              so a class built at runtime is a class that never ships. */}
          {[
            "w-full",
            "w-[92%]",
            "w-full",
            "w-[78%]",
            "w-[95%]",
            "w-[58%]",
          ].map((width, i) => (
            <Bar key={i} className={`mt-4 h-4 ${width}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10 md:py-16" aria-hidden="true">
      <div className="border-b-2 border-ink pb-8">
        <Bar className="h-2.5 w-32 bg-red/25" />
        <Bar className="mt-6 h-12 w-2/3 md:h-20" />
        <Bar className="mt-7 h-4 w-full max-w-2xl" />
      </div>
      <div className="mt-12 grid gap-x-14 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="aspect-[16/10] w-full bg-shell" />
          <Bar className="mt-6 h-7 w-11/12" />
          <Bar className="mt-3 h-7 w-2/3" />
        </div>
        <div className="lg:col-span-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-rule py-6">
              <Bar className="h-2.5 w-20 bg-red/25" />
              <Bar className="mt-3 h-5 w-full" />
              <Bar className="mt-2.5 h-5 w-3/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bar({ className = "" }: { className?: string }) {
  return <span className={`block bg-shell ${className}`} />;
}
