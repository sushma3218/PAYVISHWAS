import pytest
from backend.ml_models.risk_model import Track02RiskModel
from backend.agents.context import ContextAgent
from backend.database.database import SessionLocal, Base, engine
from backend.simulation.razorpay import generate_mock_webhook

# Setup DB for Context testing
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def test_track02_risk_model_training():
    model = Track02RiskModel()
    metrics = model.train_and_evaluate()
    
    assert "precision" in metrics
    assert "recall" in metrics
    assert "f1_score" in metrics
    
    # Prove the model is learning something better than random guessing
    assert metrics["precision"] > 0.6
    assert metrics["recall"] > 0.5

def test_track02_risk_model_prediction():
    model = Track02RiskModel()
    
    # High risk transaction: huge amount, fast velocity, low success rate
    high_risk_prediction = model.predict(amount=100000.0, velocity=5, retry_count=2, success_rate=0.1)
    
    # Low risk transaction: small amount, slow velocity, high success rate
    low_risk_prediction = model.predict(amount=500.0, velocity=1, retry_count=0, success_rate=0.99)
    
    assert high_risk_prediction["risk_level"] in ["HIGH", "CRITICAL"]
    assert low_risk_prediction["risk_level"] == "LOW"
    assert high_risk_prediction["risk_score"] > low_risk_prediction["risk_score"]

def test_context_agent_pii_masking():
    db = SessionLocal()
    agent = ContextAgent(db)
    
    payload = generate_mock_webhook("payment.failed", 1500.0)
    context = agent.build_context(payload)
    
    assert context["pii_masked"] is True
    # Ensure raw PII keys don't exist in the output dictionary
    assert "email" not in context
    assert "phone" not in context
    
    db.close()
