"use client";

// Theme preference — light / dark / system — persisted to localStorage and
// applied as the `dark` class on <html>. The root layout runs an inline
// script with the same logic before first paint (see src/app/layout.tsx),
// so this module only has to keep the class in sync after hydration.

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "solvarch.theme";
const CHANGE_EVENT = "solvarch:theme-change";
/** No stored preference falls back to dark — Solvarch is dark-first. */
const DEFAULT_THEME: Theme = "dark";

function readTheme(): Theme {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return raw === "light" || raw === "dark" || raw === "system"
      ? raw
      : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function isDark(theme: Theme): boolean {
  return theme === "system" ? systemPrefersDark() : theme === "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", isDark(theme));
}

export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable — still apply for this session.
  }
  applyTheme(theme);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  // `storage` fires only in other tabs; keep the class in sync there too.
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === THEME_STORAGE_KEY) {
      applyTheme(readTheme());
      onChange();
    }
  };
  // OS-level scheme flips only matter while following the system.
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => {
    if (readTheme() === "system") {
      applyTheme("system");
      onChange();
    }
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onMedia);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onMedia);
  };
}

/** The stored preference ("light" | "dark" | "system"). Server-renders "dark". */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);
}

/** What is actually on screen — "system" resolved. Server-renders "dark". */
export function useResolvedTheme(): "light" | "dark" {
  return useSyncExternalStore(
    subscribe,
    () => (isDark(readTheme()) ? "dark" : "light"),
    () => "dark"
  );
}
