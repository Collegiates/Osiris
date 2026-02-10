# Osiris Project Backlog

This backlog contains all features and tasks needed to complete the Osiris AI-powered coding practice platform. Items are organized by category and include difficulty levels (Easy, Medium, Hard) and priority (Must Have, Should Have, Nice to Have).

**Difficulty Levels:**
- **Easy**: 1-3 days, straightforward implementation, minimal dependencies
- **Medium**: 3-7 days, moderate complexity, some architectural decisions needed
- **Hard**: 7+ days, complex implementation, significant architectural work or research required

---

## 🔐 Authentication & Authorization

### Must Have

1. **Implement Supabase JWT verification in backend** - `Medium`
   - Replace placeholder auth with actual Supabase JWT verification
   - Extract user_id from verified JWT tokens
   - Handle token expiration and refresh
   - Add proper error handling for invalid tokens

2. **Complete Google OAuth integration** - `Medium`
   - Configure Google OAuth in Supabase
   - Handle OAuth callback flow
   - Link Google accounts to user profiles
   - Update frontend auth components

3. **User profile management** - `Easy`
   - Create user profile schema in Supabase
   - Store user names, preferences, onboarding status
   - API endpoints for profile CRUD operations
   - Frontend profile page

---

## 🗄️ Database Schema & Migrations

### Must Have

4. **Design and implement database schema** - `Medium`
   - Users table (extends Supabase auth.users)
   - Assessments table (assessment_id, user_id, level, topics, created_at, submitted_at)
   - Assessment_questions table (question_id, assessment_id, topic, difficulty, prompt, answer, question_type: coding/conceptual)
   - Problems table (problem_id, title, topic, difficulty, statement, constraints, examples, test_cases, source_repo, source_url, language: python)
   - Problem_attempts table (attempt_id, user_id, problem_id, code, language: python, verdict, time_spent, submitted_at)
   - Roadmaps table (roadmap_id, user_id, generated_at, is_active)
   - Roadmap_items table (item_id, roadmap_id, problem_id, status, rationale, order)
   - Skill_profiles table (user_id, topic, score, confidence, updated_at)
   - AI_interactions table (interaction_id, user_id, problem_id, user_message, ai_response, created_at)
   - Create Supabase migrations
   - Set up Row Level Security (RLS) policies

5. **Database connection and ORM setup** - `Medium`
   - Integrate Supabase Python client in backend
   - Create database service layer
   - Implement connection pooling
   - Add database health checks

---

## 📝 Problem Management System

### Must Have

6. **Problem database and management** - `Medium`
   - Research and identify GitHub repos with coding problems (LeetCode, HackerRank, etc.)
   - Create problem import/parsing script from GitHub repos
   - Problem CRUD API endpoints
   - Support for Python initially (extensible for future languages)
   - Problem metadata (difficulty, topic, tags, source, original_repo)
   - Test cases storage (hidden test cases for evaluation)
   - Admin interface or script to add/manage problems
   - Normalize problem formats from different sources

7. **Problem bank with diverse topics** - `Medium`
   - Import problems from selected GitHub repositories
   - Curate problems for all topics (arrays/strings, hashing, trees, graphs, DP, etc.)
   - Problems across all difficulty levels (easy, medium, hard)
   - Minimum 50+ problems for MVP/presentation
   - Problem validation and quality checks
   - Ensure test cases are properly formatted for Python execution

---

## 🧪 Code Execution & Evaluation

### Must Have

8. **Secure code execution sandbox (Python only)** - `Medium`
   - Research and select sandbox solution (Docker containers, Piston API, or custom)
   - Implement isolated Python code execution environment
   - Timeout and resource limits (CPU, memory)
   - Security hardening (prevent file system access, network calls, dangerous imports, etc.)
   - Error handling and sanitization
   - Note: Extensible architecture for future language support

