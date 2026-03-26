import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-semibold">Osiris Learning Platform</h1>
        <p className="text-base text-muted-foreground">
          Socratic AI tutoring with assessments and guided practice.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/assessment"
          className="px-4 py-2 rounded bg-black text-white text-sm"
        >
          Start Assessment
        </Link>
      </div>
    </main>
  );
}
