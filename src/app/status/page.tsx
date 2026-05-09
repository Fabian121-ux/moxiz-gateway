
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, CheckCircle2, Activity, Clock, Globe } from "lucide-react";

export default function StatusPage() {
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
              <p className="text-sm text-emerald-500/80 font-medium">Last updated: {new Date().toLocaleTimeString()} UTC</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-emerald-500">99.99%</div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Uptime last 90 days</div>
          </div>
        </div>

        <div className="grid gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2 px-2"><Activity className="h-4 w-4 text-primary" /> Regional Endpoints</h2>
          {[
            { region: "US-East (Virginia)", status: "Operational", latency: "45ms" },
            { region: "EU-West (Ireland)", status: "Operational", latency: "12ms" },
            { region: "AP-East (Tokyo)", status: "Operational", latency: "124ms" },
            { region: "Sandbox Environment", status: "Operational", latency: "38ms" },
          ].map((node, i) => (
            <div key={i} className="p-4 bg-card border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{node.region}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-code">{node.latency}</span>
                </div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{node.status}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
