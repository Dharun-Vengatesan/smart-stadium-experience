import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Stadium Experience API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # GCP Configurations
    GCP_PROJECT_ID: str = "your-gcp-project-id"
    GCP_REGION: str = "us-central1"
    
    # Redis Configurations (for caching and rate limiting)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # Firebase configuration
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    
    # Pub/Sub Topics
    PUBSUB_TELEMETRY_TOPIC: str = "user-telemetry"
    PUBSUB_ALERTS_TOPIC: str = "stadium-alerts"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True)

settings = Settings()
