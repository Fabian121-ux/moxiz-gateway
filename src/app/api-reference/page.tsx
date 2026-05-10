"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  ArrowLeft, 
  Copy, 
  Globe, 
  Lock, 
  User, 
  CreditCard, 
  RefreshCcw, 
  Webhook,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApiReferencePage() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", label: "Introduction", icon: FileText },
    { id: "authentication", label: "Authentication", icon: Lock },
    { id: "api-keys", label: "API Keys", icon: Globe },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "customers", label: "Customers", icon: User },
    { id: "refunds", label: "Refunds", icon: RefreshCcw },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Moxiz API</span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
      </nav>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Mobile Navigation */}
        <div className="lg:hidden border-b border-border bg-card/50 sticky top-[65px] z-40 overflow-x-auto no-scrollbar">
          <div className="flex p-2 gap-2 min-w-max">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  "text-xs font-bold px-3 py-2 rounded-md transition-all whitespace-nowrap",
                  activeSection === section.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="w-64 border-r border-border p-6 hidden lg:block sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto space-y-8">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-4">Core Reference</h4>
            <div className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium p-2 rounded-md cursor-pointer transition-all border-l-2",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary border-primary font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"
                  )}
                >
                  <section.icon className={cn("h-4 w-4", activeSection === section.id ? "text-primary" : "text-muted-foreground")} />
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-5xl">
          <div className="space-y-24">
            <section id="introduction" className="scroll-mt-24">
              <h1 className="text-4xl font-bold font-headline tracking-tight mb-4">REST API Reference</h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                The Moxiz API is organized around REST. Our API has predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes.
              </p>
            </section>

            <section id="authentication" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border pb-2">
                <Lock className="h-5 w-5 text-primary" /> Authentication
              </h2>
              <p className="text-sm text-muted-foreground">
                Authenticate your requests by including your secret key in the Authorization header. 
                Keep your keys secure! Never share your secret keys in client-side code or public repositories.
              </p>
              <div className="bg-card border border-border p-4 rounded-lg font-code text-sm">
                <span className="text-muted-foreground">Authorization: Bearer </span>
                <span className="text-primary">sk_test_••••••••••••••••</span>
              </div>
            </section>

            <section id="api-keys" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-border pb-2">
                <Globe className="h-5 w-5 text-accent" /> API Infrastructure
              </h2>
              <p className="text-sm text-muted-foreground">
                All API requests should be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.
              </p>
              <div className="bg-card border border-border p-4 rounded-lg font-code text-sm flex justify-between items-center group">
                <span className="text-emerald-500 font-bold truncate mr-4">https://moxiz-gateway.vercel.app/v1</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard("https://moxiz-gateway.vercel.app/v1")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </section>

            <section id="payments" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold border-b border-border pb-2">Payments</h2>
              <p className="text-sm text-muted-foreground">The Payment API allows you to create and manage payment intents for your customers.</p>
              <div className="bg-black/40 border border-white/5 p-6 rounded-xl space-y-4 font-code text-xs overflow-x-auto">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <span className="bg-primary/20 px-2 py-0.5 rounded text-[10px]">POST</span>
                  <span>/v1/payments</span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <p>{"{"}</p>
                  <p className="pl-4">"amount": 2000,</p>
                  <p className="pl-4">"currency": "usd",</p>
                  <p className="pl-4">"customer_email": "jane@example.com"</p>
                  <p>{"}"}</p>
                </div>
              </div>
            </section>

            <section id="customers" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold border-b border-border pb-2">Customers</h2>
              <p className="text-sm text-muted-foreground">Customer objects allow you to perform recurring billing and track payment history over time.</p>
              <div className="bg-black/40 border border-white/5 p-6 rounded-xl space-y-4 font-code text-xs overflow-x-auto">
                <div className="flex items-center gap-2 text-accent font-bold">
                  <span className="bg-accent/20 px-2 py-0.5 rounded text-[10px]">GET</span>
                  <span>/v1/customers</span>
                </div>
                <p className="text-muted-foreground italic">// Returns a list of all merchant customers</p>
              </div>
            </section>

            <section id="refunds" className="space-y-6 scroll-mt-24">
              <h2 className="text-2xl font-bold border-b border-border pb-2">Refunds</h2>
              <p className="text-sm text-muted-foreground">Refund objects allow you to reverse payments made by your customers, either partially or in full.</p>
              <div className="bg-black/40 border border-white/5 p-6 rounded-xl space-y-4 font-code text-xs overflow-x-auto">
                <div className="flex items-center gap-2 text-orange-500 font-bold">
                  <span className="bg-orange-500/20 px-2 py-0.5 rounded text-[10px]">POST</span>
                  <span>/v1/refunds</span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <p>{"{"}</p>
                  <p className="pl-4">"payment_id": "pay_992xJ",</p>
                  <p className="pl-4">"reason": "requested_by_customer"</p>
                  <p>{"}"}</p>
                </div>
              </div>
            </section>

            <section id="webhooks" className="space-y-6 scroll-mt-24 pb-20">
              <h2 className="text-2xl font-bold border-b border-border pb-2">Webhooks</h2>
              <p className="text-sm text-muted-foreground">Webhooks are used to notify your application when an event happens in your account.</p>
              <div className="p-4 border border-dashed border-border rounded-lg bg-card/30">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Signature Verification</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Every webhook request includes a <span className="text-foreground font-code">Moxiz-Signature</span> header. You should verify this signature using your webhook signing secret to ensure the request originated from Moxiz.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
