
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useUser, useFirestore } from "@/firebase";
import { MerchantService } from "@/services/merchant-service";
import { Merchant } from "@/lib/types";
import { ShieldCheck } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loadingMerchant, setLoadingMerchant] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        if (db) {
          try {
            const profile = await MerchantService.ensureMerchantProfile(db, user.uid, user.email!);
            setMerchant(profile);
          } catch (error) {
            console.warn("Firestore not ready, using mock merchant profile.");
            setMerchant({
              id: user.uid,
              businessName: 'Moxiz Demo Corp',
              email: user.email!,
              status: 'ACTIVE',
              createdAt: new Date().toISOString()
            } as Merchant);
          } finally {
            setLoadingMerchant(false);
          }
        } else {
          setMerchant({
            id: user.uid,
            businessName: 'Moxiz Demo Corp',
            email: user.email!,
            status: 'ACTIVE',
            createdAt: new Date().toISOString()
          } as Merchant);
          setLoadingMerchant(false);
        }
      }
    }
    if (!authLoading && user) {
      loadProfile();
    }
  }, [user, db, authLoading]);

  if (authLoading || (user && loadingMerchant)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="flex flex-col items-center gap-8 max-w-sm w-full">
          <div className="relative">
            {/* Pulsing Outer Ring */}
            <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" />
            
            {/* Brand Icon Box */}
            <div className="relative bg-primary p-4 rounded-2xl shadow-2xl shadow-primary/20 border border-primary-foreground/10 flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-white animate-[pulse_2s_infinite]" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Moxiz <span className="text-primary/50 font-code font-normal text-sm">v1.0.4</span>
            </h2>
            <div className="flex items-center gap-1.5 h-1">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className="w-8 h-1 rounded-full bg-primary/20 overflow-hidden"
                >
                  <div 
                    className="w-full h-full bg-primary origin-left animate-[loading-bar_1.5s_infinite_ease-in-out]" 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-4 animate-pulse">
              Initializing Gateway Environment
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full pt-4 border-t border-border/50">
            {[
              { label: "Auth Layer", status: "READY" },
              { label: "Vault Simulation", status: "READY" },
              { label: "API Handlers", status: "LOADING..." },
              { label: "Webhook Engine", status: "WAITING" },
            ].map((node) => (
              <div key={node.label} className="flex justify-between items-center text-[10px] font-code">
                <span className="text-muted-foreground">{node.label}</span>
                <span className={node.status === 'READY' ? 'text-emerald-500' : 'text-primary animate-pulse'}>
                  {node.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} merchant={merchant} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-sm font-medium text-muted-foreground">
            Merchant ID: {user.uid.slice(0, 8)}_test
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">
                {merchant?.businessName || "Merchant Account"}
              </div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary uppercase">
              {(merchant?.businessName || "M").slice(0, 2)}
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
