// Helpers for reference solutions (run at seed time with local Node to
// generate exact expected outputs).

export const lines = (s: string): string[] => s.split("\n");

export const ints = (line: string | undefined): number[] =>
  (line ?? "")
    .trim()
    .split(/\s+/)
    .filter((x) => x.length > 0)
    .map(Number);

export const int = (line: string | undefined): number => parseInt((line ?? "0").trim(), 10);

export const boolOut = (b: boolean): string => (b ? "true" : "false");

export const arrOut = (a: number[]): string => a.join(" ");

/**
 * A real, always-valid YouTube search URL for a curated channel + topic.
 * Avoids fabricating specific video IDs while pointing learners at the right
 * creators (NeetCode, Abdul Bari, Tushar Roy, etc.). Upgradeable to exact
 * video links later.
 */
export const yt = (query: string): string =>
  "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
