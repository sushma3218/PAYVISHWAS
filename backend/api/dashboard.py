from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database.database import get_db
from backend.database.models import Payment, PaymentAttempt, RiskAssessment
from backend.ml_models.risk_model import risk_model_instance

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    # Total Recovered
    total_recovered = db.query(func.sum(Payment.amount)).filter(Payment.status == "RECOVERED").scalar() or 0.0

    # Active Risks
    active_risks = db.query(RiskAssessment).filter(RiskAssessment.risk_level.in_(["HIGH", "CRITICAL"])).count()

    # Total AI Interventions
    interventions = db.query(PaymentAttempt).count()

    # Total Volume Processing
    total_volume = db.query(func.sum(Payment.amount)).scalar() or 0.0

    return {
        "total_recovered": total_recovered,
        "active_risks": active_risks,
        "ai_interventions": interventions,
        "total_volume": total_volume
    }

@router.get("/interventions")
def get_recent_interventions(limit: int = 5, db: Session = Depends(get_db)):
    attempts = db.query(PaymentAttempt).order_by(PaymentAttempt.timestamp.desc()).limit(limit).all()
    
    results = []
    for a in attempts:
        payment = db.query(Payment).filter(Payment.id == a.payment_id).first()
        amount = payment.amount if payment else 0
        
        # Determine risk
        risk = db.query(RiskAssessment).filter(RiskAssessment.payment_id == a.payment_id).first()
        risk_level = risk.risk_level if risk else "UNKNOWN"
        status_display = "High Risk" if risk_level in ["HIGH", "CRITICAL"] else a.status
        
        results.append({
            "id": a.payment_id,
            "action": a.action_type,
            "amount": f"₹{amount:,.0f}",
            "status": status_display,
            "raw_status": a.status,
            "time": a.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        })
    return results

@router.get("/metrics")
def get_risk_metrics():
    metrics = risk_model_instance.train_and_evaluate()
    return metrics

@router.get("/chart")
def get_chart_data(db: Session = Depends(get_db)):
    # Simplified mock chart data based on real records for the hackathon
    # In a real app we'd group by date and sum amounts
    recovered = db.query(func.sum(Payment.amount)).filter(Payment.status == "RECOVERED").scalar() or 0.0
    failed = db.query(func.sum(Payment.amount)).filter(Payment.status == "FAILED").scalar() or 0.0
    
    # Return simulated trend over last 7 days + actual today
    return [
        {"name": "Day 1", "recovered": 4000, "failed": 2400},
        {"name": "Day 2", "recovered": 3000, "failed": 1398},
        {"name": "Day 3", "recovered": 2000, "failed": 9800},
        {"name": "Day 4", "recovered": 2780, "failed": 3908},
        {"name": "Day 5", "recovered": 1890, "failed": 4800},
        {"name": "Day 6", "recovered": 2390, "failed": 3800},
        {"name": "Today", "recovered": recovered, "failed": failed},
    ]
