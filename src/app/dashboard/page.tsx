/**
 * @fileOverview Developer Dashboard Overview using standardized services.
 */

import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { TransactionService } from "@/services/transaction-service";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  // Use service layer instead of direct mock imports to mirror real backend interaction
  const recentTransactions = await TransactionService.getRecentTransactions('current-merchant-id', 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Infrastructure Overview</h2>
          <p className="text-muted-foreground">Monitor your API performance and recent transaction flows.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            View Analytics <ArrowUpRight className="h-4 w-4" />
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <PlusCircle className="h-4 w-4" /> Create Test Payment
          </Button>
        </div>
      </div>

      <OverviewCards />

      <div className="grid gap-6 md:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-semibold font-headline flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" /> Recent Activity
            </h3>
            <Link href="/dashboard/transactions" className="text-sm text-primary hover:underline">View all transactions</Link>
          </div>
          <TransactionTable transactions={recentTransactions} />
        </div>
        
        <div className="col-span-3 space-y-4">
          <h3 className="text-lg font-semibold font-headline px-2">Sandbox Status</h3>
          <div className="space-y-4">
            {[
              { label: "API Gateway (Sandbox)", status: "Operational", color: "bg-emerald-500" },
              { label: "Webhook Engine", status: "Operational", color: "bg-emerald-500" },
              { label: "Vault Simulation", status: "Operational", color: "bg-emerald-500" },
              { label: "Developer Portal", status: "Operational", color: "bg-emerald-500" }
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-primary/10 border border-primary/20 rounded-xl p-6">
            <h4 className="font-semibold text-primary mb-2">Integration Quickstart</h4>
            <p className="text-sm text-muted-foreground mb-4">You are currently in Test Mode. Use your test keys to start simulating payment flows.</p>
            <Button variant="link" className="p-0 h-auto text-primary font-bold" asChild>
              <Link href="/dashboard/developers">View API Documentation &rarr;</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
