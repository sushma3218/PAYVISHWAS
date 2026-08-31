"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Lightbulb, Loader2, Network } from "lucide-react";

export default function ProactiveAlerts() {
  const [alerts, setAlerts] = useState<any>({ current: [], past: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/phase2/alerts/proactive`);
        if (res.ok) {
          const data = await res.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && alerts.current.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Network className="w-6 h-6 mr-3 text-primary" />
          Proactive System Alerts
        </h1>
        <p className="text-muted-foreground mt-2">
          The Proactive Health Agent constantly scans global transaction data to detect anomalies and degradations before merchants even notice.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold border-b pb-2">Active Anomalies</h2>
        {alerts.current.length === 0 ? (
          <div className="bg-slate-50 border-dashed border-2 p-4 rounded-lg relative w-full">
            <h5 className="mb-1 font-medium leading-none tracking-tight text-emerald-700">System Optimal</h5>
            <div className="text-sm [&_p]:leading-relaxed text-emerald-600/80">
              No network degradations or systemic anomalies detected by the Health Agent across all payment rails.
            </div>
          </div>
        ) : (
          alerts.current.map((alert: any, idx: number) => (
            <Card key={idx} className="border-2 border-red-500 shadow-md shadow-red-500/20 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-red-500 animate-pulse"></div>
              <CardHeader className="bg-red-50/50">
                <CardTitle className="text-red-700 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {alert.type.replace(/_/g, " ")} ({alert.method})
                </CardTitle>
                <CardDescription className="text-red-900/70 font-medium">Severity: {alert.severity}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-lg font-medium">{alert.message}</p>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start">
                  <Lightbulb className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">AI Recommendation</h4>
                    <p className="text-blue-800 text-sm mt-1">{alert.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <h2 className="text-lg font-semibold border-b pb-2 mt-12 pt-8">Historical Warnings</h2>
        {alerts.past.map((alert: any, idx: number) => (
          <Card key={idx} className="opacity-70 hover:opacity-100 transition-opacity">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                  {alert.type.replace(/_/g, " ")}
                </CardTitle>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{alert.message}</p>
              <p className="text-sm text-muted-foreground mt-2 italic">Action taken: {alert.recommendation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}