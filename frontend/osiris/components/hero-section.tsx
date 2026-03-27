"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Terminal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Socratic Learning</span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Turn Your Weaknesses Into{" "}
            <span className="bg-gradient-to-r from-primary to-[#f5a623] bg-clip-text text-transparent">
              Strengths
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Master coding through personalized practice. Our Socratic AI tutor guides you without giving
            answers, building real problem-solving skills that last.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/assessment">
                Start Learning Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 border-border text-foreground hover:bg-muted">
              <Link href="/roadmaps">
                <Play className="h-4 w-4" />
                Explore Roadmaps
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "10K+", label: "Active Learners" },
              { value: "500+", label: "Problems" },
              { value: "8", label: "Topic Roadmaps" },
              { value: "95%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-20 w-full max-w-3xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <div className="h-3 w-3 rounded-full bg-secondary" />
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">problem_solver.py</span>
                </div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="space-y-1">
                  <div>
                    <span className="text-secondary">def</span>{" "}
                    <span className="text-primary">solve_challenge</span>
                    <span className="text-muted-foreground">(</span>
                    <span className="text-[#f5a623]">problem</span>
                    <span className="text-muted-foreground">):</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-muted-foreground"># Osiris guides you with hints, not answers</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-secondary">while</span>{" "}
                    <span className="text-foreground">not</span>{" "}
                    <span className="text-foreground">solved</span>
                    <span className="text-muted-foreground">:</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-foreground">hint</span>{" "}
                    <span className="text-muted-foreground">=</span>{" "}
                    <span className="text-foreground">osiris</span>
                    <span className="text-muted-foreground">.</span>
                    <span className="text-primary">get_socratic_hint</span>
                    <span className="text-muted-foreground">()</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-foreground">understanding</span>{" "}
                    <span className="text-muted-foreground">+=</span>{" "}
                    <span className="text-foreground">learn</span>
                    <span className="text-muted-foreground">(</span>
                    <span className="text-foreground">hint</span>
                    <span className="text-muted-foreground">)</span>
                  </div>
                  <div className="mt-2 pl-4">
                    <span className="text-secondary">return</span>{" "}
                    <span className="text-[#f5a623]">&quot;mastery_achieved&quot;</span>{" "}
                    <span className="animate-pulse text-primary">▌</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
