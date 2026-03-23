"use client";

import { useBackendHealth } from "@/components/backend-health-provider";
import { WifiOff, RefreshCw } from "lucide-react";

export function ConnectivityBanner() {
  const { status } = useBackendHealth();

  if (status !== "offline") return null;

  return (
    <div className="w-full bg-pg-danger/10 border-b border-pg-danger/30 text-pg-danger px-4 py-2 flex items-center gap-2 text-xs font-medium animate-slide-up">
      <WifiOff size={13} className="shrink-0" />
      <span>Backend is offline — live monitoring paused. Attempting to reconnect…</span>
      <RefreshCw size={12} className="ml-auto shrink-0 animate-spin" />
    </div>
  );
}
