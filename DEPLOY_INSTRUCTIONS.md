# Deployment Guide for Google Cloud Run

This guide outlines how to deploy the **Election Buddy India** application to Google Cloud Run using the provided Docker and configuration files.

## 1. Prerequisites
- [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install) installed and initialized.
- A Google Cloud Project with Billing enabled.
- [Docker](https://www.docker.com/products/docker-desktop) installed (for local testing).

## 2. Project Files Included
- `Dockerfile`: Multi-stage build for React (Vite) and FastAPI.
- `.dockerignore`: Optimizes build by excluding unnecessary files.
- `cloudbuild.yaml`: Automated build and deploy configuration.

## 3. Deployment Methods

### Option A: Manual Deployment (Quickest)
Run these commands from the root directory:

```bash
# 1. Build and push image to Google Container Registry
gcloud builds submit --tag gcr.io/[PROJECT_ID]/election-buddy

# 2. Deploy to Cloud Run
gcloud run deploy election-buddy \
  --image gcr.io/[PROJECT_ID]/election-buddy \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GROQ_API_KEY=[YOUR_GROQ_API_KEY]
```
*Replace `[PROJECT_ID]` and `[YOUR_GROQ_API_KEY]` with your actual values.*

### Option B: Automated with Cloud Build
If you have connected your GitHub/Bitbucket repo to Google Cloud Build, you can use the `cloudbuild.yaml` file.

1. Go to **Cloud Build** in the GCP Console.
2. Create a **Trigger** pointing to your repository.
3. Select **Cloud Build configuration file (yaml or json)**.
4. Add a substitution variable or update `cloudbuild.yaml` with your `GROQ_API_KEY`.

## 4. Local Testing
To test the Docker container locally:

```bash
# Build the image
docker build -t election-buddy .

# Run the container
# Pass your GROQ_API_KEY as an environment variable
docker run -p 8080:8080 -e GROQ_API_KEY=your_key_here election-buddy
```
Then visit `http://localhost:8080` in your browser.

## 5. Security & Scaling
- **Rate Limiting**: The app includes basic in-memory rate limiting. For high traffic, consider Cloud Armor or a Redis-backed rate limiter.
- **Environment Variables**: Always store sensitive keys like `GROQ_API_KEY` in **Secret Manager** for production environments instead of passing them in cleartext.
