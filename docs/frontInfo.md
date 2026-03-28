# Frontend Function Plan

## Purpose
Provide a fast, intuitive interface for assessments and Socratic learning onboarding without revealing full solutions.

## Primary User Flows
- Landing page with login entry.
- Choose assessment type (short or normal).
- Complete coding problems and CS questions.
- Review hidden skill level results.
- Select a topic roadmap and view progress on a hexagon map.
- Open roadmap detail for node-level progression and branching actions.
- Browse problem catalog.
- Open problem workspace and use Run/Submit controls.

## Page Map (Implemented)
- `/` Landing and onboarding entry with login.
- `/assessment` Assessment selection, flow, and results.
- `/roadmaps` Topic selector + roadmap stats + hexagon roadmap graph.
- `/roadmaps/[roadmapId]` Roadmap node progression and branching controls.
- `/problems` Problem list with search.
- `/problems/[id]` Coding workspace (statement + editor + output/test panels).

## Data Responsibilities
- Fetch assessment data and submit responses.
- Display randomized question order.

## UX Principles
- Keep the focus on learning and progress, not answer exposure.
- Show clean, modern education-focused visuals.
- Keep assessment flow minimal and fast.
