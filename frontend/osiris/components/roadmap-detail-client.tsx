"use client";

import { useEffect, useMemo, useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { apiFetchWithAuth } from "@/lib/apiClient";

type RoadmapNode = {
  nodeId: string;
  problemVersionId: string;
  title: string;
  difficulty?: string | null;
  nodeType: string;
  positionIndex: number;
  state: string;
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

const difficultyThresholds: Record<string, number> = {
  easy: 20 * 60,
  medium: 35 * 60,
  hard: 50 * 60,
};

export function RoadmapDetailClient({ roadmapId }: { roadmapId: string }) {
  const supabase = useSupabase();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showBranchPrompt, setShowBranchPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeNode = useMemo(
    () => roadmap?.nodes.find((node) => node.nodeId === activeNodeId) ?? null,
    [roadmap, activeNodeId]
  );

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || null;
      setAccessToken(token);
      if (!token) {
        setError("Missing access token");
        return;
      }
      try {
        const response = await apiFetchWithAuth<RoadmapResponse>(
          `/roadmaps/${roadmapId}`,
          token
        );
        response.nodes.sort((a, b) => a.positionIndex - b.positionIndex);
        setRoadmap(response);
        if (!activeNodeId) {
          const firstAvailable = response.nodes.find((node) =>
            ["available", "in_progress"].includes(node.state)
          );
          if (firstAvailable) {
            setActiveNodeId(firstAvailable.nodeId);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load roadmap");
      }
    };
    load();
  }, [supabase, roadmapId, activeNodeId]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  useEffect(() => {
    if (!activeNode) return;
    const threshold =
      difficultyThresholds[(activeNode.difficulty || "medium").toLowerCase()] ??
      difficultyThresholds.medium;
    if (elapsedSeconds >= threshold) {
      setShowBranchPrompt(true);
      setIsTimerRunning(false);
    }
  }, [elapsedSeconds, activeNode]);

  const updateProgress = async (nodeId: string, state: string) => {
    if (!accessToken) return;
    await apiFetchWithAuth(
      `/roadmaps/${roadmapId}/nodes/${nodeId}/progress`,
      accessToken,
      {
        method: "POST",
        body: JSON.stringify({ state }),
      }
    );
  };

  const handleSelectNode = (nodeId: string, state: string) => {
    if (state === "locked") return;
    setActiveNodeId(nodeId);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setShowBranchPrompt(false);
  };

  const handleStart = async () => {
    if (!activeNode) return;
    await updateProgress(activeNode.nodeId, "in_progress");
    setIsTimerRunning(true);
  };

  const handleComplete = async () => {
    if (!activeNode) return;
    await updateProgress(activeNode.nodeId, "completed");
    setIsTimerRunning(false);
    setElapsedSeconds(0);
    if (accessToken) {
      const response = await apiFetchWithAuth<RoadmapResponse>(
        `/roadmaps/${roadmapId}`,
        accessToken
      );
      response.nodes.sort((a, b) => a.positionIndex - b.positionIndex);
      setRoadmap(response);
    }
  };

  const handleSkip = async () => {
    if (!activeNode) return;
    await updateProgress(activeNode.nodeId, "skipped");
    setIsTimerRunning(false);
  };

  const handleStuck = async () => {
    if (!activeNode) return;
    await updateProgress(activeNode.nodeId, "stuck");
    setShowBranchPrompt(true);
    setIsTimerRunning(false);
  };

  const handleBranch = async () => {
    if (!activeNode || !accessToken) return;
    try {
      await apiFetchWithAuth(
        `/roadmaps/${roadmapId}/nodes/${activeNode.nodeId}/branch`,
        accessToken,
        { method: "POST" }
      );
      const response = await apiFetchWithAuth<RoadmapResponse>(
        `/roadmaps/${roadmapId}`,
        accessToken
      );
      response.nodes.sort((a, b) => a.positionIndex - b.positionIndex);
      setRoadmap(response);
      setShowBranchPrompt(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to branch");
    }
  };

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!roadmap) {
    return <p className="text-sm text-muted-foreground">Loading roadmap...</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4 rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl shadow-orange-500/10 backdrop-blur">
        <h1 className="font-display text-3xl">{roadmap.title}</h1>
        <div className="space-y-2">
          {roadmap.nodes.map((node) => (
            <button
              key={node.nodeId}
              type="button"
              onClick={() => handleSelectNode(node.nodeId, node.state)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                node.state === "locked"
                  ? "cursor-not-allowed border-foreground/10 bg-white/40 text-muted-foreground"
                  : "border-foreground/15 bg-white hover:-translate-y-0.5"
              }`}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {node.nodeType}
                </p>
                <p className="text-base font-semibold">{node.title}</p>
              </div>
              <span className="rounded-full bg-black/90 px-3 py-1 text-xs text-white">
                {node.state}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-foreground/10 bg-black/90 p-6 text-white shadow-xl shadow-black/20">
        <h2 className="font-display text-2xl">Current Problem</h2>
        {activeNode ? (
          <>
            <p className="text-sm text-white/70">Difficulty: {activeNode.difficulty ?? "medium"}</p>
            <p className="mt-3 text-lg font-semibold">{activeNode.title}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <button
                type="button"
                onClick={handleStart}
                className="rounded-full bg-white px-4 py-2 text-black"
              >
                Start attempt
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="rounded-full bg-[#ed7d3a] px-4 py-2 text-white"
              >
                Mark complete
              </button>
              <button
                type="button"
                onClick={handleStuck}
                className="rounded-full border border-white/40 px-4 py-2 text-white"
              >
                I&apos;m stuck
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-full border border-white/20 px-4 py-2 text-white/80"
              >
                Skip for now
              </button>
            </div>
            <p className="mt-4 text-sm text-white/60">
              Timer: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
            </p>
          </>
        ) : (
          <p className="text-sm text-white/70">Select a node to begin.</p>
        )}

        {showBranchPrompt && (
          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
            <p className="font-semibold">Try a remedial branch?</p>
            <p className="mt-1 text-white/70">
              We can insert a short set of easier problems to help you return stronger.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleBranch}
                className="rounded-full bg-white px-4 py-2 text-black"
              >
                Yes, branch
              </button>
              <button
                type="button"
                onClick={() => setShowBranchPrompt(false)}
                className="rounded-full border border-white/40 px-4 py-2 text-white"
              >
                Not now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
