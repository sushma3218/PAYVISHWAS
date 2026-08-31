"use client";

import { Activity, CreditCard, ShieldAlert, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { useEffect, useState } from "react";

export default function Home() {
  const [stats, setStats] = useState({
    total_recovered: 0,
    active_risks: 0,
    ai_interventions: 0,
    total_volume: 0
  });
  const [interventions, setInterventions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, interventionsRes, chartRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/dashboard/stats`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/dashboard/interventions?limit=5`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/dashboard/chart`)
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (interventionsRes.ok) setInterventions(await interventionsRes.json());
        if (chartRes.ok) setChartData(await chartRes.json());
      } catch (e) {
        console.error("Error fetching dashboard data", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds for demo
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Good evening, Merchant. Payment intelligence is active.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Recovered</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.total_recovered.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Recovered value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Risks</CardTitle>
            <ShieldAlert className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.active_risks}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Interventions</CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.ai_interventions}</div>
            <p className="text-xs text-muted-foreground">Total automated actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.total_volume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Processed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Placeholder */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recovery Performance</CardTitle>
            <CardDescription>Value recovered vs Failed attempts</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '14px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#062B3A', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="recovered" name="Recovered (₹)" stackId="1" stroke="#00A86B" fill="#00A86B" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="failed" name="Failed (₹)" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Interventions</CardTitle>
            <CardDescription>Automated actions taken by PAYVISHWAS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interventions.map((event: any) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{event.action}</p>
                    <p className="text-xs text-muted-foreground">{event.id} • {event.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{event.amount}</p>
                    <p className={`text-xs ${event.status === 'High Risk' ? 'text-destructive' : 'text-primary'}`}>{event.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
