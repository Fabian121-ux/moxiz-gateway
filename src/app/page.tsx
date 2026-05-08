
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  Zap, 
  Code2, 
  Activity,
  History,
  Server,
  Database,
  CheckCircle2,
  ChevronRight,
  Braces
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full z-20">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">Moxiz</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link>
          <Link href="/api-reference" className="hover:text-foreground transition-colors">API Reference</Link>
          <Link href="/status" className="hover:text-foreground transition-colors">System Status</Link>
          <Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Sign in</Link>
          <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 rounded-full group">
            Start Building <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(84,142,250,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Server className="h-3 w-3" />
            <span className="uppercase tracking-widest">99.99% Uptime SLA Guaranteed</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-foreground mb-8 leading-[1.1]">
            The infrastructure layer for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">next-gen commerce</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Moxiz provides the APIs, webhooks, and sandbox environments backend engineers need to build robust, scalable payment flows without the infrastructure overhead.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button size="lg" className="rounded-full bg-primary text-white h-12 px-8 text-md font-bold w-full sm:w-auto">
              Get API Keys
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-md font-bold bg-white/5 border-white/10 hover:bg-white/10 w-full sm:w-auto">
              Read the Integration Guide
            </Button>
          </div>
        </div>

        {/* Developer Canvas Visuals */}
        <div className="relative w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 px-4">
          {/* API Request Example */}
          <div className="md:col-span-7 bg-card border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[420px]">
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-white/10"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-white/10"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-white/10"></div>
              </div>
              <div className="text-[10px] text-muted-foreground font-code uppercase tracking-wider flex items-center gap-1.5">
                <Braces className="h-3 w-3" /> POST /v1/payments
              </div>
            </div>
            <div className="flex-1 p-6 font-code text-sm overflow-hidden bg-black/20">
              <div className="flex flex-col gap-1">
                <span className="text-primary">curl</span> <span className="text-accent">https://api.moxiz.io/v1/payments</span> \
                <div className="pl-4">
                  -u sk_test_51Mz...: \<br />
                  -d amount=2000 \<br />
                  -d currency="usd" \<br />
                  -d customer="cus_9912" \<br />
                  -d description="Standard Subscription"
                </div>
                <div className="mt-4 border-t border-white/5 pt-4">
                  <span className="text-muted-foreground">// Response</span><br />
                  <span className="text-emerald-500">201 Created</span><br />
                  <pre className="text-xs text-white/80 mt-2">
{`{
  "id": "pay_88xJ21",
  "object": "payment_intent",
  "amount": 2000,
  "status": "requires_payment_method",
  "client_secret": "pi_3M..._secret_9K..."
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Metrics */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="bg-card border border-white/10 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Activity className="h-3 w-3 text-accent" /> Webhook Log
                </h4>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded uppercase">Live</span>
              </div>
              <div className="space-y-3">
                {[
                  { event: "payment.succeeded", time: "just now", status: "200 OK" },
                  { event: "payment.failed", time: "2m ago", status: "200 OK" },
                  { event: "customer.created", time: "5m ago", status: "200 OK" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] font-code border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{log.event}</span>
                      <span className="text-muted-foreground text-[10px]">{log.time}</span>
                    </div>
                    <span className="text-emerald-500 font-bold">{log.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-white/10 rounded-xl p-6 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">API Performance</h4>
                <div className="flex items-end gap-1 h-24">
                  {[40, 45, 38, 52, 60, 48, 42, 35, 39, 44, 50, 48, 40, 42].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors" 
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">P99 Latency</span>
                <span className="text-white">124ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Focus Section */}
      <section className="bg-card/30 border-t border-white/5 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-bold font-headline tracking-tight mb-4 text-center">Built for performance engineering.</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg font-medium">
              We focus on the technical details so you can focus on your product.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: History,
                title: "Complete Lifecycle Hooks",
                desc: "Every transaction state change triggers a verifiable webhook. Full idempotency support for reliable retry logic."
              },
              {
                icon: Database,
                title: "Structured Metadata",
                desc: "Attach arbitrary data to any object. Query, filter, and export based on your own custom business logic."
              },
              {
                icon: Code2,
                title: "First-Class Sandbox",
                desc: "A mirrored environment that behaves exactly like production. Test edge cases, failures, and delays safely."
              }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 group p-6 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="bg-primary/10 p-3 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                <div className="flex items-center text-xs font-bold text-primary group-hover:gap-2 transition-all cursor-pointer">
                  VIEW DOCS <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Transparency */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        <div className="bg-black/40 border border-white/10 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" /> All Systems Operational
            </div>
            <h2 className="text-3xl font-bold font-headline">Transparency is our core API.</h2>
            <p className="text-muted-foreground text-lg">
              Our status page provides real-time latency and uptime metrics for every regional endpoint. No black boxes, just infrastructure you can trust.
            </p>
            <Button variant="link" className="p-0 text-primary font-bold text-md h-auto hover:no-underline flex items-center gap-2 group">
              Explore public status metrics <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4 w-full md:max-w-xs">
            {[
              { label: "API Uptime", val: "99.999%" },
              { label: "Webhook Lag", val: "<100ms" },
              { label: "Auth Latency", val: "45ms" },
              { label: "Success Rate", val: "99.98%" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold font-headline mb-1">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-8 bg-sidebar">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">Moxiz</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional payment infrastructure for the modern internet. Scalable, secure, and developer-first.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">API Keys</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Webhooks</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Sandbox</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Docs</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Guides</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">API Explorer</Link></li>
              </ul>
            </div>
            <div className="space-y-4 hidden md:block">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <p>© 2024 Moxiz Infrastructure Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground">Security Policy</Link>
            <Link href="#" className="hover:text-foreground">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

