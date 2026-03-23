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
