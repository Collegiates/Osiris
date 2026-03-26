# AI Runtime Suggestions

## Current Decision
Osiris currently uses **Gemini (cloud-only)** for MVP guidance and Socratic hints.

## Why This Works For MVP
- High-quality reasoning.
- Managed scaling and reliability.
- Faster iteration with fewer infrastructure concerns.

## Decision Criteria Checklist
- Target latency per request.
- Expected daily active users and prompt volume.
- Budget per user per month.
- Required reasoning depth for assessment and roadmap steps.
- Privacy requirements and data retention policy.

## Revisit Later If Needed
- If costs become high, consider a hybrid approach.
- If privacy becomes a priority, consider local inference for hints.
