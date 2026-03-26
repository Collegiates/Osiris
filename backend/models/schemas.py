from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field
from pydantic.config import ConfigDict


def nowIso() -> str:
    return datetime.now(timezone.utc).isoformat()


class CamelBaseModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class Topic(str, Enum):
    arraysStrings = "arrays_strings"
    hashing = "hashing"
    twoPointers = "two_pointers"
    stacksQueues = "stacks_queues"
    linkedLists = "linked_lists"
    trees = "trees"
    graphs = "graphs"
    dp = "dp"
    sorting = "sorting"
    binarySearch = "binary_search"


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class AssessmentType(str, Enum):
    short = "short"
    normal = "normal"


class QuestionType(str, Enum):
    coding = "coding"
    cs = "cs"


class AssessmentStartRequest(CamelBaseModel):
    assessmentType: AssessmentType
    topics: Optional[List[Topic]] = Field(default=None)


class AssessmentStartResponse(CamelBaseModel):
    assessmentId: UUID
    createdAt: str
    assessmentType: AssessmentType
    questionCount: int
    instructions: str


class Question(CamelBaseModel):
    questionId: UUID
    questionType: QuestionType
    topic: Topic
    prompt: str
    difficulty: Difficulty
    problemId: Optional[str] = None


class AssessmentGetResponse(CamelBaseModel):
    assessmentId: UUID
    createdAt: str
    questions: List[Question]


class AssessmentSubmitRequest(CamelBaseModel):
    answers: Dict[UUID, str]
    timeSpentSeconds: int = Field(ge=0)


class SkillScore(CamelBaseModel):
    topic: Topic
    score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)


class AssessmentResultResponse(CamelBaseModel):
    assessmentId: UUID
    submittedAt: str
    assessmentType: AssessmentType
    overallScore: float
    hiddenSkillLevel: float
    skillProfile: List[SkillScore]
    recommendedFocus: List[Topic]
