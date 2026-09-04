# PAYVISHWAS

## Autonomous AI Risk Manager for Intelligent Payment Recovery

### Hackathon Track

**Track 2 — AI Risk Manager**

### Product tagline

**"Trust every payment decision."**

### Core statement

PAYVISHWAS is a production-inspired multi-agent FinTech risk intelligence platform that does not simply detect failed payments.

It understands the context behind a payment failure, diagnoses the root cause, evaluates risk, predicts recovery outcomes, generates possible recovery strategies, selects the safest and most effective action, enforces deterministic financial guardrails, executes only authorized actions, verifies the actual transaction state, clearly communicates the decision, and learns from outcomes.

The core loop is:

**OBSERVE → UNDERSTAND → PREDICT → DECIDE → PROTECT → ACT → VERIFY → LEARN**

---

# 1. YOUR ROLE

Act as a complete senior engineering team:

* Lead Software Architect
* AI/ML Architect
* Multi-Agent Systems Engineer
* FinTech Backend Engineer
* Security Engineer
* Frontend Engineer
* UX Engineer
* Database Architect
* QA Engineer
* DevOps Engineer
* Product Designer

Do not behave like a simple code generator.

Think like a team building a serious financial infrastructure product that must be:

* secure
* reliable
* explainable
* observable
* testable
* scalable
* professional
* demo-ready

Do not create fake functionality merely to make the interface look complete.

If a feature is simulated, clearly label it as a simulation.

---

# 2. PRODUCT IDENTITY

Project name:

**PAYVISHWAS**

Meaning:

**PAY + VISHWAS**

Vishwas represents:

* trust
* confidence
* reliability

The name reflects the central product philosophy:

> When AI is allowed to make financial decisions, intelligence alone is not enough. The system must earn trust through context, security, explainability, authorization, verification and reliable execution.

Do not rename the project.

Do not use PAYSWARM as the visible product name.

The internal architecture may refer to the system as a multi-agent swarm, but the user-facing brand must be:

# PAYVISHWAS

---

# 3. RAZORPAY-INSPIRED PRODUCT PHILOSOPHY

Use Razorpay's publicly visible product philosophy as inspiration:

* developer-first
* payment reliability
* reducing friction
* intelligent automation
* agentic workflows
* financial safety
* merchant control
* transparent decisions
* strong operational UX

Razorpay's public Agent Studio materials describe specialized agents that monitor payments, recover failed payments/subscriptions, manage disputes and automate financial operations. Agent Studio is publicly described as being built using Anthropic's Claude Agent SDK.

Do NOT claim that PAYVISHWAS uses Razorpay's private/internal systems.

Do NOT claim access to Razorpay's internal AI models, proprietary data or internal architecture.

Where public Razorpay information is discussed, distinguish:

PUBLICLY DOCUMENTED RAZORPAY INFORMATION

from:

PAYVISHWAS DESIGN DECISIONS.

PAYVISHWAS is an independent hackathon prototype inspired by publicly observable FinTech and agentic-payment principles.

---

# 4. CORE PROBLEM

A payment failure is not simply:

"Payment failed."

The actual questions are:

1. Why did it fail?
2. Is the failure temporary or permanent?
3. Is the transaction safe to recover?
4. What is the customer's history?
5. What is the merchant context?
6. Is the payment method currently healthy?
7. Is the bank/gateway experiencing abnormal behavior?
8. What recovery actions are possible?
9. Which action has the highest expected recovery probability?
10. When should the action happen?
11. Should AI act automatically?
12. Does the action require human approval?
13. Did the action actually succeed?
14. What happens if the result is unknown?
15. What should the system learn from the outcome?
16. Can the system predict similar failures before they happen?

PAYVISHWAS must answer these questions through coordinated specialized agents.

---

# 5. WHAT PAYVISHWAS IS NOT

Do NOT build:

* generic AI chatbot
* customer support chatbot
* simple payment retry system
* basic fraud detection model
* generic analytics dashboard
* LLM wrapper
* static mock dashboard
* fake agent animation
* hardcoded "AI decision" messages

