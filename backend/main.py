from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import assessments, meta, problems, roadmaps
from backend.database import db

app = FastAPI(
    title="Osiris Learning Platform API",
    version="0.1.0",
    description="Assessment-driven coding practice with Socratic AI guidance (no full solutions).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Osiris API is running"}

@app.get("/health")
def healthCheck():
    return {"status": "healthy"}

app.include_router(assessments.router)
app.include_router(meta.router)
app.include_router(problems.router)
app.include_router(roadmaps.router)
app.include_router(db.router)
