
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, ShieldCheck, Trash2, Loader2, Plus, Braces, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DevelopersPage() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ rawKey: string; environment: string } | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (merchant) {
      fetchKeys();
    }
  }, [merchant]);

  const fetchKeys = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false });

    if (data) setApiKeys(data);
    setLoading(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} has been copied.` });
  };

  const handleCreateKey = async (env: 'sandbox' | 'live') => {
    if (!merchant) return;
    setIsGenerating(true);
    
    try {
      // We'll call an API route to generate the key securely on the server
      const response = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment: env, name: `${env.toUpperCase()} Key` })
      });

      if (!response.ok) throw new Error('Failed to generate key');
      
      const data = await response.json();
      setNewKeyData({ rawKey: data.rawKey, environment: env });
      fetchKeys();
      toast({ title: "Key Generated", description: "Your new API key is ready." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate key." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
      
      setApiKeys(apiKeys.filter(k => k.id !== keyId));
      toast({ title: "Key Revoked", description: "The API key has been deleted." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to revoke key." });
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
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">API Infrastructure</h2>
          <p className="text-muted-foreground">Manage your secret keys and integration settings.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleCreateKey('sandbox')} disabled={isGenerating} variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            New Sandbox Key
          </Button>
          <Button onClick={() => handleCreateKey('live')} disabled={isGenerating} className="gap-2 bg-primary">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            New Live Key
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/50 bg-card overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-accent" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                API Keys
              </CardTitle>
              <CardDescription>
                Use these keys to authenticate requests from your server. Keep them secret.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="h-32 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl bg-muted/5">
                  <p className="text-muted-foreground">No API keys found. Create one to start building.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="p-4 border border-border/40 rounded-xl bg-background/50 hover:bg-background transition-colors group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-sm">{key.name}</h4>
                          <Badge variant={key.environment === 'live' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold tracking-tighter">
                            {key.environment}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRevokeKey(key.id)} 
                          className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 h-7 text-xs transition-opacity"
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Revoke
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Secret Key</Label>
                          <div className="flex gap-2">
                            <div className="flex-1 px-3 py-2 bg-muted/20 border border-border/40 rounded-lg font-code text-xs flex items-center justify-between">
                              <span className="text-foreground/80">{key.key_hint}</span>
                              <span className="text-[10px] text-muted-foreground italic">Last used: {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}</span>
                            </div>
                            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => copyToClipboard(key.key_hint, "Key Hint")}>
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Braces className="h-5 w-5 text-accent" />
                Integration Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">API Base URL</Label>
                <div className="flex gap-2">
                  <Input readOnly value="https://moxiz-gateway.vercel.app/api/v1" className="bg-muted/10 border-border/40 font-code text-xs h-10" />
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => copyToClipboard("https://moxiz-gateway.vercel.app/api/v1", "Base URL")}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-white/5 bg-black/40">
                <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CURL EXAMPLE</span>
                </div>
                <div className="p-4 font-code text-[11px] text-muted-foreground space-y-1">
                  <p><span className="text-primary">curl</span> https://moxiz-gateway.vercel.app/api/v1/payments \</p>
                  <p className="pl-4">  -H <span className="text-accent">"Authorization: Bearer sk_test_..."</span> \</p>
                  <p className="pl-4">  -d amount=2000 \</p>
                  <p className="pl-4">  -d currency="usd"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card bg-gradient-to-br from-card to-background">
            <CardHeader>
              <CardTitle className="text-sm">Sandbox Mode</CardTitle>
              <CardDescription>
                Use sandbox keys to test your integration without affecting real data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold text-primary uppercase">Active</span>
                </div>
                <Button variant="link" size="sm" className="text-[10px] text-primary h-auto p-0">View Test Data</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog for New Key */}
      <Dialog open={!!newKeyData} onOpenChange={() => setNewKeyData(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              API Key Generated
            </DialogTitle>
            <DialogDescription>
              This is your {newKeyData?.environment} secret key. Please copy it now, as it will not be shown again for security reasons.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-xs font-bold uppercase tracking-widest">Warning</AlertTitle>
              <AlertDescription className="text-xs">
                Store this key securely. If you lose it, you will need to generate a new one.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Secret Key</Label>
              <div className="flex gap-2">
                <Input readOnly value={newKeyData?.rawKey || ''} className="font-code text-sm bg-muted/20" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(newKeyData?.rawKey || '', "Secret Key")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setNewKeyData(null)} className="bg-primary px-8">I've Saved It</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
