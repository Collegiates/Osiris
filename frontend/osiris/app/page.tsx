import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { DemoProblem } from "@/components/demo-problem";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(237,125,58,0.35),_transparent_55%)]" />
          <div className="absolute bottom-0 right-0 h-[60%] w-[60%] bg-[radial-gradient(circle_at_bottom_right,_rgba(77,144,120,0.35),_transparent_60%)]" />
          <div className="absolute top-10 left-10 h-24 w-24 rounded-full bg-[#ed7d3a]/60 blur-2xl animate-float-slow" />
          <div className="absolute bottom-20 left-1/4 h-32 w-32 rounded-full bg-[#4d9078]/40 blur-3xl animate-float-slow" />
        </div>

        <div className="relative z-10 px-6 pt-8">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between">
            <div className="text-lg font-semibold tracking-wide">Osiris</div>
            <div className="flex items-center gap-3">
              <AuthButton />
            </div>
          </nav>

          <div className="mx-auto grid w-full max-w-6xl gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Socratic Learning Platform
              </p>
              <h1 className="font-display text-5xl leading-tight md:text-6xl">
                Learn the way tutors teach, not the way answers are copied.
              </h1>
              <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                Osiris guides you through short or normal assessments, finds your hidden skill level, and
                builds the right practice path without ever handing you the full solution.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/assessment"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"
                >
                  Start assessment
                </Link>
                <Link
                  href="/assessment"
                  className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold transition hover:border-foreground/40"
                >
                  Preview questions
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-3xl border border-foreground/10 bg-white/60 p-8 text-sm shadow-xl shadow-orange-500/10 backdrop-blur">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Assessment Snapshot</p>
                <p className="text-lg font-semibold">Your path starts here</p>
              </div>
              <div className="space-y-3">
                {[
                  "Short: 1 coding challenge + 10 CS questions",
                  "Normal: 2 coding challenges + 10 CS questions",
                  "Hidden skill level updates as you improve",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#ed7d3a]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-black/90 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Socratic AI</p>
                <p className="text-base leading-relaxed">
                  "What data structure keeps track of what you have already seen?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Assess",
              body: "Pick short or normal, then answer focused prompts that reveal true strengths.",
            },
            {
              title: "Place",
              body: "Get a hidden skill level that moves you to the right depth instantly.",
            },
            {
              title: "Practice",
              body: "Follow topic-first roadmaps that adapt when you struggle.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-2">
              <h3 className="font-display text-2xl">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        <DemoProblem />
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-20">
        <div className="flex flex-col justify-between gap-6 rounded-3xl bg-black px-8 py-10 text-white md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Ready to begin?</p>
            <h2 className="font-display text-3xl">Start with the assessment and meet your tutor.</h2>
          </div>
          <Link
            href="/assessment"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
          >
            Start assessment
          </Link>
        </div>
      </section>
    </main>
  );
}
