
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
            // Speed up the transition for better UX
            setTimeout(() => setLoadingMerchant(false), 400);
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

  // Moxiz Custom Loading Animation (Lightweight & Integrated)
  if (authLoading || (user && loadingMerchant)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-8 max-w-sm w-full animate-in fade-in zoom-in-95 duration-300">
          <div className="relative">
            {/* Pulsing Outer Ring */}
            <div className="absolute -inset-4 rounded-full bg-primary/10 animate-ping opacity-50" />
            
            {/* Brand Icon Box */}
            <div className="relative bg-primary p-5 rounded-2xl shadow-2xl shadow-primary/30 border border-white/10 flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-white animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Moxiz <span className="text-primary/50 font-code font-normal text-xs px-2 py-0.5 border border-primary/20 rounded-md">v1.0.4</span>
            </h2>
            
            {/* Faster, sleek loading bars */}
            <div className="flex items-center gap-1.5 h-1 w-32 justify-center">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className="w-10 h-1 rounded-full bg-primary/10 overflow-hidden"
                >
                  <div 
                    className="w-full h-full bg-primary origin-left animate-loading-bar" 
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                </div>
              ))}
            </div>
            
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground mt-4 opacity-50">
              Initializing Secure Environment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background animate-in fade-in duration-500">
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
