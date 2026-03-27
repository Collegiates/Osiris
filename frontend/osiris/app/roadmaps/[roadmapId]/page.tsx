import { RoadmapDetailClient } from "@/components/roadmap-detail-client";

export default function RoadmapDetailPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
        <RoadmapDetailClient />
      </div>
    </main>
  );
}
