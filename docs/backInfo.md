# Backend Function Plan

## Purpose
Provide secure business logic, assessment evaluation, roadmap orchestration, and AI guidance routing while enforcing the “AI as tutor, not solver” policy.

## Core Services
- Auth verification (Supabase JWT validation and user role checks).
- Assessment delivery and scoring.
- Hidden skill level calculation and updates.
- Topic roadmap generation, branching, and persistence.
- Problem evaluation, run handling, and submission feedback.
- AI prompt orchestration for hints and explanations.
- Analytics aggregation for progress dashboards.

## Planned API Areas
- `POST /assessment/start`
- `POST /assessment/submit`
- `GET /skill-level`
- `GET /roadmaps`
- `GET /roadmap/{topic}`
- `POST /roadmap/{topic}/branch`
- `GET /problems/{id}`
- `POST /problems/{id}/run`
- `POST /problems/{id}/submit`
- `POST /ai/hint`
- `GET /progress`

## Assessment Rules
- Short assessment: 1 coding problem (easy to medium) + 10 CS questions.
- Normal assessment: 2 coding problems + 10 CS questions.
- Score produces a hidden skill level used for roadmap placement.

## Struggle Rules
- Track elapsed time per problem.
- Track failed submissions (max 3).
- If struggle criteria are met, branch to prerequisite skill roadmaps.

## Data Responsibilities
- Store assessment results, question responses, and skill profile snapshots.
- Maintain topic roadmaps, branching paths, and completion metrics.
- Track runs and submissions for struggle detection.
- Track AI interactions for quality and safety review.
- Persist user settings for AI behavior and pacing.

## AI Guardrails
- Enforce a no-full-solution policy with output filtering.
- Require structured response formats for hints.
- Log and rate-limit AI requests.
- Validate responses against hint-only criteria before returning.

## Error Handling
- Uniform error envelope with trace ids.
- Graceful fallbacks when AI is unavailable.
- Input validation for all user submissions.

## Security Notes
- Supabase RLS for data ownership boundaries.
- Backend verification of all client claims.
- Strict CORS and request size limits.
- Isolated execution environment for code evaluation.
