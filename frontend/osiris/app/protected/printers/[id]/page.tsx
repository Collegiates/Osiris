import { notFound } from "next/navigation";
import { MOCK_PRINTERS, MOCK_ALERTS } from "@/lib/mock-data";
import { LiveFeedPanel } from "@/components/live-feed-panel";
import { DetectionConfidenceCard } from "@/components/detection-confidence-card";
import { IncidentEvidenceCard } from "@/components/incident-evidence-card";
import { ActionBar } from "@/components/action-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChevronLeft, Cpu, Camera, Wifi } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PrinterDetailPage({ params }: Props) {
  const { id } = await params;
  const printer = MOCK_PRINTERS.find((p) => p.id === id);
  if (!printer) notFound();

  // Find the active alert for this printer if any
  const activeAlert = MOCK_ALERTS.find(
    (a) => a.printerId === id && (a.type === "confirmed" || a.type === "warning")
  );

  const isActive = printer.status === "danger" || printer.status === "warning";

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/protected/dashboard"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={14} />
          Dashboard
        </Link>
        <span className="text-muted-foreground/40 text-xs">/</span>
        <span className="text-xs text-foreground font-medium">{printer.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{printer.name}</h1>
          <p className="text-sm text-muted-foreground">{printer.model} · {printer.lab}</p>
        </div>
        <StatusBadge status={printer.status} />
      </div>

      {/* Urgent warning banner */}
      {isActive && (
        <div className={cn(
          "flex items-start gap-3 px-4 py-3 rounded-lg border text-sm animate-slide-up",
          printer.status === "danger"
            ? "bg-danger-dim border-pg-danger/40 text-pg-danger animate-pulse-ring"
            : "bg-warning-dim border-pg-warning/40 text-pg-warning"
        )}>
          <span className="font-semibold mt-px">
            {printer.status === "danger" ? "⚠ Confirmed Failure" : "⚠ Warning Detected"}
          </span>
          <span className="text-xs opacity-80">
            {printer.status === "danger"
              ? "3 consecutive failure frames confirmed. Immediate action recommended."
              : "Confidence is moderate. PrintGuard is monitoring for confirmation."}
          </span>
        </div>
      )}

      {/* Main two-column layout */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* LEFT — Live feed (takes 3/5) */}
        <div className="lg:col-span-3 space-y-4">
          <LiveFeedPanel printer={printer} className="w-full" />

          {/* Job info row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[hsl(0,80%,99%)] rounded-[14px] border border-border p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Current Job</p>
              <p className="text-xs font-medium text-foreground truncate">
                {printer.currentJob ?? "None"}
              </p>
            </div>
            <div className="bg-[hsl(0,80%,99%)] rounded-[14px] border border-border p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Progress</p>
              <p className="text-xs font-medium text-foreground">{printer.jobProgress}%</p>
            </div>
            <div className="bg-[hsl(0,80%,99%)] rounded-[14px] border border-border p-3">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Est. Time Left</p>
              <p className="text-xs font-medium text-foreground">
                {printer.estimatedTimeLeftMin > 0
                  ? `${printer.estimatedTimeLeftMin}m`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Connection health */}
          <div className="bg-[hsl(0,80%,99%)] rounded-[14px] border border-border p-5">
            <p className="text-xs font-semibold text-foreground mb-3">Connection Health</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                {
                  icon: <Camera size={14} />,
                  label: "Camera",
                  value: printer.cameraConnected ? "Connected" : "Offline",
                  ok: printer.cameraConnected,
                },
                {
                  icon: <Wifi size={14} />,
                  label: "OctoPrint",
                  value: printer.octoprintConnected ? "Connected" : "Offline",
                  ok: printer.octoprintConnected,
                },
                {
                  icon: <Cpu size={14} />,
                  label: "Latency",
                  value: printer.latencyMs > 0 ? `${printer.latencyMs}ms` : "—",
                  ok: printer.latencyMs < 100,
                },
              ].map(({ icon, label, value, ok }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <span className={ok ? "text-pg-healthy" : "text-pg-danger"}>{icon}</span>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                  <p className={cn("text-xs font-medium", ok ? "text-pg-healthy" : "text-pg-danger")}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Detection, Evidence, Actions (takes 2/5) */}
        <div className="lg:col-span-2 space-y-4">
          <DetectionConfidenceCard printer={printer} />

          {activeAlert && (
            <IncidentEvidenceCard alert={activeAlert} />
          )}

          <ActionBar
            status={printer.status}
            printerId={printer.id}
          />
        </div>
      </div>
    </div>
  );
}

// Generate static params for all mock printers
export async function generateStaticParams() {
  return MOCK_PRINTERS.map((p) => ({ id: p.id }));
}
