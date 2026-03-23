import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PrintGuard AI — Real-Time 3D Print Monitoring",
  description:
    "AI-powered computer vision that watches your 3D printers and stops failures before they waste filament and time.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

import { getConfigForClient } from "@/lib/supabase/server";
import SupabaseProvider from "@/components/supabase-provider";
import { ConfigError } from "@/components/config-error";
import { BackendHealthProvider } from "@/components/backend-health-provider";
import { BackendStatusToast } from "@/components/backend-status-toast";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const devMode = process.env.DEV_MODE === "true";

  // ── DEV MODE: skip Supabase entirely ─────────────────────────────
  if (devMode) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.className} antialiased`}>
          <BackendHealthProvider>
            {children}
            <BackendStatusToast />
          </BackendHealthProvider>
        </body>
      </html>
    );
  }

  // ── PRODUCTION: fetch Supabase config from backend ────────────────
  const configResult = await getConfigForClient();

  // If config failed, show error page
  if (!configResult.success) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ConfigError errorType={configResult.errorType} errorMessage={configResult.error} />
          </ThemeProvider>
        </body>
      </html>
    );
  }

  // Config succeeded, render normal layout
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <BackendHealthProvider>
            <SupabaseProvider
              supabaseUrl={configResult.config.NEXT_PUBLIC_SUPABASE_URL}
              supabaseKey={configResult.config.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}
            >
              {children}
            </SupabaseProvider>
            <BackendStatusToast />
          </BackendHealthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
