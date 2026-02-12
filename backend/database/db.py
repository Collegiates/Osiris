from fastapi import APIRouter
import os
from dotenv import load_dotenv

# 1. Load the secrets from the .env file
load_dotenv()

# We use a Router here so we can include it in the main app
router = APIRouter()

@router.get("/api/env")
def get_env():
    # 3. Use the secret variable HERE inside the backend
    # Return the keys needed by the frontend Supabase client
    return {
        "NEXT_PUBLIC_SUPABASE_URL": os.getenv("NEXT_PUBLIC_SUPABASE_URL"),
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY": os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    }

@router.get("/api/data")
def read_data():
    # Example route
    return {"message": "Here is the secure data", "status": "success"}