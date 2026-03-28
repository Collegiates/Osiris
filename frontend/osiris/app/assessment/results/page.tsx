"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AssessmentResultsPage() {
  const searchParams = useSearchParams();

  const results = useMemo(() => {
    const score = Number(searchParams.get("score") ?? "0");
    const skill = Number(searchParams.get("skill") ?? "0");
    const total = Number(searchParams.get("total") ?? "0");
    const answered = Number(searchParams.get("answered") ?? "0");
    const type = searchParams.get("type") ?? "short";

    return {
      score,
      skill,
      total,
      answered,
      type,
      percentAnswered: total > 0 ? Math.round((answered / total) * 100) : 0,
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Assessment Complete</h1>
          <p className="mt-2 text-muted-foreground">Your baseline has been saved. Roadmaps will adapt from here.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Assessment Type</CardTitle></CardHeader>
            <CardContent>
              <Badge variant="outline" className="capitalize">{results.type}</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Overall Score</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-foreground">{results.score.toFixed(2)}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Hidden Skill Level</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-primary">{results.skill.toFixed(2)}</p></CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader><CardTitle>Completion</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Answered {results.answered} of {results.total} questions ({results.percentAnswered}%).
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/roadmaps">Go To Roadmaps</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/assessment">Retake Assessment</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
