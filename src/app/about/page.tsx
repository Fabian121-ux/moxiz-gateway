
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Target, Users, Code } from "lucide-react";

export default function AboutPage() {
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
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-headline tracking-tight">About Moxiz</h1>
          <p className="text-muted-foreground text-lg">
            Built by engineers, for engineers. Our mission is to democratize high-fidelity fintech infrastructure.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <Target className="h-8 w-8 text-primary" />
            <h3 className="font-bold text-lg">Our Vision</h3>
            <p className="text-sm text-muted-foreground">To bridge the gap between sandbox testing and production reality for the next billion transactions.</p>
          </div>
          <div className="space-y-3">
            <Users className="h-8 w-8 text-accent" />
            <h3 className="font-bold text-lg">Developer First</h3>
            <p className="text-sm text-muted-foreground">We prioritize observability, predictable APIs, and reliable webhook infrastructure above all else.</p>
          </div>
          <div className="space-y-3">
            <Code className="h-8 w-8 text-emerald-500" />
            <h3 className="font-bold text-lg">Open Architecture</h3>
            <p className="text-sm text-muted-foreground">Moxiz is designed to be pluggable and extensible, supporting future migrations to relational backends.</p>
          </div>
        </div>

        <section className="bg-card border border-border p-8 rounded-2xl space-y-4">
          <h2 className="text-2xl font-bold">The Infrastructure Gap</h2>
          <p className="text-muted-foreground leading-relaxed">
            Most payment gateways offer sandbox environments that are either too simplistic or too restrictive. Moxiz Gateway was born out of the need for a simulation layer that mirrors production latency, failure modes, and asynchronous delivery pipelines accurately.
          </p>
        </section>
      </main>
    </div>
  );
}
