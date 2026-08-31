import json
import logging

logger = logging.getLogger(__name__)

class EventGuardian:
    """
    Deterministic agent that deeply validates the payment payload after it is received.
    """
    def __init__(self):
        pass

    def validate_event(self, event_data: dict) -> dict:
        """
        Validates the structure and required fields of the event.
        """
        try:
            # Basic structural validation
            if not isinstance(event_data, dict):
                return {"valid": False, "reason": "Payload is not a dictionary"}

            event_type = event_data.get("event")
            if not event_type:
                return {"valid": False, "reason": "Missing event type"}
                
            payload = event_data.get("payload", {})
            payment = payload.get("payment", {}).get("entity", {})
            
            payment_id = payment.get("id")
            amount = payment.get("amount")
            
            if not payment_id or amount is None:
                return {"valid": False, "reason": "Missing critical payment entity fields (id or amount)"}
                
            # If we get here, it's structurally valid for processing
            logger.info(f"EventGuardian validated event {event_data.get('id')} successfully.")
            return {
                "valid": True,
                "event_id": event_data.get("id"),
                "event_type": event_type,
                "payment_id": payment_id,
                "validation_status": "VALID"
            }
            
        except Exception as e:
            logger.error(f"EventGuardian validation error: {str(e)}")
            return {"valid": False, "reason": "Internal validation error", "details": str(e)}
