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
