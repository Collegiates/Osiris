"use client";

import { cn } from "@/lib/utils";
import type { Printer } from "@/lib/mock-data";
import { formatRelativeTime, getConfidenceLevel } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Wifi, Clock, AlertTriangle } from "lucide-react";

interface LiveFeedPanelProps {
  printer: Printer;
  className?: string;
}

export function LiveFeedPanel({ printer, className }: LiveFeedPanelProps) {
  const confLevel = getConfidenceLevel(printer.confidence);

  const feedBorder = {
    danger: "border-pg-danger/60 glow-danger",
    warning: "border-pg-warning/50 glow-warning",
    healthy: "border-pg-healthy/30 glow-healthy",
  }[confLevel];

  return (
    <div className={cn("bg-[hsl(0,80%,99%)] rounded-[14px] border border-border overflow-hidden flex flex-col shadow-sm", feedBorder, className)}>
      {/* Feed header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-pg-danger animate-pulse" />
          <span className="font-medium uppercase tracking-wide">Live Feed</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Wifi size={11} />
            {printer.latencyMs}ms
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatRelativeTime(printer.lastFrameAt)}
          </span>
        </div>
      </div>

      {/* Camera feed area */}
      <div className="relative flex-1 min-h-[260px] bg-[hsl(220_14%_5%)] flex items-center justify-center overflow-hidden">
        {printer.cameraConnected ? (
          <>
            {/* Scan line animation to simulate live video */}
            <div className="live-scan absolute inset-0" />
            {/* Placeholder camera grid */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            {/* Camera placeholder icon */}
            <div className="flex flex-col items-center gap-3 text-muted-foreground/40 z-10">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="12" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="24" cy="26" r="8" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="24" cy="26" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 12 L20 6 H28 L32 12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <p className="text-xs font-medium">Awaiting live frame stream</p>
              <p className="text-[11px]">WebSocket connected — frames will appear here</p>
            </div>

            {/* Status overlay */}
            {printer.status !== "monitoring" && printer.status !== "idle" && (
              <div className={cn(
                "absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border",
                printer.status === "danger" ? "bg-pg-danger/20 border-pg-danger/50 text-pg-danger" :
                  printer.status === "warning" ? "bg-pg-warning/20 border-pg-warning/50 text-pg-warning" :
                    printer.status === "paused" ? "bg-pg-paused/20 border-pg-paused/50 text-pg-paused" : ""
              )}>
                <AlertTriangle size={12} />
                {printer.detectedLabel !== "GOOD" ? printer.detectedLabel : printer.status.toUpperCase()}
              </div>
            )}

            {/* Confidence pip */}
            {printer.confidence > 0 && (
              <div className="absolute bottom-3 right-3 text-[10px] font-mono font-bold bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded">
                {(printer.confidence * 100).toFixed(0)}% conf
              </div>
            )}
          </>
        ) : (
          /* Offline / no camera state */
          <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="12" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <line x1="4" y1="4" x2="44" y2="44" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="text-xs font-medium">No camera feed</p>
            <p className="text-[11px]">Camera disconnected or unavailable</p>
          </div>
        )}
      </div>

      {/* Feed footer with job info */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground bg-card/60">
        <div className="flex items-center gap-2">
          <StatusBadge status={printer.status} size="sm" />
          {printer.currentJob && (
            <span className="truncate max-w-[140px]">{printer.currentJob}</span>
          )}
        </div>
        {printer.currentJob && (
          <span className="font-medium text-foreground">{printer.jobProgress}%</span>
        )}
      </div>
    </div>
  );
}
