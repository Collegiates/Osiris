from uuid import uuid4
from fastapi import APIRouter, Header

from backend.core.auth import require_user
from backend.models.schemas import GuidanceRequest, GuidanceResponse, now_iso

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/guidance", response_model=GuidanceResponse)
def ai_guidance(payload: GuidanceRequest, authorization: str | None = Header(default=None)):
    _user_id = require_user(authorization)

    # TODO: Call Ollama with strict "no solutions" prompts + output validation.
    msg = (
        "Let’s do this step-by-step.\n\n"
        "1) What time complexity are you aiming for?\n"
        "2) What condition are you checking, in one sentence?\n"
        "3) What data structure helps you remember what you've seen before?\n\n"
        "If you paste your current approach (even partial), I’ll guide the next step."
    )

    return GuidanceResponse(
        response_id=uuid4(),
        created_at=now_iso(),
        message=msg,
        mode="socratic",
    )
