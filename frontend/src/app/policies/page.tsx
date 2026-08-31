"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SlidersHorizontal, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Policies() {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <SlidersHorizontal className="w-6 h-6 mr-3 text-primary" />
          Financial Guardrails & Policies
        </h1>
        <p className="text-muted-foreground mt-2">
          Strict deterministic rules enforced by the Safety Gatekeeper that the AI agents cannot override.
        </p>
      </div>

      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600" />
            Active Merchant Policies
          </CardTitle>
          <CardDescription>Rules applied to your Razorpay integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg bg-slate-50">
              <div>
                <h4 className="font-semibold text-slate-800">Max Auto-Recovery Threshold</h4>
                <p className="text-sm text-muted-foreground">Transactions above this value require manual human approval</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-1">₹1,00,000</Badge>
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-lg bg-slate-50">
              <div>
                <h4 className="font-semibold text-slate-800">Maximum Retries</h4>
                <p className="text-sm text-muted-foreground">Hard cap on how many times an agent can retry a failed payment</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-1">2 Attempts</Badge>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg bg-slate-50">
              <div>
                <h4 className="font-semibold text-slate-800">Block Suspicious Activity</h4>
                <p className="text-sm text-muted-foreground">Automatically block users with Risk Score &gt; 90</p>
              </div>
              <Badge className="bg-emerald-500 hover:bg-emerald-600">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}