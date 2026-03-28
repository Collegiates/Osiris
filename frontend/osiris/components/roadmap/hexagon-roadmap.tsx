"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Lock, Play } from "lucide-react";
import { HexagonNode, type HexNode } from "@/components/roadmap/hexagon-node";

export type RoadmapGraphNode = {
  nodeId: string;
  title: string;
  difficulty?: string | null;
  state: "completed" | "available" | "in_progress" | "locked" | "skipped" | "stuck";
};

export type RoadmapGraphEdge = {
  fromNodeId: string;
  toNodeId: string;
  edgeType: string;
};

type HexagonRoadmapProps = {
  nodes: RoadmapGraphNode[];
  edges: RoadmapGraphEdge[];
  onNodeClick?: (nodeId: string) => void;
};

type PositionedNode = HexNode & {
  question: string;
};

function normalizeDifficulty(difficulty: string | null | undefined): "easy" | "medium" | "hard" {
  const normalizedDifficulty = (difficulty || "medium").toLowerCase();
  if (normalizedDifficulty === "easy" || normalizedDifficulty === "hard") {
    return normalizedDifficulty;
  }
  return "medium";
}

function buildPositionedNodes(nodes: RoadmapGraphNode[]): PositionedNode[] {
  return nodes.map((node, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      nodeId: node.nodeId,
      title: node.title,
      difficulty: normalizeDifficulty(node.difficulty),
      state: node.state,
      row,
      col,
      question: node.title,
    };
  });
}

export function HexagonRoadmap({ nodes, edges, onNodeClick }: HexagonRoadmapProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const positionedNodes = useMemo(() => buildPositionedNodes(nodes), [nodes]);

  const maxRow = Math.max(0, ...positionedNodes.map((node) => node.row));
  const maxCol = Math.max(0, ...positionedNodes.map((node) => node.col));
  const hexWidth = 140;
  const hexHeight = 160;
  const horizontalSpacing = hexWidth * 1.05;
  const verticalSpacing = hexHeight * 0.78;

  const svgWidth = (maxCol + 1) * horizontalSpacing + hexWidth;
  const svgHeight = (maxRow + 1) * verticalSpacing + hexHeight + 40;

  const getNodePosition = (row: number, col: number) => {
    const offsetX = row % 2 === 1 ? horizontalSpacing / 2 : 0;
    return {
      x: col * horizontalSpacing + hexWidth / 2 + 40 + offsetX,
      y: row * verticalSpacing + hexHeight / 2 + 40,
    };
  };

  const nodeById = useMemo(
    () =>
      positionedNodes.reduce<Record<string, PositionedNode>>((accumulator, node) => {
        accumulator[node.nodeId] = node;
        return accumulator;
      }, {}),
    [positionedNodes]
  );

  const hoveredNode = hoveredNodeId ? nodeById[hoveredNodeId] : null;

  return (
    <div className="relative overflow-auto p-4">
      <svg width={svgWidth} height={svgHeight} className="mx-auto">
        <g>
          {edges.map((edge) => {
            const fromNode = nodeById[edge.fromNodeId];
            const toNode = nodeById[edge.toNodeId];
            if (!fromNode || !toNode) {
              return null;
            }
            const fromPos = getNodePosition(fromNode.row, fromNode.col);
            const toPos = getNodePosition(toNode.row, toNode.col);
            const isHighlighted = hoveredNodeId === edge.fromNodeId || hoveredNodeId === edge.toNodeId;
            const isActive = fromNode.state === "completed" || fromNode.state === "available" || fromNode.state === "in_progress";

            return (
              <line
                key={`${edge.fromNodeId}-${edge.toNodeId}-${edge.edgeType}`}
                x1={fromPos.x}
                y1={fromPos.y + 40}
                x2={toPos.x}
                y2={toPos.y - 40}
                stroke={isHighlighted ? "#ed7d3a" : isActive ? "#4d9078" : "#2a2a2a"}
                strokeWidth={isHighlighted ? 3 : 2}
                strokeDasharray={toNode.state === "locked" ? "8,4" : "none"}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {positionedNodes.map((node) => {
          const pos = getNodePosition(node.row, node.col);
          return (
            <g
              key={node.nodeId}
              onClick={() => {
                if (node.state === "locked") {
                  return;
                }
                onNodeClick?.(node.nodeId);
              }}
            >
              <HexagonNode
                node={node}
                x={pos.x}
                y={pos.y}
                isHovered={hoveredNodeId === node.nodeId}
                onHover={() => setHoveredNodeId(node.nodeId)}
                onLeave={() => setHoveredNodeId(null)}
              />
            </g>
          );
        })}
      </svg>

      {hoveredNode && (
        <NodeTooltip node={hoveredNode} position={getNodePosition(hoveredNode.row, hoveredNode.col)} />
      )}
    </div>
  );
}

function NodeTooltip({ node, position }: { node: PositionedNode; position: { x: number; y: number } }) {
  const difficultyColorByType: Record<PositionedNode["difficulty"], string> = {
    easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
    medium: "bg-primary/20 text-primary border-primary/50",
    hard: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  const statusIconByState = {
    completed: <CheckCircle2 className="h-4 w-4 text-secondary" />,
    available: <Play className="h-4 w-4 text-primary" />,
    in_progress: <Play className="h-4 w-4 text-primary" />,
    skipped: <CheckCircle2 className="h-4 w-4 text-secondary" />,
    stuck: <Play className="h-4 w-4 text-primary" />,
    locked: <Lock className="h-4 w-4 text-muted-foreground" />,
  } as const;

  return (
    <div
      className="pointer-events-none absolute z-50 w-72 rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-sm"
      style={{ left: position.x + 80, top: position.y - 20 }}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-foreground">{node.title}</h4>
        <span className={`rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${difficultyColorByType[node.difficulty]}`}>
          {node.difficulty}
        </span>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{node.question}</p>

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        {statusIconByState[node.state]}
        <span className="text-sm capitalize text-muted-foreground">
          {node.state === "available" ? "Ready to solve" : node.state.replace("_", " ")}
        </span>
      </div>
    </div>
  );
}
