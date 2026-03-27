from __future__ import annotations

import random
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
        "What is the difference between a set and a map?",
        "What is an invariant in an algorithm?",
        "Explain what a heap is used for.",
        "Why is recursion sometimes slower than iteration?",
        "What does it mean for an algorithm to be greedy?",
    ]
    selectedPrompts = random.sample(prompts, k=min(10, len(prompts)))
    return [
        Question(
            questionId=uuid4(),
            questionType=QuestionType.cs,
            topic=Topic.arraysStrings,
            difficulty=Difficulty.easy,
            prompt=prompt,
        )
        for prompt in selectedPrompts
    ]


def buildCodingQuestions(assessmentType: AssessmentType) -> list[Question]:
    easyPrompts = [
        ("Write a function that finds the maximum value in an array.", Topic.arraysStrings, Difficulty.easy),
        ("Return true if a string has all unique characters.", Topic.hashing, Difficulty.easy),
        ("Given an array, return the sum of its elements.", Topic.arraysStrings, Difficulty.easy),
    ]
    mediumPrompts = [
        ("Find the first non-repeating character in a string.", Topic.hashing, Difficulty.medium),
        ("Given a list of integers, return the length of the longest increasing subsequence.", Topic.dp, Difficulty.medium),
        ("Given a binary tree, return the level order traversal.", Topic.trees, Difficulty.medium),
    ]

    questions: list[Question] = []
    if assessmentType == AssessmentType.short:
        prompt, topic, difficulty = random.choice(easyPrompts + mediumPrompts)
        questions.append(
            Question(
                questionId=uuid4(),
                questionType=QuestionType.coding,
                topic=topic,
                difficulty=difficulty,
                prompt=prompt,
            )
        )
        return questions

    easyPrompt, easyTopic, easyDifficulty = random.choice(easyPrompts)
    mediumPrompt, mediumTopic, mediumDifficulty = random.choice(mediumPrompts)
    questions.extend(
        [
            Question(
                questionId=uuid4(),
                questionType=QuestionType.coding,
                topic=easyTopic,
                difficulty=easyDifficulty,
                prompt=easyPrompt,
            ),
            Question(
                questionId=uuid4(),
                questionType=QuestionType.coding,
                topic=mediumTopic,
                difficulty=mediumDifficulty,
                prompt=mediumPrompt,
            ),
        ]
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
        questionTypeById={},
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
    questions = buildCodingQuestions(assessmentType)
    questions.extend(buildCsQuestions())
    random.shuffle(questions)

    userState.assessments[assessmentId].questionIds = [q.questionId for q in questions]
    userState.assessments[assessmentId].questionTypeById = {
        q.questionId: q.questionType for q in questions
    }

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
    coverageScore = min(1.0, totalAnswers / expectedAnswers)
    timeScore = min(1.0, payload.timeSpentSeconds / max(1, expectedAnswers * 90))

    session = userState.assessments[assessmentId]
    answerScores: list[float] = []
    for questionId, answer in payload.answers.items():
        questionType = session.questionTypeById.get(questionId, QuestionType.cs)
        answerLength = len(answer.strip())
        if questionType == QuestionType.coding:
            answerScores.append(1.0 if answerLength >= 20 else 0.5)
        else:
            answerScores.append(1.0 if answerLength >= 10 else 0.5)
    answerQualityScore = sum(answerScores) / len(answerScores) if answerScores else 0.0

    score = min(1.0, (coverageScore * 0.5) + (answerQualityScore * 0.3) + (timeScore * 0.2))
    hiddenSkillLevel = round(score, 2)

    profile = {
        Topic.arraysStrings: min(1.0, hiddenSkillLevel + 0.1),
        Topic.hashing: hiddenSkillLevel,
        Topic.trees: max(0.0, hiddenSkillLevel - 0.2),
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
