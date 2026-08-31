import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.database import Base, engine, SessionLocal
from backend.simulation.razorpay import generate_mock_webhook

# Recreate tables for testing
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_webhook_idempotency():
    # 1. Generate a mock failed payment webhook
    payload = generate_mock_webhook(
        event_type="payment.failed",
        amount_inr=18500,
        failure_reason="gateway_timeout"
    )
    
    # 2. Send it the first time (should succeed and create record)
    response1 = client.post("/api/webhooks/razorpay", json=payload)
    assert response1.status_code == 200
    assert response1.json() == {"status": "ok", "message": "Webhook processed"}
    
    # 3. Send the EXACT same payload a second time (should be caught by idempotency)
    response2 = client.post("/api/webhooks/razorpay", json=payload)
    assert response2.status_code == 200
    assert response2.json() == {"status": "ok", "message": "Duplicate event ignored (idempotent response)"}

    # Verify only one event was created in DB
    db = SessionLocal()
    from backend.database.models import PaymentEvent
    events = db.query(PaymentEvent).filter(PaymentEvent.idempotency_key == payload["id"]).all()
    assert len(events) == 1
    db.close()
