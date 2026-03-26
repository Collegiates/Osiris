# Folder Overview

## Root
- `frontend`: Next.js client application for user-facing UI and interactions.
- `backend`: FastAPI service for business logic, assessments, roadmaps, AI, and execution.
- `docs`: Project documentation, architecture, requirements, and scope tracking.
- `BACKLOG.md`: Task list and milestones.
- `README.md`: Setup instructions and project summary.

## Frontend
- `frontend/osiris/app`: Next.js routes for assessment, roadmaps, and problems.
- `frontend/osiris/components`: Shared UI components and status providers.
- `frontend/osiris/lib`: Client utilities (API and Supabase helpers).

## Backend
- `backend/routers`: API endpoints for assessments, roadmaps, problems, AI, and metadata.
- `backend/models`: Pydantic schemas for API inputs/outputs.
- `backend/content`: Content ingestion providers and canonical problem schema.
- `backend/services`: External integrations (Judge0, Gemini, language registry).
- `backend/database`: Memory store and env endpoint utilities.
- `backend/tests`: API and logic tests.

## Docs
- `docs/architecture.md`: Architecture decisions and system overview.
- `docs/requirements.md`: Functional and non-functional requirements.
- `docs/proposal.md`: Project proposal and rationale.
- `docs/adr/*`: Individual architecture decision records.
- `docs/skope.md`: Scope tracking and alignment checks.
- `docs/frontInfo.md`: Frontend function plan.
- `docs/backInfo.md`: Backend function plan.
- `docs/aiSuggestions.md`: AI runtime options and recommendations.
- `docs/folderInfo.md`: Project folder map.
