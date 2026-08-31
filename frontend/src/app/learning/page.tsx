"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, ArrowRight, Loader2, GitMerge } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LearningInsights() {
  const [data, setData] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const [res, metricsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/phase2/learning/insights"),
          fetch("http://127.0.0.1:8000/api/dashboard/metrics")
        ]);
        
        if (res.ok && metricsRes.ok) {
          const [json, metricsJson] = await Promise.all([res.json(), metricsRes.json()]);
          setData(json);
          setMetrics(metricsJson);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLearning();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Brain className="w-6 h-6 mr-3 text-primary" />
          Continuous Learning & Model Insights
        </h1>
        <p className="text-muted-foreground mt-2">
          The Memory & Learning Agent continuously compares its predictions against actual financial outcomes to recalibrate weights in real-time.
        </p>
      </div>

      {loading || !data ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top level stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground font-semibold uppercase">Total Learning Events</span>
                  <span className="text-4xl font-bold text-primary mt-2">{data.learning_events.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground mt-2">Feedback loops completed</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground font-semibold uppercase">Model Drift</span>
                  <span className="text-4xl font-bold text-primary mt-2">{data.model_drift}</span>
                  <span className="text-xs text-muted-foreground mt-2">Within acceptable parameters</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HELD OUT TEST SET METRICS (TRACK 02 HACKATHON REQUIREMENT) */}
          {metrics && (
            <Card className="border-emerald-500 shadow-sm shadow-emerald-500/20">
              <CardHeader className="bg-emerald-50/50 border-b">
                <CardTitle className="text-emerald-700 flex items-center">
                  Held-Out Test Set Evaluation
                  <Badge className="ml-3 bg-emerald-500 hover:bg-emerald-600 text-xs">Track 02 Metrics</Badge>
                </CardTitle>
                <CardDescription>
                  Evaluated on {metrics.total_test_samples.toLocaleString()} synthetic samples strictly isolated from the training data.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="border p-4 rounded-lg bg-slate-50 text-center">
                    <div className="text-sm font-semibold text-muted-foreground uppercase">Precision</div>
                    <div className="text-3xl font-bold text-slate-800 mt-1">{(metrics.precision * 100).toFixed(1)}%</div>
                  </div>
                  <div className="border p-4 rounded-lg bg-slate-50 text-center">
                    <div className="text-sm font-semibold text-muted-foreground uppercase">Recall</div>
                    <div className="text-3xl font-bold text-slate-800 mt-1">{(metrics.recall * 100).toFixed(1)}%</div>
                  </div>
                  <div className="border p-4 rounded-lg bg-slate-50 text-center">
                    <div className="text-sm font-semibold text-muted-foreground uppercase">F1-Score</div>
                    <div className="text-3xl font-bold text-slate-800 mt-1">{(metrics.f1_score * 100).toFixed(1)}%</div>
                  </div>
                  <div className="border p-4 rounded-lg bg-slate-50 text-center">
                    <div className="text-sm font-semibold text-red-600 uppercase">False Positives</div>
                    <div className="text-3xl font-bold text-slate-800 mt-1">{metrics.false_positives}</div>
                    <div className="text-xs text-muted-foreground mt-1 text-red-500">Cost: ₹{metrics.false_positive_cost.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border">
                  <h4 className="font-semibold text-slate-800 mb-4">Cost Analysis (The Business Impact)</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    The model made <strong className="text-red-500">{metrics.false_positives} False Positives</strong> (Safe transactions incorrectly blocked, costing us roughly ₹500 in margin per lost sale) and <strong className="text-amber-500">{metrics.false_negatives} False Negatives</strong> (Fraud transactions incorrectly allowed, costing us roughly ₹15,000 per chargeback).
                  </p>
                  <div className="flex flex-col space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1 font-medium">
                        <span className="text-red-600">Cost of False Positives (Friction)</span>
                        <span>₹{metrics.false_positive_cost.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-red-100 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(metrics.false_positive_cost / (metrics.false_positive_cost + metrics.false_negative_cost)) * 100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1 font-medium">
                        <span className="text-amber-600">Cost of False Negatives (Chargebacks)</span>
                        <span>₹{metrics.false_negative_cost.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-amber-100 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(metrics.false_negative_cost / (metrics.false_positive_cost + metrics.false_negative_cost)) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Adjustments */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Weight Adjustments</CardTitle>
                <CardDescription>Live feedback loops processed by the Memory Agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.recent_adjustments.map((adj: any, i: number) => (
                  <div key={i} className="border p-4 rounded-lg bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-mono text-sm text-slate-500">{adj.payment_id}</span>
                      <span className="text-xs text-muted-foreground">{adj.time}</span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 mb-4 bg-white p-3 rounded border border-dashed">
                      <div className="text-center flex-1">
                        <div className="text-xs text-muted-foreground mb-1 uppercase font-bold">Predicted</div>
                        <Badge variant="outline" className={adj.predicted.includes("SAFE") ? "text-emerald-600" : "text-red-600"}>{adj.predicted}</Badge>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 shrink-0" />
                      <div className="text-center flex-1">
                        <div className="text-xs text-muted-foreground mb-1 uppercase font-bold">Actual</div>
                        <Badge variant="default" className={adj.actual === "RECOVERED" ? "bg-emerald-500" : "bg-red-500"}>{adj.actual}</Badge>
                      </div>
                    </div>

                    <div className="flex items-start text-sm">
                      <GitMerge className="w-4 h-4 text-blue-500 mr-2 mt-0.5 shrink-0" />
                      <span className="font-medium text-slate-700">{adj.adjustment}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Feature Importance */}
            <Card>
              <CardHeader>
                <CardTitle>Global Feature Weights</CardTitle>
                <CardDescription>Current model attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.feature_importance.map((feature: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{feature.name}</span>
                      <span className="text-muted-foreground">{(feature.weight * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${feature.weight * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}