The system must contain real backend logic and real data flow.

If the UI says:

"Risk Agent evaluated transaction"

the backend must actually perform a risk evaluation.

If the UI says:

"Safety Gate BLOCKED"

there must actually be a policy decision that caused the block.

---

# 6. PRIMARY INNOVATION

PAYVISHWAS is an:

## Context-Aware Multi-Agent AI Risk Manager

for intelligent payment recovery.

The system combines:

* root-cause analysis
* contextual reasoning
* risk scoring
* recovery strategy generation
* next-best-action selection
* deterministic safety policies
* secure execution
* transaction reliability
* verification
* proactive anomaly detection
* explainable communication
* outcome-based learning
* human escalation

The important concept is:

# AI AUTONOMY WITH FINANCIAL GUARDRAILS

AI can recommend and act within defined boundaries.

AI cannot bypass financial safety policies.

---

# 7. CORE ARCHITECTURE

Implement:

```text
                    PAYMENT EVENT
                         |
                         v
                EVENT GUARDIAN
                         |
                         v
                SWARM ORCHESTRATOR
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
   DIAGNOSIS          CONTEXT            RISK
     AGENT             AGENT             AGENT
        |                |                |
        +----------------+----------------+
                         |
                         v
                RECOVERY STRATEGY
                     AGENT
                         |
                         v
                   DECISION AGENT
                         |
                         v
                POLICY ENGINE
                         |
                         v
                SAFETY GATEKEEPER
                  /      |       \
                 /       |        \
              ALLOW    BLOCK    ESCALATE
                |
                v
           EXECUTION AGENT
                |
                v
          VERIFICATION AGENT
                |
          +-----+------+
          |            |
       SUCCESS       UNKNOWN
          |            |
          |        RECONCILIATION
          |            |
          +-----+------+
                |
                v
        COMMUNICATION AGENT
                |
                v
          MEMORY AGENT
                |
                v
             LEARNING
```

---

# 8. AGENT 1 — EVENT GUARDIAN

Purpose:

Securely receive and validate payment events.

Responsibilities:

* validate event structure
* validate required fields
* verify webhook signature where applicable
* detect duplicate events
* prevent replay
* generate/use idempotency key
* persist event
* create audit record
* forward validated event

Output:

```json
{
  "valid": true,
  "event_id": "...",
  "event_type": "payment.failed",
  "idempotency_key": "...",
  "timestamp": "...",
  "validation_status": "VALID"
}
```

Never blindly trust external event data.

---

# 9. AGENT 2 — DIAGNOSIS AGENT

Purpose:

Determine the root cause of the failure.

Analyze:

* failure code
* error description
* payment method
* bank/gateway response
* transaction history
* recent system signals
* similar failures

Classify:

* temporary
* permanent
* customer action required
* bank-related
* gateway-related
* payment-method-related
* infrastructure-related
* suspicious

Output:

```json
{
  "failure_type": "TEMPORARY",
  "root_cause": "BANK_TIMEOUT",
  "evidence": [],
  "confidence": 0.93,
  "recoverability_score": 0.87
}
```

Every conclusion must have evidence.

---

# 10. AGENT 3 — CONTEXT AGENT

This is one of the most important components.

The agent must build context from:

### Customer

* previous payments
* previous failures
* payment preferences
* transaction frequency

### Merchant

* merchant policy
* normal transaction patterns
* configured recovery limits

### Transaction

* amount
* method
* timestamp
* current status
* previous attempts

### System

* bank health
* gateway health
* payment-method success rate
* current failure spikes
* latency

The agent must NOT send unnecessary PII to the LLM.

Use:

* masking
* tokenization
* data minimization

---

# 11. AGENT 4 — RISK AGENT

Purpose:

Determine whether recovery is safe.

Evaluate:

* transaction amount
* velocity
* repeated attempts
* customer history
* unusual patterns
* risk indicators
* merchant policy
* recovery action risk

Output:

```json
{
  "risk_score": 18,
  "risk_level": "LOW",
  "recovery_allowed": true,
  "human_review_required": false,
  "reasons": []
}
```

