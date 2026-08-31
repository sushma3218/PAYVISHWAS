from backend.agents.base import get_ai_provider

class DiagnosisAgent:
    """
    Agent responsible for identifying the root cause of a payment failure.
    Uses an LLM (or Mock Provider) to parse potentially complex gateway errors.
    """
    def __init__(self):
        self.ai_provider = get_ai_provider()

    def diagnose(self, event_data: dict) -> dict:
        """
        Diagnoses the failure based on the event payload.
        """
        payment_entity = event_data.get("payload", {}).get("payment", {}).get("entity", {})
        
        # Extract relevant fields for diagnosis
        error_code = payment_entity.get("error_code")
        error_description = payment_entity.get("error_description")
        error_source = payment_entity.get("error_source")
        error_step = payment_entity.get("error_step")
        error_reason = payment_entity.get("error_reason")
        
        analysis_payload = {
            "error_code": error_code,
            "error_description": error_description,
            "error_source": error_source,
            "error_step": error_step,
            "error_reason": error_reason,
            "method": payment_entity.get("method")
        }
        
        # Let the AI Provider analyze the payload
        diagnosis_result = self.ai_provider.analyze(analysis_payload)
        
        return diagnosis_result
