import { Brain, GitBranch, Target, Lightbulb, TrendingUp, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Skill Assessment",
    description: "Choose between short or comprehensive assessments. We determine your hidden skill level to place you in the perfect starting point.",
  },
  {
    icon: Brain,
    title: "Socratic AI Tutor",
    description: "Our AI guides you through questions and hints, never giving full solutions. Build real problem-solving skills that stick.",
  },
  {
    icon: GitBranch,
    title: "Dynamic Branching",
    description: "Struggling with a concept? The roadmap automatically branches to prerequisite topics, then brings you back stronger.",
  },
  {
    icon: TrendingUp,
    title: "Adaptive Difficulty",
    description: "Problems adjust to your evolving skill level. Always challenged, never overwhelmed.",
  },
  {
    icon: Lightbulb,
    title: "Topic Roadmaps",
    description: "Explore focused paths for Strings, Lists, Trees, Dictionaries, and more. Master one topic at a time.",
  },
  {
    icon: Shield,
    title: "Progress Tracking",
    description: "Track every attempt, submission, and breakthrough. Watch your skills grow over time with detailed analytics.",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Run your code in a sandboxed environment. Get immediate results and learn from every iteration.",
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Connect with fellow learners. Share insights, celebrate wins, and grow together.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="border-t border-border bg-muted/30 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Features</h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Level Up
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Osiris combines adaptive learning, Socratic teaching methods, and intelligent progress tracking
            to create the ultimate developer learning experience.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 rounded-b-xl bg-gradient-to-r from-primary to-secondary transition-all group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
