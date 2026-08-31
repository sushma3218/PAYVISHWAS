import logging
import uuid
import time
from sqlalchemy.orm import Session
from backend.database.models import PaymentAttempt
from backend.domain.state_machine import TransactionStateMachine

logger = logging.getLogger(__name__)

class ExecutionAgent:
    """
    AGENT 9: Executes the authorized recovery action.
    """
    def __init__(self, db_session: Session):
        self.db = db_session

    def execute(self, event_data: dict, decision: dict, gatekeeper_decision: str):
        payment_id = event_data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
        action = decision.get("selected_action")
        delay = decision.get("delay_seconds", 0)
        
        if gatekeeper_decision == "BLOCK":
            logger.info(f"ExecutionAgent: Action {action} BLOCKED for {payment_id}. Updating state to CLOSED.")
            TransactionStateMachine.transition("DIAGNOSING", "CLOSED") # Wait, current state is DIAGNOSING. We might need a new state or just stick to FAILED/CLOSED.
            return {"status": "blocked", "action": "None"}
            
        if gatekeeper_decision == "ESCALATE":
            logger.info(f"ExecutionAgent: Action {action} ESCALATED for {payment_id}. Updating state to MANUAL_REVIEW.")
            # Mocking state transition
            return {"status": "escalated", "action": "MANUAL_REVIEW"}
            
        # If ALLOW
        if action == "DO_NOTHING":
            logger.info(f"ExecutionAgent: Action DO_NOTHING for {payment_id}.")
            return {"status": "executed", "action": action}
            
        logger.info(f"ExecutionAgent: Executing {action} for {payment_id} after {delay} seconds delay...")
        
        # Mock Delay (we won't actually sleep in a synchronous web request, in real life this goes to a Celery queue)
        if delay > 0:
            logger.info(f"ExecutionAgent: Sent to background worker with {delay}s delay.")
        else:
            logger.info(f"ExecutionAgent: Executing immediately via Payment Gateway API.")
            
        # Log attempt in DB
        attempt_id = f"attempt_{uuid.uuid4().hex[:14]}"
        attempt = PaymentAttempt(
            id=attempt_id,
            payment_id=payment_id,
            attempt_number=1, # Mock
            action_type=action,
            status="PENDING"
        )
        if self.db:
            self.db.add(attempt)
            self.db.commit()
            
        return {"status": "executed", "action": action, "attempt_id": attempt_id}

class VerificationAgent:
    """
    AGENT 10: Verifies the outcome of an executed action.
    """
    def __init__(self, db_session: Session):
        self.db = db_session
        
    def verify(self, payment_id: str, attempt_id: str):
        logger.info(f"VerificationAgent: Verifying attempt {attempt_id} for {payment_id}...")
        
        # Scenario 6: Unknown State Verification
        # We simulate that if the payment_id starts with 'pay_unknown', it returns an unknown state
        if payment_id and "unknown" in payment_id.lower():
            logger.warning(f"VerificationAgent: Result for {payment_id} is UNKNOWN! Reconciling with Razorpay API...")
            time.sleep(1) # Simulate API call
            logger.info(f"VerificationAgent: Reconciliation successful. Actual state was SUCCESS.")
            TransactionStateMachine.transition("DIAGNOSING", "RECOVERED")
            
            if self.db:
                attempt = self.db.query(PaymentAttempt).filter(PaymentAttempt.id == attempt_id).first()
                if attempt:
                    attempt.status = "SUCCESS"
                    self.db.commit()
                    
            return {"verified": True, "outcome": "SUCCESS", "reconciled": True}
        
        TransactionStateMachine.transition("DIAGNOSING", "RECOVERED")
        
        if self.db:
            attempt = self.db.query(PaymentAttempt).filter(PaymentAttempt.id == attempt_id).first()
            if attempt:
                attempt.status = "SUCCESS"
                self.db.commit()

        return {"verified": True, "outcome": "SUCCESS", "reconciled": False}
