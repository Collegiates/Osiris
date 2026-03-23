"use client";

import { cn } from "@/lib/utils";
import type { Printer } from "@/lib/mock-data";
import { getConfidenceLevel } from "@/lib/mock-data";

interface DetectionConfidenceCardProps {
  printer: Printer;
  className?: string;
}

const DEFECT_DESCRIPTIONS: Record<string, string> = {
  SPAGHETTI:  "Filament extruding with no support — print has likely detached from the bed.",
  WARPING:    "Corners or edges lifting from the print bed due to thermal contraction.",
  DETACHMENT: "Print layer has separated from the bed or from the previous layer.",
  STRINGING:  "Thin strands of filament between structures, usually a retraction issue.",
  GOOD:       "No defects detected. Print appears healthy.",
};

export function DetectionConfidenceCard({ printer, className }: DetectionConfidenceCardProps) {
  const confLevel = getConfidenceLevel(printer.confidence);
  const confPct   = Math.round(printer.confidence * 100);

  const barColor = {
    healthy: "bg-pg-healthy",
    warning: "bg-pg-warning",
    danger:  "bg-pg-danger",
  }[confLevel];

  const labelColor = {
    healthy: "text-pg-healthy bg-healthy-dim border-pg-healthy/20",
    warning: "text-pg-warning bg-warning-dim border-pg-warning/20",
    danger:  "text-pg-danger  bg-danger-dim  border-pg-danger/20",
  }[confLevel];

  return (
    <div className={cn("bg-[#D93D38] text-white rounded-[14px] p-5 flex flex-col gap-4 shadow-md", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold tracking-tight">Detection</h3>
        <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded shadow-sm bg-black/20 text-white border-transparent")}>
          {printer.detectedLabel}
        </span>
      </div>

      {/* Confidence meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-white/80">Confidence</span>
          <span className="font-bold tabular-nums text-white">
            {confPct}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden bg-black/20">
          <div
            className="h-full rounded-full transition-all duration-500 bg-white"
            style={{ width: `${confPct}%` }}
          />
        </div>
        {/* Threshold markers */}
        <div className="relative w-full h-3">
          <div className="absolute left-[50%] top-0 w-px h-2.5 bg-white/30" />
          <div className="absolute right-[15%] top-0 w-px h-2.5 bg-white/30" />
          <span className="absolute left-[50%] translate-x-[-50%] top-2.5 text-[9px] text-white/60">50%</span>
          <span className="absolute right-[15%] translate-x-[50%] top-2.5 text-[9px] text-white/60">85%</span>
        </div>
      </div>

      {/* Consecutive frames */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-white/80">Consecutive failure frames</span>
          <span className="font-bold tabular-nums text-white">
            {printer.consecutiveFrames} / 3
          </span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-colors",
                i < printer.consecutiveFrames ? "bg-white" : "bg-black/15"
              )}
            />
          ))}
        </div>
        <p className="text-[12px] text-white/70">
          {printer.consecutiveFrames >= 3
            ? "Confirmed failure threshold reached."
            : "Waiting for 3 consecutive frames before confirming failure."}
        </p>
      </div>

      {/* Description */}
      <p className="text-[13px] text-white/80 leading-relaxed border-t border-white/20 pt-4">
        {DEFECT_DESCRIPTIONS[printer.detectedLabel] ?? DEFECT_DESCRIPTIONS.GOOD}
      </p>
    </div>
  );
}
