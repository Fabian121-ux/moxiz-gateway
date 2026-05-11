"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Search, Clock, Cpu, ShieldAlert, History, Activity, Code, Loader2, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function LogsPage() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const [env, setEnv] = useState<'sandbox' | 'live'>('sandbox');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [requestLogs, setRequestLogs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (merchant) {
      fetchLogs();
    }
  }, [merchant, env]);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    
    // Fetch Request Logs
    const { data: reqData } = await supabase
      .from('request_logs')
      .select('*')
      .eq('merchant_id', merchant.id)
      .eq('environment', env)
      .order('created_at', { ascending: false })
      .limit(50);

    // Fetch Audit Logs
    const { data: auditData } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('merchant_id', merchant.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (reqData) setRequestLogs(reqData);
    if (auditData) setAuditLogs(auditData);
    setLoadingLogs(false);
  };

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
          <h2 className="text-3xl font-bold font-headline tracking-tight">System Logs</h2>
          <p className="text-muted-foreground text-sm font-medium">Real-time API traffic and operational audit trails.</p>
        </div>
        <div className="flex gap-3 bg-muted/50 p-1 rounded-xl border border-border/50">
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

      <Tabs defaultValue="requests" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="requests" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
              <Activity className="h-4 w-4" /> API Traffic
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-6">
              <ShieldAlert className="h-4 w-4" /> Audit Trails
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/50">
              <History className="h-4 w-4" /> Live Tail
            </Button>
            <Button size="sm" className="bg-primary gap-2 rounded-lg shadow-lg shadow-primary/10">
               Export CSV
            </Button>
          </div>
        </div>

        <TabsContent value="requests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input placeholder="Filter by path, status or IP..." className="pl-10 h-11 bg-card rounded-xl border-border/50 focus:border-primary/50 transition-all" />
              </div>

              <div className="border border-border/40 rounded-2xl overflow-hidden bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30 border-b border-border/40 text-left">
                      <tr>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Method</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Path</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Latency</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {loadingLogs ? (
                        <tr>
                          <td colSpan={5} className="p-20 text-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Querying Logs...</span>
                          </td>
                        </tr>
                      ) : requestLogs.map((log) => (
                        <tr 
                          key={log.id} 
                          className={cn(
                            "hover:bg-primary/5 cursor-pointer transition-all group",
                            selectedRequest?.id === log.id && "bg-primary/[0.03]"
                          )}
                          onClick={() => setSelectedRequest(log)}
                        >
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded-md font-code text-[10px] font-bold border",
                              log.status_code < 300 
                                ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
                                : "text-destructive bg-destructive/10 border-destructive/20"
                            )}>
                              {log.status_code}
                            </span>
                          </td>
                          <td className="p-4 font-code text-[11px] font-bold text-muted-foreground/70">{log.method}</td>
                          <td className="p-4 font-code text-[11px] font-medium truncate max-w-[200px] text-foreground/80">{log.path}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-muted-foreground/50" />
                              <span className={cn(
                                "text-[11px] font-bold",
                                log.latency_ms > 500 ? "text-orange-500" : "text-foreground/60"
                              )}>{log.latency_ms}ms</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-muted-foreground text-[10px] font-medium">
                              {format(new Date(log.created_at), "HH:mm:ss.SSS")}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!loadingLogs && requestLogs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-20 text-center flex flex-col items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted/20 flex items-center justify-center">
                              <Terminal className="h-5 w-5 text-muted-foreground/40" />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                              No traffic detected in {env}
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 h-full">
              {selectedRequest ? (
                <Card className="border-primary/20 bg-card shadow-2xl shadow-primary/5 sticky top-24 overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
                  <CardHeader className="pb-4 bg-muted/10 border-b border-border/30">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2 font-bold tracking-tight">
                        <Terminal className="h-4 w-4 text-primary" /> Request Inspector
                      </span>
                      <Badge variant="outline" className="text-[10px] font-code bg-background/50">{selectedRequest.id.slice(0, 8)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Source IP</div>
                        <div className="text-xs font-code font-bold text-foreground/80">{selectedRequest.ip_address || '127.0.0.1'}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">API Key Ref</div>
                        <div className="text-[10px] font-code font-bold text-primary truncate">
                          {selectedRequest.api_key_id ? `ak_${selectedRequest.api_key_id.slice(0, 8)}` : 'Internal'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <div className="text-[9px] uppercase font-bold text-primary tracking-widest">Request Payload</div>
                         <Button variant="ghost" size="sm" className="h-5 text-[9px] uppercase font-bold text-muted-foreground">Copy JSON</Button>
                       </div>
                       <pre className="p-4 bg-black/60 rounded-xl border border-white/5 text-[11px] font-code overflow-auto max-h-[150px] shadow-inner text-primary/80">
                         {JSON.stringify(selectedRequest.request_payload, null, 2)}
                       </pre>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <div className="text-[9px] uppercase font-bold text-emerald-500 tracking-widest">Response Payload</div>
                         <Button variant="ghost" size="sm" className="h-5 text-[9px] uppercase font-bold text-muted-foreground">Copy JSON</Button>
                       </div>
                       <pre className="p-4 bg-black/60 rounded-xl border border-white/5 text-[11px] font-code overflow-auto max-h-[150px] shadow-inner text-emerald-400/80">
                         {JSON.stringify(selectedRequest.response_payload, null, 2)}
                       </pre>
                    </div>

                    <Button className="w-full h-11 gap-2 text-xs font-bold rounded-xl bg-primary shadow-lg shadow-primary/20">
                      <History className="h-4 w-4" /> Replay this Request
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-[500px] border border-border/40 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center bg-muted/5 sticky top-24">
                  <div className="h-16 w-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-6">
                    <Cpu className="h-8 w-8 text-muted-foreground/30 animate-pulse" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select a request</p>
                  <p className="text-[11px] text-muted-foreground mt-2 max-w-[220px] leading-relaxed">
                    Inspect headers, JSON bodies, and real-time performance metrics for every API call.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="border-border/40 bg-card rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/30">
              <CardTitle className="text-lg flex items-center gap-2 font-bold tracking-tight">
                <ShieldAlert className="h-5 w-5 text-primary" />
                Operational Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/30">
                 {loadingLogs ? (
                    <div className="p-20 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary/40 mx-auto mb-4" />
                      <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Fetching Audit Trails...</span>
                    </div>
                 ) : auditLogs.map((log) => (
                   <div key={log.id} className="flex items-center justify-between p-5 hover:bg-muted/5 transition-all group">
                     <div className="flex items-center gap-5">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center border",
                          log.action.includes('REVEAL') ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                          log.action.includes('SIGN') ? 'bg-primary/10 text-primary border-primary/20' :
                          'bg-muted/20 text-muted-foreground border-border/40'
                        )}>
                          <History className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground/90">{log.action}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                            <span className="bg-muted/30 px-2 py-0.5 rounded border border-border/40">{log.resource_type}</span>
                            <span className="opacity-40 font-normal">|</span>
                            <span>{log.ip_address || 'System'}</span>
                            <span className="opacity-40 font-normal">|</span>
                            <span className="text-primary/70">{log.resource_id?.slice(0, 8)}</span>
                          </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter bg-muted/20 px-3 py-1 rounded-full">
                         {format(new Date(log.created_at), "MMM d, HH:mm:ss")}
                       </span>
                       <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                     </div>
                   </div>
                 ))}
                 {!loadingLogs && auditLogs.length === 0 && (
                   <div className="py-24 text-center flex flex-col items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-muted/10 flex items-center justify-center">
                        <ShieldAlert className="h-6 w-6 text-muted-foreground/20" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground/40 max-w-[200px]">
                        No security events recorded in this environment yet.
                      </p>
                   </div>
                 )}
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
