from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import assessments, roadmap, problems, progress, ai, meta
from backend.database import db

app = FastAPI(
    title="Interview Prep Roadmap API",
    version="0.1.0",
    description="Assessment-driven coding practice with Socratic AI guidance (no full solutions).",
)

# Allow your frontend to talk to this backend
# (In production, replace "*" with your actual frontend domain)
# IMPORTANT: CORS middleware must be added BEFORE routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Keep your original endpoints
@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Routers
app.include_router(assessments.router)
app.include_router(roadmap.router)
app.include_router(problems.router)
app.include_router(progress.router)
app.include_router(ai.router)
app.include_router(meta.router)
app.include_router(db.router)
