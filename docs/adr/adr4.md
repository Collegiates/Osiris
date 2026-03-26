---

## ADR-0004 – AI Runtime: Local, Cloud, or Hybrid

### Status
Under Review – 2026-03-26

### Context
The AI must:
- Provide Socratic hints.
- Analyze skill gaps.
- Never return full solutions.
- Operate with low latency.
- Preserve user privacy where possible.

### Decision
Evaluate **local, cloud, and hybrid** runtime options.

### Rationale
- Local options improve privacy and reduce marginal cost.
- Cloud options improve reasoning quality and scaling.
- Hybrid provides a flexible upgrade path.

### Consequences
- Requires a routing layer and metrics to compare options.
- Final decision will affect cost model and infrastructure.

---
