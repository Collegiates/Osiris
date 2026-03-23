from fastapi import APIRouter, Header
from backend.core.auth import require_user
from backend.models.schemas import ProgressOverview, Topic, now_iso

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/overview", response_model=ProgressOverview)
def progress_overview(authorization: str | None = Header(default=None)):
    user_id = require_user(authorization)

    return ProgressOverview(
        user_id=user_id,
        generated_at=now_iso(),
        problems_completed=0,
        total_attempts=0,
        current_streak_days=0,
        strongest_topics=[Topic.arrays_strings],
        weakest_topics=[Topic.dp, Topic.graphs],
    )
