// Server-built search index for the global command palette (Ctrl+K).
// Everything searchable in the app — problems, roadmaps, companies, content
// pages — flattened into lightweight items the client can fuzzy-filter.
// Built once per request in the root layout and passed down as props.

import { problems, topics } from "@/data/dsa";
import { roadmaps } from "@/data/roadmaps";
import { companies } from "@/data/companies";
import {
  CS_SUBJECTS,
  getCheatsheetEntries,
  getCsTopics,
  getSystemDesignEntries,
} from "@/lib/content";

export type SearchGroup =
  | "Pages"
  | "Problems"
  | "Topics"
  | "Roadmaps"
  | "Companies"
  | "System Design"
  | "Cheat Sheets"
  | "CS Fundamentals";

export type SearchItem = {
  title: string;
  /** In-app path the palette navigates to on select. */
  path: string;
  group: SearchGroup;
  /** Short right-aligned context, e.g. "Medium · Graphs". */
  hint?: string;
  /** Extra match text (tags, topic names) — searched at lower weight. */
  keywords?: string;
};

const DIFFICULTY_LABEL = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" } as const;

// Mirrors the sidebar nav; defined here (not imported from the client nav
// module) so this stays a pure server module.
const PAGES: SearchItem[] = [
  { title: "DSA Problems", path: "/dsa", group: "Pages" },
  { title: "Progress", path: "/progress", group: "Pages", keywords: "stats dashboard streak heatmap" },
  { title: "Interview Plan", path: "/plan", group: "Pages", keywords: "countdown planner interview date pace schedule daily" },
  { title: "Roadmaps", path: "/roadmaps", group: "Pages" },
  { title: "Review", path: "/review", group: "Pages", keywords: "spaced repetition due" },
  { title: "Cheat Sheets", path: "/cheatsheets", group: "Pages" },
  { title: "Companies", path: "/companies", group: "Pages" },
  { title: "System Design", path: "/system-design", group: "Pages" },
  { title: "CS Fundamentals", path: "/cs", group: "Pages" },
  { title: "Question Bank", path: "/questions", group: "Pages", keywords: "behavioral hr interview" },
  { title: "Home", path: "/", group: "Pages", keywords: "landing" },
];

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const [systemDesign, cheatsheets, csTopicsBySubject] = await Promise.all([
    getSystemDesignEntries(),
    getCheatsheetEntries(),
    Promise.all(CS_SUBJECTS.map((s) => getCsTopics(s.slug))),
  ]);

  return [
    ...PAGES,
    ...problems.map((p) => ({
      title: p.title,
      path: `/dsa/${p.slug}`,
      group: "Problems" as const,
      hint: `${DIFFICULTY_LABEL[p.difficulty]} · ${p.topic.name}`,
      keywords: `${p.topic.name} ${p.tags.join(" ")}`,
    })),
    ...topics.map((t) => ({
      title: t.name,
      path: `/dsa?topic=${t.slug}`,
      group: "Topics" as const,
      hint: `${t.problemCount} problems`,
      keywords: t.description,
    })),
    ...roadmaps.map((r) => ({
      title: r.name,
      path: `/roadmaps/${r.slug}`,
      group: "Roadmaps" as const,
      keywords: r.tagline,
    })),
    ...companies.map((c) => ({
      title: c.name,
      path: `/companies/${c.slug}`,
      group: "Companies" as const,
      hint: `${c.questions.length} questions`,
    })),
    ...systemDesign.map((e) => ({
      title: e.title,
      path: `/system-design/${e.slug}`,
      group: "System Design" as const,
      hint: e.category === "case-study" ? "Case study" : e.category?.toUpperCase(),
      keywords: e.tags.join(" "),
    })),
    ...cheatsheets.map((e) => ({
      title: e.title,
      path: `/cheatsheets/${e.slug}`,
      group: "Cheat Sheets" as const,
      keywords: e.tags.join(" "),
    })),
    ...CS_SUBJECTS.flatMap((s, i) =>
      csTopicsBySubject[i].map((t) => ({
        title: t.title,
        path: `/cs/${s.slug}/${t.slug}`,
        group: "CS Fundamentals" as const,
        hint: s.shortName,
        keywords: `${s.name} ${t.tags.join(" ")}`,
      }))
    ),
  ];
}
