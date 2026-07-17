// Tiny dependency-free fuzzy matcher for the command palette. Higher score =
// better match; null = no match. Tuned for short titles: exact > prefix >
// word-boundary substring > substring > subsequence.

export function fuzzyScore(query: string, target: string): number | null {
  const q = query.trim().toLowerCase();
  const t = target.toLowerCase();
  if (!q) return 0;
  if (q === t) return 1000;
  if (t.startsWith(q)) return 800 - t.length;

  const idx = t.indexOf(q);
  if (idx > 0) {
    const boundary = /[\s\-_/·]/.test(t[idx - 1]);
    return (boundary ? 600 : 400) - idx - t.length * 0.1;
  }

  // Subsequence walk: reward consecutive runs and word-boundary hits,
  // penalize gaps, so "bts" finds "Binary Tree Search" over noise.
  let score = 100;
  let ti = 0;
  let prevHit = -2;
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    const found = t.indexOf(ch, ti);
    if (found === -1) return null;
    if (found === prevHit + 1) score += 8;
    if (found === 0 || /[\s\-_/·]/.test(t[found - 1])) score += 12;
    score -= (found - ti) * 0.5;
    prevHit = found;
    ti = found + 1;
  }
  return score - t.length * 0.1;
}

/** Score an item against its title and (half-weighted) keywords. */
export function scoreItem(
  query: string,
  title: string,
  keywords?: string
): number | null {
  const titleScore = fuzzyScore(query, title);
  const keywordScore = keywords ? fuzzyScore(query, keywords) : null;
  if (titleScore === null && keywordScore === null) return null;
  return Math.max(titleScore ?? -Infinity, (keywordScore ?? -Infinity) / 2);
}
