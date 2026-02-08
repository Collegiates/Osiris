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
