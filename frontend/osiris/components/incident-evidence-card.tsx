import { cn } from "@/lib/utils";
import type { Alert } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/mock-data";
import { ImageOff } from "lucide-react";

interface IncidentEvidenceCardProps {
  alert: Alert;
  className?: string;
}

export function IncidentEvidenceCard({ alert, className }: IncidentEvidenceCardProps) {
  const confPct = Math.round(alert.confidence * 100);
  const isHigh = alert.confidence >= 0.85;
  const isMid = alert.confidence >= 0.5 && !isHigh;

  return (
    <div
      className={cn(
        "bg-[hsl(0,80%,99%)] rounded-[14px] border overflow-hidden shadow-sm",
        isHigh ? "border-pg-danger/40" : isMid ? "border-pg-warning/40" : "border-border",
        className
      )}
    >
      {/* Snapshot */}
      <div className="relative bg-[hsl(220_14%_5%)] aspect-video flex items-center justify-center">
        {alert.snapshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={alert.snapshotUrl}
            alt={`Annotated snapshot for ${alert.defect} detection`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
            <ImageOff size={28} />
            <p className="text-xs">Annotated snapshot will appear here</p>
          </div>
        )}

        {/* Evidence label */}
        <div className={cn(
          "absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-bold uppercase backdrop-blur-sm",
          isHigh ? "bg-pg-danger/20 text-pg-danger border border-pg-danger/40" :
            isMid ? "bg-pg-warning/20 text-pg-warning border border-pg-warning/40" :
              "bg-muted text-muted-foreground border border-border"
        )}>
          {confPct}% — {alert.defect}
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{alert.printerName} · {alert.lab}</span>
          <span>{formatRelativeTime(alert.timestamp)}</span>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-1">Why this was flagged</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{alert.explanation}</p>
        </div>

        <div className="flex gap-3 text-[11px] text-muted-foreground pt-1 border-t border-border">
          <span>Frames: <strong className="text-foreground">{alert.consecutiveFrames}/3</strong></span>
          <span>Confidence: <strong className={isHigh ? "text-pg-danger" : isMid ? "text-pg-warning" : "text-foreground"}>{confPct}%</strong></span>
          {alert.resolution && (
            <span className="ml-auto capitalize">
              Resolution: <strong className="text-foreground">{alert.resolution.replace("_", " ")}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
