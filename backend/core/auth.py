from typing import Optional, TypedDict
from fastapi import HTTPException, status
import jwt


class UserClaims(TypedDict):
    authUid: str
    email: Optional[str]


def requireUser(authorization: Optional[str]) -> UserClaims:
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

    authUid = token
    email = None

    if token.count(".") == 2:
        try:
            payload = jwt.decode(token, options={"verify_signature": False})
            authUid = payload.get("sub", token)
            email = payload.get("email")
        except Exception:
            authUid = token
            email = None

    return {"authUid": authUid, "email": email}
