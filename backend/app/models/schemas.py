from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class LocationUpdate(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    facility_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class QueuePredictionResult(BaseModel):
    facility_id: str
    estimated_wait_minutes: int
    confidence_score: float
    timestamp: datetime

class NavigationRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_facility_id: str
    accessibility_mode: bool = Field(default=False, description="Prefer elevators and ramps")

class RouteStep(BaseModel):
    instruction: str
    latitude: float
    longitude: float
    is_indoor: bool

class RouteResponse(BaseModel):
    distance_meters: float
    estimated_time_seconds: int
    steps: List[RouteStep]
    crowd_density_alert: Optional[str] = None

class RewardClaim(BaseModel):
    user_id: str
    reward_id: str
    points_cost: int
