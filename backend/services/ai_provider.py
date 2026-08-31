import json
import logging
import random

logger = logging.getLogger(__name__)

class AIProvider:
    """
    Mock AI Provider to simulate LLM capabilities (Anthropic/OpenAI) for the hackathon demo
    without requiring API keys. This adheres to the AI_ARCHITECTURE.md design.
    """
    
    @staticmethod
    def analyze_diagnosis(event_data: dict) -> dict:
        """
        Simulates parsing a raw error message and diagnosing the root cause.
        """
        payment_data = event_data.get("payload", {}).get("payment", {}).get("entity", {})
        error_code = payment_data.get("error_code", "UNKNOWN_ERROR")
        error_description = payment_data.get("error_description", "")
        
        # Simulate LLM understanding the error context
        if "timeout" in error_description.lower():
            root_cause = "BANK_TIMEOUT"
            failure_type = "TEMPORARY"
            confidence = 0.95
        elif "insufficient" in error_description.lower() or "funds" in error_description.lower():
            root_cause = "INSUFFICIENT_FUNDS"
            failure_type = "CUSTOMER_ACTION_REQUIRED"
            confidence = 0.99
        elif "risk" in error_code.lower() or "suspicious" in error_description.lower():
            root_cause = "SUSPICIOUS_ACTIVITY"
            failure_type = "PERMANENT"
            confidence = 0.88
        else:
            root_cause = "GENERAL_DECLINE"
            failure_type = "TEMPORARY"
            confidence = 0.70
            
        return {
            "failure_type": failure_type,
            "root_cause": root_cause,
            "confidence": confidence,
            "reasoning": f"LLM parsed error '{error_code}: {error_description}' and classified as {root_cause}."
        }
        
    @staticmethod
    def generate_strategies(context: dict, diagnosis: dict) -> list:
        """
        Simulates generating recovery strategies based on context and diagnosis.
        """
        failure_type = diagnosis.get("failure_type")
        strategies = []
        
        if failure_type == "TEMPORARY":
            strategies.append({
                "action": "DELAYED_RETRY",
                "latency_seconds": 90,
                "recovery_probability": 0.85,
                "customer_experience": "HIGH",
                "expected_recovery": context.get("transaction", {}).get("amount", 0),
                "confidence": 0.91
            })
            strategies.append({
                "action": "IMMEDIATE_RETRY",
                "latency_seconds": 0,
                "recovery_probability": 0.60,
                "customer_experience": "HIGH",
                "expected_recovery": context.get("transaction", {}).get("amount", 0),
                "confidence": 0.75
            })
        elif failure_type == "CUSTOMER_ACTION_REQUIRED":
            strategies.append({
                "action": "PAYMENT_LINK",
                "latency_seconds": 3600,
                "recovery_probability": 0.45,
                "customer_experience": "MEDIUM",
                "expected_recovery": context.get("transaction", {}).get("amount", 0),
                "confidence": 0.88
            })
            
        if diagnosis.get("root_cause") == "SUSPICIOUS_ACTIVITY":
            strategies = [{
                "action": "DO_NOTHING",
                "latency_seconds": 0,
                "recovery_probability": 0.0,
                "customer_experience": "LOW",
                "expected_recovery": 0,
                "confidence": 1.0
            }]
            
        if not strategies:
            strategies.append({
                "action": "DO_NOTHING",
                "latency_seconds": 0,
                "recovery_probability": 0.0,
                "customer_experience": "MEDIUM",
                "expected_recovery": 0,
                "confidence": 1.0
            })
            
        return strategies
