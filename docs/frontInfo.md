# Frontend Function Plan

## Purpose
Provide a fast, intuitive interface for assessments, topic roadmaps, and Socratic AI guidance without revealing full solutions.

## Primary User Flows
- Account creation and sign-in.
- Choose assessment type (short or normal).
- Complete coding problems and CS questions.
- View hidden skill level placement and topic roadmap options.
- Choose a topic roadmap after login.
- Work through roadmap problems with editor, run, and submit.
- Receive AI hints and conceptual guidance.
- Track progress and skill trends over time.

## Page Map (Planned)
- `/` Landing and onboarding entry.
- `/auth` Sign up and sign in.
- `/assessment` Assessment selection, flow, and results.
- `/roadmaps` Topic roadmap list and placement guidance.
- `/roadmap/[topic]` Topic roadmap overview with dynamic branching.
- `/problem/[id]` Problem details, editor, run, submit, and hints.
- `/progress` Analytics and milestones.
- `/settings` Profile, preferences, and AI help settings.

## Data Responsibilities
- Fetch user profile, auth state, and hidden skill level.
- Display topic roadmaps and branching paths from backend APIs.
- Stream AI hints and guidance responses.
- Render progress metrics and historical attempts.

## UX Principles
- Keep the focus on learning and progress, not answer exposure.
- Show hints in steps, not full solutions.
- Make assessment and roadmap flows minimal and fast.
- Communicate struggle and branching clearly to reduce frustration.

## Frontend–Backend Contract (High Level)
- Auth uses Supabase client with JWT passed to backend.
- Backend provides:
  - assessment questions, submissions, and scoring.
  - hidden skill level updates.
  - topic roadmap generation and dynamic branching.
  - problem details and evaluation results.
  - AI hint and feedback streams.

## Error Handling
- Clear state for loading, streaming, and failures.
- User-friendly messages for auth and submission errors.
- Retry controls for AI calls and roadmap refresh.

## Security Notes
- Do not store private keys or secrets in the frontend.
- Enforce role-based UI access where relevant.
- Use secure cookies or tokens per Supabase guidance.
