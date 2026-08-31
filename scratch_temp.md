# 12. AGENT 5 — RECOVERY STRATEGY AGENT

Generate candidate actions.

Possible actions:

1. Retry immediately
2. Retry after delay
3. Recommend alternate payment method
4. Generate payment link
5. Notify customer
6. Request customer action
7. Escalate
8. Do nothing
9. Schedule follow-up

For every strategy calculate:

* recovery probability
* expected revenue
* risk
* customer experience
* latency
* action cost
* confidence

Example:

```text
Strategy: Delayed Retry

Recovery Probability: 81%
Risk: Low
Expected Recovery: ₹14,580
Customer Experience: High
Latency: 90 seconds
Confidence: 91%
```

These numbers must come from the application's simulation/model logic.

Do not invent real-world performance claims.

---

# 13. AGENT 6 — DECISION AGENT

Compare all candidate strategies.

Decision factors:

* recovery probability
* expected revenue
* risk
* customer experience
* merchant policy
* system health
* timing
* confidence
* action cost

Output:

```json
{
  "selected_action": "DELAYED_RETRY",
  "delay_seconds": 90,
  "confidence": 0.91,
  "reason": "...",
  "expected_impact": "...",
  "alternatives_considered": []
}
```

The decision must be explainable.

---

# 14. AGENT 7 — POLICY ENGINE

This MUST be deterministic.

Do not use an LLM for core authorization.

Example policies:

```text
Automatic recovery limit = ₹25,000

Maximum retries = 2

High-risk transaction = human approval

High-value transaction = human approval

Repeated failure = escalation

Suspicious transaction = block

Unknown transaction state = no blind retry
```

Merchant should be able to configure these policies.

---

# 15. AGENT 8 — SAFETY GATEKEEPER

No financial action can bypass this layer.

Validate:

* agent identity
* permissions
* merchant authorization
* transaction state
* idempotency
* amount limit
* action limit
* merchant policy
* risk threshold
* human approval requirement
* duplicate action
* rate limit

Possible outcomes:

```text
ALLOW
BLOCK
ESCALATE
```

Example:

```text
₹8,500 + low risk
→ ALLOW

₹2,50,000 + high value
→ ESCALATE

Suspicious transaction
→ BLOCK
```

---

# 16. EXECUTION AGENT