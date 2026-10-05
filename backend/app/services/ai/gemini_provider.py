import json
import logging
import httpx
from typing import Dict, Any, Optional, Type
from pydantic import BaseModel
from app.config import settings
from app.services.ai.base import BaseAIProvider
from app.services.ai.heuristic_provider import HeuristicTravelProvider

logger = logging.getLogger(__name__)

class GeminiProvider(BaseAIProvider):
    """
    Google Gemini Provider (Gemini 1.5 Flash / Pro).
    Adheres to BaseAIProvider and falls back gracefully.
    """

    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-1.5-flash"):
        self.api_key = (api_key or getattr(settings, "GEMINI_API_KEY", "")).strip()
        self.model = model
        self.fallback = HeuristicTravelProvider()

    @property
    def provider_name(self) -> str:
        return "gemini"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: Optional[Type[BaseModel]] = None
    ) -> Dict[str, Any]:
        if not self.api_key:
            logger.info("Gemini API key unconfigured; using deterministic heuristic engine.")
            return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{system_prompt}\n\nTask:\n{user_prompt}"}]
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.4
            }
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        raw_text = candidates[0]["content"]["parts"][0]["text"].strip()
                        return json.loads(raw_text)
                    return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)
                else:
                    logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text}")
                    return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)
        except Exception as e:
            logger.error(f"Gemini call error: {e}. Executing heuristic fallback.")
            return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)

    async def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        res = await self.generate_structured(system_prompt, user_prompt)
        return json.dumps(res, indent=2)
