from typing import Optional
from fastapi import HTTPException, status

def require_user(authorization: Optional[str]) -> str:
    """
    Placeholder auth gate.

    Expected: "Bearer <jwt>"
    TODO: Verify Supabase JWT and return user_id/sub.
    """
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization scheme")
    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Empty token")

    # TEMP: treat token as user_id for local testing
    return token
