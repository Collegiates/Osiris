from fastapi import FastAPI

from backend.routers import assessments, roadmap, problems, progress, ai, meta

app = FastAPI(
    title="Interview Prep Roadmap API",
    version="0.1.0",
    description="Assessment-driven coding practice with Socratic AI guidance (no full solutions).",
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
