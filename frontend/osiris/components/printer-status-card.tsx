import Link from "next/link";
import { Wifi, WifiOff, Camera, CameraOff } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { Printer } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/mock-data";

interface PrinterStatusCardProps {
  printer: Printer;
  className?: string;
}

export function PrinterStatusCard({ printer, className }: PrinterStatusCardProps) {
  return (
    <Link href={`/protected/printers/${printer.id}`}>
      <div
        className={cn(
          "rounded-[14px] border-transparent p-4 sm:p-5 flex flex-col gap-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 bg-[#D93D38] text-white",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-bold text-[17px] tracking-tight truncate">
              {printer.name}
            </p>
            <p className="text-[13px] truncate mt-0.5 text-white/80">
              {printer.model}
            </p>
          </div>
          
          {/* Custom pill replacing generic StatusBadge to look good on solid red */}
          <div className="flex items-center gap-2 bg-black/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm shrink-0">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              printer.status === "danger" ? "bg-white animate-pulse" :
              printer.status === "warning" ? "bg-amber-400" :
              printer.status === "paused" ? "bg-blue-300" : "bg-green-400"
            )} />
            {printer.status === "danger" ? "Failure" : 
             printer.status === "warning" ? "Warning" :
             printer.status === "paused" ? "Paused" : "Monitoring"}
          </div>
        </div>

        {/* Job info */}
        {printer.currentJob ? (
          <div className="text-[14px] font-medium truncate text-white/95">
            {printer.currentJob}
          </div>
        ) : (
          <div className="text-[13px] italic text-white/70">
            No active job
          </div>
        )}

        {/* Progress bar */}
        {printer.currentJob && (
          <div className="w-full h-1.5 rounded-full overflow-hidden mt-1 bg-black/15">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-500"
              style={{ width: `${printer.jobProgress}%` }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs font-medium mt-1 text-white/80">
          <div className="flex items-center gap-2.5">
            {printer.cameraConnected ? (
              <Camera size={14} className="text-white" />
            ) : (
              <CameraOff size={14} className="text-white/50" />
            )}
            {printer.octoprintConnected ? (
              <Wifi size={14} className="text-white" />
            ) : (
              <WifiOff size={14} className="text-white/50" />
            )}
          </div>
          <span>{formatRelativeTime(printer.lastFrameAt)}</span>
        </div>
      </div>
    </Link>
  );
}
