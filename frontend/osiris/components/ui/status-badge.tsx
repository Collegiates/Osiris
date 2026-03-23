import { cn } from "@/lib/utils";
import type { PrinterStatus } from "@/lib/mock-data";

type StatusConfig = {
  label: string;
  dotClass: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
};

const STATUS_CONFIG: Record<PrinterStatus | "monitoring", StatusConfig> = {
  monitoring: {
    label: "Monitoring",
    dotClass: "bg-pg-healthy",
    bgClass: "bg-healthy-dim",
    textClass: "text-healthy",
    borderClass: "border-healthy",
  },
  warning: {
    label: "Warning",
    dotClass: "bg-pg-warning animate-pulse",
    bgClass: "bg-warning-dim",
    textClass: "text-warning",
    borderClass: "border-warning",
  },
  danger: {
    label: "Failure",
    dotClass: "bg-pg-danger animate-pulse",
    bgClass: "bg-danger-dim",
    textClass: "text-danger",
    borderClass: "border-danger",
  },
  paused: {
    label: "Paused",
    dotClass: "bg-pg-paused",
    bgClass: "bg-paused-dim",
    textClass: "text-paused",
    borderClass: "border-paused",
  },
  offline: {
    label: "Offline",
    dotClass: "bg-pg-offline",
    bgClass: "bg-offline-dim",
    textClass: "text-offline",
    borderClass: "border-offline",
  },
  idle: {
    label: "Idle",
    dotClass: "bg-muted-foreground",
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
    borderClass: "border-muted",
  },
};

interface StatusBadgeProps {
  status: PrinterStatus;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  size = "md",
  showLabel = true,
  className,
}: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        size === "sm"
          ? "px-2 py-0.5 text-[11px]"
          : "px-2.5 py-1 text-xs",
        cfg.bgClass,
        cfg.textClass,
        cfg.borderClass,
        "border-current/20",
        className
      )}
    >
      <span className={cn("rounded-full shrink-0", cfg.dotClass, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {showLabel && cfg.label}
    </span>
  );
}
