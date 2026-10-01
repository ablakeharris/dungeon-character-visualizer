#!/usr/bin/env bash
# Deploy the dungeon-character-visualizer to Cloud Run.
#
# The service is private (--no-allow-unauthenticated). Access is via an
# authenticated local proxy: each authorized user runs run-local.sh, which
# uses `gcloud run services proxy` to forward localhost:8088 to the service
# and signs every request with their gcloud identity.
#
# Usage:
#   bash scripts/deploy.sh
set -euo pipefail

PROJECT="${PROJECT:-dnd-waterdeep-492623}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-dnd-character-visualizer}"
PORT="${PORT:-8089}"

cd "$(dirname "$0")/.."

ACTIVE_ACCOUNT="$(gcloud config get-value account 2>/dev/null)"
if [[ -z "$ACTIVE_ACCOUNT" || "$ACTIVE_ACCOUNT" == "(unset)" ]]; then
  echo "No active gcloud account. Run 'gcloud auth login' and retry." >&2
  exit 1
fi

gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  --project="$PROJECT"

gcloud run deploy "$SERVICE" \
  --source . \
  --project="$PROJECT" \
  --region="$REGION" \
  --no-allow-unauthenticated \
  --ingress=all \
  --cpu=1 \
  --memory=512Mi \
  --max-instances=1

gcloud run services add-iam-policy-binding "$SERVICE" \
  --region="$REGION" \
  --project="$PROJECT" \
  --member="user:${ACTIVE_ACCOUNT}" \
  --role="roles/run.invoker" >/dev/null

echo "Granted roles/run.invoker: user:${ACTIVE_ACCOUNT}"
echo
echo "Deployed. To access locally, run:"
echo "gcloud run services proxy ${SERVICE} --region=${REGION} --project=${PROJECT} --port=${PORT}"
echo "Then open: http://localhost:${PORT}/"