
"use client";

import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [search, setSearch] = useState("");

  const transactionsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'merchants', user.uid, 'transactions'),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: transactions, loading } = useCollection<Transaction>(transactionsQuery);
  
  const filteredTransactions = transactions.filter(tx => 
    tx.reference.toLowerCase().includes(search.toLowerCase()) ||
    tx.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
    tx.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Transactions</h2>
          <p className="text-muted-foreground">Review and manage your payment history.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reference, email or name..." 
            className="pl-10 bg-card border-border/50" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="gap-2 w-full md:w-auto border-border/50 bg-card">
            <Calendar className="h-4 w-4" /> Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2 w-full md:w-auto border-border/50 bg-card">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center border border-dashed rounded-lg bg-card/50">
             <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Retrieving transactions...</span>
             </div>
          </div>
        ) : (
          <>
            <div className="text-sm font-medium text-muted-foreground">
              Showing {filteredTransactions.length} transactions
            </div>
            <TransactionTable transactions={filteredTransactions} />
          </>
        )}
      </div>
    </div>
  );
}
