"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Investigations() {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Search className="w-6 h-6 mr-3 text-primary" />
          Deep Investigations
        </h1>
        <p className="text-muted-foreground mt-2">
          Historical records of complex chargebacks and escalated fraud cases requiring deep analysis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case History</CardTitle>
          <CardDescription>Recent escalated incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-blue-700 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  CASE-2991: Coordinated BIN Attack
                </h4>
                <p className="text-sm text-muted-foreground mt-1">Identified by Diagnosis Agent across 400 transactions in 5 minutes.</p>
              </div>
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">Resolved</Badge>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-blue-700 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  CASE-2990: Friendly Fraud Dispute
                </h4>
                <p className="text-sm text-muted-foreground mt-1">Customer disputed ₹50,000 claim despite successful delivery.</p>
              </div>
              <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Pending Evidence</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
