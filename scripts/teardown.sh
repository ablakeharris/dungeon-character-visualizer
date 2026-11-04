#!/usr/bin/env bash
# Tear down the Google Cloud resources created by deploy.sh.
#
# Pairs with dungeon-master-helper's teardown.sh: shared resources are deleted
# by whichever script runs last, once nothing else is left in them.
#
# Removes, in order:
#   1. The Cloud Run service (its run.invoker bindings go with it)
#   2. The service's image in the cloud-run-source-deploy Artifact Registry
#      repo, and the repo itself if nothing else is left in it
#   3. Uploaded source archives in the Cloud Run / Cloud Build source buckets,
#      and each bucket if it is left empty
#   4. (only with --disable-apis) the APIs deploy.sh enabled, provided no
#      other Cloud Run services remain in the project
#
# Every step skips resources that are already gone, so it is safe to re-run.
#
# Usage:
#   bash scripts/teardown.sh                 # asks for confirmation
#   bash scripts/teardown.sh --yes           # no prompt
#   bash scripts/teardown.sh --disable-apis  # also disable the enabled APIs
set -euo pipefail

PROJECT="${PROJECT:-dnd-waterdeep-492623}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-dnd-character-visualizer}"
AR_REPO="cloud-run-source-deploy"

ASSUME_YES=false
DISABLE_APIS=false
for arg in "$@"; do
  case "$arg" in
    -y | --yes) ASSUME_YES=true ;;
    --disable-apis) DISABLE_APIS=true ;;
    -h | --help)
      sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'
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

echo "This will delete from project '${PROJECT}' (region ${REGION}):"
echo "  - Cloud Run service:       ${SERVICE}"
echo "  - Artifact Registry image: ${REGION}-docker.pkg.dev/${PROJECT}/${AR_REPO}/${SERVICE}"
echo "    (and the ${AR_REPO} repo if it is then empty)"
echo "  - Uploaded source archives in gs://run-sources-${PROJECT}-${REGION} and gs://${PROJECT}_cloudbuild"
echo "    (and each bucket if it is then empty)"
if $DISABLE_APIS; then
  echo "  - APIs: run, cloudbuild, artifactregistry (if no other Cloud Run services remain)"
fi
echo

if ! $ASSUME_YES; then
  read -r -p "Continue? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
fi

# --- 1. Cloud Run service ----------------------------------------------------
if gcloud run services describe "$SERVICE" --region="$REGION" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud run services delete "$SERVICE" --region="$REGION" --project="$PROJECT" --quiet
  echo "Deleted Cloud Run service: ${SERVICE}"
else
  echo "Cloud Run service ${SERVICE} not found, skipping."
fi

# --- 2. Artifact Registry ----------------------------------------------------
if gcloud artifacts repositories describe "$AR_REPO" --location="$REGION" --project="$PROJECT" >/dev/null 2>&1; then
  if gcloud artifacts packages describe "$SERVICE" --repository="$AR_REPO" \
    --location="$REGION" --project="$PROJECT" >/dev/null 2>&1; then
    gcloud artifacts packages delete "$SERVICE" --repository="$AR_REPO" \
      --location="$REGION" --project="$PROJECT" --quiet
    echo "Deleted Artifact Registry image: ${SERVICE}"
  fi

  # dungeon-master-helper shares this auto-created repo.
  remaining="$(gcloud artifacts packages list --repository="$AR_REPO" \
    --location="$REGION" --project="$PROJECT" --format='value(name)' --limit=1)"
  if [[ -z "$remaining" ]]; then
    gcloud artifacts repositories delete "$AR_REPO" --location="$REGION" --project="$PROJECT" --quiet
    echo "Deleted Artifact Registry repo: ${AR_REPO}"
  else
    echo "Artifact Registry repo ${AR_REPO} still holds other images, leaving it."
  fi
else
  echo "Artifact Registry repo ${AR_REPO} not found, skipping."
fi

# --- 3. Source upload buckets ------------------------------------------------
# `gcloud run deploy --source` uploads the source to one of these buckets,
# depending on the gcloud version.
clean_bucket() {
  local bucket="$1" prefix="$2"
  if ! gcloud storage buckets describe "gs://${bucket}" --project="$PROJECT" >/dev/null 2>&1; then
    echo "Bucket gs://${bucket} not found, skipping."
    return
  fi
  if gcloud storage ls "gs://${bucket}/${prefix}**" --project="$PROJECT" >/dev/null 2>&1; then
    gcloud storage rm "gs://${bucket}/${prefix}**" --project="$PROJECT" --quiet
    echo "Deleted source archives: gs://${bucket}/${prefix}"
  fi
  if [[ -z "$(gcloud storage ls "gs://${bucket}" --project="$PROJECT" 2>/dev/null)" ]]; then
    gcloud storage buckets delete "gs://${bucket}" --project="$PROJECT" --quiet
    echo "Deleted bucket: gs://${bucket}"
  else
    echo "Bucket gs://${bucket} still holds other objects, leaving it."
  fi
}
clean_bucket "run-sources-${PROJECT}-${REGION}" "services/${SERVICE}/"
# Archives here are not named per service, so this clears the helper's too.
clean_bucket "${PROJECT}_cloudbuild" "source/"

# --- 4. APIs (opt-in) --------------------------------------------------------
# aiplatform is left to dungeon-master-helper's teardown, which enabled it.
if $DISABLE_APIS; then
  others="$(gcloud run services list --project="$PROJECT" --format='value(metadata.name)' 2>/dev/null)"
  if [[ -n "$others" ]]; then
    echo "Other Cloud Run services still exist (${others//$'\n'/, }); leaving APIs enabled."
  else
    gcloud services disable \
      run.googleapis.com \
      cloudbuild.googleapis.com \
      artifactregistry.googleapis.com \
      --project="$PROJECT" --force
    echo "Disabled APIs."
  fi
fi

echo
echo "Teardown complete."
