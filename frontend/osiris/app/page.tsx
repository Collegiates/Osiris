import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesGrid } from "@/components/features-grid";
import { RoadmapPreview } from "@/components/roadmap-preview";
import { HowItWorks } from "@/components/how-it-works";
import { CodePreview } from "@/components/code-preview";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <RoadmapPreview />
        <HowItWorks />
        <CodePreview />
      </main>
      <section id="pricing" className="border-t border-border bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">Simple pricing coming soon</h2>
          <p className="mt-3 text-muted-foreground">
            The MVP currently includes core learning features while plans are finalized.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
