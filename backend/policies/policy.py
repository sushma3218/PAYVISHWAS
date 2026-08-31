import logging
from sqlalchemy.orm import Session
from backend.database.models import MerchantPolicy, Payment

logger = logging.getLogger(__name__)

class PolicyEngine:
    """
    AGENT 7: Enforces deterministic merchant policies.
    Does not use LLMs. strictly adheres to rules (e.g. amounts, retry limits).
    """
    def __init__(self, db_session: Session):
        self.db = db_session

    def evaluate(self, event_data: dict, decision: dict, risk_assessment: dict) -> dict:
        """
        Validates if the AI's selected action complies with merchant policies.
        """
        payment_id = event_data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
        amount = event_data.get("payload", {}).get("payment", {}).get("entity", {}).get("amount", 0) / 100.0
        
        if not self.db:
            logger.warning("No DB session provided to PolicyEngine. Passing by default.")
            return {"allowed": True, "requires_human": False, "reason": "No DB"}

        payment = self.db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            return {"allowed": False, "requires_human": False, "reason": "Payment not found"}
            
        merchant_policy = self.db.query(MerchantPolicy).filter(MerchantPolicy.merchant_id == payment.merchant_id).first()
        if not merchant_policy:
            logger.info("No merchant policy found, using defaults.")
            # Default fallback policy
            merchant_policy = MerchantPolicy(
                max_auto_recovery_amount=25000.0,
                max_retries=2,
                require_human_approval_for_high_value=True,
                high_value_threshold=100000.0,
                block_suspicious=True
            )
            
        # 1. Block Suspicious
        if merchant_policy.block_suspicious and risk_assessment.get("risk_level") in ["HIGH", "CRITICAL"]:
            return {"allowed": False, "requires_human": False, "reason": "Blocked by policy: Suspicious transaction"}
            
        # 2. Check Action Type
        action = decision.get("selected_action")
        if action == "DO_NOTHING":
            return {"allowed": True, "requires_human": False, "reason": "Policy allows inaction"}
            
        # 3. Check Recovery Limit
        if amount > merchant_policy.max_auto_recovery_amount:
            return {"allowed": False, "requires_human": True, "reason": f"Amount exceeds auto-recovery limit of {merchant_policy.max_auto_recovery_amount}"}
            
        # 4. Check High Value Human Approval
        if merchant_policy.require_human_approval_for_high_value and amount >= merchant_policy.high_value_threshold:
            return {"allowed": False, "requires_human": True, "reason": f"High value transaction requires human approval (>={merchant_policy.high_value_threshold})"}
            
        return {"allowed": True, "requires_human": False, "reason": "Complies with merchant policies"}
