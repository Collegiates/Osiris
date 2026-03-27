"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { apiFetchWithAuth } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

type RoadmapTopic = {
  topicId: string;
  slug: string;
  name: string;
};

type RoadmapListItem = {
  roadmapId: string;
  topicId: string;
  title: string;
  isActive: boolean;
};

export function RoadmapsPageClient() {
  const supabase = useSupabase();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [topics, setTopics] = useState<RoadmapTopic[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || null;
      setAccessToken(token);
      if (!token) {
        setError("Missing access token");
        setIsLoading(false);
        return;
      }
      try {
        const [topicsResponse, roadmapResponse] = await Promise.all([
          apiFetchWithAuth<RoadmapTopic[]>("/roadmaps/topics", token),
          apiFetchWithAuth<RoadmapListItem[]>("/roadmaps", token),
        ]);
        setTopics(topicsResponse);
        setRoadmaps(roadmapResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load roadmaps");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [supabase]);

  const handleStart = async (topicId: string) => {
    if (!accessToken) return;
    setError(null);
    try {
      const response = await apiFetchWithAuth<{ roadmapId: string }>(
        "/roadmaps/start",
        accessToken,
        {
          method: "POST",
          body: JSON.stringify({ topicId }),
        }
      );
      router.push(`/roadmaps/${response.roadmapId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start roadmap");
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading roadmaps...</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4 rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl shadow-orange-500/10 backdrop-blur">
        <h2 className="font-display text-2xl">Topics</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => (
            <button
              key={topic.topicId}
              type="button"
              onClick={() => handleStart(topic.topicId)}
              className="rounded-2xl border border-foreground/10 bg-white px-4 py-4 text-left text-sm transition hover:-translate-y-0.5 hover:border-foreground/20"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{topic.slug}</p>
              <p className="mt-1 text-base font-semibold">{topic.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-foreground/10 bg-black/90 p-6 text-white shadow-xl shadow-black/20">
        <h2 className="font-display text-2xl">Your Roadmaps</h2>
        {roadmaps.length === 0 && (
          <p className="text-sm text-white/70">No roadmaps yet. Start one from a topic.</p>
        )}
        <div className="space-y-3">
          {roadmaps.map((roadmap) => (
            <button
              key={roadmap.roadmapId}
              type="button"
              onClick={() => router.push(`/roadmaps/${roadmap.roadmapId}`)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-white/30"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Active roadmap</p>
              <p className="mt-1 text-base font-semibold">{roadmap.title}</p>
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
      </div>
    </div>
  );
}
