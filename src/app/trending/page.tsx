import { permanentRedirect } from "next/navigation";

/**
 * The section used to be called Trending, which it never was — nothing on it
 * was ranked by readership. It is Editor's Picks now; the old address still
 * resolves so no link anyone has shared goes dead.
 */
export default function TrendingPage() {
  permanentRedirect("/editors-picks");
}
