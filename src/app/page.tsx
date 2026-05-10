
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  Zap, 
  Code2, 
  Activity,
  Server,
  Braces,
  ChevronDown,
  LogIn,
  Rocket,
  Book,
  Globe,
  Settings,
  History,
  FileCode
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

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
        
        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
            <Link href="/api-reference" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">API Reference</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground gap-1 px-0 h-auto hover:bg-transparent">
                  Resources <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><Link href="/changelog" className="cursor-pointer">Changelog</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/guides" className="cursor-pointer">Engineering Guides</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/status" className="cursor-pointer">System Status</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-sm font-bold border-primary/20 hover:bg-primary/10 text-primary gap-1 px-4 rounded-full">
                  Access Portal <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuItem asChild className="p-3">
                  <Link href="/login" className="flex items-center gap-3 cursor-pointer text-primary font-bold">
                    <Rocket className="h-5 w-5" />
                    <div className="flex flex-col">
                      <span>Start Building</span>
                      <span className="text-[10px] font-normal text-muted-foreground">Get your test keys</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center gap-2 cursor-pointer py-2 px-3">
                    <LogIn className="h-4 w-4 text-muted-foreground" /> Merchant Sign In
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center gap-2 cursor-pointer py-2 px-3 text-accent font-semibold">
                    <Zap className="h-4 w-4" /> Guest Sandbox Access
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="md:hidden" />
                
                {/* Mobile-only menu items */}
                <div className="md:hidden">
                  <DropdownMenuItem asChild>
                    <Link href="/docs" className="flex items-center gap-2 cursor-pointer py-2 px-3">
                      <Book className="h-4 w-4 text-muted-foreground" /> Documentation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/api-reference" className="flex items-center gap-2 cursor-pointer py-2 px-3">
                      <Globe className="h-4 w-4 text-muted-foreground" /> API Reference
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/changelog" className="flex items-center gap-2 cursor-pointer py-2 px-3">
                      <History className="h-4 w-4 text-muted-foreground" /> Changelog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/guides" className="flex items-center gap-2 cursor-pointer py-2 px-3">
                      <FileCode className="h-4 w-4 text-muted-foreground" /> Engineering Guides
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/status" className="flex items-center gap-2 cursor-pointer py-2 px-3">
                      <Settings className="h-4 w-4 text-muted-foreground" /> System Status
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(84,142,250,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Server className="h-3 w-3" />
            <span className="uppercase tracking-widest">Reliability-focused architecture</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-foreground mb-8 leading-[1.1]">
            The infrastructure layer for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">next-gen commerce</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Moxiz provides the APIs, webhooks, and sandbox environments backend engineers need to build robust, scalable payment flows without the infrastructure overhead.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button size="lg" className="rounded-full bg-primary text-white h-12 px-8 text-md font-bold w-full sm:w-auto group" asChild>
              <Link href="/login">
                Start Building <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-md font-bold bg-white/5 border-white/10 hover:bg-white/10 w-full sm:w-auto" asChild>
              <Link href="/docs/integration-guide">Read the Integration Guide</Link>
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
                <span className="text-primary">curl</span> <span className="text-accent">https://moxiz-gateway.vercel.app/payments</span> \
                <div className="pl-4 text-white/70">
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
                  <Activity className="h-3 w-3 text-accent" /> Sandbox Logs
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
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Simulated API Latency</h4>
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
                <span className="text-muted-foreground">Demo Environment P99</span>
                <span className="text-white">124ms</span>
              </div>
            </div>
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard/developers" className="hover:text-primary transition-colors">API Keys</Link></li>
                <li><Link href="/dashboard/webhooks" className="hover:text-primary transition-colors">Webhooks</Link></li>
                <li><Link href="/dashboard/sandbox" className="hover:text-primary transition-colors">Sandbox</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-primary transition-colors">Docs</Link></li>
                <li><Link href="/guides" className="hover:text-primary transition-colors">Guides</Link></li>
                <li><Link href="/api-explorer" className="hover:text-primary transition-colors">API Explorer</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/status" className="hover:text-primary transition-colors">Status</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-primary transition-colors">Security Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium">
          <p>© 2026 Moxiz Infrastructure Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
