export function RoadmapLegend() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-6 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <span className="text-sm font-medium text-muted-foreground">Difficulty:</span>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-emerald-500/80" />
        <span className="text-sm text-foreground">Easy</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-primary/80" />
        <span className="text-sm text-foreground">Medium</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-red-500/80" />
        <span className="text-sm text-foreground">Hard</span>
      </div>

      <div className="mx-2 h-4 w-px bg-border" />

      <span className="text-sm font-medium text-muted-foreground">Status:</span>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded border-2 border-secondary bg-secondary/20" />
        <span className="text-sm text-foreground">Completed</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded border-2 border-primary bg-primary/20" />
        <span className="text-sm text-foreground">Available</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded border-2 border-dashed border-muted-foreground bg-muted/50" />
        <span className="text-sm text-foreground">Locked</span>
      </div>
    </div>
  );
}
