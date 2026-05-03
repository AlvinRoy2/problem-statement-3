import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.security import SecurityHeaderMiddleware
from app.api.chat import router as chat_router

app = FastAPI(
    title="Indian Election Buddy API - Gemini AI",
    description="A secure, efficient, and production-ready Indian voting assistant API.",
    version="3.0.0"
)

import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Centralized Error Handling ---
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Our engineers have been notified."}
    )

# --- Performance Visibility Middleware ---
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"{request.method} {request.url.path} completed in {process_time:.4f}s")
    return response

# --- Security Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SecurityHeaderMiddleware)

# --- API Routes ---
app.include_router(chat_router, prefix="/api")

# --- Static File Serving ---
if os.path.exists("frontend/dist/assets"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

# --- Frontend / SPA Routes ---
# MUST be at the end to avoid intercepting API routes.
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    if not full_path:
        index_path = "frontend/dist/index.html"
        if os.path.exists(index_path):
            return FileResponse(index_path)
        raise HTTPException(status_code=404, detail="Frontend build not found.")

    file_path = os.path.join("frontend/dist", full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)

    index_path = "frontend/dist/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    raise HTTPException(status_code=404, detail="Frontend build not found.")
