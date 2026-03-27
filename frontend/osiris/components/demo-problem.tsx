"use client";

import { useState } from "react";

export function DemoProblem() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl shadow-orange-500/10 backdrop-blur">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Demo Problem</p>
        <h3 className="font-display text-2xl">Warm-up: Sum of Two</h3>
        <p className="text-sm text-muted-foreground">
          Click the button to preview a sample problem. No submissions yet.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-fit rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"
      >
        {isOpen ? "Hide demo problem" : "Demo problem"}
      </button>
      {isOpen && (
        <div className="rounded-2xl border border-foreground/10 bg-black/90 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Problem</p>
          <h4 className="mt-2 text-lg font-semibold">Sum of Two Integers</h4>
          <p className="mt-3 text-sm text-white/80">
            Given two integers on one line, output their sum.
          </p>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Input</p>
              <p>Two space-separated integers.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Output</p>
              <p>Their sum.</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Example</p>
              <p className="mt-1">
                Input: <span className="font-semibold text-white">4 9</span>
              </p>
              <p>
                Output: <span className="font-semibold text-white">13</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
