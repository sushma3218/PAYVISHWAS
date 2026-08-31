import pytest
from backend.domain.state_machine import TransactionStateMachine, TransactionState, InvalidStateTransitionError

def test_valid_transitions():
    assert TransactionStateMachine.transition("CREATED", "INITIATED") == "INITIATED"
    assert TransactionStateMachine.transition("FAILED", "DIAGNOSING") == "DIAGNOSING"
    assert TransactionStateMachine.transition("DIAGNOSING", "RECOVERY_PLANNED") == "RECOVERY_PLANNED"

def test_invalid_transitions():
    with pytest.raises(InvalidStateTransitionError):
        # Cannot jump from CREATED straight to CAPTURED
        TransactionStateMachine.transition("CREATED", "CAPTURED")
    
    with pytest.raises(InvalidStateTransitionError):
        # FAILED cannot go back to AUTHORIZED
        TransactionStateMachine.transition("FAILED", "AUTHORIZED")

def test_invalid_state_string():
    with pytest.raises(InvalidStateTransitionError):
        TransactionStateMachine.transition("NOT_A_REAL_STATE", "FAILED")
