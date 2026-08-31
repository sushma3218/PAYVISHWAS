from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
import uuid
import time
import json
from backend.database.database import get_db
from backend.api.webhooks import razorpay_webhook

class MockRequest:
    def __init__(self, body_bytes):
        self._body = body_bytes
    
    async def body(self):
        return self._body

router = APIRouter(prefix="/api/demo", tags=["Demo"])

@router.post("/simulate")
async def simulate_scenario(scenario: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Simulates webhook events for the 6 Demo Scenarios.
    """
    event_id = f"evt_{uuid.uuid4().hex[:10]}"
    payment_id = f"pay_{uuid.uuid4().hex[:10]}"
    
    # Base payload
    payload = {
        "entity": "event",
        "account_id": "acc_123456",
        "event": "payment.failed",
        "contains": ["payment"],
        "payload": {
            "payment": {
                "entity": {
                    "id": payment_id,
                    "entity": "payment",
                    "amount": 1850000, # Default: 18,500 INR in paise
                    "currency": "INR",
                    "status": "failed",
                    "method": "upi",
                    "error_code": "BAD_REQUEST_ERROR",
                    "error_description": "Payment failed due to bank timeout",
                    "error_reason": "payment_failed"
                }
            }
        },
        "created_at": int(time.time()),
        "id": event_id
    }

    if scenario == "low_risk":
        # Scenario 1: Killer Demo - Low Risk
        # Uses default payload (18,500 INR, temporary timeout)
        pass
        
    elif scenario == "high_risk":
        # Scenario 2: High-Risk Financial Guardrails
        # High value transaction to trigger ESCALATE / BLOCK
        payload["payload"]["payment"]["entity"]["amount"] = 25000000 # 2,50,000 INR
        payload["payload"]["payment"]["entity"]["error_code"] = "RISK_ERROR"
        payload["payload"]["payment"]["entity"]["error_description"] = "Suspicious transaction patterns detected"
        
    elif scenario == "idempotency":
        # Scenario 4: Idempotency
        # We send the exact same event ID twice
        event_id = "evt_idempotency_test_123"
        payload["id"] = event_id
        
    elif scenario == "unknown_state":
        # Scenario 6: Unknown State Verification
        # We inject "unknown" into the payment ID to trigger the VerificationAgent simulation
        payment_id = f"pay_unknown_{uuid.uuid4().hex[:6]}"
        payload["payload"]["payment"]["entity"]["id"] = payment_id
        
    else:
        raise HTTPException(status_code=400, detail="Invalid scenario")

    # Construct a mock request and route it through the existing webhook handler
    mock_request = MockRequest(json.dumps(payload).encode("utf-8"))
    
    response = await razorpay_webhook(mock_request, background_tasks, db)
    
    # If it's the idempotency scenario, we immediately trigger it a second time
    if scenario == "idempotency":
        mock_request_2 = MockRequest(json.dumps(payload).encode("utf-8"))
        response_2 = await razorpay_webhook(mock_request_2, background_tasks, db)
        return {
            "scenario": scenario,
            "first_call": response,
            "second_call": response_2
        }

    return {"scenario": scenario, "response": response, "event_id": event_id, "payment_id": payment_id}
