"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useMerchant } from "@/hooks/use-merchant";
import { createClient } from "@/lib/supabase";
import { ShieldCheck, Globe, Zap, Database, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LOADING_MESSAGES = [
  "Initializing Secure Environment",
  "Verifying Merchant Credentials",
  "Bootstrapping API Gateway",
  "Syncing Transaction Logs",
  "Calibrating Fraud Detection",
  "Connecting Webhook Engine",
  "Securing Vault Simulation",
  "Finalizing Developer Canvas"
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { merchant, loading: merchantLoading } = useMerchant();
  const [user, setUser] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [env, setEnv] = useState<'sandbox' | 'live'>('sandbox');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    }
    getUser();
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (merchantLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [merchantLoading]);

  const handleEnvChange = (newEnv: 'sandbox' | 'live') => {
    setEnv(newEnv);
    // In a real app, we'd update context here
  };

  if (merchantLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-8 max-w-sm w-full animate-in fade-in zoom-in-95 duration-500">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/10 animate-ping opacity-30" />
            <div className="relative bg-primary p-5 rounded-2xl shadow-2xl shadow-primary/30 border border-white/10 flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-white animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Moxiz <span className="text-primary/50 font-code font-normal text-xs px-2 py-0.5 border border-primary/20 rounded-md">v2.0.0</span>
            </h2>
            <div className="h-4 flex items-center justify-center mt-2">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground/60 animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out" key={loadingStep}>
                {LOADING_MESSAGES[loadingStep]}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background animate-in fade-in duration-700">
      <Sidebar user={user} merchant={merchant} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Env</span>
              <Select value={env} onValueChange={(v) => handleEnvChange(v as any)}>
                <SelectTrigger className="w-[120px] h-7 bg-transparent border-none text-xs font-bold focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-primary" /> Sandbox
                    </div>
                  </SelectItem>
                  <SelectItem value="live">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3 text-emerald-500" /> Live
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-foreground leading-tight">
                {merchant?.name || "Merchant Account"}
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">{user.email}</div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg shadow-primary/10">
              {(merchant?.name || "M").slice(0, 1)}
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
