
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Key, ShieldCheck, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function DevelopersPage() {
  const { toast } = useToast();
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast({
      title: "Copied!",
      description: `${label} has been copied to your clipboard.`,
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const keys = {
    test: {
      public: "pk_test_51MzS2Z_moxiz_dev_99x",
      secret: "sk_test_51MzS2Z_moxiz_secret_v001_88jk"
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">API Keys</h2>
        <p className="text-muted-foreground">Manage your credentials to authenticate with the Moxiz Payment API.</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Developer Environment
            </CardTitle>
            <CardDescription>
              Use these keys to simulate transactions without moving actual money.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Test Public Key</label>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value={keys.test.public} 
                  className="font-code bg-card"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => copyToClipboard(keys.test.public, "Public Key")}
                >
                  {copiedKey === "Public Key" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Test Secret Key</label>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  type={showSecret ? "text" : "password"}
                  value={keys.test.secret} 
                  className="font-code bg-card"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? "Hide" : "Reveal"}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(keys.test.secret, "Secret Key")}
                >
                   {copiedKey === "Secret Key" ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                 Never share your secret key in client-side code or public repositories.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>
              Set the URL where Moxiz should send POST requests for transaction updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Payload URL</label>
              <div className="flex gap-2">
                <Input placeholder="https://api.yourdomain.com/webhooks/moxiz" className="bg-card" />
                <Button className="bg-primary hover:bg-primary/90">Save Endpoint</Button>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="text-sm font-bold mb-2">Active Subscriptions</h4>
              <div className="flex flex-wrap gap-2">
                {["transaction.success", "transaction.failed", "transaction.reversed"].map(event => (
                  <div key={event} className="bg-card px-2 py-1 rounded border border-border text-xs font-code">
                    {event}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="p-6 border border-border rounded-xl bg-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">API Activity</h3>
              <p className="text-sm text-muted-foreground">Recent requests made using your API keys.</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <RefreshCw className="h-3 w-3" /> Refresh Logs
            </Button>
          </div>
          
          <div className="space-y-3">
            {[
              { method: "POST", path: "/v1/payments", status: 201, time: "2 mins ago" },
              { method: "GET", path: "/v1/transactions/tx_721", status: 200, time: "15 mins ago" },
              { method: "POST", path: "/v1/payments", status: 400, time: "1 hour ago" }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded",
                    log.method === "POST" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                  )}>{log.method}</span>
                  <span className="font-code text-xs">{log.path}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "font-bold",
                    log.status >= 400 ? "text-destructive" : "text-emerald-500"
                  )}>{log.status}</span>
                  <span className="text-muted-foreground text-xs">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
