
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OverviewCards() {
  const { merchant } = useMerchant();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (merchant) {
      fetchStats();
    }
  }, [merchant]);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, status')
      .eq('merchant_id', merchant.id);

    if (data) setTransactions(data);
    setLoading(false);
  };

  const totalVolume = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const successCount = transactions.filter(t => t.status === 'success').length;
  const failedCount = transactions.filter(t => t.status === 'failed').length;
  
  const totalRelevant = successCount + failedCount;
  const successRate = totalRelevant > 0 
    ? ((successCount / totalRelevant) * 100).toFixed(1)
    : "0.0";

  const StatValue = ({ val, color }: { val: string | number, color?: string }) => (
    loading ? (
      <div className="h-8 flex items-center">
        <div className="h-6 w-24 bg-muted animate-pulse rounded-md" />
      </div>
    ) : (
      <div className={`text-2xl font-bold font-headline tracking-tight ${color || 'text-foreground'}`}>
        {val}
      </div>
    )
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50 bg-card hover:border-primary/20 transition-all shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Volume</CardTitle>
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <StatValue val={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalVolume / 100)} />
          <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Successful transactions total</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card hover:border-emerald-500/20 transition-all shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Success Count</CardTitle>
          <div className="p-1.5 bg-emerald-500/10 rounded-lg">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <StatValue val={successCount} color="text-emerald-500" />
          <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Count of all paid invoices</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card hover:border-destructive/20 transition-all shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Failed Count</CardTitle>
          <div className="p-1.5 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 text-destructive" />
          </div>
        </CardHeader>
        <CardContent>
          <StatValue val={failedCount} color="text-destructive" />
          <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Declined or unauthorized</p>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card hover:border-accent/20 transition-all shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Success Rate</CardTitle>
          <div className="p-1.5 bg-accent/10 rounded-lg">
            <CreditCard className="h-3.5 w-3.5 text-accent" />
          </div>
        </CardHeader>
        <CardContent>
          <StatValue val={`${successRate}%`} />
          <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Ratio of success to failure</p>
        </CardContent>
      </Card>
    </div>
  );
}
