"use client";

import { CheckCircle2, Lock, Play } from "lucide-react";

export type HexNode = {
  nodeId: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  state: "completed" | "available" | "in_progress" | "locked" | "skipped" | "stuck";
  row: number;
  col: number;
};

type HexagonNodeProps = {
  node: HexNode;
  x: number;
  y: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
};

export function HexagonNode({ node, x, y, isHovered, onHover, onLeave }: HexagonNodeProps) {
  const size = 50;
  const hexPath = `
    M 0 ${-size}
    L ${size * 0.866} ${-size * 0.5}
    L ${size * 0.866} ${size * 0.5}
    L 0 ${size}
    L ${-size * 0.866} ${size * 0.5}
    L ${-size * 0.866} ${-size * 0.5}
    Z
  `;

  const isLocked = node.state === "locked";
  const isCompleted = node.state === "completed" || node.state === "skipped";
  const isAvailable = node.state === "available" || node.state === "in_progress" || node.state === "stuck";

  const colorByDifficulty = {
    easy: { fill: "#10b981", stroke: "#34d399" },
    medium: { fill: "#ed7d3a", stroke: "#f59e0b" },
    hard: { fill: "#ef4444", stroke: "#f87171" },
  } as const;

  const colorRow = colorByDifficulty[node.difficulty];

  return (
    <g transform={`translate(${x}, ${y})`} onMouseEnter={onHover} onMouseLeave={onLeave} className="cursor-pointer">
      <path
        d={hexPath}
        fill={isLocked ? "#1f1f1f" : colorRow.fill}
        fillOpacity={isLocked ? 0.35 : isHovered ? 1 : 0.85}
        stroke={isCompleted ? "#4d9078" : colorRow.stroke}
        strokeWidth={isHovered ? 3 : 2}
        strokeDasharray={isLocked ? "6,3" : "none"}
        style={{ transition: "all 0.2s ease" }}
      />

      <g transform="translate(-12, -12)">
        {isCompleted && <CheckCircle2 className="h-6 w-6" style={{ color: "#4d9078" }} />}
        {!isCompleted && isAvailable && <Play className="h-6 w-6 text-primary" />}
        {isLocked && <Lock className="h-6 w-6 text-muted-foreground" />}
      </g>

      <text
        y={size + 20}
        textAnchor="middle"
        className="text-xs font-medium"
        style={{ fill: isLocked ? "#6b7280" : "#f5f5f0", fontSize: "11px" }}
      >
        {node.title.length > 14 ? `${node.title.slice(0, 12)}...` : node.title}
      </text>
    </g>
  );
}
