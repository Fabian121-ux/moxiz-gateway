
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useUser, useFirestore } from "@/firebase";
import { MerchantService } from "@/services/merchant-service";
import { Merchant } from "@/lib/types";
import { ShieldCheck } from "lucide-react";

const LOADING_MESSAGES = [
  "Initializing Secure Environment",
  "Verifying Merchant Credentials",
  "Bootstrapping API Gateway",
  "Syncing Transaction Logs",
  "Calibrating Fraud Detection",
  "Connecting Webhook Engine",
  "Securing Vault Simulation",
  "Optimizing Ledger Indices",
  "Finalizing Developer Canvas"
];

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
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Message rotation effect - Slowed down for a "chill" feel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loadingMerchant) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1200); // Increased from 600ms to 1200ms
    }
    return () => clearInterval(interval);
  }, [loadingMerchant]);

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
            // Snappier transition: reduced mandatory wait from 2000ms to 1200ms
            setTimeout(() => setLoadingMerchant(false), 1200);
          }
        } else {
          setMerchant({
            id: user.uid,
            businessName: 'Moxiz Demo Corp',
            email: user.email!,
            status: 'ACTIVE',
            createdAt: new Date().toISOString()
          } as Merchant);
          setTimeout(() => setLoadingMerchant(false), 1000);
        }
      }
    }
    if (!authLoading && user) {
      loadProfile();
    }
  }, [user, db, authLoading]);

  if (authLoading || (user && loadingMerchant)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-8 max-w-sm w-full animate-in fade-in zoom-in-95 duration-500">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/10 animate-ping opacity-30" />
            <div className="relative bg-primary p-5 rounded-2xl shadow-2xl shadow-primary/30 border border-white/10 flex items-center justify-center transition-transform hover:scale-105 duration-700">
              <ShieldCheck className="h-10 w-10 text-white animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Moxiz <span className="text-primary/50 font-code font-normal text-xs px-2 py-0.5 border border-primary/20 rounded-md">v1.0.4</span>
            </h2>
            
            <div className="flex items-center gap-2 h-1 w-40 justify-center">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className="w-12 h-0.5 rounded-full bg-primary/10 overflow-hidden"
                >
                  <div 
                    className="w-full h-full bg-primary origin-left animate-loading-bar" 
                    style={{ animationDelay: `${i * 0.2}s`, animationDuration: '2s' }}
                  />
                </div>
              ))}
            </div>
            
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

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background animate-in fade-in duration-700">
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
