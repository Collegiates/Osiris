from fastapi import APIRouter

from backend.models.schemas import Topic, Difficulty

router = APIRouter(prefix="/meta", tags=["meta"])


@router.get("/topics")
def listTopics():
    return {"topics": [topic.value for topic in Topic]}


@router.get("/difficulties")
def listDifficulties():
    return {"difficulties": [difficulty.value for difficulty in Difficulty]}
