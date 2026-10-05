import json
import logging
import httpx
from typing import Dict, Any, Optional, Type
from pydantic import BaseModel
from app.config import settings
from app.services.ai.base import BaseAIProvider
from app.services.ai.heuristic_provider import HeuristicTravelProvider

logger = logging.getLogger(__name__)

class AnthropicProvider(BaseAIProvider):
    """
    Anthropic Claude 3.5 Sonnet Integration via async httpx.
    Falls back gracefully to HeuristicTravelProvider if unconfigured or on network failure.
    """

    def __init__(self, api_key: Optional[str] = None, model: str = "claude-3-5-sonnet-20241022"):
        self.api_key = (api_key or getattr(settings, "ANTHROPIC_API_KEY", "")).strip()
        self.model = model
        self.fallback = HeuristicTravelProvider()

    @property
    def provider_name(self) -> str:
        return "anthropic"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: Optional[Type[BaseModel]] = None
    ) -> Dict[str, Any]:
        if not self.api_key or self.api_key == "your_anthropic_api_key_here":
            logger.info("Anthropic API key unconfigured; using deterministic heuristic engine.")
            return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)

        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01"
        }

        payload = {
            "model": self.model,
            "max_tokens": 4096,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}]
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                resp = await client.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["content"][0]["text"].strip()
                    # Strip markdown blocks
                    if raw_text.startswith("```json"):
                        raw_text = raw_text[7:]
                    if raw_text.startswith("```"):
                        raw_text = raw_text[3:]
                    if raw_text.endswith("```"):
                        raw_text = raw_text[:-3]
                    return json.loads(raw_text.strip())
                else:
                    logger.warning(f"Anthropic API returned status {resp.status_code}: {resp.text}")
                    return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)
        except Exception as e:
            logger.error(f"Anthropic call error: {e}. Executing heuristic fallback.")
            return await self.fallback.generate_structured(system_prompt, user_prompt, response_model)

    async def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        res = await self.generate_structured(system_prompt, user_prompt)
        return json.dumps(res, indent=2)
