
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Terminal, 
  Code2, 
  Webhook, 
  History, 
  Settings, 
  LogOut,
  ShieldCheck,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: History },
  { label: "Logs & Traffic", href: "/dashboard/logs", icon: Activity },
  { label: "Console", href: "/dashboard/sandbox", icon: Terminal },
  { label: "Developers", href: "/dashboard/developers", icon: Code2 },
  { label: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  user: any;
  merchant: any;
}

export function Sidebar({ user, merchant }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('moxiz_session');
    router.push("/");
    window.location.reload();
  };

  return (
    <aside className="w-64 border-r border-border bg-sidebar h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Moxiz</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                pathname === item.href
                  ? "bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl mb-6">
           <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Service Health</h5>
           <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium text-emerald-500/80">API Gateway Online</span>
           </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
