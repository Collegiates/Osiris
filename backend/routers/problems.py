from uuid import uuid4
from fastapi import APIRouter, Header, Query

from backend.core.auth import require_user
from backend.models.schemas import (
    ProblemSummary, ProblemDetail, AttemptSubmitRequest, AttemptSubmitResponse,
    Topic, Difficulty, now_iso
)

router = APIRouter(prefix="/problems", tags=["problems"])

@router.get("/recommended", response_model=list[ProblemSummary])
def get_recommended_problems(
    authorization: str | None = Header(default=None),
    topic: Topic | None = Query(default=None),
    difficulty: Difficulty | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=50),
):
    _user_id = require_user(authorization)

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

@router.get("/{problem_id}", response_model=ProblemDetail)
def get_problem(problem_id: str, authorization: str | None = Header(default=None)):
    _user_id = require_user(authorization)

    if problem_id == "two-sum":
        return ProblemDetail(
            problem_id="two-sum",
            title="Two Sum",
            topic=Topic.hashing,
            difficulty=Difficulty.easy,
            statement="Given an array of integers nums and an integer target, return indices of two numbers such that they add up to target.",
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

@router.post("/{problem_id}/attempts", response_model=AttemptSubmitResponse)
def submit_attempt(problem_id: str, payload: AttemptSubmitRequest, authorization: str | None = Header(default=None)):
    _user_id = require_user(authorization)

    return AttemptSubmitResponse(
        attempt_id=uuid4(),
        submitted_at=now_iso(),
        verdict="received",
        feedback="Attempt received. Evaluation is not yet implemented.",
        updated_skill_profile=None,
    )
