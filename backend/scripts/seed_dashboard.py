import os
import sys
import uuid
from datetime import datetime, timedelta, timezone
import random
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.database.database import SessionLocal, engine
from backend.database.models import Base, Payment, PaymentEvent, RiskAssessment, PaymentAttempt, AuditLog, Merchant, Customer

def seed_db():
    db = SessionLocal()
    
    print("Clearing existing data...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    print("Seeding database with mock data...")
    
    merchant = Merchant(id="merch_1", name="Razorpay Test Store")
    db.add(merchant)
    
    customer = Customer(id="cust_1", total_successful_payments=10, total_failed_payments=2)
    db.add(customer)
    db.flush()

    now = datetime.now(timezone.utc)
    statuses = ["RECOVERED", "RECOVERED", "FAILED"]
    methods = ["upi", "card", "netbanking"]
    
    for i in range(50):
        days_ago = random.randint(0, 6)
        created_at = now - timedelta(days=days_ago, hours=random.randint(1, 23))
        status = random.choice(statuses)
        amount = random.choice([500.0, 1500.0, 5000.0, 18500.0, 25000.0, 50000.0])
        
        payment = Payment(
            id=f"pay_seed_{uuid.uuid4().hex[:8]}",
            merchant_id=merchant.id,
            customer_id=customer.id,
            amount=amount,
            currency="INR",
            status=status,
            method=random.choice(methods),
            created_at=created_at,
            updated_at=created_at + timedelta(minutes=5)
        )
        db.add(payment)
        db.flush()
        
        payload_data = {
            "payment": {
                "entity": {
                    "error_code": "BAD_REQUEST_ERROR" if status == "FAILED" else "TIMEOUT_ERROR",
                    "error_description": "Simulated error",
                    "error_reason": "timeout"
                }
            }
        }
        
        event = PaymentEvent(
            id=f"evt_seed_{uuid.uuid4().hex[:8]}",
            payment_id=payment.id,
            event_type="payment.failed",
            payload=json.dumps(payload_data),
            timestamp=created_at
        )
        db.add(event)
        
        risk_level = "LOW" if amount < 10000 else "HIGH" if amount > 20000 else "MEDIUM"
        risk_score = random.randint(5, 30) if risk_level == "LOW" else random.randint(70, 95)
        risk = RiskAssessment(
            id=f"risk_{uuid.uuid4().hex[:8]}",
            payment_id=payment.id,
            risk_score=risk_score,
            risk_level=risk_level,
            factors_considered=json.dumps({"velocity": random.random()}),
            timestamp=created_at + timedelta(seconds=2)
        )
        db.add(risk)
        
        attempt_status = "SUCCESS" if status == "RECOVERED" else "FAILED"
        attempt = PaymentAttempt(
            id=f"att_{uuid.uuid4().hex[:8]}",
            payment_id=payment.id,
            action_type="DELAYED_RETRY" if risk_level == "LOW" else "ESCALATE",
            status=attempt_status,
            timestamp=created_at + timedelta(seconds=5)
        )
        db.add(attempt)
    
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
