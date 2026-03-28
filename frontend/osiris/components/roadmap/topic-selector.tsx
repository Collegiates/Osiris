"use client";

import { BookOpen, Braces, GitFork, List, Share2 } from "lucide-react";

type TopicRow = {
  topicId: string;
  name: string;
  slug: string;
  description: string;
  totalNodes: number;
  completedNodes: number;
};

type TopicSelectorProps = {
  topicRows: TopicRow[];
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
};

const iconBySlug: Record<string, React.ComponentType<{ className?: string }>> = {
  strings: Braces,
  lists: List,
  trees: GitFork,
  dictionaries: BookOpen,
  graphs: Share2,
};

export function TopicSelector({ topicRows, selectedTopicId, onSelectTopic }: TopicSelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3">
        {topicRows.map((topicRow) => {
          const TopicIcon = iconBySlug[topicRow.slug] ?? Braces;
          const isSelected = selectedTopicId === topicRow.topicId;
          const progressPercent = topicRow.totalNodes > 0 ? Math.round((topicRow.completedNodes / topicRow.totalNodes) * 100) : 0;

          return (
            <button
              key={topicRow.topicId}
              onClick={() => onSelectTopic(topicRow.topicId)}
              className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                }`}
              >
                <TopicIcon className="h-5 w-5" />
              </div>

              <div className="min-w-[140px]">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>{topicRow.name}</span>
                  {progressPercent > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        progressPercent === 100 ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"
                      }`}
                    >
                      {progressPercent}%
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {topicRow.completedNodes}/{topicRow.totalNodes} nodes
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl bg-muted/50">
                <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
