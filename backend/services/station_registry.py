"""In-memory registry that maps cameras to printers as named stations."""

from __future__ import annotations

import uuid
from threading import Lock
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class PrinterStation(BaseModel):
    """A single monitoring station: one camera feed linked to one printer."""

    stationId: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str = Field(..., description="Human-readable label, e.g. 'Printer A – Front Cam'")
    cameraSourceId: int = Field(..., ge=0, le=16, description="OpenCV camera index")
    serialPort: Optional[str] = Field(
        default=None,
        description="Serial port path, e.g. /dev/ttyUSB0 or COM3 (None if no printer attached)",
    )
    baudRate: int = Field(default=115200, ge=9600, le=1000000)


class StationRegistry:
    """Thread-safe CRUD store for PrinterStation objects."""

    def __init__(self) -> None:
        self._stations: Dict[str, PrinterStation] = {}
        self._lock = Lock()

    # -- Create ---------------------------------------------------------------

    def add(self, station: PrinterStation) -> PrinterStation:
        with self._lock:
            self._stations[station.stationId] = station
        return station

    # -- Read -----------------------------------------------------------------

    def get(self, stationId: str) -> Optional[PrinterStation]:
        with self._lock:
            return self._stations.get(stationId)

    def list_all(self) -> List[PrinterStation]:
        with self._lock:
            return list(self._stations.values())

    def get_by_camera(self, cameraSourceId: int) -> Optional[PrinterStation]:
        with self._lock:
            for station in self._stations.values():
                if station.cameraSourceId == cameraSourceId:
                    return station
            return None

    # -- Delete ---------------------------------------------------------------

    def remove(self, stationId: str) -> bool:
        """Remove a station. Returns True if it existed, False otherwise."""
        with self._lock:
            return self._stations.pop(stationId, None) is not None
