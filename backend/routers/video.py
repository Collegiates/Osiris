from __future__ import annotations

import time
from typing import Generator, List, Optional

import cv2
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel, Field

from backend.services.camera_manager import CameraManager

router = APIRouter(prefix="/api/video", tags=["video"])
cameraManager = CameraManager()


class VideoSource(BaseModel):
    sourceId: int = Field(..., description="OpenCV camera index")
    name: str = Field(..., description="Best-effort label for the device")


class VideoAnalysisResponse(BaseModel):
    sourceId: int
    timestamp: float
    yoloConfigured: bool
    detections: List[dict]


class VideoBatchRequest(BaseModel):
    sourceIds: List[int] = Field(..., min_items=1, max_items=16)
    width: Optional[int] = Field(default=None, ge=1, le=4096)
    height: Optional[int] = Field(default=None, ge=1, le=4096)
    maxFps: int = Field(default=30, ge=1, le=60)


class VideoBatchResult(BaseModel):
    sourceId: int
    timestamp: float
    yoloConfigured: bool
    detections: List[dict]


class VideoBatchResponse(BaseModel):
    results: List[VideoBatchResult]


def _encodeJpeg(frame: object) -> Optional[bytes]:
    ok, buffer = cv2.imencode(".jpg", frame)
    if not ok:
        return None
    return buffer.tobytes()


@router.get("/sources", response_model=List[VideoSource])
def listVideoSources(maxSources: int = Query(default=5, ge=1, le=16)) -> List[VideoSource]:
    sources: List[VideoSource] = []
    for sourceId in range(maxSources):
        capture = cv2.VideoCapture(sourceId)
        if capture.isOpened():
            ok, _ = capture.read()
            if ok:
                sources.append(VideoSource(sourceId=sourceId, name=f"Camera {sourceId}"))
        capture.release()
    return sources


@router.get("/snapshot")
def getSnapshot(
    sourceId: int = Query(default=0, ge=0, le=16),
    width: Optional[int] = Query(default=None, ge=1, le=4096),
    height: Optional[int] = Query(default=None, ge=1, le=4096),
    maxFps: int = Query(default=30, ge=1, le=60),
) -> Response:
    frameData = cameraManager.getLatestFrame(sourceId, width, height, maxFps)
    if frameData is None:
        raise HTTPException(status_code=404, detail=f"Camera source {sourceId} not available")
    _, frame = frameData
    frameBytes = _encodeJpeg(frame)
    if frameBytes is None:
        raise HTTPException(status_code=500, detail="Failed to encode frame")
    return Response(content=frameBytes, media_type="image/jpeg")


@router.get("/stream")
def streamVideo(
    sourceId: int = Query(default=0, ge=0, le=16),
    fps: int = Query(default=10, ge=1, le=60),
) -> StreamingResponse:
    def frameGenerator() -> Generator[bytes, None, None]:
        frameDelay = 1.0 / float(fps)
        while True:
            frameData = cameraManager.getLatestFrame(sourceId, None, None, fps)
            if frameData is None:
                time.sleep(frameDelay)
                continue
            _, frame = frameData
            frameBytes = _encodeJpeg(frame)
            if frameBytes is None:
                time.sleep(frameDelay)
                continue
            yield b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frameBytes + b"\r\n"
            time.sleep(frameDelay)

    return StreamingResponse(frameGenerator(), media_type="multipart/x-mixed-replace; boundary=frame")


@router.get("/analyze", response_model=VideoAnalysisResponse)
def analyzeFrame(
    sourceId: int = Query(default=0, ge=0, le=16),
    width: Optional[int] = Query(default=None, ge=1, le=4096),
    height: Optional[int] = Query(default=None, ge=1, le=4096),
    maxFps: int = Query(default=30, ge=1, le=60),
) -> VideoAnalysisResponse:
    frameData = cameraManager.getLatestFrame(sourceId, width, height, maxFps)
    if frameData is None:
        raise HTTPException(status_code=404, detail=f"Camera source {sourceId} not available")
    timestamp, _frame = frameData

    # Placeholder for YOLO inference integration.
    return VideoAnalysisResponse(
        sourceId=sourceId,
        timestamp=timestamp,
        yoloConfigured=False,
        detections=[],
    )


@router.post("/analyze/batch", response_model=VideoBatchResponse)
def analyzeBatch(payload: VideoBatchRequest) -> VideoBatchResponse:
    results: List[VideoBatchResult] = []
    for sourceId in payload.sourceIds:
        frameData = cameraManager.getLatestFrame(
            sourceId,
            payload.width,
            payload.height,
            payload.maxFps,
        )
        if frameData is None:
            raise HTTPException(status_code=404, detail=f"Camera source {sourceId} not available")
        timestamp, _frame = frameData
        results.append(
            VideoBatchResult(
                sourceId=sourceId,
                timestamp=timestamp,
                yoloConfigured=False,
                detections=[],
            )
        )
    return VideoBatchResponse(results=results)
