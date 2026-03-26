# Osiris: Socratic Learning Platform

## Mission Statement
> Empowering developers to master their craft through personalized practice that turns weaknesses into strengths.

## Overview
Osiris is a learning platform that uses a Socratic AI tutor to guide users without giving full solutions. On first sign up, users choose a short or normal assessment. The assessment assigns a hidden skill level that updates over time. That skill level determines placement within topic-specific roadmaps such as Strings, Lists, Trees, and Dictionaries. These roadmaps are dynamic and can branch when users struggle, so users build prerequisites before returning to harder problems.

## Unique Features
- **Short or Normal Assessment:** Choose the pace at signup.
- **Hidden Skill Level:** Adjusts over time based on performance.
- **Topic Roadmaps:** Multiple smaller roadmaps instead of one global path.
- **Dynamic Branching:** Struggle triggers prerequisite practice.
- **Socratic AI Guidance:** Hints and explanations without full solutions.

## Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** Next.js / Node.js
- **Database:** Supabase (PostgreSQL)
- **Code Execution:** Judge0 (self-hosted for development)
- **AI Runtime:** Under evaluation (local, cloud, or hybrid)

## Getting Started

> **Note:** Please ensure you have Next.js and Homebrew installed before setup.

### Backend Setup

1. Set up environment variables
   - Look at `.env.example` in the backend directory and create `.env` with correct values.

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Return to root directory:
   ```bash
   cd ..
   ```

6. Run the backend server:
   ```bash
   uvicorn backend.main:app --reload
   ```

### Frontend Setup

1. Environment variable setup:
   - Create `.env.local` in `frontend/osiris` and copy values from `.env.example`.

2. Navigate to the frontend directory:
   ```bash
   cd frontend/osiris
   ```

3. Install packages and launch development server:
   ```bash
   npm install
   npm run dev
   ```
