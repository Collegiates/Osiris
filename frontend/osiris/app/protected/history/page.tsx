import { MOCK_HISTORY, formatRelativeTime, formatDuration } from "@/lib/mock-data";
import { EmptyState } from "@/components/empty-state";
import { History, Film, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  passed:  { label: "Passed",  cls: "text-pg-healthy bg-healthy-dim border-pg-healthy/20" },
  warned:  { label: "Warned",  cls: "text-pg-warning bg-warning-dim border-pg-warning/20" },
  failed:  { label: "Failed",  cls: "text-pg-danger  bg-danger-dim  border-pg-danger/20" },
  paused:  { label: "Paused",  cls: "text-pg-paused  bg-paused-dim  border-pg-paused/20" },
  resumed: { label: "Resumed", cls: "text-muted-foreground bg-muted border-border" },
};

export default function HistoryPage() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Print History</h1>
        <p className="text-sm text-muted-foreground">
          Past jobs with outcome, defect type, and waste metrics
        </p>
      </div>

      {MOCK_HISTORY.length === 0 ? (
        <EmptyState
          icon={<History size={32} />}
          title="No print history yet"
          description="Completed print jobs will appear here with their outcomes and any waste metrics."
        />
      ) : (
        <div className="bg-[hsl(0,80%,99%)] rounded-[14px] border border-border overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_140px_100px_80px_100px_80px_40px] gap-4 px-4 py-2.5 border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            <span>Job</span>
            <span>Printer</span>
            <span>Status</span>
            <span>Duration</span>
            <span>Waste saved</span>
            <span>Timelapse</span>
            <span />
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {MOCK_HISTORY.map((job) => {
              const s = STATUS_STYLES[job.status] ?? STATUS_STYLES.warned;
              return (
                <div
                  key={job.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_140px_100px_80px_100px_80px_40px] gap-2 md:gap-4 px-4 py-3.5 hover:bg-surface-2 transition-colors"
                >
                  {/* Job name */}
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[240px]">
                      {job.fileName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatRelativeTime(job.startedAt)}
                      {job.defectType && (
                        <span className="ml-2 font-mono">{job.defectType}</span>
                      )}
                    </p>
                  </div>

                  {/* Printer */}
                  <p className="text-xs text-muted-foreground self-center truncate">
                    {job.printerName}
                  </p>

                  {/* Status badge */}
                  <div className="self-center">
                    <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded border", s.cls)}>
                      {s.label}
                    </span>
                  </div>

                  {/* Duration */}
                  <p className="text-xs text-foreground self-center tabular-nums">
                    {formatDuration(job.durationMin)}
                  </p>

                  {/* Filament saved */}
                  <p className={cn("text-xs self-center tabular-nums", job.filamentSavedG ? "text-pg-healthy" : "text-muted-foreground")}>
                    {job.filamentSavedG ? `${job.filamentSavedG}g ↓` : "—"}
                  </p>

                  {/* Timelapse */}
                  <div className="self-center">
                    {job.hasTimelapse ? (
                      <Film size={14} className="text-muted-foreground" />
                    ) : (
                      <span className="text-[11px] text-muted-foreground/40">—</span>
                    )}
                  </div>

                  {/* False positive CTA */}
                  <div className="self-center">
                    {(job.status === "failed" || job.status === "warned") && (
                      <button
                        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                        title="Mark as false positive"
                        aria-label="Mark as false positive"
                      >
                        <ThumbsDown size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
