import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix
import logging

logger = logging.getLogger(__name__)

class Track02RiskModel:
    """
    The core ML Model evaluated for Track 02.
    Predicts the probability of Fraud/Chargeback Loss.
    """
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.is_trained = False
        self.metrics = {}
        
    def generate_synthetic_data(self, n_samples=10000):
        """
        Generates a synthetic dataset of payment events to train and evaluate the model.
        This satisfies the Track 02 requirement without relying on external CSVs.
        """
        logger.info(f"Generating synthetic dataset with {n_samples} samples...")
        np.random.seed(42)
        
        # Features
        amounts = np.random.lognormal(mean=7, sigma=1.5, size=n_samples) # Transaction amount
        velocity = np.random.poisson(lam=1, size=n_samples) # Transactions in last hour
        retry_counts = np.random.poisson(lam=0.5, size=n_samples)
        customer_success_rates = np.random.uniform(0, 1, size=n_samples)
        
        # Introduce Risk/Chargeback Logic (The Ground Truth)
        # Higher amount + High velocity + low customer success rate = High Risk
        risk_score_continuous = (
            (amounts / 50000) * 0.4 + 
            (velocity / 3) * 0.3 + 
            (1 - customer_success_rates) * 0.3
        )
        
        # Add some noise
        risk_score_continuous += np.random.normal(0, 0.1, size=n_samples)
        
        # Binary target: 1 = Chargeback/Fraud, 0 = Safe
        is_chargeback = (risk_score_continuous > 0.6).astype(int)
        
        df = pd.DataFrame({
            "amount": amounts,
            "velocity": velocity,
            "retry_count": retry_counts,
            "customer_success_rate": customer_success_rates,
            "is_chargeback": is_chargeback
        })
        
        return df

    def train_and_evaluate(self):
        """
        Trains the model and evaluates it on a strictly held-out test set.
        """
        if self.is_trained:
            return self.metrics
            
        df = self.generate_synthetic_data()
        
        X = df.drop(columns=["is_chargeback"])
        y = df["is_chargeback"]
        
        # Track 02 Requirement: Split dataset into Train and Held-Out Test Set (80/20)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        logger.info("Training Risk Model...")
        self.model.fit(X_train, y_train)
        
        logger.info("Evaluating on held-out test set...")
        y_pred = self.model.predict(X_test)
        
        # Calculate Metrics
        cm = confusion_matrix(y_test, y_pred)
        
        # False Positive: Model said Chargeback (1), but was Safe (0) -> Cost: friction, lost conversion (e.g., ₹500 avg margin)
        # False Negative: Model said Safe (0), but was Chargeback (1) -> Cost: actual money lost (e.g., avg amount ₹15,000)
        fp = cm[0][1]
        fn = cm[1][0]
        
        fp_cost = fp * 500
        fn_cost = fn * 15000
        
        self.metrics = {
            "precision": float(precision_score(y_test, y_pred, zero_division=0)),
            "recall": float(recall_score(y_test, y_pred, zero_division=0)),
            "f1_score": float(f1_score(y_test, y_pred, zero_division=0)),
            "confusion_matrix": cm.tolist(),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "false_positive_cost": int(fp_cost),
            "false_negative_cost": int(fn_cost),
            "total_test_samples": len(y_test)
        }
        
        self.is_trained = True
        logger.info(f"Model Evaluation Complete: Precision={self.metrics['precision']:.2f}, Recall={self.metrics['recall']:.2f}")
        
        return self.metrics

    def predict(self, amount: float, velocity: int, retry_count: int, success_rate: float) -> dict:
        """
        Scores a single transaction.
        """
        if not self.is_trained:
            self.train_and_evaluate()
            
        features = pd.DataFrame([{
            "amount": amount,
            "velocity": velocity,
            "retry_count": retry_count,
            "customer_success_rate": success_rate
        }])
        
        prob = self.model.predict_proba(features)[0][1] # Probability of class 1 (Chargeback)
        
        level = "LOW"
        if prob > 0.8:
            level = "CRITICAL"
        elif prob > 0.6:
            level = "HIGH"
        elif prob > 0.3:
            level = "MEDIUM"
            
        return {
            "risk_score": float(prob),
            "risk_level": level,
            "predicted_outcome": "CHARGEBACK_RISK" if prob > 0.6 else "SAFE",
            "confidence": float(prob if prob > 0.5 else 1 - prob)
        }

# Singleton instance
risk_model_instance = Track02RiskModel()
