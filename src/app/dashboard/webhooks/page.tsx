"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Zap, Activity, AlertCircle, CheckCircle2, Loader2, Braces, Terminal } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function WebhooksPage() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const [webhookEvents, setWebhookEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (merchant) {
      fetchEvents();
    }
  }, [merchant]);

  const fetchEvents = async () => {
    setLoading(true);
    // Fetch events joined with webhooks to filter by merchant
    const { data, error } = await supabase
      .from('webhook_events')
      .select('*, webhooks!inner(merchant_id)')
      .eq('webhooks.merchant_id', merchant.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) setWebhookEvents(data);
    setLoading(false);
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
          <p className="text-muted-foreground">Track the status of real-time event deliveries to your endpoints.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 h-11 px-5 rounded-full border-border/50 bg-card">
            <Terminal className="h-4 w-4 text-primary" /> Manage Endpoints
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-full shadow-lg shadow-primary/20">
            <Zap className="h-4 w-4" /> Send Test Webhook
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
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Average Latency</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">184ms</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Internal dispatch baseline</p>
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

      <div className="space-y-6">
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
  );
}
