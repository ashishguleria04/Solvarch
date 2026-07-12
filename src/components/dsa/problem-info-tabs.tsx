"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProblemInfoTabs({
  description,
  editorial,
  hints,
}: {
  description: React.ReactNode;
  editorial: React.ReactNode;
  hints: React.ReactNode;
}) {
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

      <Tabs defaultValue="description" className="flex min-h-0 flex-1 flex-col gap-0">
        <TabsList className="mx-4 mt-3 w-fit">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="editorial">Editorial</TabsTrigger>
          <TabsTrigger value="hints">Hints</TabsTrigger>
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
        </div>
      </Tabs>
    </div>
  );
}
