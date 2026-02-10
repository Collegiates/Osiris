from fastapi import APIRouter
from backend.models.schemas import Topic, Difficulty

router = APIRouter(prefix="/meta", tags=["meta"])

@router.get("/topics")
def list_topics():
    return {"topics": [t.value for t in Topic]}

@router.get("/difficulties")
def list_difficulties():
    return {"difficulties": [d.value for d in Difficulty]}
