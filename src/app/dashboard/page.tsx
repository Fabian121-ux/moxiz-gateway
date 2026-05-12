
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, Activity, Terminal, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (merchant) {
      fetchRecentActivity();
      
      // Enable Realtime Subscription
      const channel = supabase
        .channel('dashboard_activity')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `merchant_id=eq.${merchant.id}`
          },
          () => {
            fetchRecentActivity();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [merchant]);

  const fetchRecentActivity = async () => {
    // Note: No setLoading(true) here to prevent flickering on updates
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setRecentTransactions(data);
    setLoading(false);
  };


  if (merchantLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Infrastructure Overview</h2>
          <p className="text-muted-foreground">Monitor your API performance and recent transaction flows.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 h-11 px-5 rounded-full border-border/50 bg-card" asChild>
            <Link href="/dashboard/sandbox">
              <Terminal className="h-4 w-4 text-primary" /> Open Sandbox
            </Link>
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 h-11 px-6 rounded-full font-bold shadow-lg shadow-primary/20" asChild>
            <Link href="/dashboard/sandbox">
              <PlusCircle className="h-4 w-4" /> Create Test Payment
            </Link>
          </Button>
        </div>
      </div>

      <OverviewCards />

      <div className="grid gap-8 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" /> Recent Activity
            </h3>
            <Button variant="link" size="sm" className="text-primary font-bold gap-1" asChild>
              <Link href="/dashboard/transactions">View all <ExternalLink className="h-3 w-3" /></Link>
            </Button>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center border border-dashed rounded-2xl bg-muted/5">
              <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
            </div>
          ) : (
            <TransactionTable transactions={recentTransactions} />
          )}
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <h3 className="text-lg font-bold font-headline px-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Infrastructure Status
          </h3>
          <div className="grid gap-3">
            {[
              { label: "Supabase DB (PostgreSQL)", status: "Operational", color: "bg-emerald-500" },
              { label: "API Gateway v1", status: "Operational", color: "bg-emerald-500" },
              { label: "Webhook Dispatcher", status: "Operational", color: "bg-emerald-500" },
              { label: "Auth Middleware", status: "Operational", color: "bg-emerald-500" }
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border/40 rounded-xl p-4 flex items-center justify-between hover:border-primary/20 transition-colors">
                <span className="text-sm font-medium text-foreground/80">{item.label}</span>
                <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className={`h-1.5 w-1.5 rounded-full ${item.color} animate-pulse`} />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">{item.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
               <ShieldCheck className="h-32 w-32" />
            </div>
            <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
              Integration Quickstart
            </h4>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Your environment is in <strong>Sandbox Mode</strong>. Test transactions will not affect live balances.
            </p>
            <Button size="sm" className="bg-primary text-xs font-bold rounded-lg" asChild>
              <Link href="/dashboard/developers">Get Test Keys &rarr;</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
