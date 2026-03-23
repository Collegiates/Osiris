import {
  MOCK_PRINTERS,
  MOCK_FLEET_METRICS,
  MOCK_ALERTS,
  formatRelativeTime,
} from "@/lib/mock-data";
import { MetricCard } from "@/components/metric-card";
import { PrinterStatusCard } from "@/components/printer-status-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Printer,
  AlertTriangle,
  PauseCircle,
  Layers,
  Clock,
  TrendingDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS = ["all", "monitoring", "warning", "danger", "paused", "offline"] as const;

export default function DashboardPage() {
  const m = MOCK_FLEET_METRICS;
  const needsAttention = MOCK_PRINTERS.filter(
    (p) => p.status === "danger" || p.status === "warning" || p.status === "paused"
  );
  const recentAlerts = [...MOCK_ALERTS].slice(0, 4);

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">
          DSU Makerspace · {MOCK_PRINTERS.length} printers
        </p>
      </div>

      {/* Fleet metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Active"
          value={m.activePrinters}
          icon={<Printer size={14} />}
          status="neutral"
          subtext="printers monitoring"
        />
        <MetricCard
          label="Warnings"
          value={m.warnings}
          icon={<AlertTriangle size={14} />}
          status={m.warnings > 0 ? "warning" : "neutral"}
          subtext="need attention"
        />
        <MetricCard
          label="Paused"
          value={m.paused}
          icon={<PauseCircle size={14} />}
          status={m.paused > 0 ? "warning" : "neutral"}
          subtext="awaiting override"
        />
        <MetricCard
          label="Filament Saved"
          value={(m.totalFilamentSavedG / 1000).toFixed(2)}
          unit="kg"
          icon={<Layers size={14} />}
          status="healthy"
          subtext="waste prevented"
        />
        <MetricCard
          label="Time Saved"
          value={Math.round(m.totalTimeSavedMin / 60)}
          unit="hrs"
          icon={<Clock size={14} />}
          status="healthy"
          subtext="across all jobs"
        />
      </div>

      {/* Needs attention */}
      {needsAttention.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle size={14} className="text-pg-warning" />
            Needs Attention
            <span className="ml-1 text-[11px] font-normal text-muted-foreground">
              ({needsAttention.length})
            </span>
          </h2>
          <div className="space-y-2">
            {needsAttention.map((p) => (
              <Link
                key={p.id}
                href={`/protected/printers/${p.id}`}
                className="bg-white rounded-[14px] border border-border flex items-stretch hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group overflow-hidden"
              >
                {/* Colored Left Block */}
                <div className={cn(
                  "w-36 sm:w-44 flex-shrink-0 flex items-center justify-center transition-colors",
                  p.status === "danger" ? "bg-[#DF4A46]" :
                    p.status === "warning" ? "bg-[#FAE6CE]" :
                      "bg-[#F1F2F4]"
                )}>
                  {p.status === "danger" && (
                    <div className="flex items-center gap-2 bg-[#C23330] text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                      Failure
                    </div>
                  )}
                  {p.status === "warning" && (
                    <div className="flex items-center gap-2 bg-[#F0C995] text-[#8F5318] px-3 py-1.5 rounded-full text-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8F5318] flex-shrink-0" />
                      Warning
                    </div>
                  )}
                  {p.status === "paused" && (
                    <div className="flex items-center gap-2 bg-[#E1E3E8] text-[#555C6A] px-3 py-1.5 rounded-full text-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#555C6A] flex-shrink-0" />
                      Paused
                    </div>
                  )}
                </div>

                {/* Right Content Block */}
                <div className="flex-1 min-w-0 p-4 sm:px-6 flex items-center justify-between bg-[hsl(0,80%,99%)] group-hover:bg-[hsl(0,80%,97%)] transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-[15px] truncate">{p.name}</p>
                    <p className="text-[13px] text-muted-foreground truncate mt-0.5">
                      {p.detectedLabel !== "GOOD"
                        ? `${p.detectedLabel} - ${Math.round(p.confidence * 100)}% confidence`
                        : p.currentJob ?? "No active job"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-4 shrink-0 pr-2">
                    {formatRelativeTime(p.lastFrameAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Printer grid + Recent alerts — two column on large screen */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Printer grid — takes 2/3 */}
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">All Printers</h2>
            <Link
              href="/protected/fleet"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              Manage <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {MOCK_PRINTERS.map((p) => (
              <PrinterStatusCard key={p.id} printer={p} />
            ))}
          </div>
        </section>

        {/* Recent detections — takes 1/3 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recent Detections</h2>
            <Link href="/protected/alerts" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              All <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentAlerts.map((a) => {
              const confPct = Math.round(a.confidence * 100);
              const isHigh = a.confidence >= 0.85;
              const isMid = a.confidence >= 0.5 && !isHigh;
              return (
                <div key={a.id} className="bg-[hsl(0,80%,99%)] rounded-[14px] border p-4 space-y-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{a.printerName}</p>
                      <p className="text-[11px] text-muted-foreground">{formatRelativeTime(a.timestamp)}</p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0",
                      isHigh ? "text-pg-danger bg-danger-dim border-pg-danger/20" :
                        isMid ? "text-pg-warning bg-warning-dim border-pg-warning/20" :
                          "text-muted-foreground bg-muted border-border"
                    )}>
                      {confPct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono bg-background/50 px-1.5 py-0.5 rounded text-muted-foreground">
                      {a.defect}
                    </span>
                    <span className={cn(
                      "text-[10px] capitalize",
                      a.type === "confirmed" ? "text-pg-danger" :
                        a.type === "warning" ? "text-pg-warning" :
                          "text-muted-foreground"
                    )}>
                      {a.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Failure rate indicator */}
          <div className="bg-[hsl(0,80%,99%)] rounded-[14px] border p-5 space-y-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingDown size={12} />
                Failure Rate (30d)
              </span>
              <span className="font-bold text-pg-healthy">
                {(m.failureRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-pg-healthy rounded-full"
                style={{ width: `${m.failureRate * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">Target: &lt;1%</p>
          </div>
        </section>
      </div>
    </div>
  );
}
