import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isAuthenticated={!!session?.user} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
