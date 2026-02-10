# Osiris: AI-Powered Coding Practice

## Mission Statement
> Empowering developers to master their craft through personalized practice that turns weaknesses into strengths.

## Details
Osiris is an AI-powered coding practice platform designed to help developers and technical interview candidates improve their skills more effectively by focusing on their weakest areas. Rather than having users randomly select practice problems or rely on full solutions, Osiris begins with a coding assessment to identify skill gaps. Based on the assessment results, Osiris will generate a personalized roadmap of coding problems tailored to each user’s needs. Osiris tracks progress over time, including completed problems, time spent, and performance patterns. Osiris uses this data to continuously refine the problems assigned to our users, using AI as a learning guide, not a problem solver. To ensure AI is used as a learning guide, Osiris assists users in understanding how to approach problems and what to practice next, without directly providing answers. The primary goal is to make interview preparation and skill development more efficient by ensuring users practice the right problems at the right time.

## Unique Features
- **AI-Powered Coding Assessment:** Initial evaluation to baseline your current skills.
- **Tailored Problem Sets:** Focused practice specifically targeting your coding weaknesses.
- **AI-Powered Recommendations:** Smart suggestions that evolve as you improve.
- **Personalized Roadmaps:** Custom learning paths built from your assessment data.
- **Skill Gap Identification:** Pinpoint exactly where you need the most work.

## Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** Next.js / Node.js
- **Database:** Supabase (PostgreSQL)
- **Local AI Platform:** Ollama

## Getting Started

> **Note:** Please ensure you have [Next.js](https://nextjs.org/) and [Homebrew](https://brew.sh/) installed before setup.

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create & Activate a Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install fastapi uvicorn
   ```

4. **Run the Backend Server:**
   ```bash
   uvicorn backend.main:app --reload
   ```

### Frontend Setup

1. **Navigate to the Frontend Directory:**
   ```bash
   cd ../frontend/osiris
   ```

2. **Initialize Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install Packages & Launch Development Server:**
   ```bash
   npm install
   npm run dev
   ```
