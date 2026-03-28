"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Code2, Flame, LogOut, User } from "lucide-react";
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type SessionState = {
  email: string | null;
  isAuthenticated: boolean;
};

export function AppHeader() {
  const supabase = useSupabase();
  const [sessionState, setSessionState] = useState<SessionState>({ email: null, isAuthenticated: false });

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email ?? null;
      setSessionState({ email, isAuthenticated: Boolean(data.session) });
    };
    loadSession();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionState({ email: null, isAuthenticated: false });
  };

  const userInitials = sessionState.email ? sessionState.email.slice(0, 2).toUpperCase() : "OS";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Osiris</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/assessment">
            <Button variant="ghost" size="sm">Assessment</Button>
          </Link>
          <Link href="/problems">
            <Button variant="ghost" size="sm">Problems</Button>
          </Link>
          <Link href="/roadmaps">
            <Button variant="ghost" size="sm">Roadmaps</Button>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 sm:flex">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">7</span>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </Button>

          {sessionState.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                    {userInitials}
                  </span>
                  <span className="hidden max-w-[180px] truncate text-sm font-medium sm:inline-block">
                    {sessionState.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
