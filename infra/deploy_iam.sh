#!/bin/bash
# Security Hardening & IAM Role Assignment for Stadium Experience
# Run this once after GCP project creation to lock down least-privilege access.

PROJECT_ID="your-gcp-project-id"
API_SA="stadium-api-sa@${PROJECT_ID}.iam.gserviceaccount.com"
WORKER_SA="stadium-worker-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Applying Least-Privilege IAM configuration to ${PROJECT_ID}..."

# 1. Create dedicated Service Accounts
gcloud iam service-accounts create stadium-api-sa \
    --display-name="Stadium API Cloud Run Service Account"
gcloud iam service-accounts create stadium-worker-sa \
    --display-name="Stadium Analytics PubSub Worker SA"

# 2. Grant API Service access to Firebase, Firestore, and Pub/Sub Publishing ONLY
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${API_SA}" \
    --role="roles/pubsub.publisher"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${API_SA}" \
    --role="roles/datastore.user"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${API_SA}" \
    --role="roles/firebaseauth.admin"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${API_SA}" \
    --role="roles/aiplatform.user"

# 3. Grant Async Worker access to BigQuery and Pub/Sub Subscriber
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${WORKER_SA}" \
    --role="roles/pubsub.subscriber"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${WORKER_SA}" \
    --role="roles/bigquery.dataEditor"

echo "IAM Setup Complete! Assign ${API_SA} to your Cloud Run deployments."
