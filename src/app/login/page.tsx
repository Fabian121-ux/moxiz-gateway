
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate a brief network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation
    if (email === 'demo@moxiz.dev' && password === 'password123') {
      const mockUser = {
        uid: 'user_demo_123',
        email: email,
        displayName: 'Demo Merchant'
      };
      localStorage.setItem('moxiz_session', JSON.stringify(mockUser));
      router.push("/dashboard");
      window.location.reload(); // Force refresh to update all hooks
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials. Use the demo account to log in.",
      });
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    setEmail("demo@moxiz.dev");
    setPassword("password123");
    // We'll let the user click sign in manually or trigger it
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">Moxiz</span>
      </Link>

      <Card className="w-full max-w-md border-border bg-card shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your merchant dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-start gap-3 mb-2">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-primary">Demo Mode Available</p>
              <p className="text-[10px] text-muted-foreground">Use <span className="font-code">demo@moxiz.dev</span> / <span className="font-code">password123</span> to explore the gateway sandbox.</p>
              <Button 
                variant="link" 
                className="h-auto p-0 text-[10px] font-bold text-primary mt-1"
                onClick={loginAsDemo}
              >
                Auto-fill Demo Credentials
              </Button>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border/50"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">Demo Sandbox</span>
            </div>
          </div>

          <Button variant="outline" className="w-full border-border hover:bg-accent" onClick={() => { setEmail('demo@moxiz.dev'); setPassword('password123'); }} disabled={loading}>
            Continue as Guest Merchant
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
          Don&apos;t have an account? 
          <Link href="#" className="text-primary font-bold hover:underline">Create an account</Link>
        </CardFooter>
      </Card>

      <p className="mt-8 text-xs text-muted-foreground text-center max-w-xs">
        By signing in, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
