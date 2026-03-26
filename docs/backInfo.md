# Backend Function Plan

## Purpose
Provide secure business logic, assessment evaluation, roadmap orchestration, and AI guidance routing while enforcing the """AI as tutor, not solver""" policy.

## Core Services
- Auth verification (Supabase JWT validation and user role checks).
- Assessment delivery and scoring.
- Hidden skill level calculation and updates.
- Topic roadmap generation, branching, and persistence.
- Problem evaluation, run handling, and submission feedback.
- AI prompt orchestration for hints and explanations.
- Analytics aggregation for progress dashboards.

## Implemented API Areas
- `POST /assessments`
- `GET /assessments/{assessmentId}`
- `POST /assessments/{assessmentId}/submit`
- `GET /roadmaps`
- `GET /roadmaps/{topic}`
- `POST /roadmaps/{topic}/branch`
- `GET /problems/{id}`
- `POST /problems/{id}/run`
- `POST /problems/{id}/submit`
- `POST /ai/guidance`
- `GET /progress/overview`

## Assessment Rules
- Short assessment: 1 coding problem (easy to medium) + 10 CS questions.
- Normal assessment: 2 coding problems + 10 CS questions.
- Score produces a hidden skill level used for roadmap placement.

## Struggle Rules
- Track elapsed time per problem.
- Track failed submissions (max 3).
- If struggle criteria are met, branch to prerequisite skill roadmaps.
- """No progress""" means no code change for 5 minutes.

## Data Responsibilities
- Store assessment results, question responses, and skill profile snapshots.
- Maintain topic roadmaps, branching paths, and completion metrics.
- Track runs and submissions for struggle detection.
- Track AI interactions for quality and safety review.

## AI Guardrails
- Enforce a no-full-solution policy with output filtering.
- Require structured response formats for hints.
- Log and rate-limit AI requests.

## Security Notes
- Supabase RLS for data ownership boundaries.
- Backend verification of all client claims.
- Strict CORS and request size limits.
- Isolated execution environment for code evaluation.