9. **Code evaluation system (Python)** - `Medium`
   - Python test case execution engine
   - Compare outputs with expected results (handle different output formats)
   - Handle edge cases and error outputs
   - Performance measurement (time complexity analysis via execution time)
   - Code quality checks (basic Python linting)
   - Return detailed feedback (passed/failed tests, runtime errors, timeouts, etc.)

10. **Assessment code evaluation** - `Medium`
    - Execute user code against hidden test cases
    - Analyze correctness and efficiency
    - Generate skill scores based on performance
    - Store assessment results in database

---

## 🤖 AI Integration (Ollama)

### Must Have

11. **Ollama integration setup** - `Medium`
    - Install and configure Ollama locally
    - Pull gpt-oss:20b model
    - Create Ollama client service in backend
    - Health check endpoint for Ollama availability
    - Error handling for model unavailability

12. **AI guidance endpoint implementation** - `Hard`
    - Design Socratic-style prompts
    - Implement prompt engineering for hints (no solutions)
    - Call Ollama API with proper context
    - Stream responses for better UX
    - Output validation to prevent solution leakage
    - Context management (user history, problem details, skill level)

13. **AI-powered assessment analysis** - `Hard`
    - Analyze user code submissions for skill gaps
    - Generate skill profile scores using AI
    - Identify weak areas and recommend focus topics
    - Store analysis results

14. **Hybrid roadmap generation (Rule-based + AI)** - `Hard`
   - Implement rule-based algorithm for problem selection (skill gaps, difficulty progression, completed problems)
   - Use AI (Ollama) to generate rationale/explanation for each roadmap item
   - AI-assisted problem ranking and ordering
   - Ensure roadmap generation completes in <45 seconds
   - Cache roadmap generation results
   - Balance between rule-based efficiency and AI personalization

15. **AI learning from user interactions** - `Hard`
    - Track user prompt patterns
    - Adapt AI responses based on user preferences
    - Improve hint quality over time
    - Store interaction history for context

---

## 📊 Assessment System

### Must Have

16. **Assessment question generation** - `Medium`
   - Generate assessment questions based on level and topics
   - Mix of coding problems (from problem bank) and conceptual questions (e.g., "Explain the difference between...")
   - Store both coding and conceptual questions in database
   - Retrieve questions for assessment flow
   - Support different question types in UI

17. **Assessment submission and analysis** - `Medium`
    - Store user answers in database
    - Execute code submissions against test cases
    - AI analysis of conceptual answers
    - Calculate skill scores and confidence levels
    - Generate recommended focus areas

18. **Assessment UI flow** - `Medium`
    - Assessment start page (select level/topics)
    - Question display interface
    - Code editor for coding questions
    - Text input for conceptual questions
    - Progress tracking during assessment
    - Results page with skill profile visualization

---

## 🗺️ Roadmap System

### Must Have

19. **Roadmap generation logic (Rule-based + AI)** - `Hard`
   - Rule-based algorithm to select problems based on skill gaps
   - Consider user's completed problems
   - Balance difficulty progression
   - Integrate with AI for rationale generation (see item 14)
   - Support roadmap refresh/regeneration
   - Ensure fast execution (<45 seconds) with rule-based selection

20. **Roadmap persistence** - `Easy`
    - Save roadmap to database
    - Track roadmap item status (todo, in_progress, done)
    - Update roadmap when problems are completed
    - Handle roadmap versioning

21. **Roadmap UI** - `Medium`
    - Visual roadmap display (list/timeline view)
    - Show problem details, rationale, status
    - Click to start problem from roadmap
    - Progress indicators
    - Refresh roadmap button

---

## 💻 Problem Solving Interface

### Must Have

22. **Code editor component (Python)** - `Medium`
   - Integrate code editor (Monaco Editor or CodeMirror)
   - Python syntax highlighting
   - Code formatting for Python
   - Line numbers and basic editor features
   - Note: Architecture should allow easy addition of other languages later

23. **Problem display page** - `Easy`
    - Problem statement display
    - Constraints and examples
    - Test case preview (without answers)
    - Problem metadata (topic, difficulty)

