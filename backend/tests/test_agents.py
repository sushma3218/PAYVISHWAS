import pytest
from backend.agents.guardian import EventGuardian
from backend.agents.diagnosis import DiagnosisAgent
from backend.simulation.razorpay import generate_mock_webhook

def test_event_guardian_valid_payload():
    guardian = EventGuardian()
    valid_payload = generate_mock_webhook("payment.failed", 1500.0)
    
    result = guardian.validate_event(valid_payload)
    
    assert result["valid"] is True
    assert result["event_type"] == "payment.failed"
    assert "payment_id" in result

def test_event_guardian_invalid_payload():
    guardian = EventGuardian()
    invalid_payload = {"some_random_key": "value"} # Missing event and payload
    
    result = guardian.validate_event(invalid_payload)
    
    assert result["valid"] is False
    assert "Missing event type" in result["reason"]

def test_diagnosis_agent_timeout():
    diagnosis = DiagnosisAgent()
    payload = generate_mock_webhook("payment.failed", 1500.0, failure_reason="timeout during authentication")
    
    result = diagnosis.diagnose(payload)
    
    assert result["failure_type"] == "TEMPORARY"
    assert result["root_cause"] == "BANK_TIMEOUT"
    assert result["confidence"] > 0.90

def test_diagnosis_agent_insufficient_funds():
    diagnosis = DiagnosisAgent()
    payload = generate_mock_webhook("payment.failed", 1500.0, failure_reason="insufficient funds")
    
    result = diagnosis.diagnose(payload)
    
    assert result["failure_type"] == "CUSTOMER_ACTION_REQUIRED"
    assert result["root_cause"] == "INSUFFICIENT_FUNDS"
    
def test_diagnosis_agent_fraud():
    diagnosis = DiagnosisAgent()
    payload = generate_mock_webhook("payment.failed", 1500.0, failure_reason="suspected fraud")
    
    result = diagnosis.diagnose(payload)
    
    assert result["failure_type"] == "SUSPICIOUS"
    assert result["root_cause"] == "RISK_SYSTEM_BLOCKED"
