"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function LivePayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/phase2/payments/live");
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        }
      } catch (error) {
        console.error("Failed to fetch live payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
    const interval = setInterval(fetchPayments, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RECOVERED": return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "FAILED": return <XCircle className="w-5 h-5 text-destructive" />;
      case "CREATED": return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "LOW": return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">LOW RISK</Badge>;
      case "MEDIUM": return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">MED RISK</Badge>;
      case "HIGH": return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">HIGH RISK</Badge>;
      default: return <Badge variant="outline">PENDING</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Activity className="w-6 h-6 mr-3 text-primary" />
          Live Payments & AI Intelligence Stream
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time feed of all incoming transactions with inline AI swarm annotations and risk evaluations.
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle>Global Transaction Stream</CardTitle>
          <CardDescription>Live polling enabled (3s)</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading && payments.length === 0 ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-slate-100/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Time</th>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">AI Risk Eval</th>
                    <th className="px-6 py-4 font-medium">Swarm Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{p.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{p.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold">{p.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(p.status)}
                          <span className="font-semibold">{p.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRiskBadge(p.risk_level)}
                        {p.risk_score && <span className="text-xs text-muted-foreground ml-2">({(p.risk_score * 100).toFixed(0)}/100)</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.latest_action !== "None" ? (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            {p.latest_action}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">Awaiting Agent...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No transactions found in the database. Send a webhook to see it here!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}