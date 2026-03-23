"use client";

import { useState } from "react";
import { MOCK_ALERTS } from "@/lib/mock-data";
import { IncidentEvidenceCard } from "@/components/incident-evidence-card";
import { EmptyState } from "@/components/empty-state";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "warning" | "confirmed" | "resolved";

const TABS: { key: TabType; label: string }[] = [
  { key: "warning",   label: "Warnings" },
  { key: "confirmed", label: "Confirmed" },
  { key: "resolved",  label: "Resolved" },
];

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("confirmed");

  const filtered = MOCK_ALERTS.filter((a) => {
    if (activeTab === "confirmed") return a.type === "confirmed";
    if (activeTab === "warning")   return a.type === "warning";
    return a.type === "resolved";
  });

  const counts: Record<TabType, number> = {
    warning:   MOCK_ALERTS.filter((a) => a.type === "warning").length,
    confirmed: MOCK_ALERTS.filter((a) => a.type === "confirmed").length,
    resolved:  MOCK_ALERTS.filter((a) => a.type === "resolved").length,
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Alert Center</h1>
        <p className="text-sm text-muted-foreground">
          All detections, warnings, and resolved incidents
        </p>
      </div>

      {/* Segmented control */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeTab === key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            {counts[key] > 0 && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                key === "confirmed" && counts[key] > 0 ? "bg-pg-danger/20 text-pg-danger" :
                key === "warning"   && counts[key] > 0 ? "bg-pg-warning/20 text-pg-warning" :
                "bg-muted text-muted-foreground"
              )}>
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alert list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell size={32} />}
          title={`No ${activeTab} alerts`}
          description={
            activeTab === "resolved"
              ? "Resolved incidents will appear here after you act on a warning or confirmed failure."
              : "All clear — no active alerts in this category."
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((alert) => (
            <IncidentEvidenceCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
