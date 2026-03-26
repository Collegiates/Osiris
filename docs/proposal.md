# Project Proposal

## Problem Statement
Preparing for coding interviews and improving programming skills is inefficient because most platforms do not adapt to a learner’s actual strengths and weaknesses. Users end up practicing too many basic topics or getting stuck without a clear path forward.

## Target Users
- Computer science students preparing for internships or full-time roles.
- Developers preparing for technical interviews.
- Self-taught programmers strengthening weak areas.
- Anyone practicing data structures and algorithms who wants structured improvement.

## Solution Overview
Osiris is a learning platform that starts with a choice of assessment length. Users can take a short or normal assessment, after which the system assigns a hidden skill level that updates over time. That skill level places users within topic-specific roadmaps such as Strings, Lists, Trees, or Dictionaries.

Instead of a single global roadmap, Osiris provides many smaller, dynamic roadmaps. If a user struggles on a problem, the roadmap branches into prerequisite skills, allowing the user to build fundamentals before returning to the original topic. AI guidance follows a Socratic style, providing hints and conceptual guidance without full solutions.

## Key Characteristics
- Choice of short or normal assessment at signup.
- Hidden skill level that adjusts with performance.
- Topic roadmaps with dynamic branching.
- AI guidance that teaches without solving.
- Progress tracking and analytics over time.

## Tech Stack Justification
- **Next.js**
  Provides a modern frontend for assessments, roadmaps, and progress tracking.
- **FastAPI**
  Powers backend logic for assessment scoring, roadmap orchestration, and AI routing.
- **Supabase (PostgreSQL)**
  Stores users, assessments, skill levels, roadmaps, and progress history.
- **Code Execution (Judge0, self-hosted for development)**
  Secure execution for user submissions with isolated runtimes.
- **AI Runtime (TBD)**
  Evaluating local, cloud, or hybrid models to balance quality, cost, and privacy.
