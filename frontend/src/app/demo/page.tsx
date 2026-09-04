"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Loader2, CheckCircle, XCircle, ArrowRight, Smartphone, ShieldCheck, Activity, Search, AlertTriangle, ShieldAlert } from "lucide-react";

export default function DemoCenter() {
  const [checkoutState, setCheckoutState] = useState<"idle" | "processing" | "failed">("idle");
  const [swarmState, setSwarmState] = useState<"idle" | "working" | "resolved">("idle");
  const [scenario, setScenario] = useState<string>("low_risk");
  const [apiResponse, setApiResponse] = useState<any>(null);
  
  // Swarm steps visualization
  const [activeStep, setActiveStep] = useState<number>(-1);
  const getStepsForScenario = (currentScenario: string) => {
    if (currentScenario === "high_risk") {
      return [
        { name: "Diagnosis Agent", desc: "Analyzing failure root cause...", result: "Suspicious Pattern Detected", icon: Search, color: "text-blue-500" },
        { name: "Context Agent", desc: "Retrieving customer history...", result: "Low LTV Customer, High fraud velocity", icon: Activity, color: "text-indigo-500" },
        { name: "Risk Agent", desc: "Evaluating recovery risk...", result: "Risk Score: 85 (High) - Escalate", icon: AlertTriangle, color: "text-red-500" },
        { name: "Policy Gatekeeper", desc: "Checking merchant rules...", result: "Rule failed: High Risk & Transaction > ₹1,00,000", icon: ShieldAlert, color: "text-red-500" },
        { name: "Recovery Agent", desc: "Formulating optimal strategy...", result: "Block user and alert fraud team", icon: ShieldAlert, color: "text-red-500" },
      ];
    } else if (currentScenario === "idempotency") {
      return [
        { name: "Diagnosis Agent", desc: "Analyzing failure root cause...", result: "Duplicate Webhook Detected", icon: Search, color: "text-blue-500" },
        { name: "Context Agent", desc: "Retrieving customer history...", result: "Checking previous events...", icon: Activity, color: "text-indigo-500" },
        { name: "Risk Agent", desc: "Evaluating recovery risk...", result: "Risk Score: 0 (N/A) - Idempotent", icon: AlertTriangle, color: "text-amber-500" },
        { name: "Policy Gatekeeper", desc: "Checking merchant rules...", result: "Rule pass: Idempotency enforced", icon: ShieldCheck, color: "text-emerald-500" },
        { name: "Recovery Agent", desc: "Formulating optimal strategy...", result: "Ignore duplicate webhook silently", icon: ShieldCheck, color: "text-emerald-500" },
      ];
    } else if (currentScenario === "unknown_state") {
      return [
        { name: "Diagnosis Agent", desc: "Analyzing failure root cause...", result: "Unknown State Detected", icon: Search, color: "text-blue-500" },
        { name: "Context Agent", desc: "Retrieving customer history...", result: "Standard User profile", icon: Activity, color: "text-indigo-500" },
        { name: "Risk Agent", desc: "Evaluating recovery risk...", result: "Risk Score: 50 (Medium) - Verify first", icon: AlertTriangle, color: "text-amber-500" },
        { name: "Policy Gatekeeper", desc: "Checking merchant rules...", result: "Rule pass: Pending verification", icon: ShieldCheck, color: "text-emerald-500" },
        { name: "Recovery Agent", desc: "Formulating optimal strategy...", result: "Query bank API for actual state", icon: Activity, color: "text-purple-500" },
      ];
    }
    return [
      { name: "Diagnosis Agent", desc: "Analyzing failure root cause...", result: "Bank Timeout Detected (Transient)", icon: Search, color: "text-blue-500" },
      { name: "Context Agent", desc: "Retrieving customer history...", result: "High LTV Customer, No past fraud", icon: Activity, color: "text-indigo-500" },
      { name: "Risk Agent", desc: "Evaluating recovery risk...", result: "Risk Score: 12 (Low) - Safe to proceed", icon: AlertTriangle, color: "text-amber-500" },
      { name: "Policy Gatekeeper", desc: "Checking merchant rules...", result: "Rule pass: Transaction < ₹1,00,000", icon: ShieldCheck, color: "text-emerald-500" },
      { name: "Recovery Agent", desc: "Formulating optimal strategy...", result: "Deploy alternate payment link via SMS", icon: Smartphone, color: "text-purple-500" },
    ];
  };

  const steps = getStepsForScenario(scenario);

  const simulateCheckout = async () => {
    setCheckoutState("processing");
    setSwarmState("idle");
    setActiveStep(-1);
    setApiResponse(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/demo/simulate?scenario=${scenario}`, {
        method: 'POST'
      });
      const data = await res.json();
      setApiResponse(data);
      
      setCheckoutState("failed");
      triggerSwarm();
    } catch (e) {
      console.error(e);
      setCheckoutState("failed");
    }
  };

  const triggerSwarm = () => {
    setSwarmState("working");
    let currentStep = 0;
    
    // Animate through the swarm steps
    const interval = setInterval(() => {
      setActiveStep(currentStep);
      currentStep++;
      
      if (currentStep > steps.length) {
        clearInterval(interval);
        setSwarmState("resolved");
      }
    }, 1200); // 1.2s per agent to make it readable
  };

  const resetDemo = () => {
    setCheckoutState("idle");
    setSwarmState("idle");
    setActiveStep(-1);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recovery Pipeline Visualizer</h1>
        <p className="text-muted-foreground">
          Experience the end-to-end flow. Simulate a customer checkout failure and watch the Swarm agents react in real-time.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Checkout Simulation UI */}
        <Card className="border-2 border-muted shadow-sm">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle>1. Customer Checkout</CardTitle>
            <CardDescription>
              Simulate a standard Razorpay checkout experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4 p-4 border rounded-lg bg-white">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="font-bold text-lg">Razorpay Test Store</div>
                <div className="text-xl font-bold">₹50,000.00</div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select defaultValue="upi">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI (GPay / PhonePe / Paytm)</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 mt-4">
                  <Label>Demo Scenario</Label>
                  <Select value={scenario} onValueChange={(val) => { if (val) setScenario(val); }} disabled={checkoutState !== "idle"}>
                    <SelectTrigger className="border-blue-300 bg-blue-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low_risk">Scenario 1: Low Risk Timeout</SelectItem>
                      <SelectItem value="high_risk">Scenario 2: High Risk / High Value (Escalate)</SelectItem>
                      <SelectItem value="idempotency">Scenario 3: Webhook Idempotency</SelectItem>
                      <SelectItem value="unknown_state">Scenario 4: Unknown State Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label>UPI ID</Label>
                  <Input defaultValue="customer@okhdfcbank" disabled={checkoutState !== "idle"} />
                </div>
              </div>
            </div>

            {checkoutState === "failed" && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start border border-destructive/20 animate-in fade-in slide-in-from-top-4">
                <XCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Payment Failed</h4>
                  <p className="text-sm opacity-90 mt-1">Bank servers are currently unresponsive (Timeout). Please try again later.</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50 border-t pt-4 flex justify-between">
            {checkoutState === "failed" ? (
              <Button variant="outline" onClick={resetDemo}>Reset Checkout</Button>
            ) : (
              <Button 
                onClick={simulateCheckout} 
                disabled={checkoutState !== "idle"} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {checkoutState === "processing" ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...</>
                ) : (
                  "Pay ₹50,000 securely"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* AI Swarm Visualization UI */}
        <Card className={`border-2 transition-colors duration-500 ${swarmState === "working" ? "border-primary shadow-md shadow-primary/20" : swarmState === "resolved" ? "border-emerald-500 shadow-md shadow-emerald-500/20" : "border-muted"}`}>
          <CardHeader className="bg-slate-950 text-slate-50 rounded-t-lg border-b border-slate-800">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-emerald-400">2. PAYVISHWAS Swarm OS</CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  Autonomous agents intercepting the failed webhook...
                </CardDescription>
              </div>
              <div className="flex h-3 w-3 relative">
                {swarmState === "working" && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </>
                )}
                {swarmState === "resolved" && (
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                )}
                {swarmState === "idle" && (
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-700"></span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-6 bg-slate-50 h-[480px] overflow-y-auto">
            {swarmState === "idle" ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <ShieldAlert className="w-16 h-16 mb-4" />
                <p>System idle. Waiting for webhook triggers...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Dynamic Step Pipeline */}
                {steps.map((step, idx) => (
                  <div key={idx} className={`transition-all duration-500 ${activeStep >= idx ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 hidden"}`}>
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep > idx ? 'bg-emerald-100 text-emerald-600' : activeStep === idx ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                          {activeStep > idx ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                        </div>
                        {idx !== steps.length - 1 && (
                          <div className={`w-0.5 h-full my-1 ${activeStep > idx ? 'bg-emerald-200' : 'bg-slate-200'}`}></div>
                        )}
                      </div>
                      <div className="pb-4 pt-1 flex-1">
                        <p className="font-semibold text-sm flex items-center">
                          {step.name}
                          {activeStep === idx && <Loader2 className="w-3 h-3 ml-2 animate-spin text-muted-foreground" />}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activeStep === idx ? step.desc : step.result}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Final Resolution Box */}
                {swarmState === "resolved" && (
                  <div className="mt-8 p-4 bg-slate-50 border rounded-lg animate-in fade-in slide-in-from-bottom-4">
                    <h4 className="font-bold flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
                      Backend Processing Completed
                    </h4>
                    <p className="text-sm mb-4 text-slate-700">
                      The backend FastApi swarm orchestrator successfully processed the webhook.
                    </p>
                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-md text-xs font-mono overflow-auto max-h-40">
                      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
