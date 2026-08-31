import uuid
import time

def generate_mock_webhook(event_type: str, amount_inr: float, method: str = "upi", failure_reason: str = None) -> dict:
    """
    Generates a mock Razorpay webhook payload for simulation purposes.
    """
    event_id = f"event_{uuid.uuid4().hex[:16]}"
    payment_id = f"pay_{uuid.uuid4().hex[:14]}"
    
    payload = {
        "entity": "event",
        "account_id": "acc_1234567890",
        "event": event_type,
        "contains": ["payment"],
        "payload": {
            "payment": {
                "entity": {
                    "id": payment_id,
                    "entity": "payment",
                    "amount": int(amount_inr * 100), # Razorpay uses paise
                    "currency": "INR",
                    "status": "failed" if event_type == "payment.failed" else "captured",
                    "method": method,
                    "amount_refunded": 0,
                    "refund_status": None,
                    "captured": event_type == "payment.captured",
                    "description": "Test Transaction",
                    "error_code": "BAD_REQUEST_ERROR" if failure_reason else None,
                    "error_description": failure_reason,
                    "error_source": "bank" if failure_reason else None,
                    "error_step": "payment_authentication" if failure_reason else None,
                    "error_reason": "payment_failed" if failure_reason else None,
                    "created_at": int(time.time())
                }
            }
        },
        "created_at": int(time.time()),
        "id": event_id # This acts as our idempotency key
    }
    
    return payload
