"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { CreditCard, Loader2, LogOut, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ManageBillingButton({
  isPro,
  hasBilling,
}: {
  isPro: boolean;
  hasBilling: boolean;
}) {
  const [loading, setLoading] = useState(false);

  if (!isPro && !hasBilling) {
    return (
      <Button asChild variant="glow" size="sm">
        <Link href="/pricing">
          <Sparkles className="size-3.5" />
          Upgrade
        </Link>
      </Button>
    );
  }

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't open the billing portal.");
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Couldn't reach billing.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={openPortal} disabled={loading}>
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <CreditCard className="size-3.5" />
      )}
      Manage billing
    </Button>
  );
}

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="size-3.5" />
      Sign out
    </Button>
  );
}
