
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Copy, Globe, Lock } from "lucide-react";

export default function ApiReferencePage() {
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

      <div className="flex flex-1">
        <aside className="w-64 border-r border-border p-6 hidden lg:block space-y-6">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Authentication</h4>
            <div className="text-sm font-medium p-2 bg-primary/10 text-primary rounded-md">API Keys</div>
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Resources</h4>
            {['Payments', 'Customers', 'Refunds', 'Webhooks'].map(item => (
              <div key={item} className="text-sm font-medium p-2 hover:bg-muted rounded-md cursor-pointer transition-colors text-muted-foreground hover:text-foreground">{item}</div>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-w-4xl">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold font-headline tracking-tight mb-4">REST API Reference</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The Moxiz API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Authentication</h2>
              <p className="text-sm text-muted-foreground">Authenticate your requests by including your secret key in the Authorization header. Your API keys carry many privileges, so be sure to keep them secure!</p>
              <div className="bg-card border border-border p-4 rounded-lg font-code text-sm">
                <span className="text-muted-foreground">Authorization: Bearer </span>
                <span className="text-primary">sk_test_51Mz...</span>
              </div>
            </section>

            <section className="space-y-4 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Globe className="h-5 w-5 text-accent" /> Base URL</h2>
              <div className="bg-card border border-border p-4 rounded-lg font-code text-sm flex justify-between items-center">
                <span className="text-emerald-500 font-bold">https://moxiz-gateway.vercel.app/v1</span>
                <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
