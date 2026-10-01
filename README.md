# Dungeon Character Visualizer

A Next.js UI for viewing and editing D&D 5e character JSON produced by the Dungeon Master Helper agent. Import a JSON file to populate the character sheet, edit its fields, and export the updated JSON. Character data is handled in the browser and is not saved to a server.

## Local Development

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

Run a production build locally with:

```bash
npm run build
```

## Deploy to Cloud Run

The app can run as a private Cloud Run service alongside `dungeon-master-helper` in the same Google Cloud project and region. It scales to zero when idle and requires IAM authentication; it does not need a database or a public unauthenticated endpoint.

Prerequisites:

- `gcloud` installed and logged in (`gcloud auth login`)
- A Google Cloud project with billing enabled and permission to enable APIs, deploy Cloud Run services, and grant `roles/run.invoker`

From this repository, run:

```bash
bash scripts/deploy.sh
```

The script enables the Cloud Run, Cloud Build, and Artifact Registry APIs; builds from source; deploys the service without unauthenticated access; and grants the active gcloud account `roles/run.invoker`. Defaults match the helper's project and region:

| Setting   | Default                    |
| --------- | -------------------------- |
| `PROJECT` | `dnd-waterdeep-492623`     |
| `REGION`  | `us-central1`              |
| `SERVICE` | `dnd-character-visualizer` |
| `PORT`    | `8089` (local proxy only)  |

Override a default inline, for example:

```bash
PROJECT=my-project REGION=us-west1 bash scripts/deploy.sh
```

After deployment, access the app through the authenticated local proxy printed by the script. Keep it running and open http://localhost:8089. The helper's proxy uses port `8088`, so both can run at the same time.

To authorize another user, run:

```bash
gcloud run services add-iam-policy-binding dnd-character-visualizer \
	--region=us-central1 --project=dnd-waterdeep-492623 \
	--member="user:someone@example.com" --role="roles/run.invoker"
```

Cloud Run uses request-based billing and scales to zero. At low personal usage, runtime costs may fit within the Cloud Run free tier; the free tier is shared across projects on the billing account. Source builds and stored container images have separate Cloud Build and Artifact Registry allowances. See [Cloud Run pricing](https://cloud.google.com/run/pricing), [Cloud Build pricing](https://cloud.google.com/build/pricing), and [Artifact Registry pricing](https://cloud.google.com/artifact-registry/pricing).
