# Stadium Experience Optimization System

## Challenge Vertical
**Smart Events & Venue Management**

## Problem Statement
Large-scale sporting events (50,000+ attendees) suffer from extreme physical congestion, unpredictable queue times for facilities (food, restrooms, merchandise), and inefficient crowd distribution. This leads to frustrated fans, safety hazards during evacuations, and lost revenue for vendors due to drop-offs in long queues.

## Solution Overview
A real-time, event-driven smart stadium system that leverages predictive AI, digital twin telemetry, and gamification to dynamically load-balance crowds across the venue. The system guides attendees using accessibility-compliant navigation and predicts accurate wait times based on live telemetry.

## Approach and Logic
The architectural core relies on processing high-throughput telemetry streams decoupled from the public API serving the clients. 
1. The decoupled event ingestion model ensures the public-facing API (`Cloud Run`) responds instantly and avoids blocking I/O constraints.
2. An A* graph-based approach maps physical paths, modifying edges dynamically based on live density weights.
3. The frontend is built "Offline-First" via PWA Service Workers, ensuring fans maintain local navigation heuristics even if stadium 5G towers fail.

## How the System Works (Step-by-Step)
1. **User Connection**: A fan opens the PWA. They cross an indoor threshold (e.g., Gate A).
2. **Telemetry Ingest**: The PWA securely POSTs the location. API Gateway passes it to Cloud Run. 
3. **Data Streaming**: Cloud Run pushes the payload to a Pub/Sub topic and returns a `202 Accepted` response.
4. **Analytics Pipeline**: A BigQuery subscriber ingests the location updates in real-time.
5. **AI Prediction**: Vertex AI reads the dense heatmaps from BigQuery and outputs forecasted wait times (e.g., "12 mins at North Concession").
6. **Smart Routing**: When the user requests a route to food, the A* algorithm paths around congested zones and the frontend UI announces the instructions via screen-reader protocols.

## Google Cloud Services Used
- **Firebase Authentication**: Validates secure JWT tokens for all API ingress requests.
- **Firebase Hosting**: High-speed edge CDN delivery for the React PWA.
- **Cloud Run**: Serverless compute executing FastAPI. Scales instantly from zero to thousands of containers to handle halftime spikes.
- **Pub/Sub**: Handles asynchronous data streaming for 50k+ burst events without I/O blocking.
- **BigQuery**: Real-time analytical data warehouse backing predictive model generation.
- **Vertex AI**: Calculates and deploys queue prediction estimations.
- **Google Maps Indoor API**: Evaluates structural navigation edges to render paths.
- **Cloud Operations (Logging / Monitoring)**: End-to-end traceability of latency (X-Process-Time metrics).

## Assumptions
- Attendees have mobile devices with location tracking enabled.
- The venue has a pre-mapped digital layout (indoor graph).
- Google Cloud project has billing and corresponding APIs enabled.

## Key Features
- **Predictive Queue AI**: Estimates wait times using Vertex AI.
- **Congestion Gamification**: Prompts users to walk to less crowded vendors for rewards.
- **WCAG 2.1 AA Compliant AR Navigation**: High-contrast, screen-reader enabled pathways.
- **Offline Fallback Resilience**: Core navigation caching allows fallback routing in dead zones.

### Setup Instructions & External Services

1.  **Configure Environment Variables**:
    Create a `.env` file in the `frontend` directory based on `.env.example`:
    ```bash
    cd frontend
    cp .env.example .env
    ```

2.  **Google Maps Platform Setup**:
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Enable the **Maps JavaScript API**.
    - Create an API Key and restrict it to your deployment domain (optional for local dev).
    - Add the key to `VITE_GOOGLE_MAPS_API_KEY` in your `.env`.

3.  **Firebase Real-time Data Setup**:
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Create a new project and add a "Web App".
    - Copy the `firebaseConfig` object values into your `.env` (using the `VITE_FIREBASE_*` prefixes).
    - Enable **Cloud Firestore** in test mode.
    - Create a collection named `queues` and add documents with this structure:
      ```json
      {
        "name": "North Concession",
        "wait": 5,
        "level": "low",
        "insight": "Low Traffic"
      }
      ```
    - The app will automatically fallback to **"Sensor unavailable"** mode if no valid configuration is detected.

4.  **Local Development**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

5.  **Deploy Web Frontend**:
    ```bash
    npm run build
    firebase deploy --only hosting
    ```

6.  **Run Locust Load Test**:
    ```bash
    locust -f load_test/locustfile.py --host=https://your-api-url.com
    ```