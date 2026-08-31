import json
from sqlalchemy.orm import Session
from backend.database.models import AuditLog

def log_audit_event(db: Session, actor: str, action: str, resource_id: str, details: dict):
    """
    Creates an immutable audit log entry.
    """
    log_entry = AuditLog(
        actor=actor,
        action=action,
        resource_id=resource_id,
        details=json.dumps(details)
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
