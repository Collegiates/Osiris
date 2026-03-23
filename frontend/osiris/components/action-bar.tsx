"use client";

import { cn } from "@/lib/utils";
import type { PrinterStatus } from "@/lib/mock-data";
import { AlertTriangle, Pause, Play, Flag } from "lucide-react";

interface ActionBarProps {
  status: PrinterStatus;
  printerId: string;
  onIgnore?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onMarkFalsePositive?: () => void;
  className?: string;
}

export function ActionBar({
  status,
  onIgnore,
  onPause,
  onResume,
  onMarkFalsePositive,
  className,
}: ActionBarProps) {
  const showIgnoreAndPause = status === "warning" || status === "danger";
  const showResume = status === "paused";

  if (!showIgnoreAndPause && !showResume) return null;

  return (
    <div className={cn("bg-[hsl(0,80%,99%)] rounded-[14px] border border-border p-5 space-y-4 shadow-sm", className)}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <AlertTriangle size={12} />
        <span>Actions Required</span>
      </div>

      <div className="flex flex-col gap-2">
        {showIgnoreAndPause && (
          <>
            {/* Pause — primary urgent action */}
            <button
              onClick={onPause}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                status === "danger"
                  ? "bg-pg-danger/15 border border-pg-danger/50 text-pg-danger hover:bg-pg-danger/25"
                  : "bg-pg-warning/15 border border-pg-warning/50 text-pg-warning hover:bg-pg-warning/25"
              )}
            >
              <Pause size={14} />
              Pause Print
            </button>

            {/* Ignore — secondary */}
            <button
              onClick={onIgnore}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-muted hover:bg-accent text-muted-foreground hover:text-foreground border border-border"
            >
              Ignore Warning
            </button>

            {/* Mark false positive */}
            <button
              onClick={onMarkFalsePositive}
              className="w-full flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border"
            >
              <Flag size={11} />
              Mark as False Positive
            </button>
          </>
        )}

        {showResume && (
          <>
            <button
              onClick={onResume}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-pg-paused/15 border border-pg-paused/50 text-pg-paused hover:bg-pg-paused/25"
            >
              <Play size={14} />
              Resume Print
            </button>

            <button
              onClick={onMarkFalsePositive}
              className="w-full flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent hover:border-border"
            >
              <Flag size={11} />
              Mark as False Positive
            </button>
          </>
        )}
      </div>

      {status === "warning" && (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Confidence is moderate (50–85%). PrintGuard is monitoring for confirmation. You can ignore if&nbsp;this is expected behavior.
        </p>
      )}

      {status === "danger" && (
        <p className="text-[11px] text-pg-danger/80 leading-relaxed">
          High confidence failure confirmed across 3 frames. Pausing now prevents further filament waste.
        </p>
      )}
    </div>
  );
}
