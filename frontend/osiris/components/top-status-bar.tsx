"use client";

import { Bell, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { useBackendHealth } from "@/components/backend-health-provider";
import { cn } from "@/lib/utils";

export function TopStatusBar() {
  const { status } = useBackendHealth();

  const systemStatus =
    status === "checking"
      ? { label: "Connecting...", color: "text-muted-foreground" }
      : status === "online"
        ? { label: "System Online", color: "text-healthy" }
        : { label: "Backend Offline", color: "text-danger" };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
      {/* Lab selector */}
      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <span className="font-medium text-foreground">DSU Makerspace</span>
        <ChevronDown size={14} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* System status pill */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === "checking"
              ? "bg-muted-foreground animate-pulse"
              : status === "online"
                ? "bg-pg-healthy"
                : "bg-pg-danger animate-pulse"
          )}
        />
        <span className={cn("font-medium", systemStatus.color)}>
          {systemStatus.label}
        </span>
      </div>

      {/* Alert bell */}
      <Link
        href="/protected/alerts"
        className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label="View alerts"
      >
        <Bell size={18} />
        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-pg-danger rounded-full" />
      </Link>

      {/* User menu */}
      <Link
        href="/protected/settings"
        className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Account settings"
      >
        LM
      </Link>
    </header>
  );
}
