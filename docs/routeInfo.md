# PrintGuard Backend — Route Reference

All routes are served by the FastAPI backend (default: `http://localhost:8000`).

---

## General

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Root endpoint. Returns a simple health message (`{"message": "Hello World"}`). |
| `GET` | `/health` | Health check. Returns `{"status": "healthy"}` to confirm the server is running. |

---

## Environment & Data (`/api`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/env` | Returns the public Supabase URL and publishable key so the frontend can initialise its Supabase client. |
| `GET` | `/api/data` | Example data endpoint. Returns a placeholder JSON response. |

---

## Video (`/api/video`)

Endpoints for discovering cameras, grabbing snapshots, streaming live feeds, and running frame analysis.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/video/sources` | Probes camera indices 0–N and returns a list of available video sources with their IDs and labels. Query param: `maxSources` (default 5, max 16). |
| `GET` | `/api/video/snapshot` | Returns a single JPEG frame from the specified camera. Query params: `sourceId`, `width`, `height`, `maxFps`. |
| `GET` | `/api/video/stream` | Opens an MJPEG stream from the specified camera. Query params: `sourceId`, `fps`. The response is `multipart/x-mixed-replace` — connect from an `<img>` tag or video player. |
| `GET` | `/api/video/analyze` | Grabs the latest frame from a camera and runs it through the YOLO inference pipeline (placeholder). Returns `sourceId`, `timestamp`, `yoloConfigured`, and `detections`. |
| `POST` | `/api/video/analyze/batch` | Analyzes frames from multiple cameras in one request. Body: `{"sourceIds": [0, 1, ...], "width", "height", "maxFps"}`. Returns an array of per-camera analysis results. |

---

## Printer (`/api/printer`)

Direct serial (pyserial) control of 3D printers via G-code commands.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/printer/ports` | Lists all serial ports currently visible on the system (e.g. `/dev/ttyUSB0`, `COM3`). |
| `POST` | `/api/printer/pause` | Sends a pause command (`M25`) to a printer. Body: `{"port": "/dev/ttyUSB0", "baudRate": 115200}`. Optional `command` field to override the G-code. |
| `POST` | `/api/printer/stop` | Sends an emergency stop command (`M112`) to a printer. Same body format as `/pause`. |

---

## Stations (`/api/stations`)

Higher-level abstraction that links a camera to a printer as a named **station**. Provides CRUD management plus convenience shortcuts for streaming and printer control per station.

### CRUD

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/stations/` | List all registered stations. Returns an array of station objects. |
| `POST` | `/api/stations/` | Register a new station. Body: `{"name": "Printer A", "cameraSourceId": 0, "serialPort": "/dev/ttyUSB0", "baudRate": 115200}`. `serialPort` and `baudRate` are optional. Returns the created station with a generated `stationId`. |
| `GET` | `/api/stations/{stationId}` | Get details for a single station by ID. |
| `DELETE` | `/api/stations/{stationId}` | Remove a station and stop its associated camera worker. |

### Camera (per station)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/stations/{stationId}/snapshot` | Returns a JPEG snapshot from this station's camera. |
| `GET` | `/api/stations/{stationId}/stream` | Opens an MJPEG stream from this station's camera. Query param: `fps` (default 10). |

### Printer Control (per station)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/stations/{stationId}/pause` | Sends `M25` (pause) to the printer linked to this station. Returns an error if no serial port is configured. |
| `POST` | `/api/stations/{stationId}/stop` | Sends `M112` (emergency stop) to the printer linked to this station. |

---

> **Interactive docs**: When the server is running, visit [`http://localhost:8000/docs`](http://localhost:8000/docs) for the auto-generated Swagger UI with try-it-out functionality.
