# AI Runtime Suggestions

## Goal
Choose an AI runtime that supports Socratic guidance, low latency, and safe hinting without exposing full solutions.

## Options

### Local Only (Ollama)
**Pros**
- Lower marginal cost per request.
- Strong privacy and local control.
- No vendor lock-in.

**Cons**
- Requires capable hardware for acceptable latency.
- Model quality can be inconsistent for advanced reasoning.
- Operational burden for updates and scaling.

**Best When**
- You control deployment hardware.
- Privacy is a top priority.
- Early users are limited in number.

### Cloud Only (Hosted LLM)
**Pros**
- Higher model quality and reliability.
- Fast iteration and easy scaling.
- Reduced ops overhead.

**Cons**
- Ongoing costs that scale with usage.
- Data residency and privacy concerns.
- Dependency on external provider availability.

**Best When**
- You want best-in-class reasoning quality.
- You need fast iteration during MVP.
- You can budget for usage-based costs.

### Hybrid (Recommended Starting Point)
Use local inference for low-risk, low-complexity hints and a cloud model for deeper reasoning, assessment analysis, or roadmap generation.

**Pros**
- Cost control for common requests.
- High-quality reasoning when needed.
- A clear path to scale based on usage patterns.

**Cons**
- Requires routing logic and monitoring.
- More complex configuration.

**Best When**
- You are unsure about final scale or cost profile.
- You want an upgrade path without refactoring.

## Recommendation for Osiris
Start with a hybrid strategy:
- Use a local model for lightweight hints and follow-up questions.
- Use a cloud model for assessment evaluation, roadmap generation, and harder reasoning tasks.
- Build a routing layer that selects the model based on task complexity and user tier.

This preserves privacy for common tasks while keeping quality high for critical learning moments.

## Decision Criteria Checklist
- Target latency per request.
- Expected daily active users and prompt volume.
- Budget per user per month.
- Required reasoning depth for assessment and roadmap steps.
- Privacy requirements and data retention policy.

## Next Steps
- Define a hint format schema and safety filter rules.
- Instrument latency and quality metrics by task type.
- Run A/B tests comparing local vs cloud responses on a small set of evaluation prompts.
