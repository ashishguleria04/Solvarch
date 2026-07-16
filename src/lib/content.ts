import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

/**
 * Filesystem-backed learning content (System Design + CS Fundamentals).
 * Markdown files with frontmatter live under `content/`; they are read at
 * request time on the server and rendered with the shared Markdown component
 * (``` mermaid fences become diagrams).
 */

export type ContentVideo = { title: string; url: string };

export type ContentEntry = {
  slug: string;
  title: string;
  description: string;
  /**
   * system-design: case-study | hld | lld
   * cheatsheets: pattern | reference
   */
  category: "case-study" | "hld" | "lld" | "pattern" | "reference" | null;
  order: number;
  premium: boolean;
  tags: string[];
  videos: ContentVideo[];
  body: string;
  readingMinutes: number;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function parseFile(dir: string, filename: string): ContentEntry {
  const raw = fs.readFileSync(path.join(dir, filename), "utf8");
  const { data, content } = matter(raw);
  const body = content.trim();
  const words = body.split(/\s+/).length;
  return {
    slug: filename.replace(/\.mdx?$/, ""),
    title: String(data.title ?? filename),
    description: String(data.description ?? ""),
    category: (data.category as ContentEntry["category"]) ?? null,
    order: Number(data.order ?? 999),
    premium: Boolean(data.premium ?? false),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    videos: Array.isArray(data.videos)
      ? data.videos.map((v: { title?: string; url?: string }) => ({
          title: String(v.title ?? "Video"),
          url: String(v.url ?? "#"),
        }))
      : [],
    body,
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

function loadDir(relDir: string): ContentEntry[] {
  const dir = path.join(CONTENT_ROOT, relDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => parseFile(dir, f))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

// ------------------------------------------------------------ system design

export const getSystemDesignEntries = cache(async (): Promise<ContentEntry[]> => {
  return loadDir("system-design");
});

export const getSystemDesignEntry = cache(
  async (slug: string): Promise<ContentEntry | null> => {
    const entries = await getSystemDesignEntries();
    return entries.find((e) => e.slug === slug) ?? null;
  }
);

// -------------------------------------------------------------- cheat sheets

export const getCheatsheetEntries = cache(async (): Promise<ContentEntry[]> => {
  return loadDir("cheatsheets");
});

export const getCheatsheetEntry = cache(
  async (slug: string): Promise<ContentEntry | null> => {
    const entries = await getCheatsheetEntries();
    return entries.find((e) => e.slug === slug) ?? null;
  }
);

// -------------------------------------------------------------- fundamentals

export type CsSubject = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: string; // lucide icon name, resolved in the UI
};

export const CS_SUBJECTS: CsSubject[] = [
  {
    slug: "os",
    name: "Operating Systems",
    shortName: "OS",
    description: "Processes, threads, scheduling, memory, and synchronization.",
    icon: "Cpu",
  },
  {
    slug: "dbms",
    name: "Databases",
    shortName: "DBMS",
    description: "ACID, indexing, normalization, transactions, and SQL vs NoSQL.",
    icon: "Database",
  },
  {
    slug: "networks",
    name: "Computer Networks",
    shortName: "Networks",
    description: "TCP/IP, HTTP, DNS, TLS, and how requests actually travel.",
    icon: "Globe",
  },
  {
    slug: "oop",
    name: "Object-Oriented Programming",
    shortName: "OOP",
    description: "Pillars, SOLID, composition vs inheritance, and design intent.",
    icon: "Boxes",
  },
];

export const getCsSubject = (slug: string): CsSubject | null =>
  CS_SUBJECTS.find((s) => s.slug === slug) ?? null;

export const getCsTopics = cache(async (subject: string): Promise<ContentEntry[]> => {
  return loadDir(path.join("cs", subject));
});

export const getCsTopic = cache(
  async (subject: string, topic: string): Promise<ContentEntry | null> => {
    const topics = await getCsTopics(subject);
    return topics.find((t) => t.slug === topic) ?? null;
  }
);
