
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Moxiz</span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </Button>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-8">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><Lock className="h-8 w-8 text-primary" /> Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: March 2026</p>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Data Usage in Sandbox</h2>
            <p>Moxiz Gateway is a simulation platform. We do not store real financial data or PCI-sensitive information. All transaction data created in the sandbox is mock data used for engineering testing purposes.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. Information Collection</h2>
            <p>We collect work email addresses and business names for account authentication and service notifications. We use browser-based session data to maintain your logged-in state across dashboard navigation.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Infrastructure Logging</h2>
            <p>For service optimization, we log API request metadata (latency, endpoints accessed, error codes). These logs are used exclusively to improve the performance and reliability of the Moxiz Gateway infrastructure.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
