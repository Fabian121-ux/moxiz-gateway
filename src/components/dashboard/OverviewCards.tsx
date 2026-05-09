
"use client";

import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
import { Transaction } from "@/lib/types";

export function OverviewCards() {
  const { user } = useUser();
  const db = useFirestore();

  const transactionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'merchants', user.uid, 'transactions'));
  }, [db, user]);

  const { data: transactions, loading } = useCollection<Transaction>(transactionsQuery);

  const totalVolume = transactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const successCount = transactions.filter(t => t.status === 'SUCCESS').length;
  const failedCount = transactions.filter(t => t.status === 'FAILED').length;
  
  const successRate = transactions.length > 0 
    ? ((successCount / (successCount + failedCount || 1)) * 100).toFixed(1)
    : "0.0";

  const StatValue = ({ val }: { val: string | number }) => (
    loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mt-2" /> : <div className="text-2xl font-bold font-headline">{val}</div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <StatValue val={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalVolume / 100)} />
          <p className="text-xs text-muted-foreground">Successful transactions total</p>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <StatValue val={successCount} />
          <p className="text-xs text-muted-foreground">Count of all paid invoices</p>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Transactions</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <StatValue val={failedCount} />
          <p className="text-xs text-muted-foreground">Declined or unauthorized</p>
        </CardContent>
      </Card>
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
          <CreditCard className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <StatValue val={`${successRate}%`} />
          <p className="text-xs text-muted-foreground">Ratio of success to failure</p>
        </CardContent>
      </Card>
    </div>
  );
}
