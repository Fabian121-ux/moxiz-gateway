
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
import { Transaction } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-muted/40 cursor-pointer transition-colors">
              <TableCell className="font-medium font-code text-primary">{tx.reference}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{tx.customerName}</span>
                  <span className="text-xs text-muted-foreground">{tx.customerEmail}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: tx.currency,
                  }).format(tx.amount / 100)}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    tx.status === "SUCCESS" && "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
                    tx.status === "FAILED" && "border-destructive/50 bg-destructive/10 text-destructive",
                    tx.status === "PENDING" && "border-orange-500/50 bg-orange-500/10 text-orange-500"
                  )}
                >
                  {tx.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {format(new Date(tx.createdAt), "MMM d, h:mm a")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
