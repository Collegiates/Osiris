from __future__ import annotations

import threading
import time
from typing import Dict, Optional, Tuple

import cv2


class CameraWorker:
    def __init__(
        self,
        sourceId: int,
        width: Optional[int],
        height: Optional[int],
        maxFps: int,
    ) -> None:
        self.sourceId = sourceId
        self.width = width
        self.height = height
        self.maxFps = maxFps
        self._lock = threading.Lock()
        self._stopEvent = threading.Event()
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._latestFrame: Optional[Tuple[float, object]] = None

    def start(self) -> None:
        if not self._thread.is_alive():
            self._thread.start()

    def stop(self) -> None:
        self._stopEvent.set()
        if self._thread.is_alive():
            self._thread.join(timeout=2.0)

    def getLatestFrame(self) -> Optional[Tuple[float, object]]:
        with self._lock:
            return self._latestFrame

    def _run(self) -> None:
        capture = cv2.VideoCapture(self.sourceId)
        if self.width is not None:
            capture.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
        if self.height is not None:
            capture.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)

        frameDelay = 1.0 / float(self.maxFps) if self.maxFps > 0 else 0.0
        try:
            while not self._stopEvent.is_set():
                ok, frame = capture.read()
                if ok and frame is not None:
                    with self._lock:
                        self._latestFrame = (time.time(), frame)
                if frameDelay > 0:
                    time.sleep(frameDelay)
        finally:
            capture.release()


class CameraManager:
    def __init__(self) -> None:
        self._workers: Dict[int, CameraWorker] = {}
        self._lock = threading.Lock()

    def ensureWorker(
        self,
        sourceId: int,
        width: Optional[int],
        height: Optional[int],
        maxFps: int,
    ) -> CameraWorker:
        with self._lock:
            worker = self._workers.get(sourceId)
            if worker is None:
                worker = CameraWorker(sourceId, width, height, maxFps)
                self._workers[sourceId] = worker
                worker.start()
                return worker

            if worker.width != width or worker.height != height or worker.maxFps != maxFps:
                worker.stop()
                worker = CameraWorker(sourceId, width, height, maxFps)
                self._workers[sourceId] = worker
                worker.start()
            return worker

    def getLatestFrame(
        self,
        sourceId: int,
        width: Optional[int],
        height: Optional[int],
        maxFps: int,
    ) -> Optional[Tuple[float, object]]:
        worker = self.ensureWorker(sourceId, width, height, maxFps)
        return worker.getLatestFrame()

    def listActive(self) -> list[int]:
        """Return the source IDs of all currently running camera workers."""
        with self._lock:
            return list(self._workers.keys())

    def stopOne(self, sourceId: int) -> bool:
        """Stop and remove a single camera worker. Returns True if it existed."""
        with self._lock:
            worker = self._workers.pop(sourceId, None)
        if worker is not None:
            worker.stop()
            return True
        return False

    def stopAll(self) -> None:
        with self._lock:
            workers = list(self._workers.values())
            self._workers = {}
        for worker in workers:
            worker.stop()
