"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, AlertTriangle, Search, Undo2, Bell, Cpu, FileText, BookOpen, Settings2, SlidersHorizontal } from "lucide-react";

export const PayvishwasLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-primary"
    />
    <path 
      d="M7.5 11 L 10.5 14 L 11.5 11.5 L 9 8.5 Z" 
      fill="currentColor"
      className="text-primary"
    />
    <path 
      d="M10 13 L 15.5 6 L 17 6.5 L 12.5 15.5 L 10.5 15.5 Z" 
      fill="#3385ff" 
    />
  </svg>
);

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", icon: Activity, href: "/" },
    { name: "Live Payments", icon: Activity, href: "/live-payments" },
    { name: "Risk Center", icon: AlertTriangle, href: "/risk" },
    { name: "Investigations", icon: Search, href: "/investigations" },
    { name: "Recovery Demo", icon: Undo2, href: "/demo" },
    { name: "Proactive Alerts", icon: Bell, href: "/proactive-alerts" },
    { name: "Agent Activity", icon: Cpu, href: "/agent-activity" },
    { name: "Audit Trail", icon: FileText, href: "/audit-trail" },
    { name: "Learning", icon: BookOpen, href: "/learning" },
    { name: "Policies", icon: SlidersHorizontal, href: "/policies" },
    { name: "Settings", icon: Settings2, href: "/settings" },
  ];

  return (
    <aside className="w-64 bg-sidebar flex-shrink-0 flex flex-col h-full border-r border-sidebar-border">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <PayvishwasLogo className="w-6 h-6 mr-2" />
        <span className="text-sidebar-foreground font-bold text-lg tracking-wide">PAYVISHWAS</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary' 
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-primary' : ''}`} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            R
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-sidebar-foreground">Razorpay Merchant</p>
            <p className="text-xs text-sidebar-foreground/60">Live Mode</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