CRITICAL:

Use deterministic rules together with AI reasoning.

Never allow an LLM alone to authorize financial actions.

---

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

Only execute approved actions.

Execution flow:

```text
REQUEST
 ↓
PRE-CHECK
 ↓
IDEMPOTENCY CHECK
 ↓
EXECUTE
 ↓
RECEIVE RESPONSE
 ↓
VERIFY ACTUAL STATE
 ↓
UPDATE STATE
```

Never assume:

"API timeout = transaction failed."

A timeout can mean the financial operation may have succeeded.

---

# 17. VERIFICATION AGENT

After every action determine:

```text
SUCCESS
FAILED
PENDING
UNKNOWN
REQUIRES_RECONCILIATION
```

If UNKNOWN:

DO NOT blindly retry.

Instead:

```text
QUERY STATE
 ↓
RECONCILE
 ↓
DETERMINE ACTUAL OUTCOME
```

This must be demonstrated in the final demo.

---

# 18. MEMORY + LEARNING AGENT

Record:

* failure pattern
* context
* selected action
* prediction
* confidence
* actual outcome
* payment method
* bank/gateway
* timestamp

Compare:

```text
PREDICTION
     vs
ACTUAL RESULT
```

Learning can improve:

* strategy ranking
* prediction scores
* pattern recognition
* recovery recommendations

Learning MUST NOT modify:

* authorization rules
* transaction limits
* security policies
* human approval requirements

Those remain deterministic.

---

# 19. PROACTIVE PAYMENT HEALTH AGENT

PAYVISHWAS must not only react.

It must predict.

Monitor:

* success rate
* failure rate
* latency
* transaction volume
* payment method
* bank/gateway
* error patterns

Example:

```text
Normal UPI Success:
97%

Current:
82%

Bank X timeout rate:
+340%
```

Generate:

# PROACTIVE PAYMENT HEALTH ALERT

Example:

> "Bank X is showing a rapidly increasing timeout pattern. PAYVISHWAS predicts elevated payment failure risk."

Then show:

* affected payment method
* affected bank
* predicted failure probability
* estimated revenue at risk
* affected merchants
* recommended preventive action

---

# 20. TRANSACTION STATE MACHINE

Implement a strict state machine.

```text
CREATED
 ↓
INITIATED
 ↓
PROCESSING
 ↓
AUTHORIZED
 ↓
CAPTURED
```

Failure path:

```text
FAILED
 ↓
DIAGNOSING
 ↓
RECOVERY_PLANNED
 ↓
AWAITING_APPROVAL
 ↓
RECOVERY_EXECUTING
 ↓
VERIFYING
 ↓
RECOVERED
```

Other states:

```text
BLOCKED
ESCALATED
PENDING
UNKNOWN
REQUIRES_RECONCILIATION
```

Invalid transitions must be rejected.

---

# 21. IDEMPOTENCY

Every financial action must have an idempotency key.

If the same event/action arrives twice:

DO NOT execute twice.

Return the original action result.

Create automated tests demonstrating this.

---

# 22. SECURITY ARCHITECTURE

Implement:

* authentication
* authorization
* RBAC
* least privilege
* agent identity
* API key protection
* secret management
* environment variables
* input validation
* webhook signature validation
* rate limiting
* audit logging
* PII masking
* secure error handling
* prompt injection protection
* tool authorization
* action allowlists
* transaction limits
* human approval thresholds

Never hardcode:

* Razorpay secret
* API keys
* LLM keys
* passwords

Use `.env`.

Provide `.env.example`.

---

# 23. AI SECURITY

Treat external text as untrusted.

Protect against:

* prompt injection
* malicious transaction metadata
* malicious merchant descriptions
* tool abuse
* privilege escalation
* unauthorized actions

Architecture MUST be:

```text
LLM RECOMMENDATION
        ↓
DETERMINISTIC POLICY ENGINE
        ↓
SAFETY GATE
        ↓
AUTHORIZED TOOL
        ↓
EXECUTION
```

Never:

