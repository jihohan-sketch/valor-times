/**
 * The one story the desk is holding up this week.
 *
 * Kept as a slug rather than a flag on the article record because the
 * selection is singular by definition — `featured` and `editorsRank` describe
 * a set, this describes a choice. Changing the week's pick is a one-line edit
 * here, and the homepage simply drops the section if the slug ever stops
 * matching a story.
 *
 * Yujin Lee's other filed stories, if the desk wants a different one:
 *   olivia-rodrigo-two-new-singles · lando-norris-champion
 *   christmas-gift-guide · romanticise-fall
 */
export const ARTICLE_OF_THE_WEEK = "rhode-summer-2026";
