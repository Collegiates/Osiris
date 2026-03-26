"use client";

import { useState } from "react";
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

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Assessment</h1>
      <div className="flex gap-4">
        <select
          className="border rounded px-3 py-2"
          value={assessmentType}
          onChange={(event) => setAssessmentType(event.target.value as AssessmentType)}
        >
          <option value="short">Short (1 coding + 10 CS)</option>
          <option value="normal">Normal (2 coding + 10 CS)</option>
        </select>
        <button
          className="px-4 py-2 rounded bg-black text-white"
          onClick={startAssessment}
          disabled={loading}
        >
          {loading ? "Loading..." : "Start"}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.questionId} className="border rounded p-4 space-y-2">
              <div className="text-sm text-muted-foreground">
                {index + 1}. {question.questionType.toUpperCase()} - {question.difficulty}
              </div>
              <p>{question.prompt}</p>
              <textarea
                className="w-full border rounded p-2"
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
            className="px-4 py-2 rounded bg-black text-white"
            onClick={submitAssessment}
            disabled={loading}
          >
            Submit Assessment
          </button>
        </div>
      )}

      {result && (
        <div className="border rounded p-4">
          <p>Overall Score: {result.overallScore}</p>
          <p>Hidden Skill Level: {result.hiddenSkillLevel}</p>
        </div>
      )}
    </main>
  );
}
