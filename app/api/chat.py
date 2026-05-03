from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
import httpx
import logging

from app.core.security import is_rate_limited
from app.services.llm import get_chat_response

router = APIRouter()
logger = logging.getLogger(__name__)

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

@router.post("/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest, req: Request):
    client_ip = req.client.host if req.client else "unknown"
    if is_rate_limited(client_ip):
        raise HTTPException(
            status_code=429, 
            detail="Too many requests. Please wait a minute."
        )

    # Note: In a true microservice architecture, we could call a Cloud Function here.
    # For this implementation, we simulate that behavior if a specific webhook is configured.
    # e.g., if we wanted to call the cloud function:
    # try:
    #     async with httpx.AsyncClient() as client:
    #         resp = await client.post("CLOUD_FUNCTION_URL", json=request.model_dump())
    # except:
    #     pass

    try:
        reply, action, next_step = get_chat_response(
            request.message, 
            request.context or {}, 
            request.progress_step
        )
        return ChatResponse(reply=reply, action=action, next_step=next_step)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="The AI engine is temporarily unavailable.")
