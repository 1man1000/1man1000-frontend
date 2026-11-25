#!/usr/bin/env bash
set -euo pipefail

# Google Cloud Run / Artifact Registry deploy script for the dashboard frontend.
# Usage: ./scripts/deploy.sh [tag]
# Defaults: latest tag, us-central1, iman1000-hosting project, oneman1000-deployments repository
#
# Override any value with environment variables, e.g.:
#   REGION=europe-west1 PROJECT_ID=my-project ./scripts/deploy.sh v1.2.3

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

REGION="${REGION:-us-central1}"
PROJECT_ID="${PROJECT_ID:-iman1000-hosting}"
REPOSITORY="${REPOSITORY:-oneman1000-deployments}"
IMAGE_NAME="${IMAGE_NAME:-dashboard}"
TAG="${1:-${TAG:-latest}}"

ARTIFACT_REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}"
FULL_IMAGE="${ARTIFACT_REGISTRY}:${TAG}"

# NEXT_PUBLIC_API_URL is inlined at build time — override when targeting a
# different backend (e.g. staging): NEXT_PUBLIC_API_URL=... ./scripts/deploy.sh
API_URL="${NEXT_PUBLIC_API_URL:-https://api.1man1000.ai}"

cd "${FRONTEND_DIR}"

echo "→ Building Docker image: ${FULL_IMAGE}"
echo "→ NEXT_PUBLIC_API_URL: ${API_URL}"
docker build --platform linux/amd64 -f apps/dashboard/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL="${API_URL}" \
  -t "${FULL_IMAGE}" .

echo "→ Pushing to Artifact Registry: ${FULL_IMAGE}"
docker push "${FULL_IMAGE}"

echo ""
echo "✅ Pushed: ${FULL_IMAGE}"
echo ""
echo "To deploy to Cloud Run, run:"
echo "  gcloud run deploy dashboard \\"
echo "    --image ${FULL_IMAGE} \\"
echo "    --region ${REGION} \\"
echo "    --platform managed"
