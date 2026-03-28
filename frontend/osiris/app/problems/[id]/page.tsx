"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { useSupabase } from "@/components/supabase-provider";
import { apiFetch, apiFetchWithAuth } from "@/lib/apiClient";
import { ProblemHeader } from "@/components/problem/problem-header";
import { ProblemStatement } from "@/components/problem/problem-statement";
import { CodeEditor } from "@/components/problem/code-editor";
import { OutputPanel } from "@/components/problem/output-panel";
import type { ExecutionResult } from "@/components/problem/output-panel";

type ProblemDetailResponse = {
  problemId: string;
  problemVersionId: string;
  title: string;
  summary?: string | null;
  statementMarkdown?: string | null;
  difficulty?: string | null;
  topicId?: string | null;
  examples?: unknown;
  constraints?: Record<string, unknown> | null;
  inputSpec?: string | null;
  outputSpec?: string | null;
  timeLimitMs?: number | null;
  memoryLimitMb?: number | null;
  allowedLanguages?: string[] | null;
  sourceDataset?: string | null;
  externalId?: string | null;
};

type ExecutionLanguagesResponse = {
  providerMode: string;
  languages: Array<{
    languageKey: string;
    displayName: string;
    isEnabled: boolean;
  }>;
};

type ExampleItem = {
  input?: string;
  output?: string;
  explanation?: string;
};

const starterCodeByLanguage: Record<string, string> = {
  python: "def solve():\n    pass\n\nif __name__ == '__main__':\n    solve()\n",
  javascript: "function solve() {\n  // TODO\n}\n\nsolve();\n",
  java: "public class Main {\n  public static void main(String[] args) {\n    // TODO\n  }\n}\n",
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  // TODO\n  return 0;\n}\n",
};

function normalizeExamples(examplesValue: unknown): ExampleItem[] {
  if (Array.isArray(examplesValue)) {
    return examplesValue.filter((item) => typeof item === "object" && item !== null) as ExampleItem[];
  }
  if (examplesValue && typeof examplesValue === "object") {
    return [examplesValue as ExampleItem];
  }
  return [];
}

