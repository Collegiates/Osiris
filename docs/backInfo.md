# Backend Function Plan

## Purpose
Provide secure assessment evaluation and hidden skill level calculation while enforcing the "AI as tutor, not solver" policy.

## Core Services
- Auth verification (Supabase JWT validation placeholder).
- Assessment delivery and scoring.
- Hidden skill level calculation and updates.
- Problem content ingestion and read-only delivery from Supabase.
- Roadmap graph generation, branching, and progress tracking.

## Implemented API Areas
- `POST /assessments`
- `GET /assessments/{assessmentId}`
- `POST /assessments/{assessmentId}/submit`
- `GET /problems`
- `GET /problems/{problemId}`
- `POST /problems/{problemId}/run` (Stage 4 contract, provider-gated)
- `POST /problems/{problemId}/submit` (Stage 4 contract, provider-gated)
- `GET /execution/languages` (language registry)
- `GET /roadmaps`
- `GET /roadmaps/{roadmapId}`
- `POST /roadmaps/start`
- `POST /roadmaps/{roadmapId}/nodes/{nodeId}/progress`
- `POST /roadmaps/{roadmapId}/nodes/{nodeId}/branch`

## Assessment Rules
- Short assessment: 1 coding problem (easy to medium) + 10 CS questions.
- Normal assessment: 2 coding problems (easy + medium) + 10 CS questions.
- Questions are randomized per session.
- Scoring considers completion, answer length heuristics, and time spent.

## Data Responsibilities
- Store assessment sessions and question metadata in memory.
- Store hidden skill level snapshot per user in memory.
- Store problem metadata and versions in Supabase (CodeNet ingestion).
- Store test suites in Supabase Storage with object key references in `problem_versions` and `test_suites`.
- Store roadmap nodes, edges, and per-user node progress in Supabase.
- Store execution language enablement in backend config (`EXECUTION_ENABLED_LANGUAGES`) with future-ready keys: `python`, `javascript`, `java`, `cpp`.

## Stage 4 / 4.5 Split
- Stage 4: API contracts, language registry, gating, and frontend language plumbing.
- Stage 4.5: live Judge0 runtime wiring and run/submit execution polling.

## Security Notes
- Supabase RLS for data ownership boundaries (planned).
- Backend verification of all client claims.
- Supabase service role key required for ingestion tooling (server-side only).
