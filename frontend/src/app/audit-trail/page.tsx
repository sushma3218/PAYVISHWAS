"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Terminal, Shield, Lock, FileText, Loader2 } from "lucide-react";

export default function AuditTrail() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/phase2/audit/logs");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Shield className="w-6 h-6 mr-3 text-primary" />
          Immutable Audit Trail
        </h1>
        <p className="text-muted-foreground mt-2">
          Every decision made by an AI agent and validated by the Safety Gatekeeper is permanently logged for compliance and explainability.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-950 text-slate-50 overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-slate-800 bg-slate-900 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-emerald-400 flex items-center text-lg">
              <Terminal className="w-5 h-5 mr-2" />
              system/var/log/payvishwas_audit.log
            </CardTitle>
            <div className="flex space-x-2 text-slate-500">
              <Lock className="w-4 h-4" />
              <FileText className="w-4 h-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] overflow-y-auto font-mono text-xs sm:text-sm p-4 space-y-2">
            {loading && logs.length === 0 ? (
              <div className="flex items-center text-slate-500">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting to secure log stream...
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="group hover:bg-slate-800/50 p-1 -mx-1 rounded">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className={`shrink-0 font-bold ${log.actor === 'SafetyGatekeeper' ? 'text-amber-400' : 'text-blue-400'}`}>
                      {log.actor.padEnd(16)}
                    </span>
                    <span className="text-purple-400 shrink-0">[{log.action}]</span>
                    <span className="text-emerald-400 shrink-0">[{log.status}]</span>
                    <span className="text-slate-300 break-words">{log.resource} : {log.details}</span>
                  </div>
                </div>
              ))
            )}
            {!loading && logs.length === 0 && (
              <div className="text-slate-500 italic">No audit logs found. Run a transaction to generate logs.</div>
            )}
            <div className="text-emerald-500/50 flex items-center mt-4 animate-pulse">
              <span className="mr-2">_</span> waiting for new events...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}