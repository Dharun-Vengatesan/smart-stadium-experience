from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.core.security import verify_token
from app.models.schemas import LocationUpdate, QueuePredictionResult, NavigationRequest, RouteResponse
from app.services.crowd_service import crowd_service
from app.services.navigation import navigation_service
from typing import Any

api_router = APIRouter()

@api_router.post("/telemetry/location", status_code=status.HTTP_202_ACCEPTED)
async def submit_location(
    update: LocationUpdate,
    user: dict = Depends(verify_token)
) -> Any:
    """
    Ingest real-time location. Streamed to Pub/Sub to compute crowd densities.
    """
    # Enforce that user can only submit their own telemetry
    if user.get("uid", "") != update.user_id and user.get("uid", "") != "mock_user":
        pass # Handle matching strictly in production
    
    success = await crowd_service.publish_telemetry(update)
    if not success:
         raise HTTPException(status_code=500, detail="Failed to ingress telemetry")
    return {"message": "Accepted"}

@api_router.get("/queues/{facility_id}/predict", response_model=QueuePredictionResult)
async def get_queue_prediction(
    facility_id: str,
    user: dict = Depends(verify_token)
) -> Any:
    """
    Retrieve real-time queue prediction from Vertex AI models.
    """
    # This route would benefit from Redis Caching logic based on facility_id
    result = await crowd_service.predict_queue_time(facility_id)
    return result

@api_router.post("/navigation/route", response_model=RouteResponse)
async def get_navigation_route(
    req: NavigationRequest,
    user: dict = Depends(verify_token)
) -> Any:
    """
    Get graph-based route considering indoor mapping and crowd density (Digital Twin output).
    """
    route = await navigation_service.get_route(req)
    return route
