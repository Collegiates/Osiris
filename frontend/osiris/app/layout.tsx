import type { Metadata } from "next";
import { Newsreader, Sora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Osiris Learning Platform",
  description: "Socratic AI tutoring with assessments and guided practice.",
};

const sora = Sora({
  variable: "--font-sora",
  display: "swap",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
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
        <body className={`${sora.variable} ${newsreader.variable} font-body antialiased`}>
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
        <body className={`${sora.variable} ${newsreader.variable} font-body antialiased`}>
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
