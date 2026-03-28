import { AppHeader } from "@/components/app-header";
import { RoadmapsPageClient } from "@/components/roadmaps-page-client";

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Learning Roadmap</h1>
            <p className="mt-2 text-muted-foreground">
              Navigate through topics and master each concept step by step
            </p>
          </div>
          <RoadmapsPageClient />
        </div>
      </main>
    </div>
  );
}
