# Requirements

## Functional Requirements
- Users can create accounts and sign in with email and password.
- Users can link a Google account.
- Users can choose between short and normal assessments on first sign up.
- Short assessment includes 1 coding problem (easy to medium) and 10 CS questions.
- Normal assessment includes 2 coding problems and 10 CS questions.
- System assigns a hidden skill level after assessment and updates it over time.
- Users can select any topic roadmap after login.
- Roadmaps are topic-based (Strings, Lists, Trees, Dictionaries, etc.).
- Roadmaps are dynamic and can branch when users struggle.
- Struggle is determined by elapsed time and failed submissions, with a max of 3 failed submissions.
- Users can run code without consuming a submission attempt.
- System stores user data, roadmap progress, and attempt history.
- AI provides Socratic hints and conceptual guidance without full solutions.
- System recommends next problems based on skill level and performance.

## User Stories
Story 1: Code Submission Analysis
As a developer, I want my code evaluated for correctness and efficiency so I can understand my current skill level.
Acceptance Criteria:
- Code is executed against at least 10 hidden test cases.
- The AI analyzes time complexity and labels it as bad, ok, or great.
- The AI explains where the solution would fail if incorrect.
- The AI provides hints when requested without giving full solutions.

Story 2: Dynamic Topic Roadmaps
As a developer, I want topic-specific roadmaps that adjust when I struggle so I can strengthen weak areas efficiently.
Acceptance Criteria:
- Topic roadmaps are available after assessment.
- A hidden skill level determines placement inside a roadmap.
- The roadmap branches to prerequisite skills when struggle criteria are met.
- Roadmap progress is saved and can be resumed at any time.

## Non-Functional Requirements
- Roadmap generation should take no more than 45 seconds.
- AI responses should begin streaming quickly to reduce perceived latency.
- AI should respond within 20 seconds for typical prompts.
- Code execution must be isolated to prevent user attacks.
- System must comply with GDPR and CCPA for user data.
- System should handle hundreds of user prompts per minute.
- Key pages should load in under one second on typical connections.
- The UI must remain simple and intuitive.
- The system must remain scalable as usage grows.
- The system should follow best practices for data security.

## AI-Specific Requirements
- The AI must use a Socratic teaching style.
- The AI must not provide full solutions.
- The AI must account for the user""™s hidden skill level.
- The AI must adapt to past user prompts and performance.
- The AI must be able to judge solution optimality and brute force.

## Prioritization
Must Have:
- Short and normal assessments.
- Hidden skill level that changes over time.
- Topic roadmaps with dynamic branching.
- Submission tracking with max 3 failed submissions.
- AI hints using the Socratic method.

Should Have:
- Solutions in multiple languages for reference after completion.
- Syntax highlighting and helpful editor tooling.

Nice to Have:
- Sharing roadmaps with other users.
- Improvement metrics over time.
