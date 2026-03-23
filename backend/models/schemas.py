from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

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

# --- Assessments ---
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
    answers: Dict[UUID, str] = Field(description="Map of question_id -> user's answer (text/code).")
    time_spent_seconds: int = Field(ge=0)

class SkillScore(BaseModel):
    topic: Topic
    score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)

class AssessmentResultResponse(BaseModel):
    assessment_id: UUID
    submitted_at: str
    overall_score: float
    skill_profile: List[SkillScore]
    recommended_focus: List[Topic]

# --- Roadmap ---
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

# --- Problems / Attempts ---
class ProblemSummary(BaseModel):
    problem_id: str
    title: str
    topic: Topic
    difficulty: Difficulty
    source: str = Field(default="internal")

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
    notes: Optional[str] = None

class AttemptSubmitResponse(BaseModel):
    attempt_id: UUID
    submitted_at: str
    verdict: str
    feedback: str
    updated_skill_profile: Optional[List[SkillScore]] = None

# --- Progress ---
class ProgressOverview(BaseModel):
    user_id: str
    generated_at: str
    problems_completed: int
    total_attempts: int
    current_streak_days: int
    strongest_topics: List[Topic]
    weakest_topics: List[Topic]

# --- AI Guidance ---
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
    mode: str = Field(default="socratic")
