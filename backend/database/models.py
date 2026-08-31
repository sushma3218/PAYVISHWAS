from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.database.database import Base

class Merchant(Base):
    __tablename__ = "merchants"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    api_key_hash = Column(String)
    
    policies = relationship("MerchantPolicy", back_populates="merchant", uselist=False)
    payments = relationship("Payment", back_populates="merchant")

class MerchantPolicy(Base):
    __tablename__ = "merchant_policies"
    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(String, ForeignKey("merchants.id"))
    max_auto_recovery_amount = Column(Float, default=25000.0)
    max_retries = Column(Integer, default=2)
    require_human_approval_for_high_value = Column(Boolean, default=True)
    high_value_threshold = Column(Float, default=100000.0)
    block_suspicious = Column(Boolean, default=True)
    
    merchant = relationship("Merchant", back_populates="policies")

class Customer(Base):
    __tablename__ = "customers"
    id = Column(String, primary_key=True, index=True)
    email_hash = Column(String)
    phone_hash = Column(String)
    total_successful_payments = Column(Integer, default=0)
    total_failed_payments = Column(Integer, default=0)

    payments = relationship("Payment", back_populates="customer")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(String, primary_key=True, index=True)
    merchant_id = Column(String, ForeignKey("merchants.id"))
    customer_id = Column(String, ForeignKey("customers.id"))
    amount = Column(Float)
    currency = Column(String, default="INR")
    method = Column(String) # UPI, CARD, etc.
    status = Column(String) # CREATED, FAILED, RECOVERED, etc.
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    merchant = relationship("Merchant", back_populates="payments")
    customer = relationship("Customer", back_populates="payments")
    attempts = relationship("PaymentAttempt", back_populates="payment")
    events = relationship("PaymentEvent", back_populates="payment")
    risk_assessment = relationship("RiskAssessment", back_populates="payment", uselist=False)

class PaymentEvent(Base):
    __tablename__ = "payment_events"
    id = Column(String, primary_key=True, index=True)
    payment_id = Column(String, ForeignKey("payments.id"))
    event_type = Column(String) # payment.failed, etc.
    payload = Column(String) # JSON string representation
    idempotency_key = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    payment = relationship("Payment", back_populates="events")

class PaymentAttempt(Base):
    __tablename__ = "payment_attempts"
    id = Column(String, primary_key=True, index=True)
    payment_id = Column(String, ForeignKey("payments.id"))
    attempt_number = Column(Integer)
    action_type = Column(String) # RETRY_IMMEDIATE, PAYMENT_LINK, etc.
    status = Column(String) # SUCCESS, FAILED, UNKNOWN
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    payment = relationship("Payment", back_populates="attempts")

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    id = Column(String, primary_key=True, index=True)
    payment_id = Column(String, ForeignKey("payments.id"))
    risk_score = Column(Float) # 0.0 to 1.0
    risk_level = Column(String) # LOW, MEDIUM, HIGH, CRITICAL
    predicted_outcome = Column(String) # SAFE, CHARGEBACK_RISK
    confidence = Column(Float)
    factors_considered = Column(String) # JSON string
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    payment = relationship("Payment", back_populates="risk_assessment")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    actor = Column(String) # AGENT, USER, SYSTEM
    action = Column(String)
    resource_id = Column(String)
    details = Column(String) # JSON string
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
