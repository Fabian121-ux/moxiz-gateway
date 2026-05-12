"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, CreditCard, Send, Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SandboxPage() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const [amount, setAmount] = useState("2000");
  const [currency, setCurrency] = useState("USD");
  const [customerEmail, setCustomerEmail] = useState("dev@example.com");
  const [customerName, setCustomerName] = useState("John Doe");
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const handleSimulatePayment = async () => {
    setLoading(true);
    setLastResponse(null);

    try {
      const response = await fetch('/api/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Simulation': 'true' 
        },
        body: JSON.stringify({
          amount: parseInt(amount),
          currency,
          customer_email: customerEmail,
          customer_name: customerName,
        })
      });

      const data = await response.json();
      setLastResponse(data);

      if (response.ok) {
        toast({ title: "Payment Simulated", description: "The transaction has been created in pending state." });
        
        // Subscribe to this specific transaction for updates
        const channel = supabase
          .channel(`tx_${data.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'transactions',
              filter: `id=eq.${data.id}`
            },
            (payload) => {
              setLastResponse(payload.new);
              if (payload.new.status === 'success') {
                toast({ title: "Payment Success", description: "The simulated payment was successful!" });
              } else if (payload.new.status === 'failed') {
                toast({ variant: "destructive", title: "Payment Failed", description: "The simulated payment failed." });
              }
              supabase.removeChannel(channel);
            }
          )
          .subscribe();

      } else {
        throw new Error(data.error || 'Simulation failed');
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setLoading(false);
    }
  };


  if (merchantLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Payment Sandbox</h2>
          <p className="text-muted-foreground">Test your integration by simulating real payment flows.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Simulation Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/50 bg-card overflow-hidden">
            <div className="h-1 bg-primary" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Simulate Charge
              </CardTitle>
              <CardDescription>
                Configure the payment parameters to trigger a mock transaction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (cents)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-muted/20 border-border/40 font-code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input 
                    id="currency" 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-muted/20 border-border/40 font-code"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Customer Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="bg-muted/20 border-border/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input 
                  id="name" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-muted/20 border-border/40"
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleSimulatePayment} 
                  disabled={loading} 
                  className="w-full h-11 bg-primary font-bold shadow-lg shadow-primary/20"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Fire Simulation Request
                </Button>
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-3 mt-4">
                <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-600 leading-relaxed font-medium">
                  Simulation requests trigger the same webhook pipeline as real API calls. Make sure your webhook endpoints are configured to receive <strong>transaction.success</strong> events.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Response & Terminal */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/50 bg-black overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 bg-white/5 px-4 py-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-accent" />
                <CardTitle className="text-xs font-bold text-white/70 uppercase tracking-widest">Gateway Response</CardTitle>
              </div>
              {lastResponse && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-500 uppercase">201 Created</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] overflow-auto p-6 font-code text-[11px] text-emerald-500/80 leading-relaxed">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-primary/40">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="animate-pulse">Awaiting infrastructure response...</span>
                  </div>
                ) : lastResponse ? (
                  <pre className="animate-in fade-in slide-in-from-top-2 duration-500">
                    {JSON.stringify(lastResponse, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/10 select-none">
                    <Terminal className="h-20 w-20 mb-4 opacity-10" />
                    <p className="font-bold tracking-widest uppercase">Console Idle</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {lastResponse && lastResponse.status === 'pending' && (
            <Card className="border-border/50 bg-card overflow-hidden animate-in fade-in zoom-in-95 duration-700">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Transaction Queued</h4>
                  <p className="text-xs text-muted-foreground">Reference: <span className="font-code">{lastResponse.reference}</span>. Webhook notification will arrive in ~3 seconds.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {lastResponse && lastResponse.status === 'failed' && (
            <Card className="border-border/50 bg-card overflow-hidden animate-in fade-in zoom-in-95 duration-700">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Transaction Rejected</h4>
                  <p className="text-xs text-muted-foreground">Reason: Risk score exceeded safety threshold ({lastResponse.risk_score}). Check fraud logs for details.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
