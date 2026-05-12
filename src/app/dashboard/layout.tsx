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

  const handleEnvChange = (newEnv: 'sandbox' | 'live') => {
    setEnv(newEnv);
  };

  // Snappy, high-end loading state
  if (merchantLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background animate-in fade-in duration-300">
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-primary/20 animate-pulse blur-2xl" />
          <div className="relative bg-primary p-6 rounded-3xl shadow-2xl shadow-primary/40 border border-white/20">
            <ShieldCheck className="h-12 w-12 text-white animate-in zoom-in duration-500" />
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold tracking-tighter text-foreground italic">MOXIZ</h2>
          <div className="flex gap-1">
             <div className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
             <div className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
             <div className="h-1 w-1 rounded-full bg-primary animate-bounce" />
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
