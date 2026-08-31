"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <Settings2 className="w-6 h-6 mr-3 text-primary" />
          System Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Global configuration and API management for PAYVISHWAS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Swarm OS Configuration</CardTitle>
            <CardDescription>Adjust agent autonomy and fallback behaviors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h4 className="font-semibold">Full Autonomy Mode</h4>
                <p className="text-sm text-muted-foreground">Agents can execute recovery without human approval</p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <h4 className="font-semibold">Fallback to Manual</h4>
                <p className="text-sm text-muted-foreground">Route to human queue if confidence &lt; 85%</p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys & Webhooks</CardTitle>
            <CardDescription>Manage your gateway connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Razorpay API Key</label>
              <input type="password" value="rzp_live_xxxxxxxxxxxxx" readOnly className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook URL</label>
              <input type="text" value="https://api.payvishwas.com/webhook/razorpay" readOnly className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <Button className="w-full mt-4"><Save className="w-4 h-4 mr-2" /> Save Configuration</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}