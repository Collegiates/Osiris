import { MOCK_PRINTERS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Camera, CameraOff, Wifi, WifiOff, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/mock-data";

export default function FleetPage() {
  const labs = [...new Set(MOCK_PRINTERS.map((p) => p.lab))];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Fleet Management</h1>
          <p className="text-sm text-muted-foreground">
            {MOCK_PRINTERS.length} printers across {labs.length} labs
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={14} />
          Add Printer
        </button>
      </div>

      {/* Group by lab */}
      {labs.map((lab) => {
        const labPrinters = MOCK_PRINTERS.filter((p) => p.lab === lab);
        return (
          <section key={lab} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {lab}
            </h2>
            <div className="bg-[hsl(0,80%,99%)] rounded-[14px] border border-border overflow-hidden shadow-sm">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[1fr_120px_90px_90px_90px_80px] gap-4 px-4 py-2.5 border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
                <span>Printer</span>
                <span>Status</span>
                <span className="flex items-center gap-1"><Camera size={10} /> Camera</span>
                <span className="flex items-center gap-1"><Wifi size={10} /> OctoPrint</span>
                <span>Last Frame</span>
                <span>Actions</span>
              </div>

              <div className="divide-y divide-border">
                {labPrinters.map((printer) => (
                  <div
                    key={printer.id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_120px_90px_90px_90px_80px] gap-2 sm:gap-4 px-4 py-3.5 hover:bg-surface-2 transition-colors"
                  >
                    {/* Printer name */}
                    <div>
                      <p className="text-sm font-medium text-foreground">{printer.name}</p>
                      <p className="text-[11px] text-muted-foreground">{printer.model}</p>
                    </div>

                    {/* Status */}
                    <div className="self-center">
                      <StatusBadge status={printer.status} size="sm" />
                    </div>

                    {/* Camera */}
                    <div className="self-center flex items-center gap-1.5 text-xs">
                      {printer.cameraConnected ? (
                        <Camera size={13} className="text-pg-healthy" />
                      ) : (
                        <CameraOff size={13} className="text-pg-offline" />
                      )}
                      <span className={cn(
                        "text-[11px]",
                        printer.cameraConnected ? "text-pg-healthy" : "text-pg-offline"
                      )}>
                        {printer.cameraConnected ? "OK" : "Off"}
                      </span>
                    </div>

                    {/* OctoPrint */}
                    <div className="self-center flex items-center gap-1.5 text-xs">
                      {printer.octoprintConnected ? (
                        <Wifi size={13} className="text-pg-healthy" />
                      ) : (
                        <WifiOff size={13} className="text-pg-offline" />
                      )}
                      <span className={cn(
                        "text-[11px]",
                        printer.octoprintConnected ? "text-pg-healthy" : "text-pg-offline"
                      )}>
                        {printer.octoprintConnected ? "OK" : "Off"}
                      </span>
                    </div>

                    {/* Last frame */}
                    <p className="text-[11px] text-muted-foreground self-center">
                      {formatRelativeTime(printer.lastFrameAt)}
                    </p>

                    {/* Link */}
                    <div className="self-center">
                      <Link
                        href={`/protected/printers/${printer.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Monitor →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
