import { RoadmapDetailClient } from "@/components/roadmap-detail-client";
import { AppHeader } from "@/components/app-header";

export default function RoadmapDetailPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
        <RoadmapDetailClient />
      </main>
    </div>
  );
}
