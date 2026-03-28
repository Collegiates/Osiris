"use client";

import { Badge } from "@/components/ui/badge";

type ExampleItem = {
  input?: string;
  output?: string;
  explanation?: string;
};

type ProblemStatementProps = {
  title: string;
  statementMarkdown?: string | null;
  examples?: ExampleItem[] | null;
  constraints?: Record<string, unknown> | null;
  inputSpec?: string | null;
  outputSpec?: string | null;
  sourceDataset?: string | null;
  externalId?: string | null;
};

export function ProblemStatement({
  title,
  statementMarkdown,
  examples,
  constraints,
  inputSpec,
  outputSpec,
  sourceDataset,
  externalId,
}: ProblemStatementProps) {
  const formattedExamples = Array.isArray(examples) ? examples : [];

  return (
    <section className="h-full overflow-y-auto border-r border-border bg-card p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {sourceDataset && <Badge variant="outline">{sourceDataset}</Badge>}
            {externalId && <Badge variant="outline">ID: {externalId}</Badge>}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Problem</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {statementMarkdown ?? "Problem statement is not available yet."}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Input</h3>
          <p className="text-sm text-foreground">{inputSpec ?? "See problem statement."}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Output</h3>
          <p className="text-sm text-foreground">{outputSpec ?? "See problem statement."}</p>
        </div>

        {formattedExamples.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Examples</h3>
            {formattedExamples.map((exampleItem, index) => (
              <div key={`${exampleItem.input ?? "example"}-${index}`} className="rounded-lg border border-border bg-muted/20 p-3">
                {exampleItem.input && <p className="text-sm"><span className="font-semibold">Input:</span> {exampleItem.input}</p>}
                {exampleItem.output && <p className="text-sm"><span className="font-semibold">Output:</span> {exampleItem.output}</p>}
                {exampleItem.explanation && <p className="text-sm text-muted-foreground">{exampleItem.explanation}</p>}
              </div>
            ))}
          </div>
        )}

        {constraints && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Constraints</h3>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/20 p-3 text-xs text-foreground">
              {JSON.stringify(constraints, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
