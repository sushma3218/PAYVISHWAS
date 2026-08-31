import logging
from sqlalchemy.orm import Session
from backend.database.models import Customer, Merchant, Payment

logger = logging.getLogger(__name__)

class ContextAgent:
    """
    Builds the context profile (Customer History, Merchant Policy) for a transaction.
    Ensures PII is minimized before handing off to the Risk Agent or LLM.
    """
    def __init__(self, db: Session):
        self.db = db

    def build_context(self, event_data: dict) -> dict:
        """
        Gathers contextual data required for risk scoring and decision making.
        """
        payment_entity = event_data.get("payload", {}).get("payment", {}).get("entity", {})
        
        # For the hackathon demo, we extract mock identifiers from the payload if present
        customer_id = payment_entity.get("customer_id")
        merchant_id = event_data.get("account_id")
        amount = payment_entity.get("amount", 0) / 100.0

        # Gather Customer History
        customer_history = {
            "total_successful_payments": 0,
            "total_failed_payments": 0,
            "success_rate": 0.0
        }
        
        if customer_id:
            customer = self.db.query(Customer).filter(Customer.id == customer_id).first()
            if customer:
                success = customer.total_successful_payments
                failed = customer.total_failed_payments
                total = success + failed
                customer_history["total_successful_payments"] = success
                customer_history["total_failed_payments"] = failed
                if total > 0:
                    customer_history["success_rate"] = success / total
        
        # Calculate recent velocity for the customer (mocked for demo simplicity, in a real system query `payments` table)
        # Assuming 1 recent transaction if not found
        recent_velocity = 1 

        context = {
            "transaction": {
                "amount": amount,
                "method": payment_entity.get("method"),
                "currency": payment_entity.get("currency")
            },
            "customer_history": customer_history,
            "velocity": {
                "transactions_last_hour": recent_velocity
            },
            # No raw PII like email/phone is included in this context dictionary
            "pii_masked": True
        }
        
        logger.info(f"ContextAgent built context for payment {payment_entity.get('id')}")
        return context
