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

## Page Map (Implemented)
- `/` Landing and onboarding entry.
- `/assessment` Assessment selection, flow, and results.
- `/roadmaps` Topic roadmap list.
- `/roadmap/[topic]` Topic roadmap detail.
- `/problem/[id]` Problem details, editor, run, submit, and hints.

## Data Responsibilities
- Fetch assessment data and submit responses.
- Display topic roadmaps from backend APIs.
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
