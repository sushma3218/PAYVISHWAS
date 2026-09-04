# PAYVISHWAS

**Autonomous AI Risk Manager**  
*Trust every payment decision.*  
*Context-aware risk intelligence for safer, smarter payment recovery.*

🚀 **Live Demo:** [https://payvishwas.vercel.app/](https://payvishwas.vercel.app/)

## Track 02: AI Risk Manager

PAYVISHWAS is a context-aware multi-agent AI Risk Manager that evaluates payment risk, predicts potential loss (specifically focusing on **Fraud/Chargeback Risk on High-Value and High-Velocity Transactions**), recommends the safest response, and enforces deterministic financial guardrails before any action is taken.

The core innovation is **AI AUTONOMY WITH FINANCIAL GUARDRAILS**.

### Core Flow
**OBSERVE → UNDERSTAND → PREDICT → DECIDE → PROTECT → ACT → VERIFY → LEARN**

1. **Observe**: Receive payment webhook (Event Guardian).
2. **Understand**: Build context around customer, merchant, and system health (Context & Diagnosis Agents).
3. **Predict**: Evaluate the risk of recovering this transaction using a Track 02-aligned Risk Evaluation model.
4. **Decide**: Compare all candidate recovery strategies and select the best one (Recovery & Decision Agents).
5. **Protect**: Evaluate the selected action against deterministic safety policies (Policy Engine & Safety Gatekeeper).
6. **Act**: Execute the approved action safely (Execution Agent).
7. **Verify**: Ensure the true transaction state is known (Verification Agent).
8. **Learn**: Compare predictions with actual outcomes for continuous improvement (Memory Agent).

### Held-Out Evaluation
The system relies on an ML risk model evaluated on a strictly held-out test set, capturing:
- Precision
- Recall
- F1 Score
- Confusion Matrix
- False Positive/Negative Costs

### 📚 Documentation

We have organized all our detailed documentation into the `docs/` folder for easier reviewing:

- [ARCHITECTURE.md](docs/ARCHITECTURE.md): System architecture and data flow.
- [AI_ARCHITECTURE.md](docs/AI_ARCHITECTURE.md): Deep dive into the Swarm Orchestrator and Agents.
- [DEMO.md](docs/DEMO.md): Instructions on how to run and test the live demo.
- [API.md](docs/API.md): API documentation for phase 2.
- [SECURITY.md](docs/SECURITY.md): Security practices and considerations.
- [TESTING.md](docs/TESTING.md): Testing strategy and ML evaluation details.
- [agent.md](docs/agent.md): Overview of individual agent capabilities.

*(Development ongoing - Phase 1 Foundation)*
