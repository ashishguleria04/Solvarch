// The spaced-repetition interval ladder, in days. Lives outside the
// "use client" store module so server components can read it too.

/** Rung i's next review is REVIEW_INTERVALS_DAYS[i] away. */
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;
