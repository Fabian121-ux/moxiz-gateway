
"use client";

import { useState, useEffect } from "react";
import { useFirestore, useUser } from "@/firebase";
import { TransactionService } from "@/services/transaction-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Terminal, Zap, AlertTriangle, CheckCircle2, Clock, Loader2, Code, Braces } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Environment } from "@/lib/types";

export default function SandboxPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [env, setEnv] = useState<Environment>('SANDBOX');
  const [feed, setFeed] = useState<{msg: string, type: 'info' | 'error' | 'success'}[]>([
    { msg: "Sandbox CLI v1.0.4 initialized", type: 'info' }
  ]);

  const [formData, setFormData] = useState({
    amount: "2500",
    currency: "USD",
    email: "customer@demo.com",
    status: "SUCCESS" as any
  });

  useEffect(() => {
    const storedEnv = localStorage.getItem('moxiz_env');
    if (storedEnv) setEnv(storedEnv as Environment);
  }, []);

  const addToFeed = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setFeed(prev => [...prev.slice(-8), { msg, type }]);
  };

  const handleSimulate = async () => {
    if (!db || !user) return;
    setLoading(true);
    const amt = parseInt(formData.amount);
    
    addToFeed(`POST /v1/payments -d amount=${amt} -d env=${env}`);
    
    try {
      await TransactionService.createTransaction(db, user.uid, {
        amount: amt,
        currency: formData.currency,
        customerEmail: formData.email,
        status: formData.status
      }, env);
      
      setTimeout(() => {
        addToFeed(`HTTP 201 Created (ref: MOX-${Math.floor(100000+Math.random()*900000)})`, 'success');
        addToFeed(`Webhook event queued: transaction.created`, 'info');
        toast({
          title: "Operation Success",
          description: `Simulated ${formData.status} event in ${env}.`,
        });
        setLoading(false);
      }, 600);
      
    } catch (error: any) {
      addToFeed(`Fatal: ${error.message}`, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-3xl font-bold font-headline tracking-tight">Developer Console</h2>
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest flex items-center gap-2 mt-1">
          <Code className="h-4 w-4 text-primary" /> Connected to: <span className="text-foreground">{env}</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/50 bg-card shadow-lg">
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
                  <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Amount (cents)</Label>
                  <Input 
                    type="number" 
                    value={formData.amount} 
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="bg-muted/30 font-code"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Simulation Outcome</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="bg-muted/30 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUCCESS">Success (200 OK)</SelectItem>
                      <SelectItem value="FAILED">Declined (402 Payment Required)</SelectItem>
                      <SelectItem value="PENDING">Processing (202 Accepted)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Customer Context</Label>
                  <Input 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="bg-muted/30"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <Button className="w-full h-11 bg-primary hover:bg-primary/90 gap-2 text-sm font-bold" onClick={handleSimulate} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  Execute API Request
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
             <CardHeader className="pb-4">
               <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Curl Template</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="p-4 bg-black/40 rounded-lg border border-white/5 font-code text-[11px] text-primary overflow-x-auto">
                  <p>curl https://moxiz-gateway.vercel.app/v1/payments \</p>
                  <p className="pl-4 text-white/70">-u sk_{env.toLowerCase()}_... \</p>
                  <p className="pl-4 text-white/70">-d amount={formData.amount} \</p>
                  <p className="pl-4 text-white/70">-d currency="USD" \</p>
                  <p className="pl-4 text-white/70">-d status="{formData.status.toLowerCase()}"</p>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex-1 min-h-[400px] bg-[#0c0e12] border border-border/50 rounded-xl flex flex-col overflow-hidden shadow-2xl">
            <div className="h-10 bg-muted/20 border-b border-border/50 flex items-center justify-between px-4">
               <div className="flex gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
               </div>
               <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="h-3 w-3" /> Live Debug Feed
               </div>
            </div>
            <div className="flex-1 p-6 font-code text-[11px] space-y-2 overflow-y-auto">
              {feed.map((item, i) => (
                <div key={i} className={cn(
                  "flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300",
                  item.type === 'error' ? 'text-destructive' :
                  item.type === 'success' ? 'text-emerald-500' :
                  'text-primary/80'
                )}>
                  <span className="shrink-0 opacity-40">[{new Date().toLocaleTimeString()}]</span>
                  <span className="shrink-0 text-white opacity-50">$</span>
                  <span className="leading-relaxed">{item.msg}</span>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-primary animate-pulse">
                   <span>Executing...</span>
                </div>
              )}
            </div>
            <div className="p-4 bg-muted/10 border-t border-border/50 text-[10px] text-muted-foreground italic">
               Listening for events in {env} environment...
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             {[
               { icon: CheckCircle2, label: "Success Path", color: "text-emerald-500", status: 'SUCCESS' },
               { icon: AlertTriangle, label: "Fail Path", color: "text-destructive", status: 'FAILED' },
               { icon: Clock, label: "Async Path", color: "text-orange-500", status: 'PENDING' }
             ].map((preset) => (
               <Button 
                key={preset.label}
                variant="outline" 
                className="h-20 flex-col gap-2 border-border/50 hover:bg-muted/20"
                onClick={() => setFormData({...formData, status: preset.status})}
               >
                 <preset.icon className={cn("h-5 w-5", preset.color)} />
                 <span className="text-[10px] uppercase font-bold tracking-wider">{preset.label}</span>
               </Button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
