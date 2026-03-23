// lib/mock-data.ts
// Typed mock data for PrintGuard AI.
// Replace these with real WebSocket / Supabase / FastAPI calls.

export type PrinterStatus =
  | "monitoring"
  | "warning"
  | "danger"
  | "paused"
  | "offline"
  | "idle";

export type DefectLabel =
  | "GOOD"
  | "SPAGHETTI"
  | "WARPING"
  | "DETACHMENT"
  | "STRINGING";

export interface Printer {
  id: string;
  name: string;
  model: string;
  lab: string;
  status: PrinterStatus;
  currentJob: string | null;
  jobProgress: number; // 0–100
  confidence: number; // 0.0–1.0
  consecutiveFrames: number;
  detectedLabel: DefectLabel;
  lastFrameAt: string; // ISO
  cameraConnected: boolean;
  octoprintConnected: boolean;
  latencyMs: number;
  filamentUsedG: number;
  estimatedTimeLeftMin: number;
}

export interface Alert {
  id: string;
  printerId: string;
  printerName: string;
  lab: string;
  type: "warning" | "confirmed" | "resolved";
  defect: DefectLabel;
  confidence: number;
  consecutiveFrames: number;
  timestamp: string;
  resolvedAt?: string;
  resolution?: "ignored" | "paused" | "resumed" | "false_positive";
  snapshotUrl: string | null;
  explanation: string;
}

export interface PrintJob {
  id: string;
  printerId: string;
  printerName: string;
  lab: string;
  fileName: string;
  status: "passed" | "warned" | "failed" | "paused" | "resumed";
  startedAt: string;
  endedAt: string;
  durationMin: number;
  defectType: DefectLabel | null;
  filamentSavedG: number | null;
  timeSavedMin: number | null;
  hasTimelapse: boolean;
}

export interface FleetMetrics {
  activePrinters: number;
  warnings: number;
  paused: number;
  totalFilamentSavedG: number;
  totalTimeSavedMin: number;
  totalPrintJobs: number;
  failureRate: number; // 0–1
}

// ─── Printers ────────────────────────────────────────────────────────────────

export const MOCK_PRINTERS: Printer[] = [
  {
    id: "printer-1",
    name: "Ender 3 #1",
    model: "Creality Ender 3 Pro",
    lab: "DSU Makerspace",
    status: "danger",
    currentJob: "bracket_v3.gcode",
    jobProgress: 47,
    confidence: 0.91,
    consecutiveFrames: 3,
    detectedLabel: "SPAGHETTI",
    lastFrameAt: new Date(Date.now() - 4000).toISOString(),
    cameraConnected: true,
    octoprintConnected: true,
    latencyMs: 38,
    filamentUsedG: 42,
    estimatedTimeLeftMin: 94,
  },
  {
    id: "printer-2",
    name: "Prusa MK4 #1",
    model: "Prusa MK4",
    lab: "DSU Makerspace",
    status: "warning",
    currentJob: "enclosure_top.gcode",
    jobProgress: 22,
    confidence: 0.67,
    consecutiveFrames: 1,
    detectedLabel: "WARPING",
    lastFrameAt: new Date(Date.now() - 2000).toISOString(),
    cameraConnected: true,
    octoprintConnected: true,
    latencyMs: 52,
    filamentUsedG: 18,
    estimatedTimeLeftMin: 210,
  },
  {
    id: "printer-3",
    name: "Bambu X1C #1",
    model: "Bambu Lab X1 Carbon",
    lab: "DSU Makerspace",
    status: "monitoring",
    currentJob: "housing_final.gcode",
    jobProgress: 74,
    confidence: 0.08,
    consecutiveFrames: 0,
    detectedLabel: "GOOD",
    lastFrameAt: new Date(Date.now() - 1500).toISOString(),
    cameraConnected: true,
    octoprintConnected: true,
    latencyMs: 29,
    filamentUsedG: 88,
    estimatedTimeLeftMin: 31,
  },
  {
    id: "printer-4",
    name: "Ender 3 #2",
    model: "Creality Ender 3 Pro",
    lab: "DSU Makerspace",
    status: "paused",
    currentJob: "test_cube.gcode",
    jobProgress: 35,
    confidence: 0.89,
    consecutiveFrames: 3,
    detectedLabel: "SPAGHETTI",
    lastFrameAt: new Date(Date.now() - 120000).toISOString(),
    cameraConnected: true,
    octoprintConnected: true,
    latencyMs: 44,
    filamentUsedG: 12,
    estimatedTimeLeftMin: 58,
  },
  {
    id: "printer-5",
    name: "Voron 2.4",
    model: "Voron Design 2.4",
    lab: "Engineering Lab B",
    status: "offline",
    currentJob: null,
    jobProgress: 0,
    confidence: 0,
    consecutiveFrames: 0,
    detectedLabel: "GOOD",
    lastFrameAt: new Date(Date.now() - 3600000).toISOString(),
    cameraConnected: false,
    octoprintConnected: false,
    latencyMs: 0,
    filamentUsedG: 0,
    estimatedTimeLeftMin: 0,
  },
  {
    id: "printer-6",
    name: "Prusa MK4 #2",
    model: "Prusa MK4",
    lab: "Engineering Lab B",
    status: "monitoring",
    currentJob: "gear_assembly.gcode",
    jobProgress: 11,
    confidence: 0.04,
    consecutiveFrames: 0,
    detectedLabel: "GOOD",
    lastFrameAt: new Date(Date.now() - 800).toISOString(),
    cameraConnected: true,
    octoprintConnected: true,
    latencyMs: 61,
    filamentUsedG: 9,
    estimatedTimeLeftMin: 320,
  },
];

