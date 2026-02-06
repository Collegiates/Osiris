# ADR-0001: Core Technology Stack Selection

## Status
Accepted – 2026-02-06

## Context

The project aims to provide an AI-assisted platform that helps users prepare for technical interviews through guided coding practice.  
Key requirements:

- Modern, responsive web interface  
- Scalable backend for assessments, roadmap generation, and analytics  
- Reliable authentication and data storage  
- Local AI inference with controlled behavior (no direct solution generation)  
- Low operational cost and strong privacy guarantees  

We needed to choose a frontend framework, backend API layer, database/auth provider, and AI runtime that align with these goals while remaining feasible for a student/small-team project.

---

## Decision

We will use the following architecture:

| Layer | Technology |
|-----|------------|
| Frontend | **Next.js** |
| Backend API | **FastAPI (Python)** |
| Database & Auth | **Supabase (PostgreSQL + Auth)** |
| AI Runtime | **Ollama with gpt-oss:20b** |

---

## Rationale

### 1. Next.js – Frontend Framework

**Chosen because:**

- File-based routing and React ecosystem accelerate UI development  
- Server Components and API routes simplify integration with FastAPI  
- Built-in SSR improves performance and SEO  
- Large ecosystem for UI libraries, editors, and authentication flows  
- Easy deployment on Vercel or self-hosting

**Alternatives considered**

- Plain React – more boilerplate, no SSR  
- Vue/Nuxt – good but less team familiarity  
- Angular – heavier and slower to iterate

**Conclusion:** Next.js provides the best balance between developer experience and production readiness.

---

### 2. FastAPI – Backend Service

**Chosen because:**

- High performance with async support  
- Automatic OpenAPI documentation  
- Strong type safety with Pydantic models  
- Excellent integration with Python AI tooling  
- Simple structure for roadmap logic and analytics

**Alternatives considered**

- Node/Express – weaker AI ecosystem  
- Django – heavier than needed  
- Go – great performance but slower iteration

**Conclusion:** FastAPI aligns naturally with AI orchestration and provides rapid, maintainable API development.

---

### 3. Supabase – Database & Authentication

**Chosen because:**

- Managed PostgreSQL with minimal DevOps overhead  
- Built-in authentication (email, OAuth, JWT)  
- Row Level Security for multi-tenant safety  
- Real-time capabilities for progress tracking  
- Cheaper and simpler than self-hosting Postgres + Auth service

**Alternatives considered**

- Firebase – NoSQL less suitable for relational progress data  
- Self-hosted Postgres – more maintenance  
- Auth0 – powerful but costly and external dependency

**Conclusion:** Supabase provides production-grade DB + auth with the least complexity.

---

### 4. Ollama (gpt-oss:20b) – AI Layer

**Chosen because:**

- Fully local inference – no external API cost  
- Behavior can be constrained to *guidance only*  
- Works offline and respects privacy  
- Custom prompts for Socratic tutoring  
- Easy integration via REST

**Alternatives considered**

- OpenAI API – higher quality but expensive and uncontrollable  
- Smaller local models – weaker reasoning  
- LangChain hosted services – adds latency and cost

**Conclusion:** Ollama provides the right trade-off between capability, control, and cost.

---

## Architecture Overview

flowchart TD
    A[Next.js Frontend]
    B[FastAPI Backend]
    C[Supabase PostgreSQL]
    D[Ollama AI Service]

    A -->|REST / Auth JWT| B
    B --> C
    B --> D




Responsibilities:

- **Next.js:** UI, code editor, dashboards, session management  
- **FastAPI:** assessment logic, roadmap engine, AI prompt orchestration  
- **Supabase:** users, progress, problem metadata  
- **Ollama:** Socratic hints, concept explanations, difficulty analysis

---

## Consequences

### Positive

- Full control over AI behavior  
- Low operational cost  
- Strong privacy (no user code sent to external APIs)  
- Rapid iteration for students/developers  
- Clear separation of concerns

### Risks

- Local model quality lower than proprietary LLMs  
- Hosting Ollama requires sufficient hardware  
- Need strict prompt engineering to prevent answer leakage  
- Multi-service architecture increases dev complexity

### Mitigations

- Add guard prompts + output validators  
- Store interaction logs for moderation  
- Allow model upgrade path  
- Caching for repeated explanations

---

## Future Considerations

- Add vector DB for concept retrieval  
- Support multiple Ollama models  
- WebSocket for real-time tutoring  
- RBAC roles in Supabase  
- Telemetry for learning analytics

---

## Author

Project Team




