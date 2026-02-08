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
