"""Station router – CRUD for printer stations + convenience stream/control endpoints."""

from __future__ import annotations

import time
from typing import Generator, List, Optional

import cv2
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel, Field

from backend.services.camera_manager import CameraManager
from backend.services.station_registry import PrinterStation, StationRegistry

router = APIRouter(prefix="/api/stations", tags=["stations"])

# Shared singletons – injected from main.py at startup.
_registry: Optional[StationRegistry] = None
_cameraManager: Optional[CameraManager] = None


def init(registry: StationRegistry, cameraManager: CameraManager) -> None:
    """Called once from main.py to wire shared singletons."""
    global _registry, _cameraManager
    _registry = registry
    _cameraManager = cameraManager


def _reg() -> StationRegistry:
    assert _registry is not None, "StationRegistry not initialised"
    return _registry


def _cam() -> CameraManager:
    assert _cameraManager is not None, "CameraManager not initialised"
    return _cameraManager

# ---------------------------------------------------------------------------
class StationCreateRequest(BaseModel):
    name: str = Field(..., description="Human-readable label")
    cameraSourceId: int = Field(..., ge=0, le=16)
    serialPort: Optional[str] = Field(default=None)
    baudRate: int = Field(default=115200, ge=9600, le=1000000)


class StationResponse(BaseModel):
    stationId: str
    name: str
    cameraSourceId: int
    serialPort: Optional[str]
    baudRate: int

# ---------------------------------------------------------------------------
@router.get("/", response_model=List[StationResponse])
def listStations() -> List[StationResponse]:
    return [
        StationResponse(**s.model_dump()) for s in _reg().list_all()
    ]


@router.post("/", response_model=StationResponse, status_code=201)
def createStation(payload: StationCreateRequest) -> StationResponse:
    station = PrinterStation(
        name=payload.name,
        cameraSourceId=payload.cameraSourceId,
        serialPort=payload.serialPort,
        baudRate=payload.baudRate,
    )
    _reg().add(station)
    # Start the camera worker immediately so frames are ready.
    _cam().ensureWorker(station.cameraSourceId, None, None, 30)
    return StationResponse(**station.model_dump())


@router.get("/{stationId}", response_model=StationResponse)
def getStation(stationId: str) -> StationResponse:
    station = _reg().get(stationId)
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return StationResponse(**station.model_dump())


@router.delete("/{stationId}")
def deleteStation(stationId: str) -> dict:
    station = _reg().get(stationId)
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    _cam().stopOne(station.cameraSourceId)
    _reg().remove(stationId)
    return {"status": "removed", "stationId": stationId}

# ---------------------------------------------------------------------------
def _encodeJpeg(frame: object) -> Optional[bytes]:
    ok, buf = cv2.imencode(".jpg", frame)
    return buf.tobytes() if ok else None


@router.get("/{stationId}/snapshot")
def stationSnapshot(stationId: str) -> Response:
    station = _reg().get(stationId)
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    frameData = _cam().getLatestFrame(station.cameraSourceId, None, None, 30)
    if frameData is None:
        raise HTTPException(status_code=404, detail="Camera not available")
    _, frame = frameData
    jpg = _encodeJpeg(frame)
    if jpg is None:
        raise HTTPException(status_code=500, detail="Failed to encode frame")
    return Response(content=jpg, media_type="image/jpeg")


@router.get("/{stationId}/stream")
def stationStream(
    stationId: str,
    fps: int = Query(default=10, ge=1, le=60),
) -> StreamingResponse:
    station = _reg().get(stationId)
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    camId = station.cameraSourceId

    def generate() -> Generator[bytes, None, None]:
        delay = 1.0 / float(fps)
        while True:
            frameData = _cam().getLatestFrame(camId, None, None, fps)
            if frameData is None:
                time.sleep(delay)
                continue
            _, frame = frameData
            jpg = _encodeJpeg(frame)
            if jpg is None:
                time.sleep(delay)
                continue
            yield b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + jpg + b"\r\n"
            time.sleep(delay)

    return StreamingResponse(generate(), media_type="multipart/x-mixed-replace; boundary=frame")

# ---------------------------------------------------------------------------
def _sendSerial(station: PrinterStation, command: str) -> dict:
    if station.serialPort is None:
        raise HTTPException(
            status_code=400,
            detail=f"Station '{station.name}' has no serial port configured",
        )
    from serial import Serial, SerialException

    try:
        with Serial(station.serialPort, station.baudRate, timeout=2) as ser:
            ser.write((command + "\n").encode("utf-8"))
            ser.flush()
    except SerialException as exc:
        raise HTTPException(status_code=500, detail=f"Serial error: {exc}") from exc
    except OSError as exc:
        raise HTTPException(status_code=500, detail=f"OS error: {exc}") from exc

    return {
        "status": "sent",
        "stationId": station.stationId,
        "port": station.serialPort,
        "baudRate": station.baudRate,
        "command": command,
    }


@router.post("/{stationId}/pause")
def stationPause(stationId: str) -> dict:
    station = _reg().get(stationId)
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return _sendSerial(station, "M25")


@router.post("/{stationId}/stop")
def stationStop(stationId: str) -> dict:
    station = _reg().get(stationId)
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return _sendSerial(station, "M112")
