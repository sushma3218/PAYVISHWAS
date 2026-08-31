from fastapi import APIRouter, Depends, Request, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from backend.database.database import get_db
from backend.database.models import PaymentEvent, Payment
from backend.agents.orchestrator import SwarmOrchestrator
import json
import logging

router = APIRouter(prefix="/api/webhooks", tags=["Webhooks"])
logger = logging.getLogger(__name__)

@router.post("/razorpay")
async def razorpay_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Receives simulated (or real) Razorpay webhooks.
    Enforces idempotency using the database's unique constraint on idempotency_key.
    """
    try:
        payload_bytes = await request.body()
        payload = json.loads(payload_bytes)
        
        # In a real integration, we'd verify x-razorpay-signature here.
        # For the demo, we assume the payload contains an 'id' which we use as the idempotency key.
        
        event_id = payload.get("id")
        event_type = payload.get("event")
        payment_data = payload.get("payload", {}).get("payment", {}).get("entity", {})
        
        if not event_id or not event_type:
            raise HTTPException(status_code=400, detail="Invalid webhook payload")

        # 1. Idempotency Check & Event Storage
        # We attempt to insert the event. If the event_id (idempotency_key) already exists,
        # SQLAlchemy will throw an IntegrityError, which we catch and safely ignore.
        
        new_event = PaymentEvent(
            id=f"evt_{event_id}",
            payment_id=payment_data.get("id"),
            event_type=event_type,
            payload=json.dumps(payload),
            idempotency_key=event_id
        )
        
        db.add(new_event)
        
        # Ensure the parent payment exists for foreign key constraints in a real system
        # For the hackathon, we might lazily create the Payment record if it doesn't exist
        existing_payment = db.query(Payment).filter(Payment.id == payment_data.get("id")).first()
        if not existing_payment and payment_data.get("id"):
            new_payment = Payment(
                id=payment_data.get("id"),
                amount=payment_data.get("amount", 0) / 100.0, # Razorpay sends in paise
                currency=payment_data.get("currency", "INR"),
                method=payment_data.get("method", "unknown"),
                status="FAILED" if event_type == "payment.failed" else "UNKNOWN"
            )
            db.add(new_payment)

        db.commit()
        
        # 2. Trigger the Event Guardian / Swarm Orchestrator asynchronously
        orchestrator = SwarmOrchestrator()
        # For simplicity in hackathon, we could execute it synchronously if DB is needed across thread,
        # but since we pass db to background task, we must be careful with session scopes. 
        # FastApi background tasks run in same process. 
        background_tasks.add_task(orchestrator.process_event, payload, db)
        
        logger.info(f"Webhook {event_type} successfully accepted and stored.")
        
        return {"status": "ok", "message": "Webhook processed"}
        
    except IntegrityError:
        # This is the killer feature: if the event already exists, rollback and return 200 OK.
        db.rollback()
        logger.warning(f"DUPLICATE EVENT DETECTED: {event_id}. Ignored.")
        return {"status": "ok", "message": "Duplicate event ignored (idempotent response)"}
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
