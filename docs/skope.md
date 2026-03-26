# Scope Tracking

## End Goal
Deliver a learning platform that uses a Socratic AI tutor to assess skill level, route users into topic roadmaps, and adapt learning paths without giving full solutions.

## In Scope
- Account creation, authentication, and profile management.
- Assessment flow with short and normal options.
- Hidden skill level that updates over time based on performance.
- Topic-based roadmaps (Strings, Lists, Trees, Dictionaries, etc.).
- Dynamic branching when users struggle on a topic.
- Problem attempts, runs, submissions, and progress tracking.
- AI guidance that provides hints, explanations, and next-step recommendations.
- Supabase-backed data storage with appropriate access controls.
- Performance and safety requirements defined in `docs/requirements.md`.

## Out of Scope (For Now)
- Enterprise SSO and advanced admin tooling.
- Multi-tenant organization features.
- Live collaborative coding sessions.
- Marketplace or third-party content integrations.

## Core Moving Parts
- Frontend (Next.js): assessment UI, topic roadmaps, editor, and dashboards.
- Backend (FastAPI): assessment scoring, roadmap orchestration, and AI routing.
- Database & Auth (Supabase): users, assessments, skill levels, and roadmap state.
- Code Execution: sandboxed evaluation service for submissions.
- AI Runtime: model orchestration, guardrails, and hint generation.

## Alignment Checks
- Does this feature improve assessment accuracy, roadmap placement, or learning guidance?
- Does it preserve the “AI as tutor, not solver” policy?
- Does it respect the struggle rules and branching logic?
- Does it keep latency, security, and privacy within defined requirements?

## Open Decisions
- Final AI runtime strategy (local, cloud, or hybrid).
- Production hosting approach for code execution service.
- Problem bank sourcing and licensing.
