
"use client";

import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Zap, Activity, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { WebhookEvent } from "@/lib/types";

export default function WebhooksPage() {
  const { user } = useUser();
  const db = useFirestore();

  const webhooksQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'merchants', user.uid, 'webhooks'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [db, user]);

  const { data: webhookEvents, loading } = useCollection<WebhookEvent>(webhooksQuery);

  const deliveryRate = webhookEvents.length > 0 
    ? ((webhookEvents.filter(e => e.status === 'SENT').length / webhookEvents.length) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Webhooks</h2>
          <p className="text-muted-foreground">Track the status of real-time event deliveries.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold">
          <Zap className="h-4 w-4" /> Send Test Webhook
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryRate}%</div>
            <p className="text-xs text-muted-foreground">Based on last {webhookEvents.length} events</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">240ms</div>
            <p className="text-xs text-muted-foreground">Sandbox environment baseline</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Deliveries</CardTitle>
            <History className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {webhookEvents.filter(e => e.status === 'FAILED').length}
            </div>
            <p className="text-xs text-muted-foreground">Events requiring retry</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-headline">Recent Events</h3>
        <div className="border border-border/50 rounded-lg bg-card overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Syncing webhook logs...</span>
            </div>
          ) : webhookEvents.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              No webhook events recorded yet. Run a simulation to generate activity.
            </div>
          ) : (
            webhookEvents.map((event) => (
              <div key={event.id} className="p-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    event.status === "SENT" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                  )}>
                    {event.status === "SENT" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-code text-sm font-medium">{event.eventType}</span>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 h-4">
                        {event.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex gap-3 mt-1">
                      <span className="font-code text-[10px]">ID: {event.id.slice(0, 8)}...</span>
                      <span>•</span>
                      <span>{format(new Date(event.createdAt), "MMM d, yyyy h:mm a")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-medium">{event.retryCount > 0 ? `${event.retryCount} Retries` : 'No retries'}</div>
                    <div className="text-xs text-muted-foreground">{event.status === 'SENT' ? 'Delivered successfully' : 'Retrying delivery...'}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-accent h-8 text-xs font-bold">View Payload</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
