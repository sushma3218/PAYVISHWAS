"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Bot, Cpu, Loader2 } from "lucide-react";

export default function AgentActivity() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/phase2/agents/activity");
        if (res.ok) {
          const data = await res.json();
          setAgents(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Bot className="w-6 h-6 mr-3 text-primary" />
          Swarm OS: Agent Telemetry
        </h1>
        <p className="text-muted-foreground mt-2">
          Live performance metrics for each independent autonomous agent within the PAYVISHWAS Swarm.
        </p>
      </div>

      {loading && agents.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, idx) => (
            <Card key={idx} className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{agent.agent}</span>
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription className="h-10 line-clamp-2">{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 bg-slate-50 p-4 rounded-lg flex flex-col items-center justify-center border">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                    {agent.metric_name}
                  </span>
                  <span className="text-4xl font-bold text-slate-800">
                    {agent.metric_value.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}