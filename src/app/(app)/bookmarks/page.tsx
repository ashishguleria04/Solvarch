import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, CheckCircle2, Circle, CircleDot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { auth } from "@/lib/auth";
import { getEntitlements } from "@/lib/entitlements";
import { getBookmarkedProblems } from "@/server/dashboard";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { DifficultyBadge } from "@/components/design-system/difficulty-badge";
import { PremiumBadge } from "@/components/design-system/premium-badge";

export const metadata: Metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const { isPro } = await getEntitlements();
  const bookmarks = userId ? await getBookmarkedProblems(userId) : [];

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <PageHeader
        title="Bookmarks"
        description="Problems you've saved to revisit."
      />

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing bookmarked yet"
          description="Use the bookmark button on any problem to save it here."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card/40 p-2">
          {bookmarks.map((b) => (
            <Link
              key={b.id}
              href={`/dsa/${b.slug}`}
              className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-card"
            >
              {b.progress === "SOLVED" ? (
                <CheckCircle2 className="size-4.5 shrink-0 text-emerald-400" />
              ) : b.progress === "ATTEMPTED" ? (
                <CircleDot className="size-4.5 shrink-0 text-amber-400" />
              ) : (
                <Circle className="size-4.5 shrink-0 text-muted-foreground/50" />
              )}
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium transition-colors group-hover:text-primary">
                  {b.title}
                </span>
                <p className="text-xs text-muted-foreground">
                  {b.topic.name} · saved{" "}
                  {formatDistanceToNow(b.bookmarkedAt, { addSuffix: true })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {b.isPremium && !isPro && <PremiumBadge />}
                <DifficultyBadge difficulty={b.difficulty} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