```text
LLM
 ↓
DIRECT FINANCIAL ACTION
```

---

# 24. RAZORPAY INTEGRATION

Use Razorpay Test Mode only.

Never use real money.

Use:

```text
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

Create an abstraction:

```text
PAYVISHWAS
      ↓
PAYMENT PROVIDER INTERFACE
      ↓
RAZORPAY ADAPTER
      ↓
RAZORPAY TEST MODE
```

The rest of the system must not depend directly on Razorpay implementation details.

Where an actual Razorpay action is unavailable or unsafe for the demo, use a clearly labelled simulation layer.

Never pretend simulation is a real transaction.

Razorpay's official documentation supports web integrations and React checkout integration, and Test Mode should be used for development.

---

# 25. FRONTEND TECHNOLOGY

Build the frontend with:

* React
* TypeScript
* Next.js
* Tailwind CSS
* shadcn/ui or equivalent component system
* Recharts
* TanStack Query where useful

Use clean component architecture.

Frontend must feel like professional financial infrastructure software.

Do not create a generic AI SaaS dashboard.

---

# 26. RAZORPAY-INSPIRED VISUAL DESIGN

Use the uploaded Razorpay screenshots/logo as **visual inspiration only**.

Do not copy Razorpay's website pixel-for-pixel.

Do not reproduce proprietary assets unnecessarily.

Create an original PAYVISHWAS design system inspired by the visual language.

### Primary palette

Use:

**Deep Navy**
`#062B3A`

for:

* sidebar
* headers
* major backgrounds
* navigation

**Razorpay-inspired Green**
`#00A86B`

for:

* primary CTA
* success
* active states
* positive financial indicators

**Blue**
`#2F80ED`

for:

* information
* AI intelligence
* secondary actions
* links

**White**
`#FFFFFF`

for:

* main content backgrounds
* cards
* readability

**Soft Gray**
`#F5F7F9`

for:

* page background
* secondary sections

Use restrained color usage.

Do not make the entire dashboard green.

The UI should feel:

* trustworthy
* premium
* technical
* calm
* financial
* modern

---

# 27. FRONTEND DESIGN LANGUAGE

Create:

### Navigation

Dark navy vertical sidebar.

Logo:

**PAYVISHWAS**

with a simple original trust/payment mark.

Navigation:

* Overview
* Live Payments
* Risk Center
* Investigations
* Recovery
* Proactive Alerts
* Agent Activity
* Audit Trail
* Learning
* Policies
* Settings

---

# 28. MAIN DASHBOARD

Hero area:

## Good evening, Merchant

### Payment intelligence is active.

Show real-time status:

```text
SYSTEM HEALTH
● Operational

PAYMENT HEALTH
● Healthy

AI AGENTS
● 8 Active

SECURITY
● Protected
```

Then KPI cards:

* Total Transactions
* Successful Payments
* Failed Payments
* Recovery Rate
* Revenue Recovered
* Revenue at Risk
* Active Risk Events
* Human Escalations

---

# 29. LIVE PAYMENT MONITOR

Create a professional real-time payment stream.

Columns:

```text
Transaction
Amount
Method
Status
Risk
Failure
PAYVISHWAS Action
Time
```

Statuses:

🟢 Success
🟡 Processing
🔴 Failed
🟠 Recovery
🔵 Investigating
🟣 Escalated

Use subtle animation only for live updates.

---

# 30. RISK CENTER

Create a dedicated risk dashboard.

Show:

* risk distribution
* blocked actions
* escalations
* high-value transactions
* unusual transaction patterns
* policy violations
* security events

Include:

## AI Risk Decision

```text
Risk Score
18 / 100

LOW RISK

Recovery:
ALLOWED

Human Review:
NOT REQUIRED
```

---

# 31. PAYMENT INVESTIGATION PAGE

When a failed transaction is selected, show:

```text
PAYMENT INVESTIGATION
```

Transaction information:

* Transaction ID
* Amount
* Customer
* Merchant
* Payment method
* Timestamp
* Current status

Then a visual timeline:

