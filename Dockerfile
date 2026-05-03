# Stage 1: Build the frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend and run the app
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies if needed (none specifically for this app, but slim is clean)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY main.py .
COPY run.py .
COPY app/ ./app/

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Run the application
# We use run.py to safely read the PORT environment variable and start uvicorn
CMD ["python", "run.py"]
