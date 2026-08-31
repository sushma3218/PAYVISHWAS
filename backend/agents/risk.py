import logging
from sqlalchemy.orm import Session
from backend.ml_models.risk_model import risk_model_instance
from backend.database.models import RiskAssessment
import uuid

logger = logging.getLogger(__name__)

class RiskAgent:
    """
    Evaluates the context and diagnosis to assign a measurable Risk Score to the event.
    """
    def __init__(self, db: Session):
        self.db = db
        self.model = risk_model_instance

    def assess_risk(self, event_data: dict, diagnosis: dict, context: dict) -> dict:
        """
        Uses the ML model to calculate Fraud/Chargeback probability.
        """
        payment_id = event_data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
        
        amount = context.get("transaction", {}).get("amount", 0)
        velocity = context.get("velocity", {}).get("transactions_last_hour", 1)
        retry_count = 1  # Simplified for hackathon
        success_rate = context.get("customer_history", {}).get("success_rate", 0.5)

        # 1. Run inference through Scikit-Learn Model
        prediction = self.model.predict(
            amount=amount,
            velocity=velocity,
            retry_count=retry_count,
            success_rate=success_rate
        )
        
        logger.info(f"RiskAgent assessed payment {payment_id} as {prediction['risk_level']} Risk ({prediction['risk_score']:.2f})")
        
        import json
        # 2. Save Assessment to Database for Audit Trail
        assessment = RiskAssessment(
            id=f"risk_{uuid.uuid4().hex[:14]}",
            payment_id=payment_id,
            risk_score=prediction["risk_score"],
            risk_level=prediction["risk_level"],
            factors_considered=json.dumps({
                "amount": amount,
                "velocity": velocity,
                "success_rate": success_rate,
                "diagnosis_root_cause": diagnosis.get("root_cause")
            })
        )
        
        try:
            self.db.add(assessment)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            logger.error(f"Failed to save Risk Assessment: {str(e)}")
            
        return prediction