```text
01 Event Received
       ↓
02 Event Validated
       ↓
03 Root Cause Identified
       ↓
04 Context Built
       ↓
05 Risk Assessed
       ↓
06 Strategies Generated
       ↓
07 Decision Made
       ↓
08 Safety Gate
       ↓
09 Action Executed
       ↓
10 Outcome Verified
       ↓
11 Learning Stored
```

Each step should be expandable.

---

# 32. DECISION EXPLANATION PANEL

Make this one of the most visually impressive components.

Display:

## PAYVISHWAS DECISION

### Recommended action

**Retry after 90 seconds**

### Why?

Temporary bank timeout detected.

### Evidence

* recent bank timeout increase
* returning customer
* previous successful payments
* low transaction risk

### Confidence

**91%**

### Expected recovery

**High**

### Policy

**Within autonomous recovery limit**

### Safety

**APPROVED**

This should make the AI explainable to a human.

---

# 33. AGENT ACTIVITY

Show live agent orchestration.

Example:

```text
21:31:02
EVENT GUARDIAN
Payment event validated

21:31:03
DIAGNOSIS AGENT
Bank timeout identified

21:31:03
CONTEXT AGENT
Customer history loaded

21:31:04
RISK AGENT
LOW RISK

21:31:04
RECOVERY AGENT
4 strategies generated

21:31:05
DECISION AGENT
Delayed retry selected

21:31:05
SAFETY GATE
APPROVED

21:32:35
EXECUTION AGENT
Recovery initiated

21:32:37
VERIFICATION AGENT
Payment recovered

21:32:37
MEMORY AGENT
Outcome stored
```

This must reflect actual backend events.

---

# 34. PROACTIVE ALERT CENTER

Show:

## Payment Health Alert

Example:

```text
HIGH PRIORITY

Bank X

UPI timeout rate increased 340%

Current success:
82%

Normal:
97%

Predicted failure risk:
HIGH

Revenue at risk:
₹X/hour

Recommended:
Prepare alternate recovery strategy
```

Allow merchant to inspect evidence.

---

# 35. POLICY CENTER

Create a merchant configuration page.

Controls:

```text
Maximum automatic recovery:
₹25,000

Maximum retries:
2

High-value transactions:
Require approval

High-risk transactions:
Block

Unknown state:
Require reconciliation

Suspicious activity:
Escalate
```

Show:

> "These policies are deterministic and cannot be overridden by an AI agent."

This is important.

---

# 36. AUDIT TRAIL

Every important action must be visible.

Columns:

* Timestamp
* Actor
* Agent
* Transaction
* Action
* Decision
* Confidence
* Policy
* Authorization
* Result

Allow filtering.

---

# 37. DEMO MODE

Create a prominent:

# DEMO CENTER

with scenarios.

### Scenario 1

Temporary bank timeout

### Scenario 2

High-value risky payment

### Scenario 3

Duplicate webhook

### Scenario 4

Unknown transaction state

### Scenario 5

Payment failure spike

### Scenario 6

Successful recovery

### Scenario 7

Recovery failure → escalation

When a scenario is selected, show the complete agent workflow in real time.

---

# 38. KILLER DEMO — LOW-RISK RECOVERY

Use:

Payment:
₹18,500

Customer:
Returning customer

Method:
UPI

Failure:
Temporary bank timeout

System:

```text
Diagnosis:
Temporary failure

Risk:
LOW

Recovery probability:
HIGH

Decision:
Delayed retry

Safety:
APPROVED

Execution:
SUCCESS

Verification:
RECOVERED
```

Then communicate:

> Payment successfully recovered.

---

# 39. KILLER DEMO — HIGH-RISK ACTION

Use:

Payment:
₹2,50,000

Risk:
HIGH

Decision Agent:

> Recovery recommended.

Safety Gatekeeper:

> BLOCKED / ESCALATED

Reason:

> Transaction exceeds autonomous action threshold.

This proves that PAYVISHWAS is not blindly autonomous.

---

# 40. KILLER DEMO — DUPLICATE EVENT