// ─── Alerts ──────────────────────────────────────────────────────────────────

export const MOCK_ALERTS: Alert[] = [
  {
    id: "alert-1",
    printerId: "printer-1",
    printerName: "Ender 3 #1",
    lab: "DSU Makerspace",
    type: "confirmed",
    defect: "SPAGHETTI",
    confidence: 0.91,
    consecutiveFrames: 3,
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    snapshotUrl: null,
    explanation:
      "Filament was detected printing in open air with no support structure beneath it. This pattern — commonly called 'spaghetti' — usually means the print detached from the bed. PrintGuard confirmed this across 3 consecutive frames before alerting.",
  },
  {
    id: "alert-2",
    printerId: "printer-2",
    printerName: "Prusa MK4 #1",
    lab: "DSU Makerspace",
    type: "warning",
    defect: "WARPING",
    confidence: 0.67,
    consecutiveFrames: 1,
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    snapshotUrl: null,
    explanation:
      "One or more corners of the print appear to be lifting from the bed. This is early-stage warping, likely caused by temperature differential between the first layer and ambient air. Confidence is moderate — PrintGuard is continuing to monitor before escalating.",
  },
  {
    id: "alert-3",
    printerId: "printer-4",
    printerName: "Ender 3 #2",
    lab: "DSU Makerspace",
    type: "resolved",
    defect: "SPAGHETTI",
    confidence: 0.89,
    consecutiveFrames: 3,
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 118 * 60 * 1000).toISOString(),
    resolution: "paused",
    snapshotUrl: null,
    explanation:
      "Total detachment detected — filament was extruding with no bed contact. Print was paused automatically after 3 confirmed frames.",
  },
  {
    id: "alert-4",
    printerId: "printer-3",
    printerName: "Bambu X1C #1",
    lab: "DSU Makerspace",
    type: "resolved",
    defect: "STRINGING",
    confidence: 0.58,
    consecutiveFrames: 2,
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 4.8 * 3600 * 1000).toISOString(),
    resolution: "ignored",
    snapshotUrl: null,
    explanation:
      "Thin strands of filament were detected between structures. This can be a cosmetic issue with retraction settings rather than a structural failure. The user marked this as a false positive.",
  },
];

// ─── Print History ────────────────────────────────────────────────────────────

export const MOCK_HISTORY: PrintJob[] = [
  {
    id: "job-1",
    printerId: "printer-4",
    printerName: "Ender 3 #2",
    lab: "DSU Makerspace",
    fileName: "test_cube.gcode",
    status: "paused",
    startedAt: new Date(Date.now() - 2.2 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    durationMin: 12,
    defectType: "SPAGHETTI",
    filamentSavedG: 34,
    timeSavedMin: 46,
    hasTimelapse: true,
  },
  {
    id: "job-2",
    printerId: "printer-3",
    printerName: "Bambu X1C #1",
    lab: "DSU Makerspace",
    fileName: "enclosure_lid.gcode",
    status: "passed",
    startedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    durationMin: 150,
    defectType: null,
    filamentSavedG: null,
    timeSavedMin: null,
    hasTimelapse: true,
  },
  {
    id: "job-3",
    printerId: "printer-1",
    printerName: "Ender 3 #1",
    lab: "DSU Makerspace",
    fileName: "phone_stand.gcode",
    status: "passed",
    startedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 8.5 * 3600 * 1000).toISOString(),
    durationMin: 90,
    defectType: null,
    filamentSavedG: null,
    timeSavedMin: null,
    hasTimelapse: false,
  },
  {
    id: "job-4",
    printerId: "printer-6",
    printerName: "Prusa MK4 #2",
    lab: "Engineering Lab B",
    fileName: "motor_bracket.gcode",
    status: "warned",
    startedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
    durationMin: 180,
    defectType: "WARPING",
    filamentSavedG: null,
    timeSavedMin: null,
    hasTimelapse: true,
  },
  {
    id: "job-5",
    printerId: "printer-5",
    printerName: "Voron 2.4",
    lab: "Engineering Lab B",
    fileName: "robot_arm_v2.gcode",
    status: "failed",
    startedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    durationMin: 120,
    defectType: "DETACHMENT",
    filamentSavedG: 67,
    timeSavedMin: 88,
    hasTimelapse: false,
  },
];

// ─── Fleet Metrics ────────────────────────────────────────────────────────────

export const MOCK_FLEET_METRICS: FleetMetrics = {
  activePrinters: 4,
  warnings: 1,
  paused: 1,
  totalFilamentSavedG: 520,
  totalTimeSavedMin: 1340,
  totalPrintJobs: 47,
  failureRate: 0.08,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getConfidenceLevel(
  confidence: number
): "healthy" | "warning" | "danger" {
  if (confidence >= 0.85) return "danger";
  if (confidence >= 0.5) return "warning";
  return "healthy";
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
