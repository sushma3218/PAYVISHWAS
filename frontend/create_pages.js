const fs = require('fs');
const path = require('path');

const pages = [
    { slug: 'live-payments', title: 'Live Payments', desc: 'Real-time feed of all incoming transactions and AI intelligence layers.' },
    { slug: 'proactive-alerts', title: 'Proactive Alerts', desc: 'Systemic anomaly detection and network health warnings from the AI.' },
    { slug: 'agent-activity', title: 'Agent Activity', desc: 'Global metrics and performance logs for the AI Swarm agents.' },
    { slug: 'audit-trail', title: 'Audit Trail', desc: 'Immutable logs of every decision and action taken by PAYVISHWAS.' },
    { slug: 'learning', title: 'Learning & Insights', desc: 'Feedback loop and continuous learning metrics for the AI models.' },
    { slug: 'policies', title: 'Safety Policies', desc: 'Configuration for merchant-defined guardrails and risk limits.' },
    { slug: 'settings', title: 'Settings', desc: 'Preferences, API keys, and integration settings.' }
];

const baseDir = path.join(__dirname, 'src', 'app');

const template = (title, desc) => `import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function Page() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">${title}</h1>
        <p className="text-muted-foreground">
          ${desc}
        </p>
      </div>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center h-[400px] text-muted-foreground space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <Lock className="w-8 h-8" />
          </div>
          <p className="text-sm">This module is currently in development for Phase 2.</p>
        </CardContent>
      </Card>
    </div>
  );
}`;

pages.forEach(p => {
    const dirPath = path.join(baseDir, p.slug);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, 'page.tsx'), template(p.title, p.desc));
});

console.log('Pages created successfully.');
