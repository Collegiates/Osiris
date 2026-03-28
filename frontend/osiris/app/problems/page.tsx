"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/apiClient";

type ProblemListItem = {
  problemId: string;
  problemVersionId: string;
  title: string;
  summary?: string | null;
  difficulty?: string | null;
  topicId?: string | null;
  sourceDataset?: string | null;
  externalId?: string | null;
};

const difficultyOrder: Record<string, number> = { easy: 0, medium: 1, hard: 2 };

export default function ProblemsPage() {
  const [searchText, setSearchText] = useState("");
  const [problemRows, setProblemRows] = useState<ProblemListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProblems = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const rows = await apiFetch<ProblemListItem[]>("/problems?limit=150");
        setProblemRows(rows);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load problems");
      } finally {
        setIsLoading(false);
      }
    };
    loadProblems();
  }, []);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    return [...problemRows]
      .filter((row) => {
        if (!normalizedSearch) return true;
        return row.title.toLowerCase().includes(normalizedSearch);
      })
      .sort((leftItem, rightItem) => {
        const leftDifficulty = difficultyOrder[(leftItem.difficulty ?? "medium").toLowerCase()] ?? 1;
        const rightDifficulty = difficultyOrder[(rightItem.difficulty ?? "medium").toLowerCase()] ?? 1;
        if (leftDifficulty !== rightDifficulty) {
          return leftDifficulty - rightDifficulty;
        }
        return leftItem.title.localeCompare(rightItem.title);
      });
  }, [problemRows, searchText]);

  const solvedCount = 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Problems</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{problemRows.length}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">Solved</div>
            <div className="mt-2 text-3xl font-bold text-secondary">{solvedCount}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">Source</div>
            <div className="mt-2 text-3xl font-bold text-primary">CodeNet</div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading problems...</p>}
        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

        {!isLoading && !errorMessage && (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-[minmax(0,1fr),120px,180px] gap-4 border-b border-border bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              <span>Problem</span>
              <span>Difficulty</span>
              <span>Action</span>
            </div>
            {filteredRows.map((row) => (
              <div
                key={row.problemId}
                className="grid grid-cols-[minmax(0,1fr),120px,180px] items-center gap-4 border-b border-border/70 px-4 py-4 last:border-b-0"
              >
                <div>
                  <p className="font-medium text-foreground">{row.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {row.summary ?? `Dataset ID: ${row.externalId ?? row.problemVersionId}`}
                  </p>
                </div>
                <div>
                  <Badge variant="outline" className="capitalize">
                    {row.difficulty ?? "medium"}
                  </Badge>
                </div>
                <div>
                  <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href={`/problems/${row.problemId}`}>Open Problem</Link>
                  </Button>
                </div>
              </div>
            ))}
            {filteredRows.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No problems match your search.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
