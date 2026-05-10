
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Zap, Code, Terminal, CheckCircle } from "lucide-react";

export default function IntegrationGuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Moxiz Docs</span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/docs"><ArrowLeft className="h-4 w-4" /> All Docs</Link>
        </Button>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Backend Integration Guide</h1>
          <p className="text-muted-foreground text-lg">
            A comprehensive guide to connecting your application to the Moxiz infrastructure.
          </p>
        </div>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold">1</div>
            <h2 className="text-2xl font-bold">Obtain API Keys</h2>
          </div>
          <p className="text-muted-foreground">Navigate to your dashboard to generate your secret and public keys. Ensure you use <span className="text-accent font-code">sk_test</span> for development.</p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold">2</div>
            <h2 className="text-2xl font-bold">Initialize the Client</h2>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl font-code text-sm">
            <span className="text-primary">const</span> moxiz = require(<span className="text-accent">'moxiz'</span>)(<span className="text-accent">'sk_test_...'</span>);
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold">3</div>
            <h2 className="text-2xl font-bold">Set Up Webhooks</h2>
          </div>
          <p className="text-muted-foreground">Configure your receiver endpoint in the dashboard and verify the signing secret for each event.</p>
          <div className="flex gap-4">
            <div className="p-4 border border-border rounded-lg bg-card/50 flex-1">
              <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
              <h4 className="font-bold">Idempotency</h4>
              <p className="text-xs text-muted-foreground">Always check the <span className="text-foreground">Idempotency-Key</span> header.</p>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card/50 flex-1">
              <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
              <h4 className="font-bold">Security</h4>
              <p className="text-xs text-muted-foreground">Validate HMAC signatures on all requests.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
