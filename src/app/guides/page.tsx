
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, BookOpen, Rocket, Zap, Database } from "lucide-react";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Moxiz Guides</span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </Button>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-12">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><BookOpen className="h-8 w-8 text-primary" /> Engineering Guides</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "Handling Webhook Retries", icon: Zap, desc: "Implementing exponential backoff and idempotency in your receiver." },
            { title: "Vault Simulation Setup", icon: Database, desc: "Modeling secure tokenization flows within the Moxiz gateway." },
            { title: "Load Testing Sandbox", icon: Rocket, desc: "Using our CLI to simulate high-concurrency payment activity." },
            { title: "Error Response Mapping", icon: ShieldCheck, desc: "Mapping Moxiz infrastructure codes to your internal application errors." },
          ].map((item, i) => (
            <div key={i} className="p-6 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors cursor-pointer group">
              <item.icon className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
