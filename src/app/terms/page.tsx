
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><FileText className="h-8 w-8 text-primary" /> Terms of Service</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Sandbox Usage</h2>
            <p>The Moxiz Gateway is provided for development and simulation purposes. It is strictly prohibited to use this platform for processing actual financial transactions or moving real currency.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. API Security</h2>
            <p>You are responsible for maintaining the confidentiality of your API keys. While our sandbox is an isolated environment, security best practices should always be followed when integrating with our developer gateway.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Service Availability</h2>
            <p>Moxiz provides the infrastructure simulation on an "as-is" basis. We strive for 99.9% uptime for our sandbox endpoints but do not provide formal SLAs for developer-tier usage.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
