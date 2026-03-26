from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Optional
from uuid import UUID

from backend.models.schemas import AssessmentType, Topic


@dataclass
class AssessmentSession:
    assessmentId: UUID
    assessmentType: AssessmentType
    createdAt: str
    questionIds: List[UUID]


@dataclass
class UserSkillProfile:
    hiddenSkillLevel: float
    topicScores: Dict[Topic, float]


@dataclass
class UserState:
    assessments: Dict[UUID, AssessmentSession] = field(default_factory=dict)
    skillProfile: Optional[UserSkillProfile] = None


class MemoryStore:
    def __init__(self) -> None:
        self.userStates: Dict[str, UserState] = {}

    def getUserState(self, userId: str) -> UserState:
        if userId not in self.userStates:
            self.userStates[userId] = UserState()
        return self.userStates[userId]


memoryStore = MemoryStore()


def nowIso() -> str:
    return datetime.now(timezone.utc).isoformat()