24. **Code submission flow** - `Medium`
    - Submit code button
    - Loading states during evaluation
    - Display results (passed/failed, feedback)
    - Show test case results (which passed/failed)
    - Time tracking

25. **AI guidance interface** - `Medium`
    - "Get Help" button/chat interface
    - Display AI hints in Socratic style
    - Chat history during problem session
    - Prevent solution leakage in UI

---

## 📈 Progress Tracking

### Must Have

26. **Progress calculation system** - `Medium`
    - Track completed problems
    - Calculate total attempts
    - Compute streak days
    - Identify strongest/weakest topics
    - Update skill profile over time

27. **Progress dashboard UI** - `Medium`
    - Overview page with key metrics
    - Problems completed count
    - Current streak
    - Topic strength visualization (charts/graphs)
    - Progress over time graphs
    - Recent activity feed

28. **Progress persistence** - `Easy`
    - Store all attempt data
    - Track problem completion status
    - Calculate and cache progress metrics
    - Update progress on each submission

---

## 🎨 Frontend Pages & Navigation

### Must Have

29. **Main dashboard/home page** - `Easy`
    - Welcome message for authenticated users
    - Quick actions (start assessment, view roadmap, see progress)
    - Onboarding flow for new users
    - Navigation menu

30. **Assessment flow pages** - `Medium`
    - Assessment start page
    - Question pages (multiple questions)
    - Assessment results page
    - Skill profile visualization

31. **Problem solving pages** - `Medium`
    - Problem list/browse page
    - Individual problem page with editor
    - Problem completion page

32. **Roadmap page** - `Medium`
    - Roadmap visualization
    - Problem cards with status
    - Filter and sort options

33. **Progress dashboard page** - `Medium`
    - Statistics and metrics
    - Charts and visualizations
    - Topic breakdown

---

## 🔧 Infrastructure & DevOps

### Must Have

34. **CORS configuration** - `Easy`
    - Configure CORS in FastAPI for Next.js frontend
    - Handle preflight requests
    - Environment-based CORS settings

35. **Environment configuration** - `Easy`
    - Environment variables for all services
    - .env.example files
    - Configuration validation on startup
    - Supabase URL and keys
    - Ollama URL and settings

36. **Error handling and logging** - `Medium`
    - Structured logging setup
    - Error handling middleware
    - User-friendly error messages
    - Error tracking (optional: Sentry integration)

37. **API documentation** - `Easy`
    - FastAPI auto-generated docs (already available)
    - API endpoint documentation
    - Request/response examples
    - Authentication guide

---

## 🧪 Testing

### Should Have

38. **Backend unit tests** - `Medium`
    - Test all router endpoints
    - Mock database calls
    - Test authentication logic
    - Test code evaluation logic
    - Test AI integration (mocked)

39. **Backend integration tests** - `Hard`
    - Test database operations
    - Test code execution sandbox
    - Test full assessment flow
    - Test roadmap generation

40. **Frontend component tests** - `Medium`
    - Test React components
    - Test user interactions
    - Test API integration
    - Test routing

41. **End-to-end tests** - `Hard`
    - Full user flows (assessment → roadmap → problem solving)
    - Authentication flows
    - Code submission and evaluation

---

## 🚀 Deployment & CI/CD

### Should Have

42. **Backend deployment setup (for presentation/demo)** - `Medium`
   - Docker containerization (optional for local demo)
   - Prepare for Railway deployment (eventual production)
   - Health check endpoints
   - Environment variable management
   - Local development setup documentation
   - Note: Full production deployment not required for class project/presentation

43. **Frontend deployment setup (for presentation/demo)** - `Easy`
   - Prepare Vercel deployment configuration (for eventual production)
   - Environment variables setup
   - Build optimization
   - Local development server setup for presentation
   - Note: Can demo locally for class project/presentation

44. **CI/CD pipeline (optional for class project)** - `Medium`
   - Basic GitHub Actions workflow (if time permits)
   - Automated testing on PR (optional)
   - Note: Not critical for class project/presentation, but good for future production

---

