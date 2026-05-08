
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  Zap, 
  Globe, 
  Lock,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">Moxiz</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">Products</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Developers</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Company</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Sign in</Link>
          <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 rounded-full group">
            Start Free <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4">
          <Zap className="h-4 w-4" />
          <span>V1 is now live in developer preview</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold font-headline tracking-tighter text-foreground max-w-4xl mb-8 leading-[1.1]">
          Infrastructure for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">next-gen</span> fintech.
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          The developer-first payment gateway built for speed, reliability, and seamless API integration. Start simulating global commerce in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Button size="lg" className="rounded-full bg-primary text-white h-14 px-10 text-lg font-bold">
            Create Developer Account
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-14 px-10 text-lg font-bold bg-white/5 border-white/10 hover:bg-white/10">
            Read API Docs
          </Button>
        </div>

        {/* Dashboard Preview */}
        <div className="relative w-full max-w-5xl mx-auto mt-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-sidebar border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="mx-auto bg-white/5 px-8 py-0.5 rounded text-[10px] text-muted-foreground font-code">
                moxiz.io/dashboard/overview
              </div>
            </div>
            <img 
              src="https://picsum.photos/seed/moxiz-hero/1200/800" 
              alt="Moxiz Dashboard" 
              className="w-full h-auto object-cover opacity-90"
              data-ai-hint="fintech dashboard"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-card/30 border-t border-white/5 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Terminal,
                title: "Developer First",
                desc: "Modern RESTful APIs, robust webhooks, and comprehensive SDKs designed by engineers for engineers."
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                desc: "Enterprise-grade encryption and automated fraud detection systems keeping every transaction secure."
              },
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Accept payments in 135+ currencies with local payment methods support right out of the box."
              }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 group">
                <div className="bg-primary/10 p-3 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                <Link href="#" className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-8 bg-sidebar">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Moxiz</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Moxiz Gateway Inc. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
