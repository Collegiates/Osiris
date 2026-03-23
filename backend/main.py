from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import video, printer, stations
from backend.database import db
from backend.services.camera_manager import CameraManager
from backend.services.station_registry import StationRegistry

# Shared singletons
cameraManager = CameraManager()
stationRegistry = StationRegistry()

app = FastAPI(
    title="PrintGuard Backend API",
    version="0.2.0",
    description="Multi-camera device streaming, station management, and printer control for PrintGuard.",
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

# Wire shared singletons into the routers that need them
video.cameraManager = cameraManager
stations.init(stationRegistry, cameraManager)

# Routers
app.include_router(db.router)
app.include_router(video.router)
app.include_router(printer.router)
app.include_router(stations.router)


@app.on_event("shutdown")
def shutdownEvent() -> None:
    cameraManager.stopAll()
