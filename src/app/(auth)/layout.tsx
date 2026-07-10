import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/design-system/logo";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute inset-0 bg-radial-glow" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo href="/" />
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-xl sm:p-8">
          {children}
        </div>
        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
