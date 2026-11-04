#!/usr/bin/env bash
# Remove the Cloud Run resources created by deploy.sh.
#
# Deletes:
#   - the Cloud Run service (its IAM bindings, including roles/run.invoker,
#     go with it)
#   - this service's container images in the cloud-run-source-deploy
#     Artifact Registry repository
#
# Leaves in place, because dungeon-master-helper shares them in this project:
#   - the enabled APIs (Cloud Run, Cloud Build, Artifact Registry)
#   - the cloud-run-source-deploy repository itself
#   - uploaded build sources in gs://<project>_cloudbuild
#
# Usage:
#   bash scripts/teardown.sh          # asks for confirmation
#   bash scripts/teardown.sh --yes    # skips confirmation
set -euo pipefail

PROJECT="${PROJECT:-dnd-waterdeep-492623}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-dnd-character-visualizer}"
REPOSITORY="${REPOSITORY:-cloud-run-source-deploy}"

ASSUME_YES=false
for arg in "$@"; do
  case "$arg" in
    -y|--yes) ASSUME_YES=true ;;
    -h|--help)
      sed -n '2,17p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

ACTIVE_ACCOUNT="$(gcloud config get-value account 2>/dev/null)"
if [[ -z "$ACTIVE_ACCOUNT" || "$ACTIVE_ACCOUNT" == "(unset)" ]]; then
  echo "No active gcloud account. Run 'gcloud auth login' and retry." >&2
  exit 1
fi

echo "This will delete from project ${PROJECT} (${REGION}):"
echo "  - Cloud Run service: ${SERVICE}"
echo "  - Container images:  ${REGION}-docker.pkg.dev/${PROJECT}/${REPOSITORY}/${SERVICE}"
echo

if [[ "$ASSUME_YES" != true ]]; then
  read -r -p "Continue? [y/N] " reply
  if [[ ! "$reply" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

if gcloud run services describe "$SERVICE" \
  --region="$REGION" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud run services delete "$SERVICE" \
    --region="$REGION" --project="$PROJECT" --quiet
  echo "Deleted Cloud Run service: ${SERVICE}"
else
  echo "Cloud Run service ${SERVICE} not found; skipping."
fi

if gcloud artifacts packages describe "$SERVICE" \
  --repository="$REPOSITORY" --location="$REGION" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud artifacts packages delete "$SERVICE" \
    --repository="$REPOSITORY" --location="$REGION" --project="$PROJECT" --quiet
  echo "Deleted container images: ${SERVICE}"
else
  echo "No container images for ${SERVICE} in ${REPOSITORY}; skipping."
fi

echo
echo "Teardown complete."
