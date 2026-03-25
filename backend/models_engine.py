import networkx as nx
import numpy as np
import random
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

class MLRiskEngine:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        # Train a robust synthetic dataset (simulate past certificates mapped against fraud cases)
        # Features: [Integrity_Score, Institution_Trust, Graph_Confidence, Certificate_Age, Document_Anomalies, QR_Status]
        # QR_Status: 0 = no QR, 1 = valid QR, 2 = mismatch/fake QR
        
        # 0 = Fraud, 1 = Authentic
        np.random.seed(42)
        
        # Create authentic samples
        X_auth_5 = np.random.uniform(low=[0.7, 0.7, 0.7, 0, 0], high=[1.0, 1.0, 1.0, 10, 0], size=(100, 5))
        qr_auth = np.random.choice([0, 1], size=(100, 1), p=[0.2, 0.8])
        X_auth = np.hstack((X_auth_5, qr_auth))
        y_auth = np.ones(100)
        
        # Create fraud samples (low integrity, anomalies, low trust)
        X_fraud_5 = np.random.uniform(low=[0.1, 0.1, 0.1, 0, 1], high=[0.6, 0.6, 0.6, 2, 5], size=(50, 5))
        qr_fraud = np.random.choice([0, 2], size=(50, 1), p=[0.3, 0.7])
        X_fraud = np.hstack((X_fraud_5, qr_fraud))
        y_fraud = np.zeros(50)
        
        # Create suspicious/borderline samples
        X_susp_5 = np.random.uniform(low=[0.5, 0.5, 0.5, 0, 0], high=[0.8, 0.8, 0.8, 5, 2], size=(50, 5))
        qr_susp = np.random.choice([0, 1, 2], size=(50, 1), p=[0.5, 0.3, 0.2])
        X_susp = np.hstack((X_susp_5, qr_susp))
        y_susp = np.random.choice([0, 1], size=50, p=[0.7, 0.3])
        
        X_full = np.vstack((X_auth, X_fraud, X_susp))
        y_full = np.concatenate((y_auth, y_fraud, y_susp))
        
        # Split into training and testing sets to generate honest evaluation metrics
        X_train, X_test, y_train, y_test = train_test_split(X_full, y_full, test_size=0.2, random_state=42)
        
        self.scaler.fit(X_train)
        X_scaled = self.scaler.transform(X_train)
        self.model.fit(X_scaled, y_train)
        
        # Compute exact Model Performance Metrics natively (GAP 6)
        X_test_scaled = self.scaler.transform(X_test)
        y_pred = self.model.predict(X_test_scaled)
        
        self.metrics = {
            "accuracy": round(accuracy_score(y_test, y_pred), 3),
            "precision": round(precision_score(y_test, y_pred, zero_division=1), 3),
            "recall": round(recall_score(y_test, y_pred, zero_division=1), 3),
            "f1_score": round(f1_score(y_test, y_pred, zero_division=1), 3)
        }

    def predict_trust_score(self, integrity_score: float, institution_trust: float, graph_confidence: float, age: int, anomalies: int, qr_status: int) -> int:
        features = np.array([[integrity_score, institution_trust, graph_confidence, age, anomalies, qr_status]])
        scaled = self.scaler.transform(features)
        proba = self.model.predict_proba(scaled)[0]
        score = int(proba[1] * 100)
        
        # Hard-Reject Heuristic (Protects against 66% Hallucinations on Dummy Docs)
        if integrity_score < 0.25 or anomalies > 4:
            # Force a failing grade if the document is structurally broken
            score = min(score, random.randint(5, 25))
            
        return min(max(score, 1), 99)  # Clamp between 1-99 for realistic bounds

class GraphTrustNetwork:
    def __init__(self):
        self.G = nx.DiGraph()
        self.known_trusted = ["ABC University", "XYZ College", "National Institute", "Stanford", "MIT", "Global Tech"]
        self.known_fraud = ["Diploma Mill 1", "Fake University 2", "Quick Degree Online"]
        
        self._build_initial_graph()
            
    def _build_initial_graph(self):
        for inst in self.known_trusted:
            self.G.add_node(inst, type="institution", trust_rank=random.uniform(0.85, 0.99))
        for inst in self.known_fraud:
            self.G.add_node(inst, type="institution", trust_rank=random.uniform(0.01, 0.2))
            
    def add_certificate(self, cert_id: str, institution: str, trust_score: int):
        self.G.add_node(cert_id, type="certificate", score=trust_score)
        self.G.add_edge(institution, cert_id, type="issued")
            
    def evaluate_institution_graph_score(self, institution_name: str) -> float:
        # Exact match or partial match
        for node in self.G.nodes(data=True):
            if node[1].get('type') == 'institution':
                if institution_name.lower() in str(node[0]).lower():
                    return node[1].get('trust_rank', 0.5)
        
        # New institution - assign a default neutral-low trust rank until proven otherwise
        self.G.add_node(institution_name, type="institution", trust_rank=0.55)
        return 0.55

ml_engine = MLRiskEngine()
graph_network = GraphTrustNetwork()
