from uuid import uuid4, UUID
from fastapi import APIRouter, Header

from backend.core.auth import require_user
from backend.models.schemas import (
    AssessmentStartRequest, AssessmentStartResponse,
    AssessmentGetResponse, AssessmentSubmitRequest, AssessmentResultResponse,
    Question, Topic, Difficulty, SkillScore, now_iso
)

router = APIRouter(prefix="/assessments", tags=["assessments"])

@router.post("", response_model=AssessmentStartResponse)
def start_assessment(payload: AssessmentStartRequest, authorization: str | None = Header(default=None)):
    _user_id = require_user(authorization)

    topics = payload.topics or [
        Topic.arrays_strings,
        Topic.hashing,
        Topic.trees,
        Topic.graphs,
        Topic.dp,
    ]

    assessment_id = uuid4()
    return AssessmentStartResponse(
        assessment_id=assessment_id,
        created_at=now_iso(),
        level=payload.level,
        topics=topics,
        instructions="Answer each question as best you can. Used to build your skill profile and roadmap.",
    )

@router.get("/{assessment_id}", response_model=AssessmentGetResponse)
def get_assessment(assessment_id: UUID, authorization: str | None = Header(default=None)):
    _user_id = require_user(authorization)

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

@router.post("/{assessment_id}/submit", response_model=AssessmentResultResponse)
def submit_assessment(
    assessment_id: UUID,
    payload: AssessmentSubmitRequest,
    authorization: str | None = Header(default=None),
):
    _user_id = require_user(authorization)

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
