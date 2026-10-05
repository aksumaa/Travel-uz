import json
import logging
import httpx
from typing import Dict, Any, Optional, Type
from pydantic import BaseModel
from app.config import settings
from app.services.ai.base import BaseAIProvider
from app.services.ai.heuristic_provider import HeuristicTravelProvider

logger = logging.getLogger(__name__)

class OpenAIProvider(BaseAIProvider):
    """
    OpenAI GPT Provider (GPT-4o / GPT-4o-mini).
    Uses JSON mode and graceful fallback.
    """

    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o"):
        self.api_key = (api_key or getattr(settings, "OPENAI_API_KEY", "")).strip()
        self.model = model
        self.fallback = HeuristicTravelProvider()

    @property
    def provider_name(self) -> str:
        return "openai"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: Optional[Type[BaseModel]] = None
    ) -> Dict[str, Any]:
        if not self.api_key:
            logger.info("OpenAI API key unconfigured; using deterministic heuristic engine.")
            return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        payload = {
            "model": self.model,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.4
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                resp = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["choices"][0]["message"]["content"].strip()
                    return json.loads(raw_text)
                else:
                    logger.warning(f"OpenAI API returned status {resp.status_code}: {resp.text}")
                    return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)
        except Exception as e:
            logger.error(f"OpenAI call error: {e}. Executing heuristic fallback.")
            return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)

    async def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        res = await self.generate_structured(system_prompt, user_prompt)
        return json.dumps(res, indent=2)
