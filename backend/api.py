"""
main.py — FastAPI backend for the coding-assessment + roadmap platform.

Keeps your existing endpoints:
- GET /
- GET /health

Adds core project endpoints (MVP-friendly):
- Auth/session (stubbed; Supabase JWT verification placeholder)
- Assessments (create, submit, results)
- Roadmap (get, refresh)
- Problems (recommendations, problem detail, submit attempt)
- Progress (overview, events)
- AI guidance (Socratic hints only; Ollama integration stub)

Notes:
- This file is safe to run as-is (stubs return placeholder data).
- Replace TODO sections with Supabase + DB + Ollama calls as you implement.
"""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from fastapi import FastAPI, Header, HTTPException, Query, status
from pydantic import BaseModel, Field

app = FastAPI(
    title="Interview Prep Roadmap API",
    version="0.1.0",
    description="Assessment-driven coding practice with Socratic AI guidance (no full solutions).",
)

# -------------------------
# Existing endpoints (kept)
# -------------------------

@app.get("/")
def root():
    return {"message": "Hello World"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# -------------------------
# Helpers / placeholders
# -------------------------

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def require_user(authorization: Optional[str]) -> str:
    """
    Placeholder auth gate.

    Expected: "Bearer <jwt>"
    TODO: Verify Supabase JWT and return user_id/sub.
    """
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization scheme")
    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Empty token")

    # TODO: Verify token with Supabase public key / JWKS; return user_id (sub).
    # For now, pretend token is the user_id for local testing.
    return token


# -------------------------
# Data models (MVP)
# -------------------------

class Topic(str, Enum):
    arrays_strings = "arrays_strings"
    hashing = "hashing"
    two_pointers = "two_pointers"
    stacks_queues = "stacks_queues"
    linked_lists = "linked_lists"
    trees = "trees"
    graphs = "graphs"
    dp = "dp"
    sorting = "sorting"
    binary_search = "binary_search"


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class AssessmentStartRequest(BaseModel):
    level: str = Field(default="mixed", description="beginner | intermediate | advanced | mixed")
    topics: Optional[List[Topic]] = Field(default=None, description="If omitted, system chooses a balanced set.")


class AssessmentStartResponse(BaseModel):
    assessment_id: UUID
    created_at: str
    level: str
    topics: List[Topic]
    instructions: str


class Question(BaseModel):
    question_id: UUID
    topic: Topic
    prompt: str
    difficulty: Difficulty


class AssessmentGetResponse(BaseModel):
    assessment_id: UUID
    created_at: str
    questions: List[Question]


class AssessmentSubmitRequest(BaseModel):
    answers: Dict[UUID, str] = Field(
        description="Map of question_id -> user's answer (text/code)."
    )
    time_spent_seconds: int = Field(ge=0)


class SkillScore(BaseModel):
    topic: Topic
    score: float = Field(ge=0.0, le=1.0, description="0..1 normalized skill estimate")
    confidence: float = Field(ge=0.0, le=1.0, description="0..1 confidence estimate")


class AssessmentResultResponse(BaseModel):
    assessment_id: UUID
    submitted_at: str
    overall_score: float
    skill_profile: List[SkillScore]
    recommended_focus: List[Topic]


class RoadmapItem(BaseModel):
    item_id: UUID
    topic: Topic
    difficulty: Difficulty
    problem_id: str
    title: str
    rationale: str
    status: str = Field(default="todo", description="todo | in_progress | done")


class RoadmapResponse(BaseModel):
    user_id: str
    generated_at: str
    items: List[RoadmapItem]


class ProblemSummary(BaseModel):
    problem_id: str
    title: str
    topic: Topic
    difficulty: Difficulty
    source: str = Field(default="internal", description="internal | leetcode | custom | etc.")


class ProblemDetail(BaseModel):
    problem_id: str
    title: str
    topic: Topic
    difficulty: Difficulty
    statement: str
    constraints: List[str] = []
    examples: List[Dict[str, Any]] = []


class AttemptSubmitRequest(BaseModel):
    code: str
    language: str = Field(default="python")
    time_spent_seconds: int = Field(ge=0)
    notes: Optional[str] = Field(default=None, description="Optional reflection: what was hard, what you learned.")


class AttemptSubmitResponse(BaseModel):
    attempt_id: UUID
    submitted_at: str
    verdict: str
    feedback: str
    updated_skill_profile: Optional[List[SkillScore]] = None


class ProgressOverview(BaseModel):
    user_id: str
    generated_at: str
    problems_completed: int
    total_attempts: int
    current_streak_days: int
    strongest_topics: List[Topic]
    weakest_topics: List[Topic]


class GuidanceRequest(BaseModel):
    problem_id: str
    user_message: str
    code_snippet: Optional[str] = None
    language: Optional[str] = "python"
    topic: Optional[Topic] = None


class GuidanceResponse(BaseModel):
    response_id: UUID
    created_at: str
    message: str
    mode: str = Field(default="socratic", description="socratic only; no full solutions")


# -------------------------
# Auth / session endpoints
# -------------------------

@app.get("/me")
def get_me(authorization: Optional[str] = Header(default=None)):
    user_id = require_user(authorization)
    # TODO: fetch user profile from Supabase
    return {
        "user_id": user_id,
        "created_at": None,
        "plan": "free",
        "server_time": now_iso(),
    }


# -------------------------
# Assessment endpoints
# -------------------------

@app.post("/assessments", response_model=AssessmentStartResponse)
def start_assessment(payload: AssessmentStartRequest, authorization: Optional[str] = Header(default=None)):
    user_id = require_user(authorization)

    topics = payload.topics or [
        Topic.arrays_strings,
        Topic.hashing,
        Topic.trees,
        Topic.graphs,
        Topic.dp,
    ]

    assessment_id = uuid4()
    # TODO: persist assessment + selected questions to DB
    return AssessmentStartResponse(
        assessment_id=assessment_id,
        created_at=now_iso(),
        level=payload.level,
        topics=topics,
        instructions=(
            "Answer each question as best you can. Partial answers are OK. "
            "This is used to build your skill profile and roadmap."
        ),
    )


@app.get("/assessments/{assessment_id}", response_model=AssessmentGetResponse)
def get_assessment(assessment_id: UUID, authorization: Optional[str] = Header(default=None)):
    _user_id = require_user(authorization)

    # TODO: load assessment + questions from DB
    questions = [
        Question(
            question_id=uuid4(),
            topic=Topic.arrays_strings,
            difficulty=Difficulty.easy,
            prompt="Explain the difference between an array and a linked list. When would you choose each?",
        ),
        Question(
            question_id=uuid4(),
            topic=Topic.hashing,
            difficulty=Difficulty.medium,
            prompt="Given a list of integers, return whether any value appears at least twice. Provide an O(n) approach.",
        ),
    ]

    return AssessmentGetResponse(
        assessment_id=assessment_id,
        created_at=now_iso(),
        questions=questions,
    )


@app.post("/assessments/{assessment_id}/submit", response_model=AssessmentResultResponse)
def submit_assessment(
    assessment_id: UUID,
    payload: AssessmentSubmitRequest,
    authorization: Optional[str] = Header(default=None),
):
    _user_id = require_user(authorization)

    # TODO: grade responses (rubric + model-assisted evaluation) and store results
    # Stubbed skill profile:
    profile = [
        SkillScore(topic=Topic.arrays_strings, score=0.6, confidence=0.5),
        SkillScore(topic=Topic.hashing, score=0.4, confidence=0.4),
        SkillScore(topic=Topic.trees, score=0.3, confidence=0.3),
        SkillScore(topic=Topic.dp, score=0.2, confidence=0.2),
    ]

    recommended_focus = [Topic.dp, Topic.trees, Topic.hashing]

    return AssessmentResultResponse(
        assessment_id=assessment_id,
        submitted_at=now_iso(),
        overall_score=0.38,
        skill_profile=profile,
        recommended_focus=recommended_focus,
    )


# -------------------------
# Roadmap endpoints
# -------------------------

@app.get("/roadmap", response_model=RoadmapResponse)
def get_roadmap(
    authorization: Optional[str] = Header(default=None),
    limit: int = Query(default=20, ge=1, le=100),
):
    user_id = require_user(authorization)

    # TODO: fetch latest roadmap items from DB
    items: List[RoadmapItem] = []
    for _ in range(min(limit, 6)):
        items.append(
            RoadmapItem(
                item_id=uuid4(),
                topic=Topic.hashing,
                difficulty=Difficulty.easy,
                problem_id="two-sum",
                title="Two Sum",
                rationale="Recommended to build fundamentals in hashing and lookup patterns.",
                status="todo",
            )
        )

    return RoadmapResponse(user_id=user_id, generated_at=now_iso(), items=items)


@app.post("/roadmap/refresh", response_model=RoadmapResponse)
def refresh_roadmap(authorization: Optional[str] = Header(default=None)):
    user_id = require_user(authorization)

    # TODO: regenerate roadmap based on latest skill profile + recent attempts
    items = [
        RoadmapItem(
            item_id=uuid4(),
            topic=Topic.dp,
            difficulty=Difficulty.medium,
            problem_id="house-robber",
            title="House Robber",
            rationale="DP weakness detected; this builds state transitions and optimal substructure intuition.",
            status="todo",
        ),
        RoadmapItem(
            item_id=uuid4(),
            topic=Topic.trees,
            difficulty=Difficulty.medium,
            problem_id="binary-tree-level-order",
            title="Binary Tree Level Order Traversal",
            rationale="Tree traversal patterns improve BFS/queue fluency and structural reasoning.",
            status="todo",
        ),
    ]
    return RoadmapResponse(user_id=user_id, generated_at=now_iso(), items=items)


# -------------------------
# Problem endpoints
# -------------------------

@app.get("/problems/recommended", response_model=List[ProblemSummary])
def get_recommended_problems(
    authorization: Optional[str] = Header(default=None),
    topic: Optional[Topic] = Query(default=None),
    difficulty: Optional[Difficulty] = Query(default=None),
    limit: int = Query(default=10, ge=1, le=50),
):
    _user_id = require_user(authorization)

    # TODO: select problems based on roadmap + performance
    base = [
        ProblemSummary(problem_id="two-sum", title="Two Sum", topic=Topic.hashing, difficulty=Difficulty.easy),
        ProblemSummary(problem_id="valid-parentheses", title="Valid Parentheses", topic=Topic.stacks_queues, difficulty=Difficulty.easy),
        ProblemSummary(problem_id="house-robber", title="House Robber", topic=Topic.dp, difficulty=Difficulty.medium),
    ]

    filtered = [
        p for p in base
        if (topic is None or p.topic == topic) and (difficulty is None or p.difficulty == difficulty)
    ]
    return filtered[:limit]


@app.get("/problems/{problem_id}", response_model=ProblemDetail)
def get_problem(problem_id: str, authorization: Optional[str] = Header(default=None)):
    _user_id = require_user(authorization)

    # TODO: fetch problem content from DB / provider
    if problem_id == "two-sum":
        return ProblemDetail(
            problem_id="two-sum",
            title="Two Sum",
            topic=Topic.hashing,
            difficulty=Difficulty.easy,
            statement="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            constraints=["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
            examples=[{"input": {"nums": [2, 7, 11, 15], "target": 9}, "output": [0, 1]}],
        )

    return ProblemDetail(
        problem_id=problem_id,
        title="Placeholder Problem",
        topic=Topic.arrays_strings,
        difficulty=Difficulty.easy,
        statement="Problem statement not found in demo mode.",
    )


@app.post("/problems/{problem_id}/attempts", response_model=AttemptSubmitResponse)
def submit_attempt(problem_id: str, payload: AttemptSubmitRequest, authorization: Optional[str] = Header(default=None)):
    _user_id = require_user(authorization)

    # TODO: run tests, store attempt, update metrics, update skill profile
    # For now: simple placeholder
    attempt_id = uuid4()
    return AttemptSubmitResponse(
        attempt_id=attempt_id,
        submitted_at=now_iso(),
        verdict="received",
        feedback="Attempt received. In MVP mode, evaluation is not yet implemented.",
        updated_skill_profile=None,
    )


# -------------------------
# Progress endpoints
# -------------------------

@app.get("/progress/overview", response_model=ProgressOverview)
def progress_overview(authorization: Optional[str] = Header(default=None)):
    user_id = require_user(authorization)

    # TODO: compute from attempts + completions
    return ProgressOverview(
        user_id=user_id,
        generated_at=now_iso(),
        problems_completed=0,
        total_attempts=0,
        current_streak_days=0,
        strongest_topics=[Topic.arrays_strings],
        weakest_topics=[Topic.dp, Topic.graphs],
    )


# -------------------------
# AI Guidance endpoints (Socratic only)
# -------------------------

@app.post("/ai/guidance", response_model=GuidanceResponse)
def ai_guidance(payload: GuidanceRequest, authorization: Optional[str] = Header(default=None)):
    _user_id = require_user(authorization)

    # TODO: Call Ollama with a strict "no solutions" system prompt + output guardrails.
    # IMPORTANT: Keep it Socratic: questions + hints + conceptual explanation only.
    msg = (
        "Let’s approach this step-by-step.\n\n"
        "1) What’s the input size and what time complexity are you aiming for?\n"
        "2) Can you restate the core condition you’re checking in one sentence?\n"
        "3) What data structure gives you O(1) average lookups for 'have I seen X before'?\n\n"
        "If you paste your current approach (even partial), I’ll help you identify the next correct move."
    )

    return GuidanceResponse(
        response_id=uuid4(),
        created_at=now_iso(),
        message=msg,
        mode="socratic",
    )


# -------------------------
# Optional: simple tags + docs friendliness
# -------------------------

@app.get("/meta/topics")
def list_topics():
    return {"topics": [t.value for t in Topic]}


@app.get("/meta/difficulties")
def list_difficulties():
    return {"difficulties": [d.value for d in Difficulty]}
