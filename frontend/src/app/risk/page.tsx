"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, Activity, ShieldAlert } from "lucide-react";

export default function RiskCenter() {
  const [metrics, setMetrics] = useState<any>(null);
  const [items, setItems] = useState([
    { id: "pay_xx920llp", reason: "Multiple cards used from same IP", risk_score: 85, amount: "₹85,000" },
    { id: "pay_zz11kk99", reason: "Unusually high transaction volume", risk_score: 92, amount: "₹4,50,000" },
  ]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard/metrics")
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(console.error);
  }, []);

  const handleAction = (id: string, action: string) => {
    alert(`Successfully applied: ${action} for ${id}`);
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Risk Center</h1>
        <p className="text-muted-foreground">
          Manual review queue for payments escalated by the Safety Gatekeeper.
        </p>
      </div>

      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Model Precision</CardTitle>
              <ShieldAlert className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(metrics.precision * 100).toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">False Positive Cost: ₹{metrics.false_positive_cost.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Model Recall</CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(metrics.recall * 100).toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">False Negative Cost: ₹{metrics.false_negative_cost.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">F1 Score</CardTitle>
              <CheckCircle className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(metrics.f1_score * 100).toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Test Set: {metrics.total_test_samples} samples</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confusion Matrix</CardTitle>
              <AlertTriangle className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono mt-2">
                <div>TP: {metrics.confusion_matrix[1][1]} | FP: {metrics.confusion_matrix[0][1]}</div>
                <div>FN: {metrics.confusion_matrix[1][0]} | TN: {metrics.confusion_matrix[0][0]}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed">
            <CheckCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">All caught up!</h3>
            <p className="text-muted-foreground text-sm">No pending items in the manual review queue.</p>
          </div>
        ) : (
          items.map(item => (
            <Card key={item.id} className="border-l-4 border-l-destructive">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
                      Review Required: {item.id}
                    </CardTitle>
                    <CardDescription className="mt-1">{item.reason}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">{item.amount}</div>
                    <Badge variant="destructive" className="mt-1">Risk Score: {item.risk_score}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md mt-2 text-sm space-y-2">
                  <p><strong>Agent Diagnosis:</strong> Potential card testing attack detected based on rapid successive failures across 4 different BINs.</p>
                  <p><strong>Proposed Action:</strong> Block User ID and refund successful captures.</p>
                  <p><strong>Gatekeeper Status:</strong> ESCALATED. Policy requires manual approval for actions involving permanent blocks.</p>
                </div>
                <div className="mt-4 flex space-x-3">
                  <Button onClick={() => handleAction(item.id, 'Approve Block')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Agent Action
                  </Button>
                  <Button onClick={() => handleAction(item.id, 'Override & Allow')} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <XCircle className="w-4 h-4 mr-2" />
                    Override & Allow Payment
                  </Button>
                  <Button variant="secondary" onClick={() => alert("Loading logs...")}>View Full Logs</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
