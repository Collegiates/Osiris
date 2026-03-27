import { RoadmapsPageClient } from "@/components/roadmaps-page-client";

export default function RoadmapsPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Roadmaps</p>
          <h1 className="font-display text-4xl">Choose a topic to begin</h1>
        </div>
        <RoadmapsPageClient />
      </div>
    </main>
  );
}
