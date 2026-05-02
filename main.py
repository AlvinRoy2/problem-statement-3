from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
from collections import defaultdict
import os
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Indian Election Buddy API - Groq AI",
    description="A secure and efficient Indian voting assistant API.",
    version="2.0.0"
)

# --- Security Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SecurityHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://ipapi.co;"
        return response

app.add_middleware(SecurityHeaderMiddleware)

# Serve Vite assets
if os.path.exists("frontend/dist/assets"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# --- Simple In-Memory Rate Limiter ---
_rate_limit_store: Dict[str, list] = defaultdict(list)
RATE_LIMIT = 15
RATE_WINDOW = 60

def is_rate_limited(ip: str) -> bool:
    now = time.time()
    _rate_limit_store[ip] = [t for t in _rate_limit_store[ip] if now - t < RATE_WINDOW]
    if len(_rate_limit_store[ip]) >= RATE_LIMIT:
        return True
    _rate_limit_store[ip].append(now)
    return False

# --- Request / Response Models ---
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)
    context: Optional[Dict[str, Any]] = None
    progress_step: Optional[int] = Field(default=0, ge=0, le=3)

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, v: str) -> str:
        return v.strip().replace("<script", "[script]").replace("javascript:", "[js]")

class ChatResponse(BaseModel):
    reply: str
    action: Optional[str] = "NONE"
    next_step: Optional[int] = 0

# --- Routes ---
@app.get("/")
async def read_index():
    if os.path.exists("frontend/dist/index.html"):
        return FileResponse("frontend/dist/index.html")
    raise HTTPException(status_code=404, detail="Frontend build not found.")

@app.post("/api/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest, req: Request):
    client_ip = req.client.host if req.client else "unknown"
    if is_rate_limited(client_ip):
        raise HTTPException(
            status_code=429, 
            detail="Too many requests. Please wait a minute."
        )

    if not client:
        return ChatResponse(
            reply="The AI assistant is currently offline.",
            action="NONE"
        )

    location_str = "Location: Unknown"
    if request.context:
        loc = request.context.get("location", {}) or {}
        city = loc.get("city", "Unknown") if isinstance(loc, dict) else "Unknown"
        region = loc.get("region", "") if isinstance(loc, dict) else ""
        location_str = f"Location: {city}, {region}"

    system_prompt = f"""You are the 'Election Buddy India', a helpful, highly concise AI voting assistant for Indian elections.
Current User Context:
- {location_str}
- Current Progress Step: {request.progress_step} (0=Registration/EPIC, 1=Research/Constituency, 2=Booth/Method, 3=Voting/EVM)

Rules:
1. Be extremely concise (2-3 sentences max).
2. Use Indian terminology (e.g., EPIC card, Lok Sabha, Vidhan Sabha, ECI, NVSP portal).
3. If they ask about registration, point them to voters.eci.gov.in or NVSP.
4. Explain that you can't access their private EPIC data but can guide them to check their name in the Electoral Roll.
5. If they mention they've registered or checked their name, append exactly '[ACTION: UPDATE_STEP X]' where X is the NEW NEXT step number.
"""

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=250,
        )

        reply = response.choices[0].message.content
        action = "NONE"
        next_step = request.progress_step

        if "[ACTION: UPDATE_STEP" in reply:
            try:
                action_part = reply.split("[ACTION: UPDATE_STEP")[1]
                step_val = int(action_part.split("]")[0].strip())
                if 0 <= step_val <= 3:
                    next_step = step_val
                    action = "UPDATE_STEP"
                reply = reply.split("[ACTION:")[0].strip()
            except (ValueError, IndexError):
                pass

        return ChatResponse(reply=reply, action=action, next_step=next_step)

    except Exception as e:
        print(f"Groq API Error: {e}")
        raise HTTPException(status_code=500, detail="The AI engine is temporarily unavailable.")
