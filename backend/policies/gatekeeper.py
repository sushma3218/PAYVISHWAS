import logging

logger = logging.getLogger(__name__)

class SafetyGatekeeper:
    """
    AGENT 8: The final safety layer before execution.
    Combines policy engine results, risk levels, and idempotency states to ALLOW, BLOCK, or ESCALATE.
    """
    def __init__(self, db_session=None):
        self.db = db_session

    def validate_action(self, event_data: dict, decision: dict, policy_result: dict, context: dict) -> str:
        """
        Returns "ALLOW", "BLOCK", or "ESCALATE"
        """
        payment_id = event_data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
        action = decision.get("selected_action")
        
        logger.info(f"SafetyGatekeeper validating {action} for {payment_id}")
        
        if not policy_result.get("allowed"):
            if policy_result.get("requires_human"):
                logger.info("SafetyGatekeeper: ESCALATE (Human required by policy)")
                return "ESCALATE"
            else:
                logger.info("SafetyGatekeeper: BLOCK (Blocked by policy)")
                return "BLOCK"
                
        # Check idempotency/retry count from context
        attempts = context.get("velocity", {}).get("retry_count", 0)
        if attempts >= 2: # Should be dynamic based on policy, simplified here
            logger.info("SafetyGatekeeper: BLOCK (Max retries exceeded)")
            return "BLOCK"
            
        # If everything passes
        logger.info("SafetyGatekeeper: ALLOW")
        return "ALLOW"
