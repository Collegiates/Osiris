from uuid import uuid4
from fastapi import APIRouter, Header, Query

from backend.core.auth import require_user
from backend.models.schemas import RoadmapResponse, RoadmapItem, Topic, Difficulty, now_iso

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.get("", response_model=RoadmapResponse)
def get_roadmap(authorization: str | None = Header(default=None), limit: int = Query(default=20, ge=1, le=100)):
    user_id = require_user(authorization)

    items = []
    for _ in range(min(limit, 6)):
        items.append(
            RoadmapItem(
                item_id=uuid4(),
                topic=Topic.hashing,
                difficulty=Difficulty.easy,
                problem_id="two-sum",
                title="Two Sum",
                rationale="Build fundamentals in hashing and lookup patterns.",
                status="todo",
            )
        )

    return RoadmapResponse(user_id=user_id, generated_at=now_iso(), items=items)

@router.post("/refresh", response_model=RoadmapResponse)
def refresh_roadmap(authorization: str | None = Header(default=None)):
    user_id = require_user(authorization)

    items = [
        RoadmapItem(
            item_id=uuid4(),
            topic=Topic.dp,
            difficulty=Difficulty.medium,
            problem_id="house-robber",
            title="House Robber",
            rationale="DP weakness detected; build state transitions + optimal substructure intuition.",
            status="todo",
        ),
        RoadmapItem(
            item_id=uuid4(),
            topic=Topic.trees,
            difficulty=Difficulty.medium,
            problem_id="binary-tree-level-order",
            title="Binary Tree Level Order Traversal",
            rationale="Practice BFS/queue + structural reasoning.",
            status="todo",
        ),
    ]
    return RoadmapResponse(user_id=user_id, generated_at=now_iso(), items=items)
