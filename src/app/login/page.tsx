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
import { loginMerchant, signUpMerchant } from "@/services/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginMerchant(email, password);
      router.push("/dashboard");
      toast({ title: "Welcome back!", description: "You have successfully signed in." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) {
      toast({ variant: "destructive", title: "Error", description: "Business name is required." });
      return;
    }
    setLoading(true);
    try {
      await signUpMerchant(email, password, businessName);
      router.push("/dashboard");
      toast({ title: "Account Created", description: "Your merchant infrastructure is ready." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Sign Up Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    // For demo purposes, we can have a guest login that uses a pre-existing account
    setEmail("guest@moxiz.dev");
    setPassword("moxiz_demo_123");
    toast({ title: "Guest Access", description: "Using demo credentials." });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">Moxiz</span>
      </Link>

      <Card className="w-full max-w-md border-border/50 bg-card shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
        <Tabs defaultValue="login">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
                <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
              </TabsList>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Infrastructure Access</CardTitle>
            <CardDescription className="text-center">
              Authenticate to manage your payment gateway
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="demo@moxiz.dev" 
                    required 
                    className="h-11 rounded-xl bg-muted/20"
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
                      className="h-11 rounded-xl bg-muted/20"
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
                <Button type="submit" className="w-full h-11 bg-primary font-bold rounded-xl" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-business">Business Name</Label>
                  <Input 
                    id="signup-business" 
                    placeholder="Acme Payments Inc." 
                    required 
                    className="h-11 rounded-xl bg-muted/20"
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
                    className="h-11 rounded-xl bg-muted/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    required 
                    className="h-11 rounded-xl bg-muted/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full h-11 bg-accent text-accent-foreground font-bold rounded-xl" disabled={loading}>
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
                <span className="bg-card px-2 text-muted-foreground font-bold tracking-widest">or</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-11 border-primary/20 hover:bg-primary/5 text-primary font-bold gap-2 rounded-xl" 
              onClick={handleGuestLogin}
              disabled={loading}
            >
              <UserCircle className="h-4 w-4" />
              Use Demo Credentials
            </Button>
          </CardContent>
        </Tabs>
        <CardFooter className="justify-center border-t border-border/30 bg-muted/10">
          <p className="text-[10px] text-muted-foreground text-center font-medium">
            Moxiz Gateway Sandbox v1.0.4 • Professional Infrastructure
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
