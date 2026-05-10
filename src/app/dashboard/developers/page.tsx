"use client";

import { useState } from "react";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
import { ApiKeyService } from "@/services/api-key-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Key, ShieldCheck, Check, Trash2, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ApiKey } from "@/lib/types";

export default function DevelopersPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [showSecretId, setShowSecretId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const keysQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'merchants', user.uid, 'apiKeys'),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: apiKeys, loading } = useCollection<ApiKey>(keysQuery);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} has been copied.` });
  };

  const handleCreateKey = async () => {
    if (!db || !user) return;
    setIsGenerating(true);
    try {
      await ApiKeyService.generateKey(db, user.uid, `Key ${new Date().toLocaleDateString()}`, 'TEST');
      toast({ title: "Key Generated", description: "Your new API key is ready for use." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate key." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!db || !user) return;
    try {
      await ApiKeyService.revokeKey(db, user.uid, keyId);
      toast({ title: "Key Revoked", description: "The API key has been disabled." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to revoke key." });
    }
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Developer Infrastructure</h2>
          <p className="text-muted-foreground">Manage authentication credentials and webhook listeners.</p>
        </div>
        <Button onClick={handleCreateKey} disabled={isGenerating} className="gap-2 bg-primary">
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Generate New Key
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Active API Keys
            </CardTitle>
            <CardDescription>
              Use these credentials to authenticate your server-side requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No API keys found. Generate one to get started.</div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="p-4 border border-border/50 rounded-lg bg-background/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-sm">{key.name}</h4>
                        <Badge variant={key.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-[10px] h-4">
                          {key.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{key.environment}</span>
                      </div>
                      {key.status === 'ACTIVE' && (
                        <Button variant="ghost" size="sm" onClick={() => handleRevokeKey(key.id)} className="text-destructive hover:bg-destructive/10 h-7 text-xs">
                          Revoke Key
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground">Public Key</Label>
                        <div className="flex gap-2">
                          <Input readOnly value={key.publicKey} className="font-code text-xs bg-muted/30" />
                          <Button variant="outline" size="icon" className="shrink-0" onClick={() => copyToClipboard(key.publicKey, "Public Key")}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase text-muted-foreground">Secret Key</Label>
                        <div className="flex gap-2">
                          <Input 
                            readOnly 
                            type={showSecretId === key.id ? "text" : "password"}
                            value={key.secretKey} 
                            className="font-code text-xs bg-muted/30" 
                          />
                          <Button variant="outline" size="sm" onClick={() => setShowSecretId(showSecretId === key.id ? null : key.id)}>
                            {showSecretId === key.id ? "Hide" : "Reveal"}
                          </Button>
                          <Button variant="outline" size="icon" className="shrink-0" onClick={() => copyToClipboard(key.secretKey, "Secret Key")}>
                            <Copy className="h-3 w-3" />
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

        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle>Webhook Endpoints</CardTitle>
            <CardDescription>
              Configure the callback URLs where Moxiz sends real-time transaction events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Payload URL</Label>
              <div className="flex gap-2">
                <Input placeholder="https://api.acme.com/webhooks/moxiz" className="bg-background/50" />
                <Button className="bg-primary hover:bg-primary/90">Save Endpoint</Button>
              </div>
            </div>
            
            <div className="p-4 border border-dashed border-border rounded-lg bg-muted/10">
              <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Signing Secret</h5>
              <div className="flex items-center justify-between">
                <span className="font-code text-sm text-foreground">whsec_test_••••••••••••88jk</span>
                <Button variant="link" size="sm" className="text-primary font-bold">Roll Secret</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
