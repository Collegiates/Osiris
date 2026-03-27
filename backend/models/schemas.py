from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


def nowIso() -> str:
    return datetime.now(timezone.utc).isoformat()


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


class AssessmentStartRequest(BaseModel):
    assessmentType: AssessmentType
    topics: Optional[List[Topic]] = Field(default=None)


class AssessmentStartResponse(BaseModel):
    assessmentId: UUID
    createdAt: str
    assessmentType: AssessmentType
    questionCount: int
    instructions: str


class Question(BaseModel):
    questionId: UUID
    questionType: QuestionType
    topic: Topic
    prompt: str
    difficulty: Difficulty
    problemId: Optional[str] = None


class AssessmentGetResponse(BaseModel):
    assessmentId: UUID
    createdAt: str
    questions: List[Question]


class AssessmentSubmitRequest(BaseModel):
    answers: Dict[UUID, str]
    timeSpentSeconds: int = Field(ge=0)


class SkillScore(BaseModel):
    topic: Topic
    score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)


class AssessmentResultResponse(BaseModel):
    assessmentId: UUID
    submittedAt: str
    assessmentType: AssessmentType
    overallScore: float
    hiddenSkillLevel: float
    skillProfile: List[SkillScore]
    recommendedFocus: List[Topic]


class ProblemListItem(BaseModel):
    problemId: str
    problemVersionId: str
    title: str
    summary: Optional[str] = None
    difficulty: Optional[str] = None
    topicId: Optional[str] = None
    sourceDataset: Optional[str] = None
    externalId: Optional[str] = None


class ProblemDetailResponse(BaseModel):
    problemId: str
    problemVersionId: str
    title: str
    summary: Optional[str] = None
    statementMarkdown: Optional[str] = None
    difficulty: Optional[str] = None
    topicId: Optional[str] = None
    examples: Optional[dict] = None
    constraints: Optional[dict] = None
    inputSpec: Optional[str] = None
    outputSpec: Optional[str] = None
    timeLimitMs: Optional[int] = None
    memoryLimitMb: Optional[int] = None
    allowedLanguages: Optional[list] = None
    sourceDataset: Optional[str] = None
    externalId: Optional[str] = None
    testsObjectKey: Optional[str] = None


class RoadmapTopicResponse(BaseModel):
    topicId: str
    slug: str
    name: str


class RoadmapStartRequest(BaseModel):
    topicId: str


class RoadmapStartResponse(BaseModel):
    roadmapId: str


class RoadmapListItem(BaseModel):
    roadmapId: str
    topicId: str
    title: str
    isActive: bool


class RoadmapNodeResponse(BaseModel):
    nodeId: str
    problemVersionId: str
    title: str
    difficulty: Optional[str] = None
    nodeType: str
    positionIndex: int
    state: str


class RoadmapEdgeResponse(BaseModel):
    fromNodeId: str
    toNodeId: str
    edgeType: str


class RoadmapResponse(BaseModel):
    roadmapId: str
    topicId: str
    title: str
    nodes: List[RoadmapNodeResponse]
    edges: List[RoadmapEdgeResponse]


class RoadmapProgressRequest(BaseModel):
    state: str
