import type { Article } from "../types";

import { comics } from "./comics";
import { culture } from "./culture";
import { cuisine } from "./cuisine";
import { healthScience } from "./health-science";
import { news } from "./news";
import { opinions } from "./opinions";
import { psychology } from "./psychology";
import { socialIssues } from "./social-issues";

/**
 * The whole newsroom. Each section lives in its own file so publishing is a
 * matter of copying one object — routes, search, trending, category pages and
 * every homepage section read from here and need no other change.
 */
export const articles: Article[] = [
  ...news,
  ...socialIssues,
  ...culture,
  ...opinions,
  ...cuisine,
  ...healthScience,
  ...psychology,
  ...comics,
];
