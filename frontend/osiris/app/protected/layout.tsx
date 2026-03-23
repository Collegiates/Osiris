import { SidebarNav } from "@/components/sidebar-nav";
import { TopStatusBar } from "@/components/top-status-bar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ConnectivityBanner } from "@/components/connectivity-banner";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Skip auth entirely in dev mode (DEV_MODE=true in .env.local)
  const devMode = process.env.DEV_MODE === "true";

  if (!devMode) {
    // Only import and run Supabase auth in production
    const { createClient } = await import("@/lib/supabase/server");
    const { redirect } = await import("next/navigation");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopStatusBar />
        <ConnectivityBanner />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

