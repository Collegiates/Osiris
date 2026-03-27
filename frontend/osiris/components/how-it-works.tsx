import { ClipboardCheck, Route, Code2, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Take the Assessment",
    description: "Choose a quick 5-minute or comprehensive 15-minute assessment. We analyze your current skill level without you even realizing it.",
  },
  {
    number: "02",
    icon: Route,
    title: "Get Your Roadmap",
    description: "Based on your assessment, we create a personalized learning path. Start exactly where you need to, no wasted time on things you already know.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Learn by Doing",
    description: "Tackle problems with Socratic AI guidance. We ask the right questions to lead you to solutions, building genuine understanding.",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Master & Progress",
    description: "Complete topics, unlock new challenges, and watch your skill level grow. Struggling? We branch to prerequisites, then bring you back.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border bg-muted/30 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">How It Works</h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your Path to Mastery
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Four simple steps to transform your coding skills. Our adaptive system meets you where you are
            and guides you to where you want to be.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-16 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-primary/50 to-transparent lg:block" />
              )}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 text-sm font-bold text-primary">{step.number}</div>
                <div className="relative mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-lg">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute inset-0 -z-10 h-16 w-16 rounded-2xl bg-primary/20 blur-xl" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 p-8 text-center">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-xl font-semibold text-foreground">The Socratic Difference</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Unlike other platforms that hand you solutions, Osiris asks guiding questions that help you
              discover answers yourself. This builds <span className="font-medium text-foreground">real problem-solving intuition</span> that
              transfers to any coding challenge you will face.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