Send the same `payment.failed` event twice.

First:

```text
EVENT ACCEPTED
```

Second:

```text
DUPLICATE EVENT DETECTED
```

No duplicate recovery action should be created.

---

# 41. KILLER DEMO — UNKNOWN STATE

Simulate:

```text
Recovery request sent
        ↓
Network timeout
        ↓
UNKNOWN
```

PAYVISHWAS must:

```text
NOT RETRY BLINDLY

VERIFY
 ↓
RECONCILE
 ↓
DETERMINE ACTUAL STATE
```

This is a major financial reliability demonstration.

---

# 42. KILLER DEMO — PROACTIVE DETECTION

Simulate:

```text
Normal:
97%

Current:
82%

Bank X timeout:
rapidly increasing
```

PAYVISHWAS detects the problem before the merchant manually reports it.

Show:

# PROACTIVE ALERT

and explain the evidence.

---

# 43. AI MODEL ARCHITECTURE

Do not force every task through one LLM.

Use the right approach for the right task.

### Deterministic logic

Use for:

* authorization
* transaction state
* limits
* idempotency
* policy
* security
* financial calculations

### ML/statistical logic

Use for:

* anomaly detection
* recovery probability
* payment health
* trend prediction

### LLM reasoning

Use for:

* root-cause explanation
* contextual reasoning
* strategy generation
* decision explanation
* communication
* summarization

### Agent orchestration

Use for:

* delegation
* coordination
* tool use
* workflow execution

Core principle:

# USE THE RIGHT INTELLIGENCE FOR THE RIGHT TASK.

Do not use an LLM where deterministic logic is safer.

---

# 44. MODEL ABSTRACTION

Create a clean AI provider interface.

Example:

```text
AIProvider
 ├── analyze()
 ├── reason()
 ├── generate()
 └── explain()
```

The model provider must be configurable.

Do not hardcode the entire architecture around one model.

The system should support future model replacement.

---

# 45. BACKEND

Use:

* Python
* FastAPI
* PostgreSQL
* Redis where useful
* background workers
* async processing

Structure:

```text
/backend
    /api
    /agents
    /domain
    /services
    /security
    /policies
    /payments
    /simulation
    /database
    /workers
    /tests
```

Keep financial logic separate from AI logic.

---

# 46. DATABASE

Create schemas for:

```text
users
merchants
customers
payments
payment_events
payment_attempts
failure_diagnostics
risk_assessments
recovery_strategies
agent_decisions
agent_actions
security_events
audit_logs
notifications
learning_outcomes
system_health_metrics
merchant_policies
```

All financial actions must be auditable.

---

# 47. API

Implement:

```text
POST /api/webhooks/razorpay

GET /api/payments

GET /api/payments/{id}

GET /api/payments/{id}/investigation

POST /api/payments/{id}/simulate-failure

POST /api/payments/{id}/recover

GET /api/agents/activity

GET /api/risk

GET /api/alerts

GET /api/audit

GET /api/metrics

GET /api/policies

POST /api/policies

POST /api/demo/scenario/{scenario}

GET /api/health
```

Generate OpenAPI documentation.

---

# 48. OBSERVABILITY

Track:

* agent latency
* decision latency
* API latency
* agent failures
* recovery rate
* recovery time
* escalation rate
* blocked actions
* duplicate events
* unknown states
* proactive alerts

Create a metrics dashboard.

---

# 49. BASELINE COMPARISON

Implement a simple baseline:

```text
IF payment fails:
    retry once
```

Compare against PAYVISHWAS.

Example values must be clearly labelled:

**SIMULATED BENCHMARK**

Never present simulated results as Razorpay production results.

Compare:

* recovery rate
* recovery time
* unsafe actions blocked
* duplicate prevention
* escalation accuracy
* proactive detection

---

# 50. TESTING

Mandatory.

Create:

* unit tests
* API tests
* integration tests
* agent tests
* security tests
* idempotency tests
* state machine tests

Test:

