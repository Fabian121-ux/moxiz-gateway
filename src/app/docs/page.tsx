
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Book, Code, Terminal, Zap } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Moxiz</span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Back to Home</Link>
        </Button>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full p-8 md:p-12 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Documentation</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to integrate Moxiz into your backend infrastructure.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Zap, title: "Quickstart Guide", desc: "Get your first test payment running in under 5 minutes." },
            { icon: Code, title: "SDK References", desc: "Official libraries for Node.js, Python, and Go." },
            { icon: Terminal, title: "CLI Tooling", desc: "Manage your sandbox environment from your terminal." },
            { icon: Book, title: "Core Concepts", desc: "Understand idempotency, webhooks, and security." },
          ].map((item, i) => (
            <div key={i} className="p-6 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors cursor-pointer group">
              <item.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-primary/5 border border-primary/20 rounded-2xl">
          <h4 className="font-bold text-primary mb-2">Need help?</h4>
          <p className="text-sm text-muted-foreground mb-4">Our engineering support team is available for technical consultations regarding your payment architecture.</p>
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">Contact Engineering Support</Button>
        </div>
      </main>
    </div>
  );
}
