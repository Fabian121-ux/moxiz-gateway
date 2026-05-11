
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  transactions: any[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="font-bold text-xs uppercase tracking-widest py-4">Reference</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-widest py-4">Customer</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-widest py-4">Amount</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-widest py-4">Status</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase tracking-widest py-4">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-muted/40 cursor-pointer transition-colors group border-border/30">
                <TableCell className="font-medium font-code text-primary py-4">{tx.reference}</TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{tx.customer_name || 'N/A'}</span>
                    <span className="text-[11px] text-muted-foreground">{tx.customer_email || 'No email'}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="font-bold text-foreground">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: tx.currency || 'USD',
                    }).format(tx.amount / 100)}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-bold text-[10px] uppercase tracking-tighter px-2 h-5",
                      tx.status === "success" && "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
                      tx.status === "failed" && "border-destructive/50 bg-destructive/10 text-destructive",
                      tx.status === "pending" && "border-orange-500/50 bg-orange-500/10 text-orange-500"
                    )}
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground font-medium py-4">
                  {format(new Date(tx.created_at), "MMM d, h:mm a")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
