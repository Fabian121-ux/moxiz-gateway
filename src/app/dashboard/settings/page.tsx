"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useMerchant } from "@/hooks/use-merchant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Shield, Save, Loader2, Fingerprint } from "lucide-react";

export default function SettingsPage() {
  const { merchant, loading: merchantLoading } = useMerchant();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const supabase = createClient();

  useEffect(() => {
    if (merchant) {
      setFormData({
        name: merchant.name || '',
        slug: merchant.slug || ''
      });
    }
  }, [merchant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('merchants')
        .update({
          name: formData.name,
        })
        .eq('id', merchant.id);

      if (error) throw error;

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

  if (merchantLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground font-medium">Manage your merchant profile and account preferences across the Moxiz network.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <Card className="border-border/50 bg-card overflow-hidden rounded-2xl shadow-sm group">
          <div className="h-1.5 bg-primary/20 group-focus-within:bg-primary transition-colors" />
          <CardHeader className="pb-8">
            <CardTitle className="flex items-center gap-3 text-xl font-bold font-headline">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              Business Profile
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              This information will be visible on your invoices, public receipts, and checkout sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Business Legal Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Acme Corp"
                className="h-12 bg-muted/30 border-border/50 rounded-xl focus:border-primary/50 transition-all font-medium"
              />
            </div>
            
            <div className="grid gap-3 group/field">
              <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Merchant Slug</Label>
              <div className="relative">
                <Input 
                  id="slug" 
                  value={formData.slug} 
                  readOnly
                  className="h-12 bg-muted/50 font-code text-xs rounded-xl border-border/50 text-muted-foreground pl-10"
                />
                <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within/field:text-primary transition-colors" />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium ml-1">Your unique public identifier in the Moxiz ecosystem. Used for API endpoint routing.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card overflow-hidden rounded-2xl shadow-sm">
          <CardHeader className="pb-8">
            <CardTitle className="flex items-center gap-3 text-xl font-bold font-headline">
              <div className="p-2 rounded-xl bg-accent/10 text-accent">
                <Mail className="h-5 w-5" />
              </div>
              Contact Information
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Primary email used for billing, security alerts, and critical system notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 opacity-80">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Work Email</Label>
              <Input 
                id="email" 
                value={merchant?.email || "No email linked"} 
                readOnly
                className="h-12 bg-muted/50 rounded-xl border-border/50 text-muted-foreground font-medium"
              />
              <p className="text-[10px] text-muted-foreground font-medium ml-1">To update your account email, please visit the Identity settings in the Supabase console.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card overflow-hidden rounded-2xl shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold font-headline">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Shield className="h-5 w-5" />
              </div>
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border border-border/40 transition-all hover:border-emerald-500/30">
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-foreground/90">Merchant Verification</p>
                <p className="text-xs text-muted-foreground font-medium">Your account is fully verified and authorized for sandbox operations.</p>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{merchant?.status || "ACTIVE"}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t border-border/40 py-6 px-8 flex justify-between items-center">
            <p className="text-[10px] text-muted-foreground font-medium max-w-[300px]">
              Last updated on {merchant?.updated_at ? format(new Date(merchant.updated_at), "PPP") : 'recently'}.
            </p>
            <Button type="submit" disabled={saving} className="h-12 px-8 gap-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