export default function ProblemDetailPage() {
  const params = useParams<{ id: string }>();
  const problemId = params.id;
  const supabase = useSupabase();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [problemData, setProblemData] = useState<ProblemDetailResponse | null>(null);
  const [languageOptions, setLanguageOptions] = useState<Array<{ languageKey: string; displayName: string }>>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [codeValue, setCodeValue] = useState(starterCodeByLanguage.python);
  const [stdinValue, setStdinValue] = useState("");
  const [result, setResult] = useState<ExecutionResult>({ status: "idle" });
  const [activeTab, setActiveTab] = useState<"output" | "testcases">("output");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      if (!problemId) {
        setErrorMessage("Missing problem id");
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setAccessToken(data.session?.access_token ?? null);

        const [problemResponse, languageResponse] = await Promise.all([
          apiFetch<ProblemDetailResponse>(`/problems/${problemId}`),
          apiFetch<ExecutionLanguagesResponse>("/execution/languages"),
        ]);

        setProblemData(problemResponse);

        const enabledLanguageRows = languageResponse.languages.filter((row) => row.isEnabled);
        const allowedLanguageSet = new Set((problemResponse.allowedLanguages ?? ["python"]).map((item) => item.toLowerCase()));
        const filteredLanguageRows = enabledLanguageRows.filter((row) => allowedLanguageSet.has(row.languageKey));
        const finalLanguageRows = filteredLanguageRows.length > 0 ? filteredLanguageRows : enabledLanguageRows;

        setLanguageOptions(finalLanguageRows.map((row) => ({ languageKey: row.languageKey, displayName: row.displayName })));

        const initialLanguage = finalLanguageRows[0]?.languageKey ?? "python";
        setSelectedLanguage(initialLanguage);
        setCodeValue(starterCodeByLanguage[initialLanguage] ?? starterCodeByLanguage.python);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load problem");
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [problemId, supabase]);

  const exampleItems = useMemo(() => normalizeExamples(problemData?.examples), [problemData]);

  const handleLanguageChange = (languageKey: string) => {
    setSelectedLanguage(languageKey);
    setCodeValue(starterCodeByLanguage[languageKey] ?? codeValue);
  };

  const handleRun = async () => {
    if (!accessToken || !problemData) {
      setErrorMessage("Sign in to run code");
      return;
    }
    setResult({ status: "running" });
    setActiveTab("output");
    try {
      const response = await apiFetchWithAuth<{
        stdout?: string;
        stderr?: string;
        compileOutput?: string;
        message?: string;
        status?: { description?: string };
      }>(`/problems/${problemData.problemId}/run`, accessToken, {
        method: "POST",
        body: JSON.stringify({ languageKey: selectedLanguage, sourceCode: codeValue, stdin: stdinValue }),
      });
      setResult({
        status: "success",
        stdout: response.stdout,
        stderr: response.stderr,
        compileOutput: response.compileOutput,
        message: response.message ?? response.status?.description,
      });
    } catch (error) {
      setResult({ status: "error", message: error instanceof Error ? error.message : "Run failed" });
    }
  };

  const handleSubmit = async () => {
    if (!accessToken || !problemData) {
      setErrorMessage("Sign in to submit code");
      return;
    }
    setResult({ status: "running" });
    setActiveTab("testcases");
    try {
      const response = await apiFetchWithAuth<{
        passedCount?: number;
        totalCount?: number;
        score?: number;
        failedCasesPreview?: Array<{ input: string; expected: string; actual: string }>;
        message?: string;
      }>(`/problems/${problemData.problemId}/submit`, accessToken, {
        method: "POST",
        body: JSON.stringify({ languageKey: selectedLanguage, sourceCode: codeValue, stdin: stdinValue }),
      });
      setResult({
        status: "success",
        passedCount: response.passedCount,
        totalCount: response.totalCount,
        score: response.score,
        failedCasesPreview: response.failedCasesPreview,
        message: response.message,
      });
    } catch (error) {
      setResult({ status: "error", message: error instanceof Error ? error.message : "Submit failed" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      {!accessToken && (
        <div className="border-b border-border bg-primary/10 px-4 py-2 text-sm text-primary">
          You are viewing read-only mode. <Link href="/auth/login" className="underline">Sign in</Link> to run and submit.
        </div>
      )}

      {isLoading && <p className="px-4 py-6 text-sm text-muted-foreground">Loading problem...</p>}
      {errorMessage && <p className="px-4 py-3 text-sm text-destructive">{errorMessage}</p>}

      {problemData && !isLoading && (
        <>
          <ProblemHeader
            problem={{ title: problemData.title, difficulty: problemData.difficulty }}
            selectedLanguage={selectedLanguage}
            languageOptions={languageOptions}
            isRunning={result.status === "running"}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
          />

          <main className="grid min-h-[calc(100vh-10rem)] grid-cols-1 lg:grid-cols-[42%,58%]">
            <ProblemStatement
              title={problemData.title}
              statementMarkdown={problemData.statementMarkdown}
              examples={exampleItems}
              constraints={problemData.constraints}
              inputSpec={problemData.inputSpec}
              outputSpec={problemData.outputSpec}
              sourceDataset={problemData.sourceDataset}
              externalId={problemData.externalId}
            />

            <section className="grid grid-rows-[62%,38%]">
              <CodeEditor codeValue={codeValue} languageKey={selectedLanguage} onCodeChange={setCodeValue} />
              <OutputPanel
                result={result}
                stdinValue={stdinValue}
                activeTab={activeTab}
                onStdinChange={setStdinValue}
                onTabChange={setActiveTab}
              />
            </section>
          </main>
        </>
      )}
    </div>
  );
}
