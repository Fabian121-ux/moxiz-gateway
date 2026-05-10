
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, CheckCircle2, Activity, Clock, Globe } from "lucide-react";

export default function StatusPage() {
  const [latencies, setLatencies] = useState([45, 12, 124, 38]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencies(prev => prev.map(l => l + Math.floor(Math.random() * 5) - 2));
      setLastUpdated(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const regions = [
    { region: "US-East (Virginia)", status: "Operational" },
    { region: "EU-West (Ireland)", status: "Operational" },
    { region: "AP-East (Tokyo)", status: "Operational" },
    { region: "Sandbox Environment", status: "Operational" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Moxiz</span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </Button>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-8">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500 p-2 rounded-full shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">All Systems Operational</h1>
              <p className="text-sm text-emerald-500/80 font-medium">Last updated: {lastUpdated.toLocaleTimeString()} UTC</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-emerald-500">99.99%</div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Uptime last 90 days</div>
          </div>
        </div>

        <div className="grid gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 px-2"><Activity className="h-4 w-4 text-primary" /> Regional Endpoints</h2>
          {regions.map((node, i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{node.region}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-code">{latencies[i]}ms</span>
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{node.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border border-dashed border-border rounded-xl bg-card/30">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Infrastructure Heartbeat</h3>
          <div className="flex gap-1 h-8 items-end">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="flex-1 bg-emerald-500/40 rounded-t-sm h-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 text-center">Real-time health monitoring of edge gateway distribution.</p>
        </div>
      </main>
    </div>
  );
}
