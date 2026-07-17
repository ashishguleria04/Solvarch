"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNote, useNotes } from "@/lib/notes";
import { useActivePractice } from "@/lib/practice";

export function ProblemInfoTabs({
  slug,
  description,
  editorial,
  hints,
  notes,
}: {
  slug: string;
  description: React.ReactNode;
  editorial: React.ReactNode;
  hints: React.ReactNode;
  notes: React.ReactNode;
}) {
  const [tab, setTab] = useState("description");

  // During a timed self-practice session the editorial and hints are locked —
  // no feedback, no peeking. The active tab is derived so a running session
  // always pins the description, no effect needed.
  const practice = useActivePractice();
  const locked = practice?.slug === slug;
  const activeTab = locked ? "description" : tab;

  // Notes are the learner's own writing, so they stay available even during
  // a timed practice session. The dot marks problems that have a note.
  const hasNote = !!getNote(useNotes(), slug)?.text.trim();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <Link
          href="/dsa"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Problems
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setTab} className="flex min-h-0 flex-1 flex-col gap-0">
        <TabsList className="mx-4 mt-3 w-fit">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger
            value="editorial"
            disabled={locked}
            title={locked ? "Locked during timed practice" : undefined}
          >
            {locked && <Lock className="size-3.5" />}
            Editorial
          </TabsTrigger>
          <TabsTrigger
            value="hints"
            disabled={locked}
            title={locked ? "Locked during timed practice" : undefined}
          >
            {locked && <Lock className="size-3.5" />}
            Hints
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notes
            {hasNote && (
              <span
                className="size-1.5 rounded-full bg-primary"
                aria-label="Has a note"
              />
            )}
          </TabsTrigger>
        </TabsList>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
          <TabsContent value="description" className="mt-0">
            {description}
          </TabsContent>
          <TabsContent value="editorial" className="mt-0">
            {editorial}
          </TabsContent>
          <TabsContent value="hints" className="mt-0">
            {hints}
          </TabsContent>
          <TabsContent value="notes" className="mt-0 h-full">
            {notes}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
