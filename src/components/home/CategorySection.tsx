import { FeatureSection } from "@/components/home/sections/FeatureSection";
import { GallerySection } from "@/components/home/sections/GallerySection";
import { IndexSection } from "@/components/home/sections/IndexSection";
import { ListSection } from "@/components/home/sections/ListSection";
import { PinnedSection } from "@/components/home/sections/PinnedSection";
import { QuotesSection } from "@/components/home/sections/QuotesSection";
import { RailSection } from "@/components/home/sections/RailSection";
import { SplitSection } from "@/components/home/sections/SplitSection";
import type { Article, Category } from "@/data";

/**
 * Dispatches a section to its chosen presentation. Changing how a whole
 * section looks is a one-word edit in src/data/categories.ts.
 */
export function CategorySection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  switch (category.layout) {
    case "split":
      return <SplitSection category={category} articles={articles} />;
    case "list":
      return <ListSection category={category} articles={articles} />;
    case "rail":
      return <RailSection category={category} articles={articles} />;
    case "quotes":
      return <QuotesSection category={category} articles={articles} />;
    case "pinned":
      return <PinnedSection category={category} articles={articles} />;
    case "feature":
      return <FeatureSection category={category} articles={articles} />;
    case "index":
      return <IndexSection category={category} articles={articles} />;
    case "gallery":
      return <GallerySection category={category} articles={articles} />;
  }
}
