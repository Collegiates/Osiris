# PrintGuard: AI-Powered Defect Detection App

## Mission Statement
> Transforming additive manufacturing through autonomous, scalable, and concurrent monitoring that turns machine failures into instant alerts and actionable data.

## Details
**PrintGuard** is an AI-powered process monitoring platform designed to help manufacturers, teams, and hobbyists eliminate 3D printing failures in real-time. Rather than relying on manual supervision or post-print inspection, PrintGuard uses a **multi-camera computer vision system** to continuously assess the health of every print across your fleet simultaneously.

The system is built from the ground up for **multi-camera scalability** — a single PrintGuard instance can ingest feeds from several webcams at once, each assigned to a specific printer or viewing angle. A fine-tuned YOLOv8 model analyzes each camera feed in parallel, identifying defects (such as warping, spaghetti, stringing, or detachment) as they happen. When a failure is confirmed, PrintGuard sends G-code commands directly to the affected printer over USB serial via **pyserial** — no OctoPrint or intermediate server software required — and immediately dispatches an email notification.

Through the PrintGuard web platform, authenticated users can monitor all of their machines side-by-side via real-time livestream feeds, complete with a dynamic "Print Health" confidence percentage bar per camera. Built with scalability in mind, PrintGuard features robust Organization management. Users can join teams to view each other's live printing feeds, analyze fleet-wide statistics, and subscribe to shared error notifications, making it the perfect tool for makerspaces, university labs, and industrial print farms.

## Unique Features
* **Multi-Camera Scalability:** Add cameras and printers as your lab grows — each feed is processed independently, so scaling from 1 printer to 20 requires zero architectural changes.
* **Real-Time Print Dashboard:** Monitor every printer side-by-side with live camera feeds and a dynamic AI confidence percentage bar per camera.
* **Direct Serial Printer Control:** Sends G-code commands (e.g., `M0` pause, `M112` emergency stop) directly to printers over USB via pyserial — no OctoPrint or extra server software needed.
* **Instant Email Notifications:** Secure user authentication linked to an automated alert system that emails you the moment a defect is detected.
* **Organization & Team Hub:** Create or join organizations to share live camera feeds, track fleet-wide print statistics, and manage collaborative printing workflows.
* **Defect Detection:** Real-time identification of "Spaghetti," "Warping," "Stringing," and "Detachment" using high-speed YOLOv8 object detection models.

## Tech Stack
* **Backend:** FastAPI (Python w/ pyserial & OpenCV)
* **Frontend:** Next.js / Node.js
* **Database & Auth:** Supabase (PostgreSQL, Authentication, Row Level Security)
* **Computer Vision Model:** YOLO (Ultralytics / PyTorch)

---

## Getting Started

> **Note:** Please ensure you have [Next.js](https://nextjs.org/) and [Homebrew](https://brew.sh/) installed before setup.

### Backend Setup

1.  **Set up environment variables**
    Look at `.env.example` in the backend directory and create a new file named `.env`. Add the correct variables (Supabase credentials, Email SMTP settings, etc.).

2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

3.  **Create & Activate a Virtual Environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

4.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Return to Root Directory:**
    ```bash
    cd ..
    ```

6.  **Run the Backend Server:**
    ```bash
    uvicorn backend.main:app --reload
    ```

### Frontend Setup

1.  **Environment variable set up:**
    Create a new file named `.env.local` in the `frontend/PG` directory and add correct variables from `.env.example`. Change the backend URL to your local backend URL if needed.

2.  **Navigate to the Frontend Directory:**
    ```bash
    cd frontend/PG
    ```

3.  **Install Packages & Launch Development Server:**
    ```bash
    npm install
    npm run dev
    ```
