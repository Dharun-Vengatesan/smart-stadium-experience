from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

# Override verify_token dependency for testing
from app.core.security import verify_token
def override_verify_token():
    return {"uid": "mock_user", "email": "test@example.com"}

app.dependency_overrides[verify_token] = override_verify_token

def test_health_check():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": "1.0.0"}

def test_submit_location():
    payload = {
        "user_id": "mock_user",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "facility_id": "GATE_A"
    }
    # Simulate a POST request. The auth is bypassed via override.
    response = client.post("/api/v1/telemetry/location", json=payload)
    assert response.status_code == 202
    assert response.json()["message"] == "Accepted"

def test_get_queue_prediction():
    response = client.get("/api/v1/queues/GATE_A/predict")
    assert response.status_code == 200
    data = response.json()
    assert data["facility_id"] == "GATE_A"
    assert "estimated_wait_minutes" in data
