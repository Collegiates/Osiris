---

## ADR-0005 – Code Execution: Judge0 (Dev)

### Status
Accepted – 2026-03-26

### Context
The platform must run untrusted code submissions safely and at scale, with consistent language support.

### Decision
Use **Judge0 self-hosted** for development environments.

### Rationale
- Sandboxed execution.
- Scalable architecture.
- Widely used in coding platforms.

### Consequences
- Requires containerized deployment.
- Production hosting strategy remains open.

---
