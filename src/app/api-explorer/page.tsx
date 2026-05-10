
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Terminal, Play, Lock } from "lucide-react";

export default function ApiExplorerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Moxiz Explorer</span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </Button>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-8 text-center">
        <div className="bg-card border border-border p-12 rounded-3xl space-y-6">
          <Terminal className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-4xl font-bold font-headline">Interactive API Explorer</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Test and debug Moxiz API endpoints directly from your browser. Authenticate with your test keys and see real responses.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-primary gap-2" asChild>
              <Link href="/login">
                <Lock className="h-4 w-4" /> Authenticate to Start
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Play className="h-4 w-4" /> View Sandbox Logs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-xl bg-card/30">
            <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Base Endpoint</div>
            <div className="text-sm font-code text-primary">/v1/payments</div>
          </div>
          <div className="p-4 border border-border rounded-xl bg-card/30">
            <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Auth Type</div>
            <div className="text-sm font-code text-primary">Bearer Token</div>
          </div>
          <div className="p-4 border border-border rounded-xl bg-card/30">
            <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Environment</div>
            <div className="text-sm font-code text-primary">Sandbox (Test)</div>
          </div>
        </div>
      </main>
    </div>
  );
}
