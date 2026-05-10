
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Database } from "lucide-react";

export default function CookiesPage() {
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
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><Database className="h-8 w-8 text-primary" /> Cookie Policy</h1>
        
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>Moxiz Gateway uses essential cookies to provide our developer infrastructure services. We do not use advertising or tracking cookies.</p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Essential Cookies</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="text-foreground font-bold">moxiz_session</span>: Used to maintain your authenticated state in the merchant dashboard.</li>
              <li><span className="text-foreground font-bold">moxiz_env_pref</span>: Stores your preference between TEST and LIVE environment views.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
