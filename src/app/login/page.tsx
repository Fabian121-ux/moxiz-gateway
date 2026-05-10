"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, ArrowRight, Loader2, Info, Eye, EyeOff, UserCircle, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const performMockLogin = async (userEmail: string, displayName: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser = {
      uid: 'user_' + Math.random().toString(36).substring(7),
      email: userEmail,
      displayName: displayName
    };
    
    localStorage.setItem('moxiz_session', JSON.stringify(mockUser));
    window.location.href = "/dashboard";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await performMockLogin(email || "demo@moxiz.dev", "Merchant User");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) {
      toast({ variant: "destructive", title: "Error", description: "Business name is required." });
      return;
    }
    await performMockLogin(email, businessName);
  };

  const handleGuestLogin = async () => {
    await performMockLogin("guest@moxiz.dev", "Guest Merchant");
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
        <Tabs defaultValue="login">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Infrastructure Access</CardTitle>
            <CardDescription className="text-center">
              Authenticate to manage your payment gateway
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="demo@moxiz.dev" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary font-bold" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-business">Business Name</Label>
                  <Input 
                    id="signup-business" 
                    placeholder="Acme Payments Inc." 
                    required 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Work Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="eng@acme.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground font-bold" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                  Create Merchant Account
                </Button>
              </form>
            </TabsContent>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-semibold">Fast Track</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-primary/20 hover:bg-primary/10 text-primary font-semibold gap-2" 
              onClick={handleGuestLogin}
              disabled={loading}
            >
              <UserCircle className="h-4 w-4" />
              Continue as Guest Merchant
            </Button>
          </CardContent>
        </Tabs>
        <CardFooter className="justify-center">
          <p className="text-[10px] text-muted-foreground text-center">
            Moxiz Gateway Sandbox v1.0.4 • © 2024 Moxiz Infrastructure Ltd.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