1. duplicate webhook
2. invalid webhook
3. unauthorized action
4. high-risk transaction
5. low-risk transaction
6. recovery success
7. recovery failure
8. network timeout
9. unknown state
10. invalid transition
11. prompt injection
12. excessive retry
13. policy violation
14. missing fields

---

# 51. UI QUALITY BAR

The frontend must feel like a real FinTech infrastructure platform.

Do not create:

* excessive gradients
* cartoon illustrations
* generic robot graphics
* excessive glassmorphism
* unnecessary animations
* clutter
* huge decorative elements

Use:

* strong typography
* clear hierarchy
* generous spacing
* professional tables
* meaningful charts
* subtle transitions
* skeleton loading
* empty states
* proper error states
* responsive layouts
* accessible components

Use animation only when it communicates system activity.

---

# 52. RESPONSIVE DESIGN

Desktop:

Primary target.

Tablet:

Fully functional.

Mobile:

Readable and usable.

Do not simply shrink the desktop dashboard.

Create proper responsive layouts.

---

# 53. BRANDING

Visible brand:

# PAYVISHWAS

Subheading:

**Autonomous AI Risk Manager**

Tagline:

**Trust every payment decision.**

Secondary description:

**Context-aware risk intelligence for safer, smarter payment recovery.**

Use an original logo/mark.

Do not copy the Razorpay logo.

Use the uploaded Razorpay visual references only for inspiration in:

* color relationships
* visual simplicity
* professional tone
* typography hierarchy
* spacing
* developer-oriented aesthetic

---

# 54. PRODUCT FEEL

The final product should feel like:

**Razorpay × modern AI infrastructure × financial security**

but must remain an original PAYVISHWAS product.

The experience should communicate:

**Trust**

**Intelligence**

**Security**

**Speed**

**Control**

**Transparency**

---

# 55. PROJECT STRUCTURE

Use:

```text
/payvishwas

/frontend
/backend
/agents
/database
/simulation
/tests
/docs
/scripts
/docker
```

Create:

```text
README.md
ARCHITECTURE.md
SECURITY.md
API.md
DEMO.md
TESTING.md
AI_ARCHITECTURE.md
.env.example
```

---

# 56. DOCUMENTATION

Document:

1. Problem
2. Track selection
3. Solution
4. Why multi-agent
5. Agent architecture
6. AI architecture
7. Security architecture
8. Transaction reliability
9. Proactive detection
10. Decision-making
11. Human escalation
12. Learning
13. Razorpay integration
14. Simulation layer
15. API
16. Database
17. Testing
18. Limitations
19. Future scope

---

# 57. IMPLEMENTATION ORDER

DO NOT generate the entire application blindly.

Follow this sequence.

## PHASE 1

Architecture

Repository

Design system

Database schema

Transaction state machine

Agent contracts

Security model

API specification

---

## PHASE 2

Backend foundation

Database

Authentication

Merchant policies

Transaction model

State machine

Audit logging

---

## PHASE 3

Payment simulator

Razorpay adapter

Webhook processing

Idempotency

---

## PHASE 4

Event Guardian

---

## PHASE 5

Diagnosis Agent

---

## PHASE 6

Context Agent

---

## PHASE 7

Risk Agent

---

## PHASE 8

Recovery Strategy Agent

---

## PHASE 9

Decision Agent

---

## PHASE 10

Policy Engine

Safety Gatekeeper

---

## PHASE 11

Execution Agent

Verification Agent

---

## PHASE 12

Memory/Learning

---

## PHASE 13

Proactive Payment Health Agent

---

## PHASE 14

Communication Agent

---

## PHASE 15

Frontend dashboard

---

## PHASE 16

Investigation interface

---

## PHASE 17

Risk center

---

## PHASE 18

Demo center

---

## PHASE 19

Security hardening

---

## PHASE 20

Testing

---

## PHASE 21

Performance optimization

---

## PHASE 22

Final documentation

---

# 58. ANTIGRAVITY OPERATING RULES

Before coding:

1. Inspect repository.
2. Create architecture plan.
3. Identify dependencies.
4. Identify security risks.
5. Create milestones.
6. Create database design.
7. Create API contracts.
8. Create agent contracts.

