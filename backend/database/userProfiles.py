from __future__ import annotations

from typing import Optional


def getOrCreateUserProfileId(supabaseClient, authUid: str, email: Optional[str]) -> str:
    response = (
        supabaseClient
        .table("user_profiles")
        .select("id")
        .eq("auth_uid", authUid)
        .limit(1)
        .execute()
    )
    data = response.data or []
    if data:
        return data[0]["id"]

    insertResponse = (
        supabaseClient
        .table("user_profiles")
        .insert({"auth_uid": authUid, "email": email})
        .execute()
    )
    return insertResponse.data[0]["id"]
