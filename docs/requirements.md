1. Functional Requirements

Camera Integration: System must ingest a live video feed from a webcam or Raspberry Pi camera pointed at the 3D printer bed.

Real-Time Monitoring: System must analyze video frames continuously to check for printing errors.

User Accounts: User can make an account with their email and password, or link their Google account.

Alert System: System must send notifications (Email/SMS/App Push) to the user immediately upon detecting a potential failure.

History & Timelapse: System has to store print history, including pass/fail status and a timelapse video of the print.

Manual Override: User must be able to remotely view the live feed and override the AI’s decision (e.g., "Resume Print" if it was a false alarm).

Failure Classification: System must identify specific defect types: "Spaghetti" (detachment), "Warping" (corners lifting), or "Layer Shift."



Story 1: The Catastrophic Save
As a maker, I want the system to automatically pause my printer if the print detaches from the bed, so that I don't wake up to a giant ball of plastic spaghetti and wasted filament.

Acceptance Criteria:
The AI detects "Spaghetti" failure with >85% confidence.

The system sends a "Pause" command to the printer within 45 seconds of detection.(If we have time to add this feature)

The system sends an alert to the user's phone with a snapshot of the failure.

The printer heating element is turned off (safety) if the user doesn't respond in 15 minutes.(potential future implementations)


Story 2: The False Alarm Protection

As a user, I want the AI to ask for confirmation on ambiguous errors rather than killing a good print, so that I don't lose days of work due to a software glitch.

Acceptance Criteria:
If AI confidence is between 50-85% (Unsure), it sends a "Warning" alert but does not pause immediately.
User can click "Ignore" or "Pause" from the dashboard.

System learns from this interaction (Reinforcement Learning) to avoid flagging that specific geometry again.

2. Non-Functional Requirements

Latency: The time from "failure event" to "alert sent" should be no more than 60 seconds.

Resource Efficiency: The vision model must run on low-power edge devices (like a Raspberry Pi 4) without causing the printer to stutter.

False Positive Rate: The system must have a False Positive rate of less than 1% (stopping a good print is worse than missing a bad one).

Connectivity: The system should handle temporary Wi-Fi disconnects gracefully (continue monitoring locally and sync later).

Scalability: The backend should be able to handle hundreds of concurrent video streams (for a print farm manager) if scaled up.

UI Response: The dashboard (live feed view) should load in under 2 seconds.

Security: Video feeds must be encrypted to prevent unauthorized viewing of proprietary prototypes.

Compliance: System must comply with GDPR/CCPA for user data (especially if faces are captured in the background).

3. AI-Specific Requirements

Context Window/Memory: The AI does not need a long text context, but it needs "Temporal Consistency" it should compare the current frame to the previous 5 frames to 
ensure the error is persistent (not just a hand moving across the camera).

Defect Recognition Capabilities: The AI must distinguish between "Support Material" (messy looking but intentional) and "Spaghetti" (messy looking and 
unintentional).

Lighting Adaptability: The AI must function correctly in various lighting conditions (e.g., lights off with only the printer's LCD glow, or bright daylight).
Training Loop: The AI should allow users to tag "False Positives" in their history, which are then used to retrain the model to better understand that specific user's printer setup.

Inference Speed: The AI should not take more than 2 seconds to process a single image frame on the edge device.

4. Prioritization

Must Haves (MVP)

Connection to webcam and OctoPrint/Klipper.

Detection of "Spaghetti" (Total Detachment) failure.

Mobile-friendly dashboard to view the live feed.

Basic alert system (Email).


Should Haves (Beta)

Detection of "Warping" (corners lifting off the bed).

Timelapse generation (auto-removing frames where the print head blocks the view).


Nice to Haves (V2.0)

"Confidence Slider" allowing users to set how sensitive the AI is

Auto-Pause functionality

Layer Shift detection (harder to see)

"Nozzle Clog" detection (inferring from lack of material flow)

Thermal readings and detection

SMS notifications

