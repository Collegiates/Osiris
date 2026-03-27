import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Osiris - Socratic Learning Platform for Developers",
  description: "Master your craft through personalized practice. AI-powered Socratic tutoring that turns your weaknesses into strengths.",
};

const geist = Geist({
  variable: "--font-geist",
  display: "swap",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
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
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
