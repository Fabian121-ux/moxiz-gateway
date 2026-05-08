
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { mockTransactions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Welcome back, Acme</h2>
          <p className="text-muted-foreground">Here is what is happening with your business today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            View Analytics <ArrowUpRight className="h-4 w-4" />
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <PlusCircle className="h-4 w-4" /> Create Payment
          </Button>
        </div>
      </div>

      <OverviewCards />

      <div className="grid gap-6 md:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-semibold font-headline">Recent Transactions</h3>
            <Link href="/dashboard/transactions" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <TransactionTable transactions={mockTransactions.slice(0, 5)} />
        </div>
        
        <div className="col-span-3 space-y-4">
          <h3 className="text-lg font-semibold font-headline px-2">System Health</h3>
          <div className="space-y-4">
            {[
              { label: "API Gateway", status: "Operational", color: "bg-emerald-500" },
              { label: "Webhook Engine", status: "Operational", color: "bg-emerald-500" },
              { label: "Vault Services", status: "Operational", color: "bg-emerald-500" },
              { label: "Test Simulation", status: "Operational", color: "bg-emerald-500" }
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
            <p className="text-sm text-muted-foreground mb-4">You are currently in Test Mode. Use your test keys to start simulating payments.</p>
            <Button variant="link" className="p-0 h-auto text-primary font-bold" asChild>
              <Link href="/dashboard/developers">View API Documentation &rarr;</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
