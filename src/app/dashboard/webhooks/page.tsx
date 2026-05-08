
"use client";

import { mockWebhookEvents } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Zap, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function WebhooksPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Webhooks</h2>
          <p className="text-muted-foreground">Track the status of real-time event deliveries.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Zap className="h-4 w-4" /> Send Test Webhook
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">240ms</div>
            <p className="text-xs text-muted-foreground">From event to delivery</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retries</CardTitle>
            <History className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Recovered successfully</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold font-headline">Recent Events</h3>
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          {mockWebhookEvents.map((event) => (
            <div key={event.id} className="p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors flex items-center justify-between">
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
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      {event.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-3 mt-1">
                    <span>ID: {event.id}</span>
                    <span>•</span>
                    <span>{format(new Date(event.createdAt), "MMM d, yyyy h:mm a")}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium">{event.retryCount > 0 ? `${event.retryCount} Retries` : 'No retries'}</div>
                  <div className="text-xs text-muted-foreground">{event.status === 'SENT' ? 'Delivered successfully' : 'Last failed attempt: 10m ago'}</div>
                </div>
                <Button variant="ghost" size="sm">View Payload</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
