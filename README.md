# Stadium Flow: Smart Event Optimization

A high-performance, real-time stadium monitoring system designed for the modern fan. This system uses an event-driven architecture to optimize crowd flow, predict wait times, and provide accessibility-first navigation.

## Project Architecture

1. **Frontend**: React + Vite PWA. Premium dark-mode UI with glassmorphism, responsive navigation, and offline fallback resilience.
2. **Backend**: Minimal Node.js (Express) microservice deployed on **Google Cloud Run**.
3. **Intelligence**: Simulated AI routing Comparison (Path A vs Path B) and live queue telemetry integration.

---

## 🚀 Google Cloud Run Deployment

To deploy the backend microservice, follow these steps:

### 1. Prerequisites
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured.
- Project ID set to `smart-stadium-monitoring`.

### 2. Initialization
```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project smart-stadium-monitoring
```

### 3. Enable Required Google APIs
```bash
gcloud services enable run.googleapis.com \
                       cloudbuild.googleapis.com \
                       artifactregistry.googleapis.com
```

### 4. Deploy Backend
Navigate to the `backend` folder and run:
```bash
cd backend
gcloud run deploy stadium-backend \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```
**Expected Output**: The command will output a Service URL (e.g., `https://stadium-backend-xxxx.a.run.app`).

---

## ⚡ API Endpoints

- **GET /**: Basic backend status message.
- **GET /api/queues**: Returns real-time mock queue telemetry (Wait times, crowd levels, and AI insights).

---

## 🛠️ Setup Instructions

### 1. Configure Environment
Copy the example environment file and update the variables:
```bash
cd frontend
cp .env.example .env
```
Add the Service URL from the Cloud Run deployment to `VITE_API_URL`.

### 2. Local Development
```bash
# Frontend
cd frontend
npm install && npm run dev

# Backend
cd backend
npm install && node server.js
```

---

## 📦 Repository Optimization
- **Size**: Strictly optimized to remain **under 1MB** by utilizing minimal dependencies (Express only for backend) and excluding heavy build artifacts.
- **Cleanup**: Unused Python backend components, local virtual environments, and deployment logs are gitignored to ensure a clean, submission-ready structure.

---

### Fallback Resilience
If the Cloud Run API is inaccessible, the frontend automatically enters **"Sensor unavailable"** mode, displaying cached simulation data to maintain a seamless user experience.