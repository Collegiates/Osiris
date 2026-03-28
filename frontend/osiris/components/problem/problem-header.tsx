"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown, Play, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type ProblemHeaderModel = {
  title: string;
  difficulty?: string | null;
};

type LanguageOption = {
  languageKey: string;
  displayName: string;
};

type ProblemHeaderProps = {
  problem: ProblemHeaderModel;
  selectedLanguage: string;
  languageOptions: LanguageOption[];
  isRunning: boolean;
  onLanguageChange: (languageKey: string) => void;
  onRun: () => void;
  onSubmit: () => void;
};

export function ProblemHeader({
  problem,
  selectedLanguage,
  languageOptions,
  isRunning,
  onLanguageChange,
  onRun,
  onSubmit,
}: ProblemHeaderProps) {
  const selectedLanguageLabel =
    languageOptions.find((option) => option.languageKey === selectedLanguage)?.displayName ?? selectedLanguage;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <Link href="/problems" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Problems</span>
        </Link>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">{problem.title}</h1>
          <Badge variant="outline" className="capitalize">
            {problem.difficulty ?? "medium"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className="text-sm">{selectedLanguageLabel}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languageOptions.map((option) => (
              <DropdownMenuItem key={option.languageKey} onClick={() => onLanguageChange(option.languageKey)}>
                {option.displayName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="gap-2" onClick={onRun} disabled={isRunning}>
          <Play className="h-3.5 w-3.5" />
          Run
        </Button>
        <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={onSubmit} disabled={isRunning}>
          <Send className="h-3.5 w-3.5" />
          Submit
        </Button>
      </div>
    </header>
  );
}
