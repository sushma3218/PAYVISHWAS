import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

class DecisionAgent:
    """
    AGENT 6: Selects the optimal recovery strategy from the candidate list.
    Weighs probability, risk, timing, and customer experience.
    """
    def __init__(self, db_session=None):
        self.db = db_session

    def select_strategy(self, event_data: dict, strategies: List[Dict]) -> Dict:
        """
        Compare all candidate strategies and pick the best one.
        """
        payment_id = event_data.get("payload", {}).get("payment", {}).get("entity", {}).get("id")
        
        if not strategies:
            logger.warning(f"No strategies provided for {payment_id}. Defaulting to DO_NOTHING.")
            return {
                "selected_action": "DO_NOTHING",
                "delay_seconds": 0,
                "confidence": 1.0,
                "reason": "No candidate strategies available",
                "expected_impact": "Safe fallback",
                "alternatives_considered": []
            }
            
        # Simplified scoring logic
        # Score = (recovery_probability * 10) - (latency_seconds / 3600) + (confidence * 5)
        # Note: If action is DO_NOTHING, it usually means High Risk, so we select it if it's the only option or if forced.
        
        best_strategy = None
        highest_score = -9999
        
        for strategy in strategies:
            if strategy["action"] == "DO_NOTHING":
                # DO_NOTHING takes precedence if it's the only one or if risk is too high
                best_strategy = strategy
                break
                
            score = (strategy["recovery_probability"] * 10) - (strategy["latency_seconds"] / 3600) + (strategy["confidence"] * 5)
            
            # Penalize bad customer experience slightly
            if strategy["customer_experience"] == "LOW":
                score -= 1.0
                
            if score > highest_score:
                highest_score = score
                best_strategy = strategy

        if not best_strategy:
            best_strategy = strategies[0]
            
        decision = {
            "selected_action": best_strategy["action"],
            "delay_seconds": best_strategy["latency_seconds"],
            "confidence": best_strategy["confidence"],
            "reason": f"Selected based on high recovery probability ({best_strategy['recovery_probability']:.2f}) and optimal timing.",
            "expected_impact": f"Expected recovery: {best_strategy['expected_recovery']}",
            "alternatives_considered": [s["action"] for s in strategies if s["action"] != best_strategy["action"]]
        }
        
        logger.info(f"DecisionAgent selected {decision['selected_action']} for {payment_id}")
        return decision
