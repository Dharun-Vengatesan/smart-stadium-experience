from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
import logging
import time

# Google Cloud Observability Setup
import google.cloud.logging
from google.cloud import error_reporting

# Ensure GCP Observability works only when deployed to avoid local errors when unauthenticated
try:
    cloud_logging_client = google.cloud.logging.Client()
    cloud_logging_client.setup_logging()
    error_client = error_reporting.Client()
except Exception as e:
    logging.basicConfig(level=logging.INFO)
    logging.warning("GCP Logging omitted locally, using basic logging.")

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend services for Stadium Experience Optimization system.",
    docs_url="/api/docs",  # Fully integrated Swagger UI path
    redoc_url="/api/redoc", # ReDoc path
)

# CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Latency Observability Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    # Send custom metrics log for High Concurrency tracking
    logger.info(
        f"Path: {request.url.path} Method: {request.method} "
        f"Status: {response.status_code} Latency_s: {process_time:.4f}"
    )
    return response

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/healthz")
async def health_check():
    return {"status": "ok", "version": settings.VERSION}
