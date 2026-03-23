import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
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
  const configResult = await getConfigForClient();

  // If config failed, show error page
  if (!configResult.success) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
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
