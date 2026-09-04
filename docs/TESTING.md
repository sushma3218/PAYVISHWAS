# PAYVISHWAS Testing Strategy

Testing is mandatory to ensure financial safety. We will implement testing across several layers of the application.

## 1. Unit Tests (FastAPI / Pytest)
- **Deterministic Policy Engine**: Extensive unit testing to verify that policies (e.g., limits, blocklists) work perfectly in isolation.
- **Agent Contracts**: Verify that the input/output schemas for all agents (Event Guardian, Context Agent, etc.) remain valid.
- **State Machine Transitions**: Ensure invalid state transitions (e.g., `FAILED` -> `AUTHORIZED` directly) throw exceptions.

## 2. Integration Tests
- **Database & Cache**: Verify that idempotency checks in Redis and record keeping in PostgreSQL work as expected.
- **Agent Orchestration Flow**: End-to-end tests starting from a simulated webhook, moving through the agents, and terminating at the execution layer (simulated).

## 3. Financial Safety & Security Tests
- **Duplicate Webhook Test**: Send the exact same payload twice and assert that `Recovery Strategy` is generated only once.
- **Unauthorized Action Test**: Force an LLM (using a mock provider) to recommend a `₹5,00,000` recovery, and assert that the **Safety Gatekeeper** blocks it.
- **Prompt Injection**: Feed malicious payload text and ensure JSON parsing and PII masking remain intact.

## 4. Track 02 Machine Learning Evaluation
Testing the ML Risk Model is done via the **Held-Out Test Set**.
- The testing pipeline splits the dataset (e.g., 70% Train, 15% Validation, 15% Held-Out).
- Tests must assert that the model's Precision, Recall, and F1 Score do not drop below a predefined baseline.
- `test_model_evaluation_pipeline.py` will run during CI to prevent model regression.

## 5. UI Tests (Jest / React Testing Library)
- Assert that the **Risk Evaluation Center** correctly renders the confusion matrix and metrics API responses.
- Assert that the Timeline accurately reflects the backend states.

## 6. Unknown State Recovery
- **Timeout Test**: Simulate a network timeout during the Razorpay API call. Assert that the system enters the `UNKNOWN` or `REQUIRES_RECONCILIATION` state rather than blindly retrying.
