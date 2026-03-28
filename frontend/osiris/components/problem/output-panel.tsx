"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type ExecutionStatus = "idle" | "running" | "success" | "failed" | "error";

export type ExecutionResult = {
  status: ExecutionStatus;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  message?: string;
  timeMs?: number;
  memoryKb?: number;
  passedCount?: number;
  totalCount?: number;
  score?: number;
  failedCasesPreview?: Array<{
    input: string;
    expected: string;
    actual: string;
  }>;
};

type OutputPanelProps = {
  result: ExecutionResult;
  stdinValue: string;
  activeTab: "output" | "testcases";
  onStdinChange: (stdinValue: string) => void;
  onTabChange: (tabValue: "output" | "testcases") => void;
};

export function OutputPanel({
  result,
  stdinValue,
  activeTab,
  onStdinChange,
  onTabChange,
}: OutputPanelProps) {
  return (
    <section className="flex h-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex gap-2">
          <Button variant={activeTab === "output" ? "default" : "outline"} size="sm" onClick={() => onTabChange("output")}>Output</Button>
          <Button variant={activeTab === "testcases" ? "default" : "outline"} size="sm" onClick={() => onTabChange("testcases")}>Test Cases</Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">{result.status}</Badge>
          {result.timeMs !== undefined && <span className="text-xs text-muted-foreground">{result.timeMs}ms</span>}
          {result.memoryKb !== undefined && <span className="text-xs text-muted-foreground">{(result.memoryKb / 1024).toFixed(1)}MB</span>}
        </div>
      </div>

      {activeTab === "output" ? (
        <div className="grid h-full grid-cols-[1fr,1fr] divide-x divide-border">
          <div className="p-3">
            <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">Standard Input</p>
            <textarea
              value={stdinValue}
              onChange={(event) => onStdinChange(event.target.value)}
              placeholder="Enter stdin for Run"
              className="h-[180px] w-full resize-none rounded-md border border-border bg-muted/20 p-2 font-mono text-sm outline-none"
            />
          </div>
          <div className="p-3">
            <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">Standard Output</p>
            <pre className="h-[180px] overflow-auto rounded-md border border-border bg-muted/20 p-2 text-sm">
{result.stdout ?? result.stderr ?? result.compileOutput ?? result.message ?? "Run your code to see output."}
            </pre>
          </div>
        </div>
      ) : (
        <div className="space-y-3 p-3 text-sm">
          {result.passedCount !== undefined && result.totalCount !== undefined ? (
            <div className="rounded-md border border-border bg-muted/20 p-3">
              <p className="font-medium text-foreground">
                {result.passedCount} / {result.totalCount} passed
              </p>
              {result.score !== undefined && <p className="text-muted-foreground">Score: {result.score}%</p>}
            </div>
          ) : (
            <p className="text-muted-foreground">Submit your code to run hidden test cases.</p>
          )}

          {result.failedCasesPreview?.map((caseItem, index) => (
            <div key={`${caseItem.input}-${index}`} className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
              <p><span className="font-semibold">Input:</span> {caseItem.input}</p>
              <p><span className="font-semibold">Expected:</span> {caseItem.expected}</p>
              <p><span className="font-semibold">Actual:</span> {caseItem.actual}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
