# PAYVISHWAS Security Architecture

Financial security and deterministic guardrails are the foundational principles of PAYVISHWAS. This document outlines the security posture and the **Safety Gatekeeper** architecture.

## AI Security & The Safety Gatekeeper

The most critical rule in PAYVISHWAS is: **Never allow an LLM to directly authorize a financial action.**

### The Execution Flow
1. **LLM Recommendation**: The AI Decision Agent recommends an action (e.g., "Delayed Retry after 90s").
2. **Deterministic Policy Engine**: The engine evaluates the recommendation against hardcoded merchant policies (e.g., "Max automatic recovery = ₹25,000").
3. **Safety Gatekeeper**: Verifies that the Policy Engine approved the action, checks the Risk Model threshold, and ensures idempotency.
4. **Authorized Tool Execution**: Only if the Gatekeeper returns `ALLOW`, the Execution Agent is granted temporary permission to perform the action.

## Core Security Controls

### 1. Webhook Security
- All incoming webhooks from Razorpay (or the simulator) are verified using cryptographic signatures (`RAZORPAY_WEBHOOK_SECRET`).
- The **Event Guardian** is the only entry point and immediately rejects unsigned or malformed payloads.

### 2. Idempotency
- Every financial action (retry, refund, recovery) requires a unique `idempotency_key`.
- The Execution Agent checks the database/Redis. If an action with that key has already been processed, it returns the cached result instead of duplicating the action.

### 3. PII Minimization
- The **Context Agent** is responsible for masking Personally Identifiable Information (PII) before sending context to any external LLM provider.
- Example: Card numbers, exact email addresses, and phone numbers are tokenized or masked (e.g., `user_***@gmail.com`).

### 4. Prompt Injection Protection
- External text (e.g., customer notes, external error messages) is treated as untrusted.
- System prompts enforce strict JSON output formatting.
- The Deterministic Policy Engine acts as a final fail-safe against malicious prompts tricking the LLM into recommending unauthorized actions.

### 5. Role-Based Access Control (RBAC) & Agent Identity
- Agents operate with the Principle of Least Privilege.
- The Diagnosis Agent cannot execute payments. The Execution Agent cannot alter policies.

### 6. Transaction Limits & Human Approval
- High-value transactions (configured by the merchant) trigger an automatic `ESCALATE` state.
- Suspicious transactions (flagged by the Risk Model as CRITICAL) trigger an automatic `BLOCK` state.

## Secret Management
- Secrets (`RAZORPAY_KEY_SECRET`, `LLM_API_KEY`) are stored in environment variables and are never hardcoded.
- `.env` is included in `.gitignore`.
