from __future__ import annotations

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()


def getSupabaseClient() -> Client:
    supabaseUrl = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabaseServiceRoleKey = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabaseUrl or not supabaseServiceRoleKey:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

    return create_client(supabaseUrl, supabaseServiceRoleKey)
