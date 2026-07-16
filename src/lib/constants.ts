export const APP_NAME = "Solvarch";

export type LanguageConfig = {
  id: "python" | "javascript" | "java" | "cpp";
  label: string;
  monaco: string;
  piston: { language: string; version: string };
  /** Paiza.IO language id (default execution provider). */
  paiza: string;
  /** Judge0 language id (used when JUDGE0 env is configured). */
  judge0: number;
  ext: string;
};

/**
 * Editor languages mapped to Monaco ids and Piston runtimes.
 * Versions are known-good on the public Piston API (emkc.org). The execution
 * client falls back to the latest available runtime for a language if the
 * pinned version is unavailable.
 */
export const LANGUAGES: LanguageConfig[] = [
  {
    id: "python",
    label: "Python",
    monaco: "python",
    piston: { language: "python", version: "3.10.0" },
    paiza: "python3",
    judge0: 71,
    ext: "py",
  },
  {
    id: "javascript",
    label: "JavaScript",
    monaco: "javascript",
    piston: { language: "javascript", version: "18.15.0" },
    paiza: "javascript",
    judge0: 63,
    ext: "js",
  },
  {
    id: "java",
    label: "Java",
    monaco: "java",
    piston: { language: "java", version: "15.0.2" },
    paiza: "java",
    judge0: 62,
    ext: "java",
  },
  {
    id: "cpp",
    label: "C++",
    monaco: "cpp",
    piston: { language: "c++", version: "10.2.0" },
    paiza: "cpp",
    judge0: 54,
    ext: "cpp",
  },
];

export function getLanguage(id: string): LanguageConfig | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

export const DEFAULT_LANGUAGE = "python";

/** Top-level product navigation (marketing + in-app). */
export const PRODUCT_NAV = [
  { label: "DSA", href: "/dsa" },
  { label: "Companies", href: "/companies" },
  { label: "System Design", href: "/system-design" },
  { label: "CS Fundamentals", href: "/cs" },
  { label: "Question Bank", href: "/questions" },
] as const;
