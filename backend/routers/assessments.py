from __future__ import annotations

from uuid import uuid4, UUID
from fastapi import APIRouter, Header, HTTPException, status

from backend.core.auth import requireUser
from backend.models.schemas import (
    AssessmentStartRequest,
    AssessmentStartResponse,
    AssessmentGetResponse,
    AssessmentSubmitRequest,
    AssessmentResultResponse,
    Question,
    QuestionType,
    Topic,
    Difficulty,
    SkillScore,
    AssessmentType,
    nowIso,
)
from backend.database.memoryStore import memoryStore, AssessmentSession, UserSkillProfile

router = APIRouter(prefix="/assessments", tags=["assessments"])


def buildCsQuestions() -> list[Question]:
    prompts = [
        "What is the difference between a stack and a queue?",
        "Explain Big-O notation in one sentence.",
        "What is a hash collision and how can it be handled?",
        "Describe the tradeoff between arrays and linked lists.",
        "What is recursion and when is it useful?",
        "What is the difference between DFS and BFS?",
        "What does it mean for a sort to be stable?",
        "Explain the purpose of a binary search tree.",
        "What is dynamic programming used for?",
        "When would you use a set instead of a list?",
    ]
    return [
        Question(
            questionId=uuid4(),
            questionType=QuestionType.cs,
            topic=Topic.arraysStrings,
            difficulty=Difficulty.easy,
            prompt=prompt,
        )
        for prompt in prompts
    ]


def buildCodingQuestions(count: int) -> list[Question]:
    questions: list[Question] = []
    for _ in range(count):
        questions.append(
            Question(
                questionId=uuid4(),
                questionType=QuestionType.coding,
                topic=Topic.arraysStrings,
                difficulty=Difficulty.easy,
                prompt="Write a function that finds the maximum value in an array.",
            )
        )
    return questions


@router.post("", response_model=AssessmentStartResponse)
def startAssessment(payload: AssessmentStartRequest, authorization: str | None = Header(default=None)):
    userId = requireUser(authorization)

    if payload.assessmentType not in {AssessmentType.short, AssessmentType.normal}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid assessment type")

    assessmentId = uuid4()
    questionCount = 11 if payload.assessmentType == AssessmentType.short else 12

    session = AssessmentSession(
        assessmentId=assessmentId,
        assessmentType=payload.assessmentType,
        createdAt=nowIso(),
        questionIds=[],
    )
    memoryStore.getUserState(userId).assessments[assessmentId] = session

    return AssessmentStartResponse(
        assessmentId=assessmentId,
        createdAt=session.createdAt,
        assessmentType=payload.assessmentType,
        questionCount=questionCount,
        instructions="Answer each question to establish your baseline skill level.",
    )


@router.get("/{assessmentId}", response_model=AssessmentGetResponse)
def getAssessment(assessmentId: UUID, authorization: str | None = Header(default=None)):
    userId = requireUser(authorization)
    userState = memoryStore.getUserState(userId)

    if assessmentId not in userState.assessments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    assessmentType = userState.assessments[assessmentId].assessmentType
    codingCount = 1 if assessmentType == AssessmentType.short else 2
    csCount = 10

    questions = buildCodingQuestions(codingCount)
    questions.extend(buildCsQuestions()[:csCount])

    userState.assessments[assessmentId].questionIds = [q.questionId for q in questions]

    return AssessmentGetResponse(
        assessmentId=assessmentId,
        createdAt=nowIso(),
        questions=questions,
    )


@router.post("/{assessmentId}/submit", response_model=AssessmentResultResponse)
def submitAssessment(
    assessmentId: UUID,
    payload: AssessmentSubmitRequest,
    authorization: str | None = Header(default=None),
):
    userId = requireUser(authorization)
    userState = memoryStore.getUserState(userId)

    if assessmentId not in userState.assessments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    assessmentType = userState.assessments[assessmentId].assessmentType
    expectedAnswers = 11 if assessmentType == AssessmentType.short else 12
    totalAnswers = len(payload.answers)
    score = min(1.0, totalAnswers / expectedAnswers)
    hiddenSkillLevel = round(score, 2)

    profile = {
        Topic.arraysStrings: 0.6,
        Topic.hashing: 0.4,
        Topic.trees: 0.3,
    }
    userState.skillProfile = UserSkillProfile(hiddenSkillLevel=hiddenSkillLevel, topicScores=profile)

    skillProfile = [
        SkillScore(topic=topic, score=value, confidence=0.5)
        for topic, value in profile.items()
    ]
    recommendedFocus = [Topic.trees, Topic.hashing]

    return AssessmentResultResponse(
        assessmentId=assessmentId,
        submittedAt=nowIso(),
        assessmentType=assessmentType,
        overallScore=score,
        hiddenSkillLevel=hiddenSkillLevel,
        skillProfile=skillProfile,
        recommendedFocus=recommendedFocus,
    )
