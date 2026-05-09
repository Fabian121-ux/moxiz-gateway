
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Rocket, Zap, Bug, Shield } from "lucide-react";

export default function ChangelogPage() {
  const updates = [
    {
      version: "v1.0.4",
      date: "May 20, 2024",
      title: "Enhanced Webhook Reliability",
      desc: "Improved retry logic and added exponential backoff for failed webhook deliveries.",
      type: "feature",
      icon: Zap
    },
    {
      version: "v1.0.3",
      date: "May 12, 2024",
      title: "Sandbox Simulator Improvements",
      desc: "Added ability to simulate specific failure codes (402, 500) via sandbox headers.",
      type: "improvement",
      icon: Rocket
    },
    {
      version: "v1.0.2",
      date: "April 28, 2024",
      title: "API Key Rotation UI",
      desc: "New intuitive interface for generating and revoking merchant API keys.",
      type: "feature",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Moxiz</span>
        </Link>
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </Button>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-8 md:p-12 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Changelog</h1>
          <p className="text-muted-foreground text-lg">
            Follow the latest infrastructure updates and API improvements.
          </p>
        </div>

        <div className="space-y-16">
          {updates.map((update, i) => (
            <div key={i} className="relative pl-8 border-l border-border">
              <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary border-4 border-background" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{update.version}</span>
                  <span className="text-xs text-muted-foreground font-medium">{update.date}</span>
                </div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <update.icon className="h-5 w-5 text-accent" />
                  {update.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">{update.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
