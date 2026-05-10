
"use client";

import { useState, useEffect } from "react";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { query, collection, orderBy, limit, where } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
import { RequestLog, AuditLog, Environment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Search, Clock, Cpu, ShieldAlert, History, Activity, Code } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function LogsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [env, setEnv] = useState<Environment>('SANDBOX');
  const [selectedRequest, setSelectedRequest] = useState<RequestLog | null>(null);

  useEffect(() => {
    const storedEnv = localStorage.getItem('moxiz_env');
    if (storedEnv) setEnv(storedEnv as Environment);
  }, []);

  const reqQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'merchants', user.uid, 'requestLogs'),
      where('environment', '==', env),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [db, user, env]);

  const auditQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'merchants', user.uid, 'auditLogs'),
      where('environment', '==', env),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [db, user, env]);

  const { data: requestLogs, loading: loadingReq } = useCollection<RequestLog>(reqQuery);
  const { data: auditLogs, loading: loadingAudit } = useCollection<AuditLog>(auditQuery);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-headline tracking-tight">System Logs</h2>
          <p className="text-muted-foreground text-sm">Real-time API traffic and operational audit trails.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" /> Live Tail
          </Button>
          <Button size="sm" className="bg-primary gap-2">
             Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="requests" className="gap-2">
            <Activity className="h-4 w-4" /> API Traffic
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <ShieldAlert className="h-4 w-4" /> Audit Trails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filter by path, status or IP..." className="pl-10 bg-card" />
              </div>

              <div className="border border-border/50 rounded-lg overflow-hidden bg-card">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 border-b border-border/50 text-left">
                    <tr>
                      <th className="p-3 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="p-3 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Method</th>
                      <th className="p-3 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Path</th>
                      <th className="p-3 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Latency</th>
                      <th className="p-3 font-bold text-[10px] uppercase tracking-widest text-muted-foreground text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {requestLogs.map((log) => (
                      <tr 
                        key={log.id} 
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          selectedRequest?.id === log.id && "bg-primary/5"
                        )}
                        onClick={() => setSelectedRequest(log)}
                      >
                        <td className="p-3">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-sm font-code text-[10px] font-bold",
                            log.statusCode < 300 ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"
                          )}>
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="p-3 font-code text-[11px] font-bold text-muted-foreground">{log.method}</td>
                        <td className="p-3 font-code text-[11px] truncate max-w-[200px]">{log.path}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[11px] font-medium">{log.latencyMs}ms</span>
                          </div>
                        </td>
                        <td className="p-3 text-right text-muted-foreground text-[10px]">
                          {format(new Date(log.createdAt), "HH:mm:ss.SSS")}
                        </td>
                      </tr>
                    ))}
                    {requestLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground italic text-sm">
                          Listening for incoming traffic in {env} environment...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              {selectedRequest ? (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-primary" /> Request Inspector
                      </span>
                      <Badge variant="outline" className="text-[10px]">{selectedRequest.id.slice(0, 8)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-muted-foreground mb-1">IP Address</div>
                        <div className="text-xs font-code">{selectedRequest.ip}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-muted-foreground mb-1">User Agent</div>
                        <div className="text-[10px] font-code truncate">{selectedRequest.userAgent}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <div className="text-[9px] uppercase font-bold text-primary mb-1">Request Payload</div>
                       <pre className="p-3 bg-black/40 rounded border border-white/5 text-[10px] font-code overflow-auto max-h-[120px]">
                         {JSON.stringify(selectedRequest.requestPayload, null, 2)}
                       </pre>
                    </div>

                    <div className="space-y-3">
                       <div className="text-[9px] uppercase font-bold text-emerald-500 mb-1">Response Payload</div>
                       <pre className="p-3 bg-black/40 rounded border border-white/5 text-[10px] font-code overflow-auto max-h-[120px]">
                         {JSON.stringify(selectedRequest.responsePayload, null, 2)}
                       </pre>
                    </div>

                    <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                      <History className="h-3 w-3" /> Replay this Request
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full border border-dashed rounded-lg flex flex-col items-center justify-center p-8 text-center bg-muted/5">
                  <Cpu className="h-10 w-10 text-muted-foreground/30 mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select a request</p>
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">Inspect headers, bodies, and performance metrics in real-time.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-accent" />
                Operational Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {auditLogs.map((log) => (
                   <div key={log.id} className="flex items-center justify-between p-3 border border-border/50 rounded hover:bg-muted/10 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded",
                          log.category === 'AUTH' ? 'bg-primary/10 text-primary' :
                          log.category === 'API_KEY' ? 'bg-accent/10 text-accent' :
                          'bg-muted text-muted-foreground'
                        )}>
                          <History className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{log.action}</p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                            <span>{log.actor}</span>
                            <span>•</span>
                            <span>{log.ip}</span>
                            <span>•</span>
                            <span className="text-primary">{log.environment}</span>
                          </div>
                        </div>
                     </div>
                     <span className="text-[10px] text-muted-foreground font-medium">
                       {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                     </span>
                   </div>
                 ))}
                 {auditLogs.length === 0 && (
                   <div className="py-20 text-center text-muted-foreground text-sm italic">
                      No security events recorded in this environment yet.
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
