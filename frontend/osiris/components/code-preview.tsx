"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Terminal, MessageSquare, ChevronRight, Lightbulb, CheckCircle2 } from "lucide-react";

const hints = [
  { text: "What would happen if the input string is empty?" },
  { text: "Think about the edge cases first. How should your function behave?" },
  { text: "You are on the right track. The loop structure looks good." },
];

export function CodePreview() {
  const [activeHint, setActiveHint] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1500);
  };

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Experience</h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See Socratic Learning in Action
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Our AI tutor guides you with thoughtful questions, helping you build understanding
            step by step without just handing you the solution.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <div className="h-3 w-3 rounded-full bg-secondary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">reverse_string.py</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleRun}
                  className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-secondary-foreground border-t-transparent" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Code
                    </>
                  )}
                </Button>
              </div>

              <div className="p-6 font-mono text-sm">
                <div className="space-y-0.5">
                  <div className="flex">
                    <span className="w-8 select-none text-muted-foreground">1</span>
                    <span className="text-secondary">def</span>{" "}
                    <span className="text-primary">reverse_string</span>
                    <span className="text-muted-foreground">(</span>
                    <span className="text-[#f5a623]">s</span>
                    <span className="text-muted-foreground">):</span>
                  </div>
                  <div className="flex">
                    <span className="w-8 select-none text-muted-foreground">2</span>
                    <span className="pl-4 text-muted-foreground">&quot;&quot;&quot;Reverse a string without using built-in reverse.&quot;&quot;&quot;</span>
                  </div>
                  <div className="flex">
                    <span className="w-8 select-none text-muted-foreground">3</span>
                    <span className="pl-4 text-foreground">result</span>{" "}
                    <span className="text-muted-foreground">=</span>{" "}
                    <span className="text-[#f5a623]">&quot;&quot;</span>
                  </div>
                  <div className="flex">
                    <span className="w-8 select-none text-muted-foreground">4</span>
                    <span className="pl-4 text-secondary">for</span>{" "}
                    <span className="text-foreground">char</span>{" "}
                    <span className="text-secondary">in</span>{" "}
                    <span className="text-foreground">s</span>
                    <span className="text-muted-foreground">:</span>
                  </div>
                  <div className="-mx-6 flex border-l-2 border-primary bg-primary/10 px-6 py-0.5">
                    <span className="w-8 select-none text-primary">5</span>
                    <span className="pl-8 text-foreground">result</span>{" "}
                    <span className="text-muted-foreground">=</span>{" "}
                    <span className="text-foreground">char</span>{" "}
                    <span className="text-muted-foreground">+</span>{" "}
                    <span className="text-foreground">result</span>
                    <span className="ml-1 animate-pulse text-primary">▌</span>
                  </div>
                  <div className="flex">
                    <span className="w-8 select-none text-muted-foreground">6</span>
                    <span className="pl-4 text-secondary">return</span>{" "}
                    <span className="text-foreground">result</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border bg-[#0d0d0d] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Terminal className="h-3 w-3" />
                  <span>Output</span>
                </div>
                <div className="font-mono text-sm text-secondary">
                  {isRunning ? (
                    <span className="text-muted-foreground">Running tests...</span>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Test 1 passed: reverse_string(&quot;hello&quot;) = &quot;olleh&quot;</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Test 2 passed: reverse_string(&quot;world&quot;) = &quot;dlrow&quot;</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border bg-primary/10 px-4 py-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Osiris AI Tutor</span>
              </div>

              <div className="flex-1 space-y-4 p-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Socratic Hint</p>
                      <p className="text-foreground">{hints[activeHint].text}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Hint {activeHint + 1} of {hints.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveHint((prev) => Math.max(0, prev - 1))}
                      disabled={activeHint === 0}
                      className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setActiveHint((prev) => Math.min(hints.length - 1, prev + 1))}
                      disabled={activeHint === hints.length - 1}
                      className="rounded-md px-3 py-1.5 text-sm text-primary hover:bg-primary/10 disabled:opacity-50"
                    >
                      Next Hint
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <p className="mb-2 text-xs text-muted-foreground">Quick Actions</p>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-border p-3 text-sm text-foreground transition-colors hover:bg-muted">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span>Explain this concept</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-border p-3 text-sm text-foreground transition-colors hover:bg-muted">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span>Show me a similar example</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-border p-3 text-sm text-foreground transition-colors hover:bg-muted">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span>What should I try next?</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
