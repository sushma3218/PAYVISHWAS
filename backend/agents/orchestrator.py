import logging
from backend.agents.guardian import EventGuardian
from backend.agents.diagnosis import DiagnosisAgent
from backend.agents.context import ContextAgent
from backend.agents.risk import RiskAgent
from backend.agents.recovery import RecoveryStrategyAgent
from backend.agents.decision import DecisionAgent
from backend.policies.policy import PolicyEngine
from backend.policies.gatekeeper import SafetyGatekeeper
from backend.agents.execution import ExecutionAgent, VerificationAgent
from backend.agents.memory import MemoryLearningAgent
from backend.domain.state_machine import TransactionStateMachine

logger = logging.getLogger(__name__)

class SwarmOrchestrator:
    """
    Coordinates the multi-agent pipeline for processing payment events.
    """
    def __init__(self):
        self.guardian = EventGuardian()
        self.diagnosis = DiagnosisAgent()

    def process_event(self, event_data: dict, db_session=None):
        """
        Main pipeline execution.
        """
        event_id = event_data.get("id")
        logger.info(f"SwarmOrchestrator started for event {event_id}")

        # 1. Event Guardian Validation
        guardian_result = self.guardian.validate_event(event_data)
        if not guardian_result.get("valid"):
            logger.error(f"Event Guardian rejected event {event_id}: {guardian_result.get('reason')}")
            return

        event_type = guardian_result.get("event_type")
        
        # We only process failed payments through the full AI pipeline
        if event_type != "payment.failed":
            logger.info(f"Event {event_id} is {event_type}, no recovery required.")
            return

        # 2. State Machine Update: FAILED -> DIAGNOSING
        try:
            new_state = TransactionStateMachine.transition("FAILED", "DIAGNOSING")
            logger.info(f"Transitioned to state: {new_state}")
        except Exception as e:
            logger.error(f"State transition failed: {str(e)}")
            return

        # 3. Diagnosis Agent
        diagnosis_result = self.diagnosis.diagnose(event_data)
        logger.info(f"Diagnosis complete for {event_id}: {diagnosis_result.get('root_cause')} (Confidence: {diagnosis_result.get('confidence')})")

        if not db_session:
            # If db_session is missing (like in some tests), we can't run Context/Risk which require DB.
            logger.warning("No db_session provided, skipping Context and Risk Agent phases.")
            return

        # 4. Context Agent
        context_agent = ContextAgent(db_session)
        context_result = context_agent.build_context(event_data)
        logger.info(f"Context built successfully for {event_id}")
        
        # 5. Risk Agent
        risk_agent = RiskAgent(db_session)
        risk_result = risk_agent.assess_risk(event_data, diagnosis_result, context_result)
        
        # 6. Recovery Strategy Agent
        recovery_agent = RecoveryStrategyAgent(db_session)
        strategies = recovery_agent.generate_strategies(event_data, diagnosis_result, risk_result)
        
        # 7. Decision Agent
        decision_agent = DecisionAgent(db_session)
        decision = decision_agent.select_strategy(event_data, strategies)
        
        # 8. Policy Engine
        policy_engine = PolicyEngine(db_session)
        policy_result = policy_engine.evaluate(event_data, decision, risk_result)
        
        # 9. Safety Gatekeeper
        gatekeeper = SafetyGatekeeper(db_session)
        gatekeeper_decision = gatekeeper.validate_action(event_data, decision, policy_result, context_result)
        
        # 10. Execution Agent
        execution_agent = ExecutionAgent(db_session)
        execution_result = execution_agent.execute(event_data, decision, gatekeeper_decision)
        
        # 11. Verification Agent
        verification_agent = VerificationAgent(db_session)
        attempt_id = execution_result.get("attempt_id")
        payment_id = event_data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
        
        if attempt_id and gatekeeper_decision == "ALLOW":
            verification_result = verification_agent.verify(payment_id, attempt_id)
            logger.info(f"Verification result: {verification_result}")
            actual_result = verification_result.get("outcome", "UNKNOWN")
        else:
            actual_result = execution_result.get("status", "skipped")
            
        # 12. Memory & Learning Agent
        memory_agent = MemoryLearningAgent(db_session)
        predicted_outcome = {
            "recovery_probability": risk_result.get("confidence", 0), # Simplified mapping
            "risk": risk_result.get("risk_level", "UNKNOWN")
        }
        memory_agent.record_outcome(payment_id, attempt_id or "none", predicted_outcome, actual_result)
        
        logger.info(f"SwarmOrchestrator finished pipeline through Memory Agent for {event_id}. Final status: {actual_result}")

