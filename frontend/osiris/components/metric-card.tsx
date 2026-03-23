import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  status?: "healthy" | "warning" | "danger" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  subtext,
  status = "neutral",
  icon,
  className,
}: MetricCardProps) {
  const valueColor = {
    healthy: "text-pg-healthy",
    warning: "text-pg-warning",
    danger:  "text-pg-danger",
    neutral: "text-foreground",
  }[status];

  return (
    <div
      className={cn(
        "bg-[#D93D38] text-white border-transparent rounded-[14px] p-5 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/70 uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span className="text-white/70">{icon}</span>
        )}
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-2xl font-bold tabular-nums leading-none text-white">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-white/70 mb-0.5">{unit}</span>
        )}
      </div>
      {subtext && (
        <p className="text-xs text-white/60">{subtext}</p>
      )}
    </div>
  );
}
