
"use client";

import { useState, useEffect } from "react";
import { useFirestore, useUser } from "@/firebase";
import { MerchantService } from "@/services/merchant-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Building2, Mail, Shield, Save, Loader2 } from "lucide-react";
import { Merchant } from "@/lib/types";

export default function SettingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Merchant | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !db) return;
      setLoading(true);
      try {
        const data = await MerchantService.ensureMerchantProfile(db, user.uid, user.email!);
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user, db]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !profile) return;

    setSaving(true);
    try {
      await MerchantService.updateMerchant(db, user.uid, {
        businessName: profile.businessName,
      });
      toast({
        title: "Settings updated",
        description: "Your business profile has been successfully saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your merchant profile and account preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Business Profile
            </CardTitle>
            <CardDescription>
              This information will be visible on your invoices and checkout sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="businessName">Business Legal Name</Label>
              <Input 
                id="businessName" 
                value={profile?.businessName || ""} 
                onChange={(e) => setProfile(prev => prev ? { ...prev, businessName: e.target.value } : null)}
                placeholder="Acme Corp"
                className="bg-background border-border/50"
              />
            </div>
            <div className="grid gap-2 opacity-70">
              <Label htmlFor="merchantId">Merchant ID</Label>
              <Input 
                id="merchantId" 
                value={user?.uid || ""} 
                readOnly
                className="bg-muted font-code text-xs"
              />
              <p className="text-[10px] text-muted-foreground">Your unique identifier in the Moxiz ecosystem. Cannot be changed.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mail className="h-5 w-5 text-accent" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Primary email used for billing and critical system notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 opacity-70">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                value={profile?.email || ""} 
                readOnly
                className="bg-muted"
              />
              <p className="text-[10px] text-muted-foreground">To change your email, please contact Moxiz support.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-emerald-500" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="space-y-1">
                <p className="text-sm font-medium">Environment Status</p>
                <p className="text-xs text-muted-foreground">You are currently operating in the Sandbox environment.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{profile?.status || "ACTIVE"}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t border-border/50 py-4">
            <Button type="submit" disabled={saving} className="gap-2 ml-auto bg-primary hover:bg-primary/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
