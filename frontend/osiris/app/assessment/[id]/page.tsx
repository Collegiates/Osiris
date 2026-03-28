"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { useSupabase } from "@/components/supabase-provider";
import { apiFetchWithAuth } from "@/lib/apiClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AssessmentType = "short" | "normal";

type Question = {
  questionId: string;
  questionType: "coding" | "cs";
  prompt: string;
  difficulty: "easy" | "medium" | "hard";
};

type AssessmentStartResponse = {
  assessmentId: string;
  assessmentType: AssessmentType;
  instructions: string;
};

type AssessmentGetResponse = {
  questions: Question[];
};

type AssessmentResultResponse = {
  overallScore: number;
  hiddenSkillLevel: number;
};

export default function AssessmentTakingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = useSupabase();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [questionRows, setQuestionRows] = useState<Question[]>([]);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const assessmentType = (params.id === "normal" ? "normal" : "short") as AssessmentType;

  useEffect(() => {
    const boot = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token ?? null;
        setAccessToken(token);
        if (!token) {
          setErrorMessage("Sign in required to take assessment");
          setIsLoading(false);
          return;
        }

        const startResponse = await apiFetchWithAuth<AssessmentStartResponse>("/assessments", token, {
          method: "POST",
          body: JSON.stringify({ assessmentType }),
        });
        setAssessmentId(startResponse.assessmentId);
        setInstructions(startResponse.instructions);

        const questionResponse = await apiFetchWithAuth<AssessmentGetResponse>(
          `/assessments/${startResponse.assessmentId}`,
          token
        );
        setQuestionRows(questionResponse.questions);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to start assessment");
      } finally {
        setIsLoading(false);
      }
    };

    boot();
  }, [assessmentType, supabase]);

  const currentQuestion = questionRows[currentIndex];
  const answeredCount = useMemo(
    () => Object.values(answersByQuestionId).filter((answerValue) => answerValue.trim().length > 0).length,
    [answersByQuestionId]
  );

  const handleSubmit = async () => {
    if (!accessToken || !assessmentId) return;
    setIsSubmitting(true);
    try {
      const resultResponse = await apiFetchWithAuth<AssessmentResultResponse>(
        `/assessments/${assessmentId}/submit`,
        accessToken,
        {
          method: "POST",
          body: JSON.stringify({
            answers: answersByQuestionId,
            timeSpentSeconds: 0,
          }),
        }
      );

      const query = new URLSearchParams({
        type: assessmentType,
        score: String(resultResponse.overallScore),
        skill: String(resultResponse.hiddenSkillLevel),
        answered: String(answeredCount),
        total: String(questionRows.length),
      });
      router.push(`/assessment/results?${query.toString()}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Submit failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {isLoading && <p className="text-sm text-muted-foreground">Loading assessment...</p>}
        {errorMessage && <p className="mb-4 text-sm text-destructive">{errorMessage}</p>}

        {!isLoading && !errorMessage && currentQuestion && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questionRows.length}</p>
                <h1 className="text-2xl font-bold text-foreground">{assessmentType === "short" ? "Quick" : "Comprehensive"} Assessment</h1>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Answered: {answeredCount}</Badge>
                <Button variant="outline" asChild>
                  <Link href="/assessment">Exit</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                <span>{currentQuestion.questionType}</span>
                <span>•</span>
                <span>{currentQuestion.difficulty}</span>
              </div>
              <p className="mb-4 text-lg text-foreground">{currentQuestion.prompt}</p>
              <textarea
                value={answersByQuestionId[currentQuestion.questionId] ?? ""}
                onChange={(event) =>
                  setAnswersByQuestionId((prevState) => ({
                    ...prevState,
                    [currentQuestion.questionId]: event.target.value,
                  }))
                }
                className="h-44 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none"
              />
            </div>

            <p className="text-sm text-muted-foreground">{instructions}</p>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prevState) => Math.max(0, prevState - 1))}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentIndex >= questionRows.length - 1}
                  onClick={() => setCurrentIndex((prevState) => Math.min(questionRows.length - 1, prevState + 1))}
                >
                  Next
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Assessment"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
