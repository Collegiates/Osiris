"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { apiFetchWithAuth } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { TopicSelector } from "@/components/roadmap/topic-selector";
import { RoadmapStats } from "@/components/roadmap/roadmap-stats";
import { RoadmapLegend } from "@/components/roadmap/roadmap-legend";
import { HexagonRoadmap } from "@/components/roadmap/hexagon-roadmap";

type RoadmapTopic = {
  topicId: string;
  slug: string;
  name: string;
  description: string;
  totalNodes: number;
  completedNodes: number;
};

type RoadmapListItem = {
  roadmapId: string;
  topicId: string;
  title: string;
  isActive: boolean;
};

type RoadmapNode = {
  nodeId: string;
  problemVersionId: string;
  title: string;
  difficulty?: string | null;
  nodeType: string;
  positionIndex: number;
  state: "completed" | "available" | "in_progress" | "locked" | "skipped" | "stuck";
};

type RoadmapEdge = {
  fromNodeId: string;
  toNodeId: string;
  edgeType: string;
};

type RoadmapResponse = {
  roadmapId: string;
  topicId: string;
  title: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
};

export function RoadmapsPageClient() {
  const supabase = useSupabase();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [topicRows, setTopicRows] = useState<RoadmapTopic[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapListItem[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);
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
          apiFetchWithAuth<Array<Pick<RoadmapTopic, "topicId" | "slug" | "name">>>("/roadmaps/topics", token),
          apiFetchWithAuth<RoadmapListItem[]>("/roadmaps", token),
        ]);
        const topicRowsWithDefaults: RoadmapTopic[] = topicsResponse.map((topic) => ({
          ...topic,
          description: "",
          totalNodes: 0,
          completedNodes: 0,
        }));
        setTopicRows(topicRowsWithDefaults);
        setRoadmaps(roadmapResponse);
        if (topicRowsWithDefaults.length > 0) {
          setSelectedTopicId(topicRowsWithDefaults[0].topicId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load roadmaps");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [supabase]);

  const loadRoadmapByTopic = async (topicId: string, forceCreate: boolean = false) => {
    if (!accessToken) return;
    setError(null);
    setIsRoadmapLoading(true);
    try {
      let roadmapId =
        !forceCreate
          ? roadmaps.find((roadmapRow) => roadmapRow.topicId === topicId && roadmapRow.isActive)?.roadmapId ?? null
          : null;

      if (!roadmapId) {
        const startResponse = await apiFetchWithAuth<{ roadmapId: string }>("/roadmaps/start", accessToken, {
          method: "POST",
          body: JSON.stringify({ topicId }),
        });
        roadmapId = startResponse.roadmapId;
      }

      const roadmapResponse = await apiFetchWithAuth<RoadmapResponse>(`/roadmaps/${roadmapId}`, accessToken);
      roadmapResponse.nodes.sort((a, b) => a.positionIndex - b.positionIndex);
      setSelectedRoadmap(roadmapResponse);

      setRoadmaps((currentRoadmaps) => {
        if (currentRoadmaps.some((roadmapRow) => roadmapRow.roadmapId === roadmapResponse.roadmapId)) {
          return currentRoadmaps;
        }
        return [
          {
            roadmapId: roadmapResponse.roadmapId,
            topicId: roadmapResponse.topicId,
            title: roadmapResponse.title,
            isActive: true,
          },
          ...currentRoadmaps,
        ];
      });

      setTopicRows((currentTopics) =>
        currentTopics.map((topicRow) => {
          if (topicRow.topicId !== topicId) {
            return topicRow;
          }
          const totalNodes = roadmapResponse.nodes.length;
          const completedNodes = roadmapResponse.nodes.filter((node) => node.state === "completed" || node.state === "skipped").length;
          return {
            ...topicRow,
            totalNodes,
            completedNodes,
          };
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roadmap");
    } finally {
      setIsRoadmapLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTopicId || !accessToken) {
      return;
    }
    void loadRoadmapByTopic(selectedTopicId);
  }, [selectedTopicId, accessToken]);

  const selectedTopic = topicRows.find((topicRow) => topicRow.topicId === selectedTopicId) ?? null;

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading roadmaps...</p>;
  }

  return (
    <div>
      <TopicSelector
        topicRows={topicRows}
        selectedTopicId={selectedTopicId}
        onSelectTopic={(topicId) => setSelectedTopicId(topicId)}
      />

      {selectedTopic && (
        <RoadmapStats totalNodes={selectedTopic.totalNodes} completedNodes={selectedTopic.completedNodes} />
      )}

      <RoadmapLegend />

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        {isRoadmapLoading && (
          <div className="p-6 text-sm text-muted-foreground">Loading topic roadmap...</div>
        )}
        {!isRoadmapLoading && selectedRoadmap && (
          <HexagonRoadmap
            nodes={selectedRoadmap.nodes}
            edges={selectedRoadmap.edges}
            onNodeClick={() => router.push(`/roadmaps/${selectedRoadmap.roadmapId}`)}
          />
        )}
        {!isRoadmapLoading && !selectedRoadmap && (
          <div className="p-6 text-sm text-muted-foreground">Select a topic to start roadmap generation.</div>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
