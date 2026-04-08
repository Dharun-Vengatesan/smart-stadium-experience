from locust import HttpUser, task, between, events
import time
import random

class StadiumUser(HttpUser):
    # Simulates users checking their route and sending location updates
    wait_time = between(1, 3)

    def on_start(self):
        # Authenticate and set headers (Assumes mock auth for testing)
        self.headers = {"Authorization": "Bearer mock_token_for_load_test"}
        self.user_id = f"user_{random.randint(1000, 99999)}"

    @task(3)
    def send_telemetry(self):
        payload = {
            "user_id": self.user_id,
            "latitude": 34.0522 + random.uniform(-0.001, 0.001),
            "longitude": -118.2437 + random.uniform(-0.001, 0.001),
            "facility_id": random.choice(["GATE_A", "CONCESSION_1", "RESTROOM_NORTH"])
        }
        with self.client.post(
            "/api/v1/telemetry/location", 
            json=payload, 
            headers=self.headers,
            catch_response=True
        ) as response:
            if response.status_code == 202:
                response.success()
            else:
                response.failure(f"Failed with status: {response.status_code}")

    @task(1)
    def check_queue(self):
        facility = random.choice(["GATE_A", "CONCESSION_1", "RESTROOM_NORTH"])
        self.client.get(f"/api/v1/queues/{facility}/predict", headers=self.headers)

    @task(1)
    def get_route(self):
        payload = {
            "start_lat": 34.0522,
            "start_lng": -118.2437,
            "end_facility_id": "CONCESSION_1",
            "accessibility_mode": random.choice([True, False])
        }
        self.client.post("/api/v1/navigation/route", json=payload, headers=self.headers)

# Hook to capture system level metrics during test
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("Starting 50k Concurrent User Simulation against API...")
