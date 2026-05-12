"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  History, Zap, Activity, AlertCircle, CheckCircle2, 
  Loader2, Braces, Terminal, Plus, Trash2, Globe, Copy, Info
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function WebhooksPage() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['transaction.success', 'transaction.failed']);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (merchant) {
      fetchData();

      const channel = supabase
        .channel('webhook_monitoring')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'webhook_events'
          },
          () => {
            // Since we can't filter joins in realtime easily, 
            // we'll just refresh when any event happens. 
            // In a larger app, we'd use a more specific channel.
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [merchant]);

  const fetchData = async () => {
    // 1. Fetch Endpoints
    const { data: endpointData } = await supabase
      .from('webhooks')
      .select('*')
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false });
    
    if (endpointData) setEndpoints(endpointData);

    // 2. Fetch recent events
    const { data: eventData } = await supabase
      .from('webhook_events')
      .select('*, webhooks!inner(merchant_id)')
      .eq('webhooks.merchant_id', merchant.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (eventData) setWebhookEvents(eventData);
    setLoading(false);
  };


  const handleAddEndpoint = async () => {
    if (!newUrl || !newUrl.startsWith('http')) {
      toast({ variant: "destructive", title: "Invalid URL", description: "Please enter a valid HTTP/HTTPS URL." });
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch('/api/webhooks/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl,
          events: selectedEvents,
          environment: 'sandbox' // Default for now
        })
      });

      if (!response.ok) throw new Error('Failed to register webhook');
      
      toast({ title: "Webhook Registered", description: "Your endpoint is now active." });
      setNewUrl("");
      fetchData();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteEndpoint = async (id: string) => {
    const { error } = await supabase.from('webhooks').delete().eq('id', id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setEndpoints(endpoints.filter(e => e.id !== id));
      toast({ title: "Endpoint Deleted" });
    }
  };

  const deliveryRate = webhookEvents.length > 0 
    ? ((webhookEvents.filter(e => e.status === 'delivered').length / webhookEvents.length) * 100).toFixed(1)
    : "0.0";

  if (merchantLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Webhooks</h2>
          <p className="text-muted-foreground">Manage endpoints and track real-time event deliveries.</p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-full shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" /> Add Endpoint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
              <DialogHeader>
                <DialogTitle>Register Webhook Endpoint</DialogTitle>
                <DialogDescription>
                  Events will be sent to this URL as POST requests with a JSON payload.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Endpoint URL</Label>
                  <Input 
                    id="url" 
                    placeholder="https://api.yourdomain.com/webhooks" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="bg-muted/20 border-border/40"
                  />
                  <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                    <Info className="h-3 w-3" /> URL must be reachable from the public internet.
                  </p>
                </div>
                <div className="space-y-3">
                  <Label>Events to Subscribe</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'transaction.success', label: 'Payment Success' },
                      { id: 'transaction.failed', label: 'Payment Failed' },
                      { id: 'transaction.created', label: 'Payment Created' },
                      { id: 'fraud.flagged', label: 'Fraud Flagged' }
                    ].map((evt) => (
                      <div key={evt.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={evt.id} 
                          checked={selectedEvents.includes(evt.id)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedEvents([...selectedEvents, evt.id]);
                            else setSelectedEvents(selectedEvents.filter(e => e !== evt.id));
                          }}
                        />
                        <label htmlFor={evt.id} className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {evt.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleAddEndpoint} 
                  disabled={isAdding} 
                  className="w-full bg-primary font-bold"
                >
                  {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Webhook
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="gap-2 h-11 px-5 rounded-full border-border/50 bg-card">
            <Zap className="h-4 w-4 text-primary" /> Send Test Event
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/50 bg-card overflow-hidden group">
          <div className="h-1 bg-emerald-500/50" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Delivery Rate</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{deliveryRate}%</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Based on last {webhookEvents.length} events</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card overflow-hidden group">
          <div className="h-1 bg-primary/50" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Endpoints</CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{endpoints.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Configured destinations</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card overflow-hidden group">
          <div className="h-1 bg-destructive/50" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Failed Deliveries</CardTitle>
            <History className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {webhookEvents.filter(e => e.status === 'failed').length}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Events requiring manual retry</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Endpoints List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold font-headline">Endpoints</h3>
          </div>
          <div className="space-y-3">
            {endpoints.length === 0 ? (
              <div className="p-10 border border-dashed rounded-2xl bg-card/50 text-center">
                <p className="text-xs text-muted-foreground">No endpoints configured.</p>
              </div>
            ) : (
              endpoints.map((ep) => (
                <Card key={ep.id} className="border-border/50 bg-card overflow-hidden group hover:border-primary/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest border-none bg-primary/5 text-primary">
                        {ep.environment}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteEndpoint(ep.id)}
                        className="h-7 w-7 p-0 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate max-w-[180px]">{ep.url}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                          navigator.clipboard.writeText(ep.url);
                          toast({ title: "URL Copied" });
                        }}>
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {ep.events.map((evt: string) => (
                          <span key={evt} className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                            {evt.split('.')[1]}
                          </span>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-border/30 mt-2">
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Braces className="h-3 w-3" />
                          Secret: <span className="font-code opacity-60">{ep.secret.slice(0, 10)}...</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Braces className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-bold font-headline">Recent Events</h3>
          </div>
          <div className="border border-border/50 rounded-2xl bg-card overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-20 flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                <span className="text-sm font-medium text-muted-foreground/60 tracking-wider uppercase">Syncing webhook logs...</span>
              </div>
            ) : webhookEvents.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-muted/20 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground font-medium max-w-[200px]">
                  No webhook events recorded yet. Run a simulation to generate activity.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {webhookEvents.map((event) => (
                  <div key={event.id} className="p-5 hover:bg-muted/10 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                        event.status === "delivered" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                      )}>
                        {event.status === "delivered" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-code text-sm font-bold text-foreground/90">{event.event_type}</span>
                          <Badge variant="outline" className={cn(
                            "text-[9px] uppercase font-bold tracking-widest py-0 px-2 h-4 border-none",
                            event.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'
                          )}>
                            {event.status}
                          </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-3 mt-1.5 font-medium">
                          <span className="font-code opacity-60">ID: {event.id.slice(0, 8)}</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span>{format(new Date(event.created_at), "MMM d, yyyy h:mm a")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <div className="text-[11px] font-bold text-foreground/80">{event.retry_count > 0 ? `${event.retry_count} Retries` : 'First attempt'}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {event.response_code ? `HTTP ${event.response_code}` : 'Awaiting delivery'}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-9 px-4 text-[11px] font-bold rounded-lg border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all">
                        View Payload
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

