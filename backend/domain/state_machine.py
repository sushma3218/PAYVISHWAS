from enum import Enum

class TransactionState(str, Enum):
    CREATED = "CREATED"
    INITIATED = "INITIATED"
    PROCESSING = "PROCESSING"
    AUTHORIZED = "AUTHORIZED"
    CAPTURED = "CAPTURED"
    FAILED = "FAILED"
    DIAGNOSING = "DIAGNOSING"
    RECOVERY_PLANNED = "RECOVERY_PLANNED"
    AWAITING_APPROVAL = "AWAITING_APPROVAL"
    RECOVERY_EXECUTING = "RECOVERY_EXECUTING"
    VERIFYING = "VERIFYING"
    RECOVERED = "RECOVERED"
    BLOCKED = "BLOCKED"
    ESCALATED = "ESCALATED"
    UNKNOWN = "UNKNOWN"
    CLOSED = "CLOSED"

class InvalidStateTransitionError(Exception):
    pass

class TransactionStateMachine:
    VALID_TRANSITIONS = {
        TransactionState.CREATED: [TransactionState.INITIATED, TransactionState.FAILED],
        TransactionState.INITIATED: [TransactionState.PROCESSING, TransactionState.FAILED],
        TransactionState.PROCESSING: [TransactionState.AUTHORIZED, TransactionState.FAILED, TransactionState.UNKNOWN],
        TransactionState.AUTHORIZED: [TransactionState.CAPTURED, TransactionState.FAILED],
        TransactionState.CAPTURED: [], # End state for normal flow
        TransactionState.FAILED: [TransactionState.DIAGNOSING, TransactionState.UNKNOWN],
        TransactionState.DIAGNOSING: [TransactionState.RECOVERY_PLANNED, TransactionState.ESCALATED, TransactionState.BLOCKED, TransactionState.CLOSED, TransactionState.RECOVERED],
        TransactionState.RECOVERY_PLANNED: [TransactionState.AWAITING_APPROVAL, TransactionState.RECOVERY_EXECUTING],
        TransactionState.AWAITING_APPROVAL: [TransactionState.RECOVERY_EXECUTING, TransactionState.ESCALATED, TransactionState.BLOCKED],
        TransactionState.RECOVERY_EXECUTING: [TransactionState.VERIFYING, TransactionState.UNKNOWN, TransactionState.FAILED],
        TransactionState.VERIFYING: [TransactionState.RECOVERED, TransactionState.FAILED, TransactionState.ESCALATED],
        TransactionState.RECOVERED: [], # End state for recovery flow
        TransactionState.BLOCKED: [], # End state
        TransactionState.ESCALATED: [TransactionState.RECOVERY_EXECUTING, TransactionState.FAILED, TransactionState.RECOVERED], # Humans can act
        TransactionState.UNKNOWN: [TransactionState.VERIFYING, TransactionState.FAILED, TransactionState.RECOVERED], # Reconciled
        TransactionState.CLOSED: []
    }

    @classmethod
    def transition(cls, current_state: str, new_state: str) -> str:
        try:
            curr_enum = TransactionState(current_state)
            new_enum = TransactionState(new_state)
        except ValueError:
            raise InvalidStateTransitionError(f"Invalid state string provided.")

        allowed = cls.VALID_TRANSITIONS.get(curr_enum, [])
        if new_enum not in allowed:
            raise InvalidStateTransitionError(
                f"Cannot transition from {current_state} to {new_state}."
            )
        return new_enum.value
