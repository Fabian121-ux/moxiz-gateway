
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Lock, ShieldAlert } from "lucide-react";

export default function SecurityPage() {
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

      <main className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-12">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><Lock className="h-8 w-8 text-primary" /> Infrastructure Security</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border border-border rounded-xl bg-card">
            <ShieldCheck className="h-6 w-6 text-emerald-500 mb-4" />
            <h3 className="font-bold mb-2">Isolated Sandbox</h3>
            <p className="text-sm text-muted-foreground">Our testing environments are logically separated from production systems, ensuring zero cross-contamination of data.</p>
          </div>
          <div className="p-6 border border-border rounded-xl bg-card">
            <ShieldAlert className="h-6 w-6 text-accent mb-4" />
            <h3 className="font-bold mb-2">Key Rotation</h3>
            <p className="text-sm text-muted-foreground">Moxiz supports instant API key revocation and rotation via the dashboard to protect your developer workflows.</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Vulnerability Disclosure</h2>
          <p className="text-muted-foreground leading-relaxed">
            As a developer-first platform, we take security seriously. If you discover a vulnerability in our simulation gateway, please report it to our engineering team at <span className="text-primary font-code">security@moxiz.dev</span>.
          </p>
        </section>
      </main>
    </div>
  );
}
