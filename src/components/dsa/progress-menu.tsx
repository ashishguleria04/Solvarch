"use client";

// Export / import / reset menu for local data. Extracted from dsa-progress so
// the /progress dashboard can offer the same controls. Exports bundle notes
// alongside progress; imports accept both new bundles and old progress-only
// files (extra keys are ignored by the progress schema).

import { useRef, useState } from "react";
import { Download, MoreVertical, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  exportFileName,
  importProgress,
  resetProgress,
  serializeProgress,
} from "@/lib/progress";
import { importNotes, notesForExport } from "@/lib/notes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProgressMenu({ hasProgress }: { hasProgress: boolean }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  function handleExport() {
    const bundle = {
      ...JSON.parse(serializeProgress()),
      notes: notesForExport(),
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportFileName();
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Progress exported.");
  }

  async function handleImportFile(file: File) {
    const text = await file.text();
    const result = importProgress(text);
    if (result.ok) {
      let notes = 0;
      try {
        notes = importNotes(JSON.parse(text));
      } catch {
        // Progress import already succeeded; a notes failure is non-fatal.
      }
      toast.success(
        `Progress imported — ${result.solved} problem${result.solved === 1 ? "" : "s"} solved` +
          (notes > 0 ? `, ${notes} note${notes === 1 ? "" : "s"}.` : ".")
      );
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
          e.target.value = "";
        }}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Progress options">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleExport} disabled={!hasProgress}>
            <Download className="size-4" />
            Export progress
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => fileInput.current?.click()}>
            <Upload className="size-4" />
            Import progress
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setConfirmReset(true)}
            disabled={!hasProgress}
          >
            <Trash2 className="size-4" />
            Reset progress
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all progress?</DialogTitle>
            <DialogDescription>
              This clears every solved and attempted problem, your completed
              reading marks, and your streak from this browser. Progress is
              stored locally only, so this can&apos;t be undone — export a
              backup first if you might want it back.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                toast.success("Progress reset.");
              }}
            >
              Reset everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
