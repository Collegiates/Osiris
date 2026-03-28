"use client";

import Link from "next/link";
import { Brain, Sparkles, Target, Zap } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const assessmentCards = [
  {
    id: "short",
    title: "Quick Assessment",
    duration: "10-15 minutes",
    questions: "1 coding + 10 CS",
    description: "Fast baseline check before you jump into practice.",
    icon: Zap,
    recommended: false,
  },
  {
    id: "normal",
    title: "Comprehensive Assessment",
    duration: "25-35 minutes",
    questions: "2 coding + 10 CS",
    description: "More accurate placement and stronger topic profile.",
    icon: Target,
    recommended: true,
  },
] as const;

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">Skills Assessment</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose your assessment type to generate your starting skill level and roadmap position.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {assessmentCards.map((assessmentCard) => {
            const Icon = assessmentCard.icon;
            return (
              <Card key={assessmentCard.id} className="relative border-border">
                {assessmentCard.recommended && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-secondary text-secondary-foreground">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Recommended
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{assessmentCard.title}</CardTitle>
                  <CardDescription>{assessmentCard.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Duration: {assessmentCard.duration}</p>
                    <p>Questions: {assessmentCard.questions}</p>
                  </div>
                  <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href={`/assessment/${assessmentCard.id}`}>Begin Assessment</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
