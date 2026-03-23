# Architecture

This document records the major architectural decisions for the project.  
Each layer of the system is captured as an independent Architecture Decision Record (ADR) within this file.

System goals:

- Real-time computer vision defect detection with millisecond latency  
- Autonomous printer intervention to prevent material waste  
- Plug-and-play deployment for makerspaces and engineering labs  
- Clear separation between video capture, AI inference, hardware control, and UI

High level structure:

- Frontend – Next.js  
- Backend – FastAPI  
- Video & Control – OpenCV & OctoPrint API
- Data & Auth – Supabase (PostgreSQL)  
- AI – YOLOv8 (Ultralytics) running locally

Architecture Overview



---

## ADR-0001 – Frontend Framework: Next.js

### Status
Accepted – 2026-02-27

### Context
The platform requires an interactive, real-time web interface for:

- Live multi-camera WebSocket feeds  
- Dynamic "Print Health" dashboards  
- Fleet-wide waste and statistics tracking  
- Organization and lab management

We needed a frontend framework that supports fast iteration, seamless WebSocket integration, and responsive design.

### Decision
Use **Next.js** as the primary frontend framework.

### Rationale

**Benefits**

- File-based routing and React ecosystem  
- Server Components for performance  
- Excellent support for real-time data visualization  
- Strong community and UI library support  
- Simple deployment (Vercel or self-hosted)

**Alternatives Considered**

- React only – more boilerplate  
- Vue/Nuxt – less team familiarity  
- Vanilla JS – too complex for state management with live video feeds

### Consequences

- Faster UI development  
- Need to manage CORS and WebSocket connections with FastAPI  
- Requires Node environment for builds

---

## ADR-0002 – Backend Service: FastAPI

### Status
Accepted – 2026-02-27

### Context
The backend must:

- Ingest live video frames from webcams  
- Run frames through the YOLOv8 inference pipeline  
- Track consecutive failure frames to reduce false positives  
- Communicate with the OctoPrint API to pause printers  
- Serve data and live feeds to the frontend

### Decision
Use **FastAPI (Python)** as the backend service.

### Rationale

**Benefits**

- Async performance natively suited for video streaming and WebSockets  
- Seamless integration with the Python ML ecosystem (OpenCV, PyTorch, Ultralytics)  
- Automatic OpenAPI documentation  
- Strong typing with Pydantic  
- Minimal overhead for millisecond-latency inference tasks

**Alternatives Considered**

- Node/Express – weak integration with Python-based computer vision libraries  
- Django – too heavy for a streaming/inference microservice  
- Flask – lacks native async support required for concurrent video processing

### Consequences

- Clear boundary between UI, hardware, and AI logic  
- Highly performant video processing  
- Requires careful memory management for continuous frame buffers

---

## ADR-0003 – Data & Authentication: Supabase

### Status
Accepted – 2026-02-27

### Context
We require storage for:

- User and Lab Manager accounts  
- Organization/Makerspace structures  
- Print failure logs and annotated screenshots  
- Fleet-wide material and time waste metrics  

Authentication must support secure access to shared lab feeds.

### Decision
Use **Supabase** for PostgreSQL database and authentication.

### Rationale

**Benefits**

- Managed PostgreSQL with Row Level Security (RLS) for multi-tenant labs  
- Built-in auth and JWT  
- Real-time database capabilities  
- Minimal DevOps overhead  
- Relational model perfectly fits fleet tracking and user roles

**Alternatives Considered**

- Firebase – NoSQL mismatch for relational fleet data  
- Self-hosted Postgres – more ops work  
- Auth0 – external dependency & higher cost

### Consequences

- Fast startup with secure, lab-specific auth  
- Vendor dependency  
- Need migrations strategy for schema updates

---

## ADR-0004 – AI Runtime: YOLOv8 (Ultralytics)

### Status
Accepted – 2026-02-27

### Context
The AI must:

- Analyze live video frames in real-time  
- Detect structural defects (`SPAGHETTI`, `WARPING`, `DETACHMENT`)  
- Operate entirely locally without internet dependency  
- Avoid cloud API costs to keep the solution affordable for academic labs

### Decision
Use **YOLOv8 via Ultralytics** running locally on GPU.

### Rationale

**Benefits**

- Industry-standard architecture for real-time object detection  
- Pre-trained weights allow rapid fine-tuning on our 3D print failure datasets  
- Inference runs in milliseconds per frame on local hardware  
- Complete privacy and zero cloud latency  

**Alternatives Considered**

- Large Language Models / Vision Language Models (e.g., Ollama/LLaVA) – far too slow for real-time frame-by-frame processing; overkill for bounding box detection.  
- Cloud AI APIs (AWS/GCP) – introduces network latency and recurring costs unsuitable for budget-constrained makerspaces.

### Consequences

- Requires local GPU or edge TPU for optimal performance  
- Need robust MLOps pipeline to fine-tune and update the weights file (`.pt`)  
- Requires logic to filter single-frame false positives (e.g., requiring 3 consecutive failure frames)

---

## ADR-0005 – Hardware Interface: OctoPrint API & OpenCV

### Status
Accepted – 2026-02-27

### Context
The system must physically interact with the 3D printer without requiring custom firmware rewrites or hardware splicing.

### Decision
Use **OpenCV** for frame capture and the **OctoPrint REST API** for machine control.

### Rationale

**Benefits**

- OpenCV is the standard, highly optimized library for grabbing webcam streams.  
- OctoPrint exposes a clean REST API over WiFi to pause, cancel, and monitor physical G-code execution.  
- Completely software-driven "closed loop" control without touching the printer's mainboard.

**Alternatives Considered**

- Direct Serial/USB connection – reinvents the wheel; requires complex G-code parsing.  
- Proprietary Plugins – locks the system into a single slicer ecosystem.

### Consequences

- Printers must be networked via a Raspberry Pi running OctoPrint.  
- Network stability between the FastAPI server and the OctoPrint Pi is critical.

---

## Cross-Layer Considerations

### Integration Flow

1. **OpenCV** captures live frames from the printer's webcam.  
2. **FastAPI** passes frames to the **YOLOv8** model for inference.  
3. If YOLOv8 detects 3 consecutive failure frames, FastAPI POSTs to the **OctoPrint API** to halt the print.  
4. FastAPI saves the failure event and an annotated frame to **Supabase**.  
5. **Next.js** dashboard instantly updates via WebSocket, showing the paused print and sending an email alert.

### Risks

- **The "Luma Trap":** Changes in lab lighting triggering false positives.  
- **Hardware Occlusion:** The print head blocking the camera's view of the defect.  
- **Network Latency:** Dropped frames between the webcam and the server.

### Mitigations

- Fine-tuning the YOLOv8 model on highly diverse, real-world makerspace data (varying lighting, colors, and angles).  
- Implementing a multi-frame confidence threshold (e.g., must see the defect in 3 consecutive frames).  
- Supporting a multi-camera vision mesh to view the print from different angles simultaneously.
