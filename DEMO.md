# PAYVISHWAS Demo Guide

This document outlines the specific scenarios we will demonstrate to the judges for the Razorpay Buildathon, focusing on the **Track 02 Risk Manager** requirements.

## The Story Arc
1. **Problem**: A specific financial loss/risk situation (Fraud/Chargeback).
2. **Detect**: PAYVISHWAS identifies the risk.
3. **Understand**: Agents build transaction context.
4. **Predict**: Risk model predicts the outcome (Chargeback Risk).
5. **Decide**: Agents generate and rank responses.
6. **Protect**: Deterministic policy + Safety Gatekeeper.
7. **Act**: Authorized response.
8. **Verify**: Actual outcome is confirmed.
9. **Learn**: Prediction is compared with reality.
10. **Measure**: Show the Held-Out Data Metrics (Precision/Recall).

---

## Scenario 1: The Killer Demo — Low-Risk Recovery
- **Setup**: `₹18,500` payment, returning customer, temporary bank timeout.
- **Flow**:
  - Event Guardian accepts.
  - Diagnosis Agent identifies temporary failure.
  - Context Agent sees good history.
  - **Risk Agent**: Evaluates as `LOW RISK`.
  - Recovery & Decision Agents: Recommend "Delayed Retry".
  - Policy Engine & Safety Gatekeeper: `APPROVED`.
  - Execution Agent: Succeeds.
- **Result**: "Payment successfully recovered."

## Scenario 2: High-Risk Financial Guardrails
- **Setup**: `₹2,50,000` payment, suspicious transaction.
- **Flow**:
  - **Risk Agent**: Evaluates as `HIGH RISK` (Predicted Chargeback).
  - Decision Agent: Recommends recovery.
  - Policy Engine & Safety Gatekeeper: **BLOCKED / ESCALATED**.
  - Reason: "Transaction exceeds autonomous action threshold / High Risk."
- **Result**: Proves AI autonomy has deterministic financial guardrails.

## Scenario 3: Track 02 Risk Evaluation Center
- **Setup**: Navigate to the **Risk Center** tab in the dashboard.
- **Flow**:
  - Click **"Run Evaluation"**.
  - The backend runs the ML model against the 1,500 held-out test set.
  - Display Precision, Recall, F1 Score, and Confusion Matrix.
  - Show the False Positive / False Negative Financial Cost analysis.
- **Result**: Proves this is a real, measurable model, not just a prompt wrapper.

## Scenario 4: Idempotency (Duplicate Event)
- **Setup**: Send the exact same `payment.failed` webhook twice.
- **Flow**:
  - First event: `ACCEPTED`.
  - Second event: `DUPLICATE EVENT DETECTED`.
- **Result**: Proves the system will not double-retry and lose money.

## Scenario 5: Proactive Payment Health
- **Setup**: Simulate a rapid spike in UPI timeouts for "Bank X".
- **Flow**:
  - The Statistical ML anomaly detector flags the 340% increase.
  - A **Proactive Alert** appears on the dashboard warning of high predicted failure risk.
- **Result**: Proves the system doesn't just react, it predicts.

## Scenario 6: Unknown State Verification
- **Setup**: Simulate a network timeout *during* the execution of a retry.
- **Flow**:
  - Action result is `UNKNOWN`.
  - Verification Agent intervenes, blocks blind retries.
  - Queries actual Razorpay state to reconcile.
- **Result**: Major financial reliability demonstration.
