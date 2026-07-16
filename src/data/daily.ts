// Slim, server-built catalog for the daily practice set. Imported only by
// server components and passed as props, so the full problem catalog (test
// cases included) never reaches the client bundle.

import { problems } from "./dsa";
import type { DailyCatalogEntry } from "@/components/marketing/daily-problem";

export const dailyCatalog: DailyCatalogEntry[] = problems.map((p) => ({
  slug: p.slug,
  title: p.title,
  difficulty: p.difficulty,
  topicName: p.topic.name,
  tags: p.tags,
  hasEditorial: !!(p.editorial || (p.approaches?.length ?? 0) > 0),
}));