During development:

* write modular code
* test continuously
* use deterministic financial logic
* use AI only where it adds reasoning value
* never bypass security
* never hardcode secrets
* never hide errors
* never fake successful financial operations

When something fails:

1. identify root cause
2. fix root cause
3. run tests
4. verify
5. document

Do not patch around failures just to make the UI appear functional.

---

# 59. FINAL DEMO STORY

The final presentation must tell this story:

### STEP 1

A payment fails.

### STEP 2

PAYVISHWAS securely receives the event.

### STEP 3

Diagnosis Agent discovers WHY.

### STEP 4

Context Agent understands WHO, WHAT, WHEN and WHERE.

### STEP 5

Risk Agent determines whether recovery is safe.

### STEP 6

Recovery Agent generates multiple strategies.

### STEP 7

Decision Agent selects the best strategy.

### STEP 8

Policy Engine checks deterministic rules.

### STEP 9

Safety Gatekeeper:

**ALLOW / BLOCK / ESCALATE**

### STEP 10

Execution Agent acts.

### STEP 11

Verification Agent confirms the real outcome.

### STEP 12

Communication Agent explains everything.

### STEP 13

Memory Agent stores the outcome.

### STEP 14

Learning improves future strategy ranking.

### STEP 15

Proactive Health Agent detects future failure patterns.

This demonstrates:

**Context Awareness**

**Adaptability**

**Reliable Decision Making**

**Efficient Task Execution**

**Security**

**Transaction Reliability**

**Clear Communication**

**Proactive Problem Solving**

---

# 60. SUCCESS CRITERIA

The project is NOT complete until these are demonstrated:

* [ ] genuine multi-agent workflow
* [ ] root-cause analysis
* [ ] contextual reasoning
* [ ] risk assessment
* [ ] recovery strategy generation
* [ ] explainable decision
* [ ] deterministic policy engine
* [ ] safety gate
* [ ] authorization
* [ ] idempotency
* [ ] transaction state machine
* [ ] duplicate-event protection
* [ ] unknown-state handling
* [ ] verification
* [ ] proactive anomaly detection
* [ ] outcome-based learning
* [ ] audit trail
* [ ] human escalation
* [ ] Razorpay Test Mode adapter
* [ ] simulation mode
* [ ] security tests
* [ ] agent tests
* [ ] integration tests
* [ ] professional FinTech frontend
* [ ] responsive UI
* [ ] clear AI explanations
* [ ] policy configuration
* [ ] demo scenarios
* [ ] documentation

---

# 61. START NOW

DO NOT immediately build the complete application.

First perform ONLY Phase 1.

Your first response/action must produce:

1. Complete architecture diagram
2. Repository structure
3. Technology decisions
4. Database ER/schema design
5. Transaction state machine
6. Agent contracts
7. Security architecture
8. API specification
9. Frontend design system
10. Color/token system
11. Implementation roadmap

Then create the Phase 1 files.

Run validation.

Report:

* files created
* architecture decisions
* dependencies
* security risks
* tests
* remaining work

Do not continue to Phase 2 until Phase 1 foundations are valid.

Build PAYVISHWAS as a serious, original, production-inspired AI Risk Manager for a Razorpay hackathon.

The final product must demonstrate:

# TRUSTWORTHY AUTONOMOUS FINANCIAL DECISION-MAKING

not merely an AI chatbot.

---

# 62. HACKATHON TRACK

**Track 02: AI Risk Manager**
Stop the merchant losing money to fraud, returns and chargebacks

Build a working detector, verifier or auto-responder for one class of loss, with measured precision and recall on a held-out test set.

### Why now
AI-enabled fraud is hitting Indian BFSI while returns and chargebacks quietly eat margin. This track surfaces the risk and ML minded builders the others miss.

### Example directions
- Chargeback evidence responder
- Return-risk scorer
- Fraud-spike detector
- Abuse-ring sentinel

### The bar
Honest metrics including false-positive cost. Strictly defense-only: anything offense-capable is disqualified.
