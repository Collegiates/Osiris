# Backend Function Plan

## Purpose
Provide secure assessment evaluation and hidden skill level calculation while enforcing the "AI as tutor, not solver" policy.

## Core Services
- Auth verification (Supabase JWT validation placeholder).
- Assessment delivery and scoring.
- Hidden skill level calculation and updates.
- Problem content ingestion and read-only delivery from Supabase.

## Implemented API Areas
- `POST /assessments`
- `GET /assessments/{assessmentId}`
- `POST /assessments/{assessmentId}/submit`
- `GET /problems`
- `GET /problems/{problemId}`

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

## Security Notes
- Supabase RLS for data ownership boundaries (planned).
- Backend verification of all client claims.
- Supabase service role key required for ingestion tooling (server-side only).
