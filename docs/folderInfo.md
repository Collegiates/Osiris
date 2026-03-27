# Folder Overview

## Root
- `frontend`: Next.js client application for user-facing UI and interactions.
- `backend`: FastAPI service for assessment logic.
- `docs`: Project documentation, architecture, requirements, and scope tracking.
- `BACKLOG.md`: Task list and milestones.
- `README.md`: Setup instructions and project summary.

## Frontend
- `frontend/osiris/app`: Next.js routes for landing and assessment.
- `frontend/osiris/components`: Shared UI components and status providers.
- `frontend/osiris/lib`: Client utilities (API and Supabase helpers).

## Backend
- `backend/routers`: API endpoints for assessments and metadata.
- `backend/models`: Pydantic schemas for API inputs/outputs.
- `backend/database`: Memory store, Supabase client helpers, and env endpoint utilities.
- `backend/services`: execution language registry and execution-provider abstractions.
- `backend/scripts`: Offline ingestion scripts (CodeNet import and test suite uploads).
- `backend/tests`: API tests for assessment flows.

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
- `docs/stage3_roadmap_schema.sql`: Roadmap graph schema changes for Stage 3.
