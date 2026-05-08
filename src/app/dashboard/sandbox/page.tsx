
"use client";

import { useState } from "react";
import { useFirestore, useUser } from "@/firebase";
import { TransactionService } from "@/services/transaction-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Terminal, Zap, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SandboxPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "2500",
    currency: "USD",
    email: "customer@demo.com",
    status: "SUCCESS" as any
  });

  const handleSimulate = async () => {
    if (!db || !user) return;
    setLoading(true);
    try {
      await TransactionService.createTransaction(db, user.uid, {
        amount: parseInt(formData.amount),
        currency: formData.currency,
        customerEmail: formData.email,
        status: formData.status
      });
      toast({
        title: "Simulation Triggered",
        description: `Successfully simulated a ${formData.status} transaction.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Simulation Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Developer Sandbox</h2>
        <p className="text-muted-foreground">Test your integration by simulating various payment outcomes and webhook events.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Transaction Simulator
            </CardTitle>
            <CardDescription>
              Create fake transactions to test your backend's response to different states.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (in cents)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="bg-card"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Expected Outcome</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUCCESS">Success (200)</SelectItem>
                    <SelectItem value="FAILED">Failure (Declined)</SelectItem>
                    <SelectItem value="PENDING">Pending (Awaiting Auth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Customer Email</Label>
                <Input 
                  id="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-card"
                />
              </div>
            </div>
            <Button className="w-full gap-2" onClick={handleSimulate} disabled={loading}>
              {loading ? <Clock className="h-4 w-4 animate-spin" /> : <Terminal className="h-4 w-4" />}
              Run Simulation
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Sandbox Presets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500" onClick={() => setFormData({...formData, status: 'SUCCESS'})}>
                <CheckCircle2 className="h-4 w-4" /> Happy Path (Success)
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-destructive/20 hover:bg-destructive/10 text-destructive" onClick={() => setFormData({...formData, status: 'FAILED'})}>
                <AlertTriangle className="h-4 w-4" /> Simulate Insufficient Funds
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-orange-500/20 hover:bg-orange-500/10 text-orange-500" onClick={() => setFormData({...formData, status: 'PENDING'})}>
                <Clock className="h-4 w-4" /> Simulate Delayed Processing
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 border border-border rounded-xl bg-card/50 space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Terminal className="h-4 w-4 text-accent" />
              Live Simulation Feed
            </h4>
            <div className="space-y-2 font-code text-[10px] text-muted-foreground bg-black/40 p-4 rounded-lg border border-white/5">
              <p className="text-emerald-500">{">"} Simulation initialized...</p>
              <p>{">"} POST /v1/payments {formData.amount} {formData.currency}</p>
              <p className={formData.status === 'FAILED' ? 'text-destructive' : 'text-primary'}>
                {">"} Status: {formData.status}
              </p>
              <p>{">"} Webhook queued: transaction.{formData.status.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
