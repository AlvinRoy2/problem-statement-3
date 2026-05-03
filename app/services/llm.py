import os
import functools
import logging
from typing import Optional, Tuple
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# LRU Cache to optimize efficiency by preventing redundant API calls
@functools.lru_cache(maxsize=100)
def _cached_generate_content(prompt: str, system_instruction: str) -> str:
    if not client:
        return "The AI assistant is currently offline."
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
                max_output_tokens=250,
            ),
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        raise

def get_chat_response(message: str, context: dict, progress_step: int) -> Tuple[str, str, int]:
    location_str = "Location: Unknown"
    if context:
        loc = context.get("location", {}) or {}
        city = loc.get("city", "Unknown") if isinstance(loc, dict) else "Unknown"
        region = loc.get("region", "") if isinstance(loc, dict) else ""
        location_str = f"Location: {city}, {region}"

    system_prompt = f"""You are the 'Election Buddy India', a helpful, highly concise AI voting assistant for Indian elections.
Current User Context:
- {location_str}
- Current Progress Step: {progress_step} (0=Registration/EPIC, 1=Research/Constituency, 2=Booth/Method, 3=Voting/EVM)

Rules:
1. Be extremely concise (2-3 sentences max).
2. Use Indian terminology (e.g., EPIC card, Lok Sabha, Vidhan Sabha, ECI, NVSP portal).
3. If they ask about registration, point them to voters.eci.gov.in or NVSP.
4. Explain that you can't access their private EPIC data but can guide them to check their name in the Electoral Roll.
5. If they mention they've registered or checked their name, append exactly '[ACTION: UPDATE_STEP X]' where X is the NEW NEXT step number.
"""
    
    try:
        reply = _cached_generate_content(message, system_prompt)
    except Exception:
        raise Exception("The AI engine is temporarily unavailable.")

    action = "NONE"
    next_step = progress_step

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

    return reply, action, next_step
