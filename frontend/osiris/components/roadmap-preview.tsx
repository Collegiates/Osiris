"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Lock, ArrowRight, Braces, List, GitFork, BookOpen } from "lucide-react";

const roadmaps = [
  { id: "strings", name: "Strings", icon: Braces, problems: 42, color: "text-primary" },
  { id: "lists", name: "Lists", icon: List, problems: 38, color: "text-secondary" },
  { id: "trees", name: "Trees", icon: GitFork, problems: 35, color: "text-[#f5a623]" },
  { id: "dictionaries", name: "Dictionaries", icon: BookOpen, problems: 28, color: "text-primary" },
];

const sampleNodes = [
  { id: 1, title: "String Basics", status: "completed", level: 1 },
  { id: 2, title: "String Manipulation", status: "completed", level: 1 },
  { id: 3, title: "Pattern Matching", status: "current", level: 2 },
  { id: 4, title: "Regular Expressions", status: "locked", level: 2 },
  { id: 5, title: "String Algorithms", status: "locked", level: 3 },
  { id: 6, title: "Advanced Patterns", status: "locked", level: 3 },
];

export function RoadmapPreview() {
  const [activeRoadmap, setActiveRoadmap] = useState("strings");

  return (
    <section id="roadmaps" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Roadmaps</h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Structured Learning Paths
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Each topic has its own dedicated roadmap. Progress through concepts in order,
            with dynamic branching when you need extra practice.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {roadmaps.map((roadmap) => (
            <button
              key={roadmap.id}
              onClick={() => setActiveRoadmap(roadmap.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                activeRoadmap === roadmap.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <roadmap.icon className={`h-4 w-4 ${roadmap.color}`} />
              {roadmap.name}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{roadmap.problems}</span>
            </button>
          ))}
        </div>

        <div className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border bg-muted/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Braces className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">Strings Roadmap</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>2 of 6 completed</span>
                  <div className="h-2 w-32 rounded-full bg-muted">
                    <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-4">
                {sampleNodes.map((node) => (
                  <div key={node.id} className="flex items-center gap-4">
                    <div
                      className={`flex flex-1 items-center gap-4 rounded-lg border p-4 transition-all ${
                        node.status === "current"
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : node.status === "completed"
                            ? "border-secondary/50 bg-secondary/5"
                            : "border-border bg-card opacity-60"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        node.status === "completed"
                          ? "bg-secondary/20"
                          : node.status === "current"
                            ? "bg-primary/20"
                            : "bg-muted"
                      }`}>
                        {node.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-secondary" />
                        ) : node.status === "current" ? (
                          <Circle className="h-5 w-5 text-primary" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className={`${node.status === "locked" ? "text-muted-foreground" : "text-foreground"} font-medium`}>
                          {node.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Level {node.level} • {node.status === "completed" ? "5/5 problems" : node.status === "current" ? "2/5 problems" : "5 problems"}
                        </p>
                      </div>

                      {node.status === "current" && (
                        <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <Link href="/roadmaps">
                            Continue
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {node.status === "completed" && (
                        <Button asChild size="sm" variant="ghost" className="text-secondary hover:bg-secondary/10 hover:text-secondary">
                          <Link href="/roadmaps">Review</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/roadmaps">
              Explore All Roadmaps
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
