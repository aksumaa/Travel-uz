from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Type
from pydantic import BaseModel

class BaseAIProvider(ABC):
    """
    Abstract Base Class for AI Model Providers.
    Ensures provider-agnostic execution across Anthropic Claude, OpenAI GPT, Google Gemini,
    and Deterministic Heuristic Fallback.
    """
    
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the unique name of the provider."""
        pass

    @abstractmethod
    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: Optional[Type[BaseModel]] = None
    ) -> Dict[str, Any]:
        """
        Generate structured JSON response adhering to a schema or dictionary format.
        Must strictly return a parsed Python dictionary.
        """
        pass

    @abstractmethod
    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str
    ) -> str:
        """
        Generate natural language explanation or answer.
        """
        pass
