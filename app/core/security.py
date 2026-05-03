import time
from typing import Dict
from collections import defaultdict
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

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

# --- Security Headers ---
class SecurityHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://ipapi.co;"
        return response
