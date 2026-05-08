
"use client";

import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { mockTransactions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Calendar } from "lucide-react";
import { useState } from "react";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  
  const filteredTransactions = mockTransactions.filter(tx => 
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
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reference, email or name..." 
            className="pl-10 bg-card border-border" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="gap-2 w-full md:w-auto">
            <Calendar className="h-4 w-4" /> Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-medium text-muted-foreground">
          Showing {filteredTransactions.length} transactions
        </div>
        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  );
}
