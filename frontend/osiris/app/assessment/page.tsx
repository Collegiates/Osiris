"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";

const authHeader = { Authorization: "Bearer demo-user" };

type AssessmentType = "short" | "normal";

type Question = {
  questionId: string;
  questionType: "coding" | "cs";
  prompt: string;
  difficulty: "easy" | "medium" | "hard";
  problemId?: string | null;
};

type AssessmentStartResponse = {
  assessmentId: string;
  assessmentType: AssessmentType;
  questionCount: number;
  instructions: string;
};

type AssessmentGetResponse = {
  assessmentId: string;
  questions: Question[];
};

type AssessmentResultResponse = {
  assessmentId: string;
  overallScore: number;
  hiddenSkillLevel: number;
};

export default function AssessmentPage() {
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("short");
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResultResponse | null>(null);
  const [instructions, setInstructions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startAssessment = async () => {
    setLoading(true);
    setResult(null);
    try {
      const start = await apiFetch<AssessmentStartResponse>("/assessments", {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ assessmentType }),
      });
      setAssessmentId(start.assessmentId);
      setInstructions(start.instructions);

      const fetched = await apiFetch<AssessmentGetResponse>(`/assessments/${start.assessmentId}`, {
        headers: authHeader,
      });
      setQuestions(fetched.questions);
    } finally {
      setLoading(false);
    }
  };

  const submitAssessment = async () => {
    if (!assessmentId) return;
    setLoading(true);
    try {
      const payload = {
        answers: Object.fromEntries(
          Object.entries(answers).map(([questionId, answer]) => [questionId, answer])
        ),
        timeSpentSeconds: 0,
      };
      const response = await apiFetch<AssessmentResultResponse>(
        `/assessments/${assessmentId}/submit`,
        {
          method: "POST",
          headers: authHeader,
          body: JSON.stringify(payload),
        }
      );
      setResult(response);
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = Object.values(answers).filter((value) => value.trim().length > 0).length;

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Assessment</p>
            <h1 className="font-display text-3xl">Find your starting level</h1>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back home
          </Link>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-lg shadow-orange-500/10 backdrop-blur">
          <div className="flex flex-wrap items-center gap-4">
            <select
              className="rounded-full border border-foreground/20 bg-transparent px-4 py-2 text-sm"
              value={assessmentType}
              onChange={(event) => setAssessmentType(event.target.value as AssessmentType)}
            >
              <option value="short">Short (1 coding + 10 CS)</option>
              <option value="normal">Normal (2 coding + 10 CS)</option>
            </select>
            <button
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
              onClick={startAssessment}
              disabled={loading}
            >
              {loading ? "Loading..." : "Start assessment"}
            </button>
          </div>
          {instructions && (
            <p className="text-sm text-muted-foreground">{instructions}</p>
          )}
          {questions.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Answered {answeredCount} of {questions.length}
              </span>
              <span>Save your best attempt for each prompt.</span>
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="space-y-5">
            {questions.map((question, index) => (
              <div key={question.questionId} className="space-y-3 border-b border-foreground/10 pb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {index + 1}. {question.questionType.toUpperCase()} - {question.difficulty}
                  </span>
                  <span className="rounded-full bg-[#ed7d3a]/10 px-3 py-1 text-xs text-[#ed7d3a]">
                    {question.questionType === "coding" ? "Coding" : "Concept"}
                  </span>
                </div>
                <p className="text-lg">{question.prompt}</p>
                <textarea
                  className="w-full rounded-2xl border border-foreground/10 bg-white/80 p-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ed7d3a]/40"
                  rows={3}
                  value={answers[question.questionId] || ""}
                  onChange={(event) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.questionId]: event.target.value,
                    }))
                  }
                />
              </div>
            ))}
            <button
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              onClick={submitAssessment}
              disabled={loading}
            >
              Submit assessment
            </button>
          </div>
        )}

        {result && (
          <div className="rounded-3xl border border-foreground/10 bg-white/80 p-6 text-sm shadow-lg">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Results</p>
            <div className="mt-3 flex flex-col gap-2">
              <p>Overall Score: {result.overallScore.toFixed(2)}</p>
              <p>Hidden Skill Level: {result.hiddenSkillLevel.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
