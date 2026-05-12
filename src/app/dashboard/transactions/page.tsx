
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Calendar, Loader2 } from "lucide-react";

export default function TransactionsPage() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (merchant) {
      fetchTransactions();

      const channel = supabase
        .channel('transactions_list')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `merchant_id=eq.${merchant.id}`
          },
          () => fetchTransactions()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [merchant]);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false });

    if (data) setTransactions(data);
    setLoading(false);
  };
  
  const filteredTransactions = transactions.filter(tx => 
    tx.reference.toLowerCase().includes(search.toLowerCase()) ||
    (tx.customer_email && tx.customer_email.toLowerCase().includes(search.toLowerCase())) ||
    (tx.customer_name && tx.customer_name.toLowerCase().includes(search.toLowerCase()))
  );

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
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Transactions</h2>
          <p className="text-muted-foreground">Review and manage your payment history.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 h-11 rounded-full">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reference, email or name..." 
            className="pl-10 bg-card border-border/50 h-11 rounded-xl" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="gap-2 w-full md:w-auto border-border/50 bg-card h-11 rounded-xl">
            <Calendar className="h-4 w-4" /> Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2 w-full md:w-auto border-border/50 bg-card h-11 rounded-xl">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center border border-dashed rounded-xl bg-card/50">
             <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Retrieving transactions...</span>
             </div>
          </div>
        ) : (
          <>
            <div className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Showing {filteredTransactions.length} transactions</span>
              <Button variant="link" size="sm" onClick={fetchTransactions} className="h-auto p-0 text-primary">Refresh</Button>
            </div>
            <TransactionTable transactions={filteredTransactions} />
          </>
        )}
      </div>
    </div>
  );
}
