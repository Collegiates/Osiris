# Architecture

This document records the major architectural decisions for the project.  
Each layer of the system is captured as an independent Architecture Decision Record (ADR) within this file.

System goals:

- Guided, AI-assisted learning without providing direct solutions  
- Scalable web platform for coding assessments and roadmaps  
- Low operational cost with strong privacy  
- Clear separation between UI, logic, data, and AI inference

High level structure:

- Frontend – Next.js  
- Backend – FastAPI  
- Data & Auth – Supabase (PostgreSQL)  
- AI – Ollama (gpt-oss:20b)

Architecture Overview

![System Architecture](./diagram.svg)


---

## ADR-0001 – Frontend Framework: Next.js

### Status
Accepted – 2026-02-06

### Context
The platform requires an interactive web interface for:

- Coding assessments  
- Progress dashboards  
- Roadmap visualization  
- Real-time AI tutoring interactions

We needed a frontend framework that supports fast iteration, good performance, and easy integration with a Python backend.

### Decision
Use **Next.js** as the primary frontend framework.

### Rationale

**Benefits**

- File-based routing and React ecosystem  
- Server Components for performance  
- Built-in API routes for BFF patterns  
- Strong community and UI library support  
- Simple deployment (Vercel or self-hosted)

**Alternatives Considered**

- React only – more boilerplate  
- Vue/Nuxt – less team familiarity  
- Angular – heavier and slower iteration

### Consequences

- Faster UI development  
- Need to manage CORS with FastAPI  
- Requires Node environment for builds

---

## ADR-0002 – Backend Service: FastAPI

### Status
Accepted – 2026-02-06

### Context
The backend must:

- Evaluate assessments  
- Generate learning roadmaps  
- Orchestrate AI prompts  
- Store and retrieve progress  
- Expose a secure REST API

### Decision
Use **FastAPI (Python)** as the backend service.

### Rationale

**Benefits**

- Async performance for AI calls  
- Automatic OpenAPI documentation  
- Strong typing with Pydantic  
- Native Python ecosystem for ML  
- Simple, explicit architecture

**Alternatives Considered**

- Node/Express – weaker AI ecosystem  
- Django – heavier than required  
- Go – higher complexity for ML tasks

### Consequences

- Clear boundary between UI and logic  
- Easy integration with Ollama  
- Requires API gateway or reverse proxy

---

## ADR-0003 – Data & Authentication: Supabase

### Status
Accepted – 2026-02-06

### Context
We require storage for:

- User accounts  
- Assessment results  
- Problem history  
- Roadmap state  
- Analytics

Authentication must support email and OAuth with minimal custom code.

### Decision
Use **Supabase** for PostgreSQL database and authentication.

### Rationale

**Benefits**

- Managed PostgreSQL with RLS  
- Built-in auth and JWT  
- Real-time capabilities  
- Minimal DevOps overhead  
- Relational model fits progress data

**Alternatives Considered**

- Firebase – NoSQL mismatch  
- Self-hosted Postgres – more ops work  
- Auth0 – external dependency & cost

### Consequences

- Fast startup with secure auth  
- Vendor dependency  
- Need migrations strategy

---

## ADR-0004 – AI Runtime: Ollama

### Status
Accepted – 2026-02-06

### Context
The AI must:

- Provide Socratic hints  
- Analyze skill gaps  
- Never return full solutions  
- Operate with low cost  
- Preserve user privacy

### Decision
Use **Ollama running gpt-oss:20b** locally.

### Rationale

**Benefits**

- No external API cost  
- Full control over prompts  
- Offline capability  
- Privacy for user code  
- REST integration

**Alternatives Considered**

- OpenAI API – expensive, uncontrollable  
- Smaller models – weaker reasoning  
- Hosted LangChain – latency & cost

### Consequences

- Requires capable hardware  
- Need guardrails against answer leakage  
- Model upgrades handled internally

---

## Cross-Layer Considerations

### Integration Flow

1. User interacts with Next.js UI  
2. FastAPI handles business logic  
3. Supabase stores state  
4. Ollama provides guided responses

### Risks

- Local model quality  
- Multi-service complexity  
- Prompt safety

### Mitigations

- Output validation layer  
- Interaction logging  
- Caching explanations  
- Upgrade path for models

---

## Author

CXKing23

