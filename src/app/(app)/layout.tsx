import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getEntitlements } from "@/lib/entitlements";
import { getStreak } from "@/server/stats";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [entitlements, streak] = await Promise.all([
    getEntitlements(),
    getStreak(session.user.id),
  ]);

  return (
    <div className="min-h-screen">
      <AppSidebar isPro={entitlements.isPro} />
      <div className="lg:pl-64">
        <AppTopbar
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
          isPro={entitlements.isPro}
          streak={streak}
        />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
