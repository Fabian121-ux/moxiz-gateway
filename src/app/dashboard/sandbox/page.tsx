
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { createTransaction } from "@/services/transactions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Terminal, Zap, AlertTriangle, CheckCircle2, Clock, Loader2, Code, Braces } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SandboxPage() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [env, setEnv] = useState<'sandbox' | 'live'>('sandbox');
  const [feed, setFeed] = useState<{msg: string, type: 'info' | 'error' | 'success'}[]>([
    { msg: "Sandbox CLI v1.0.4 initialized", type: 'info' }
  ]);

  const [formData, setFormData] = useState({
    amount: "2500",
    currency: "USD",
    email: "customer@demo.com",
    status: "success" as any
  });

  const addToFeed = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setFeed(prev => [...prev.slice(-8), { msg, type }]);
  };

  const handleSimulate = async () => {
    if (!merchant) return;
    setLoading(true);
    const amt = parseInt(formData.amount);
    
    addToFeed(`POST /api/v1/payments -d amount=${amt} -e ${env}`);
    
    try {
      // Simulate calling the internal service
      const transaction = await createTransaction({
        merchantId: merchant.id,
        amount: amt,
        currency: formData.currency,
        customerEmail: formData.email,
        environment: env,
        status: formData.status.toLowerCase() as any
      });
      
      setTimeout(() => {
        addToFeed(`HTTP 201 Created (ref: ${transaction.reference})`, 'success');
        addToFeed(`Event triggered: payment.created`, 'info');
        if (transaction.status === 'success') {
          addToFeed(`Event triggered: payment.succeeded`, 'success');
        }
        
        toast({
          title: "Simulation Success",
          description: `Created ${transaction.status} transaction: ${transaction.reference}`,
        });
        setLoading(false);
      }, 800);
      
    } catch (error: any) {
      addToFeed(`Fatal: ${error.message}`, 'error');
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
    <div className="max-w-6xl space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight">Developer Console</h2>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest flex items-center gap-2 mt-1">
            <Code className="h-4 w-4 text-primary" /> Gateway: <span className="text-foreground">{merchant?.name}</span>
          </p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
          <Button 
            variant={env === 'sandbox' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setEnv('sandbox')}
            className="rounded-lg h-8 text-xs px-4"
          >
            Sandbox
          </Button>
          <Button 
            variant={env === 'live' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setEnv('live')}
            className="rounded-lg h-8 text-xs px-4"
          >
            Live
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/50 bg-card shadow-lg overflow-hidden">
            <div className="h-1 bg-primary/50" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Braces className="h-5 w-5 text-primary" />
                API Request Builder
              </CardTitle>
              <CardDescription>
                Construct payment requests to test integration logic.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Amount (cents)</Label>
                  <Input 
                    type="number" 
                    value={formData.amount} 
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="bg-muted/20 border-border/40 font-code h-11 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Simulation Outcome</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="bg-muted/20 border-border/40 font-medium h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">Success (200 OK)</SelectItem>
                      <SelectItem value="failed">Declined (402 Payment Required)</SelectItem>
                      <SelectItem value="pending">Processing (202 Accepted)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Customer Email</Label>
                  <Input 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="bg-muted/20 border-border/40 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 gap-2 text-sm font-bold rounded-xl shadow-lg shadow-primary/20" onClick={handleSimulate} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  Execute API Request
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card overflow-hidden">
             <div className="px-4 py-3 bg-muted/20 border-b border-border/50 flex items-center justify-between">
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Curl Template</span>
             </div>
             <CardContent className="pt-6">
                <div className="p-4 bg-black/60 rounded-xl border border-white/5 font-code text-[11px] text-primary/90 overflow-x-auto shadow-inner">
                  <p>curl https://moxiz-gateway.vercel.app/api/v1/payments \</p>
                  <p className="pl-4 text-white/60">-u sk_{env}_... \</p>
                  <p className="pl-4 text-white/60">-d amount={formData.amount} \</p>
                  <p className="pl-4 text-white/60">-d currency="USD" \</p>
                  <p className="pl-4 text-white/60">-d status="{formData.status}"</p>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex-1 min-h-[450px] bg-[#0c0e12] border border-border/50 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="h-12 bg-muted/20 border-b border-border/50 flex items-center justify-between px-6 z-10">
               <div className="flex gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/30 border border-red-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/30 border border-green-500/50" />
               </div>
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="h-3 w-3 text-primary" /> Live Debug Feed
               </div>
            </div>
            <div className="flex-1 p-6 font-code text-[12px] space-y-3 overflow-y-auto z-10">
              {feed.map((item, i) => (
                <div key={i} className={cn(
                  "flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300",
                  item.type === 'error' ? 'text-destructive' :
                  item.type === 'success' ? 'text-emerald-400' :
                  'text-primary/70'
                )}>
                  <span className="shrink-0 opacity-40">[{new Date().toLocaleTimeString()}]</span>
                  <span className="shrink-0 text-white/40">$</span>
                  <span className="leading-relaxed text-white/90">{item.msg}</span>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-primary animate-pulse font-bold ml-11">
                   <Loader2 className="h-3 w-3 animate-spin" />
                   <span>Negotiating handshake...</span>
                </div>
              )}
            </div>
            <div className="p-4 bg-muted/5 border-t border-border/50 text-[10px] text-muted-foreground/60 italic px-6">
               Moxiz Gateway v1.0 • Node Environment • Listening for {env} events
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             {[
               { icon: CheckCircle2, label: "Success Path", color: "text-emerald-500", status: 'success' },
               { icon: AlertTriangle, label: "Fail Path", color: "text-destructive", status: 'failed' },
               { icon: Clock, label: "Async Path", color: "text-orange-500", status: 'pending' }
             ].map((preset) => (
               <Button 
                key={preset.label}
                variant="outline" 
                className={cn(
                  "h-24 flex-col gap-3 border-border/50 hover:bg-muted/10 rounded-2xl transition-all duration-300",
                  formData.status === preset.status && "bg-muted/20 border-primary/50 shadow-lg shadow-primary/5"
                )}
                onClick={() => setFormData({...formData, status: preset.status})}
               >
                 <preset.icon className={cn("h-6 w-6", preset.color)} />
                 <span className="text-[10px] uppercase font-bold tracking-widest">{preset.label}</span>
               </Button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
