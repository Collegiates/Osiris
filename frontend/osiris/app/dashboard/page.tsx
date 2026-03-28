import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Track progress and continue where you left off.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Current Streak</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">7</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Problems Solved</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">42</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Roadmaps Active</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">3</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">Skill Score</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-primary">1,850</p></CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/problems">Practice Problems</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/roadmap">Open Roadmap</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/assessment">Retake Assessment</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
