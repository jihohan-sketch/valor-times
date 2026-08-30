import { MosaicCard } from "@/components/cards/MosaicCard";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Mosaic } from "@/components/ui/Mosaic";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Article } from "@/data";
import { isPlate } from "@/data/plate";

/**
 * Spreads the shorter run evenly through the longer one.
 *
 * Multi-column fills a column top to bottom before starting the next, so the
 * order of this array is the order of the columns. Listing the five back-page
 * plates one after another would drop all five into a single column and the
 * board would read as two sections standing beside each other, which is the one
 * thing it is here to stop being.
 */
function interleave(long: Article[], short: Article[]): Article[] {
  if (short.length === 0) return long;

  const every = Math.max(1, Math.round(long.length / short.length));
  const out: Article[] = [];
  let next = 0;

  long.forEach((article, i) => {
    out.push(article);
    if ((i + 1) % every === 0 && next < short.length) out.push(short[next++]);
  });

  return [...out, ...short.slice(next)];
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The picture desk's board.
 *
 * Everything above this on the front page is a frame the artwork had to fit:
 * the cover is a 21:9 band, the Culture rail is a run of 4:5 portraits, the
 * back page is a shelf of plates standing at one height. Those frames are what
 * make the page read as a printed paper, and none of them are going anywhere —
 * but between them they have cropped a photograph of a claw machine to a
 * portrait, left nine Culture stories with no frame at all, and shown the drawn
 * pages only sideways, one at a time.
 *
 * So the desk pins the leftovers to a board. It draws from the two sections
 * whose artwork is the most unlike itself — Culture, where a panorama sits next
 * to a square album cover, and the back page, where a landscape Psalm runs
 * among portrait comics — and gives every piece its own proportions. Nothing is
 * cut, so the columns come out ragged, and the raggedness is the argument: it
 * is the only place on the front page where you see what shape the artwork
 * actually is.
 *
 * It is placed after the sections rather than among them on purpose. A board is
 * only legible as a board once the reader has spent a page reading frames, and
 * the contrast between the rail two sections up and this is the whole point.
 */
export function PictureDesk({
  culture,
  backPage,
}: {
  /** Culture & Lifestyle stories the rail above could not fit. */
  culture: Article[];
  /** The back page's drawn plates, in the order they were printed. */
  backPage: Article[];
}) {
  const board = interleave(culture, backPage);
  if (board.length === 0) return null;

  const plates = board.filter(isPlate).length;
  const photographs = board.length - plates;

  return (
    <section className="shell band" aria-labelledby="picture-desk">
      <Reveal>
        <SectionHead
          id="picture-desk"
          kicker="Pinned up"
          title="The Picture Desk"
          description="The artwork the rails had to crop or leave behind, pinned at the size it was actually drawn: clippings of printed type, the back page's plates, and photographs standing together for once."
          note={
            <>
              <span className="text-red">{pad(plates)}</span> plates
              <span className="mx-2 opacity-40">/</span>
              <span className="text-red">{pad(photographs)}</span> photographs
            </>
          }
        />
      </Reveal>

      {/* The board is not wrapped in a single Reveal the way a rail is. One
          mask over a column three screens tall would clear the bottom of the
          board while the reader is still at the top of it; each card carries
          its own instead, so a piece is pinned up as it is reached. */}
      <div className="mt-10 md:mt-14">
        <Mosaic
          count={board.length}
          label="Culture and back-page artwork"
          action={
            <ArrowLink href="/archive" size="sm">
              Every piece filed
            </ArrowLink>
          }
        >
          {board.map((article, i) => (
            <MosaicCard
              key={article.slug}
              article={article}
              /* Cards in the same row arrive together and need separating;
                 past four the stagger stops being punctuation and starts
                 being a wait, so it caps. */
              delay={Math.min(i * 45, 180)}
            />
          ))}
        </Mosaic>
      </div>
    </section>
  );
}
