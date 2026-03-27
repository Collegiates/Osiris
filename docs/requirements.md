# Requirements

## Functional Requirements
- Users can create accounts and sign in with email and password.
- Users can link a Google account.
- Users can choose between short and normal assessments on first sign up.
- Short assessment includes 1 coding problem (easy to medium) and 10 CS questions.
- Normal assessment includes 2 coding problems (easy + medium) and 10 CS questions.
- Assessment questions are randomized per session.
- System assigns a hidden skill level after assessment and updates it over time.
- System stores user data and assessment results.
- AI provides Socratic hints and conceptual guidance without full solutions.

## User Stories
Story 1: Assessment Baseline
As a developer, I want a short or normal assessment so I can quickly establish a baseline skill level.
Acceptance Criteria:
- Short assessment has 11 questions total.
- Normal assessment has 12 questions total.
- Questions are a mix of coding and CS prompts.
- The system returns a hidden skill level after submission.

## Non-Functional Requirements
- Assessment flow should load quickly and feel responsive.
- The UI must remain simple and intuitive.
- The system should follow best practices for data security.

## AI-Specific Requirements
- The AI must use a Socratic teaching style.
- The AI must not provide full solutions.

## Prioritization
Must Have:
- Short and normal assessments.
- Hidden skill level that changes over time.
- Randomized assessment questions per session.

Should Have:
- Time-based weighting in assessment scoring.

Nice to Have:
- Improvement metrics over time.
