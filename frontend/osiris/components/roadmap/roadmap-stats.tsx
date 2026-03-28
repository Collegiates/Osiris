import { CheckCircle2, Clock, Target, Zap } from "lucide-react";

type RoadmapStatsProps = {
  totalNodes: number;
  completedNodes: number;
};

export function RoadmapStats({ totalNodes, completedNodes }: RoadmapStatsProps) {
  const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
  const remainingNodes = Math.max(totalNodes - completedNodes, 0);

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalNodes}</p>
            <p className="text-xs text-muted-foreground">Total Problems</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
            <CheckCircle2 className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{completedNodes}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{remainingNodes}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{progressPercent}%</p>
            <p className="text-xs text-muted-foreground">Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
