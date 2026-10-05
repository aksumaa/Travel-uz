import os
import logging
from typing import Optional
from app.config import settings
from app.services.ai.base import BaseAIProvider
from app.services.ai.anthropic_provider import AnthropicProvider
from app.services.ai.openai_provider import OpenAIProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.heuristic_provider import HeuristicTravelProvider

logger = logging.getLogger(__name__)

def get_ai_provider(provider_override: Optional[str] = None) -> BaseAIProvider:
    """
    Factory function returning the appropriate AI provider instance.
    Checks environment configurations and secrets safely without hardcoding.
    """
    provider_name = (
        provider_override or
        os.getenv("AI_PROVIDER") or
        getattr(settings, "AI_PROVIDER", "anthropic")
    ).lower().strip()

    if provider_name == "openai":
        return OpenAIProvider()
    elif provider_name == "gemini":
        return GeminiProvider()
    elif provider_name == "heuristic":
        return HeuristicTravelProvider()
    else:
        # Default to Anthropic (with automatic heuristic fallback if API key is unconfigured)
        return AnthropicProvider()
