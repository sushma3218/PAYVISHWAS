from abc import ABC, abstractmethod
import os

class AIProvider(ABC):
    @abstractmethod
    def analyze(self, data: dict) -> dict:
        pass
    
    @abstractmethod
    def reason(self, context: str) -> str:
        pass
    
    @abstractmethod
    def generate(self, prompt: str) -> str:
        pass
    
    @abstractmethod
    def explain(self, decision_data: dict) -> str:
        pass

class MockAIProvider(AIProvider):
    """
    A deterministic mock provider to ensure the project works flawlessly out of the box 
    during local development and hackathon presentations without requiring paid API keys immediately.
    """
    def analyze(self, data: dict) -> dict:
        # Mock diagnosis logic based on incoming data
        error_code = data.get("error_code")
        error_description = data.get("error_description", "").lower()
        
        if error_code == "BAD_REQUEST_ERROR" and "timeout" in error_description:
            return {
                "failure_type": "TEMPORARY",
                "root_cause": "BANK_TIMEOUT",
                "evidence": ["Bank response timed out during authentication"],
                "confidence": 0.95,
                "recoverability_score": 0.85
            }
        elif "funds" in error_description:
            return {
                "failure_type": "CUSTOMER_ACTION_REQUIRED",
                "root_cause": "INSUFFICIENT_FUNDS",
                "evidence": ["Bank reported insufficient funds"],
                "confidence": 0.99,
                "recoverability_score": 0.20
            }
        elif "fraud" in error_description or "suspicious" in error_description:
            return {
                "failure_type": "SUSPICIOUS",
                "root_cause": "RISK_SYSTEM_BLOCKED",
                "evidence": ["Gateway flagged transaction as high risk"],
                "confidence": 0.90,
                "recoverability_score": 0.05
            }
        else:
            return {
                "failure_type": "UNKNOWN",
                "root_cause": "UNRECOGNIZED_ERROR",
                "evidence": [],
                "confidence": 0.50,
                "recoverability_score": 0.50
            }

    def reason(self, context: str) -> str:
        return "Simulated reasoning based on context."
        
    def generate(self, prompt: str) -> str:
        return "Simulated generated text."
        
    def explain(self, decision_data: dict) -> str:
        return f"Decision was made due to: {decision_data.get('reason', 'System policies')}"

def get_ai_provider() -> AIProvider:
    provider_name = os.getenv("LLM_PROVIDER", "mock")
    if provider_name == "mock":
        return MockAIProvider()
    else:
        # Extensible for real OpenAI/Anthropic LangChain implementations
        return MockAIProvider() 