## ✨ Nice to Have Features

### Nice to Have

45. **Syntax error highlighting** - `Medium`
    - Real-time syntax checking in editor
    - Display errors inline
    - Language-specific error messages

46. **Function autocomplete** - `Hard`
    - IDE-like autocomplete in code editor
    - Language-specific suggestions
    - Context-aware completions

47. **Multiple language solutions** - `Medium`
    - Store solutions in multiple languages
    - Allow users to view solutions after completion
    - Language comparison features

48. **Roadmap sharing** - `Easy`
    - Generate shareable roadmap links
    - Public roadmap view (optional)
    - Export roadmap as PDF/image

49. **Improvement metrics** - `Medium`
    - Calculate improvement percentage over time
    - Show skill growth charts
    - Compare current vs. past performance
    - Milestone achievements

50. **Performance optimizations** - `Medium`
    - Implement caching for roadmap generation
    - Cache AI responses for common questions
    - Optimize database queries
    - Implement pagination for problem lists
    - Lazy loading for large datasets

51. **Accessibility improvements** - `Medium`
    - ARIA labels and semantic HTML
    - Keyboard navigation
    - Screen reader support
    - Color contrast compliance

52. **Mobile responsiveness** - `Medium`
    - Responsive design for mobile devices
    - Touch-friendly code editor
    - Mobile-optimized navigation

53. **Real-time features** - `Hard`
    - Real-time code collaboration (future)
    - Live progress updates
    - Real-time AI streaming (already planned)

54. **Analytics and monitoring** - `Medium`
    - User analytics dashboard
    - Performance monitoring
    - Error tracking and alerting
    - Usage statistics

---

## 📋 Summary by Priority

### Must Have (34 items)
- Authentication & Authorization: 3 items
- Database Schema: 2 items
- Problem Management: 2 items
- Code Execution: 3 items
- AI Integration: 5 items
- Assessment System: 3 items
- Roadmap System: 3 items
- Problem Solving Interface: 4 items
- Progress Tracking: 3 items
- Frontend Pages: 5 items
- Infrastructure: 4 items

### Should Have (6 items)
- Testing: 4 items
- Deployment: 2 items

### Nice to Have (10 items)
- Enhanced features and optimizations

---

## 🎯 Recommended Sprint Planning

**Sprint 1 (Foundation):**
- Items 1, 4, 5, 34, 35 (Auth, Database, Config)

**Sprint 2 (Core Features):**
- Items 6, 7, 8, 9 (Problem Import from GitHub & Python Code Execution)

**Sprint 3 (AI Integration):**
- Items 11, 12, 13 (Ollama Setup & Guidance)

**Sprint 4 (Assessment):**
- Items 16, 17, 18, 10 (Assessment System)

**Sprint 5 (Roadmap):**
- Items 19, 20, 21, 14 (Hybrid Roadmap Generation & UI)

**Sprint 6 (Problem Solving):**
- Items 22, 23, 24, 25 (Problem Interface)

**Sprint 7 (Progress & Polish):**
- Items 26, 27, 28, 29, 30, 31, 32, 33 (Progress & All Pages)

**Sprint 8 (Testing & Demo Prep):**
- Items 38, 39, 40 (Testing)
- Items 42, 43 (Demo/Deployment Setup - optional for class project)

**Future Sprints:**
- Nice to have features as needed

---

*Last Updated: Based on repository analysis and clarifications on 2026-02-06*
*Total Items: 54*
*Must Have: 34 | Should Have: 6 | Nice to Have: 10*

## 📝 Project Context Notes

**Project Type:** Class project with presentation at an event
**Deployment:** Local demo for presentation; eventual production on Vercel (frontend) + Railway (backend)
**Initial Language Support:** Python only (extensible architecture for future languages)
**Problem Source:** Combination of GitHub repositories (LeetCode, HackerRank, etc.)
**Roadmap Generation:** Hybrid approach - rule-based selection with AI-generated rationale
**Assessment Questions:** Mix of coding problems and conceptual questions

