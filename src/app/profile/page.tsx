"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, MapPin, LogOut, Loader2, Save, Heart, Home as HomeIcon, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({ liked: 0, viewed: 0 });
  const { user, signOut } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setEmail(profile.email || user.email || "");
        setCity(profile.city || "");
        setState(profile.state || "");
      } else {
        setEmail(user.email || "");
      }

      const { count: likedCount } = await supabase
        .from("property_likes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: dismissedCount } = await supabase
        .from("property_dismissals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setStats({
        liked: likedCount || 0,
        viewed: (likedCount || 0) + (dismissedCount || 0),
      });

      setIsLoading(false);
    };

    fetchProfile();
  }, [user, supabase]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      email,
      city,
      state,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
              <User className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-serif">Profile</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 rounded-full gradient-emerald flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-serif text-background">
              {fullName ? fullName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-serif mb-1">{fullName || "Welcome!"}</h1>
          <p className="text-muted-foreground">{email}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-emerald" />
            </div>
            <div className="text-2xl font-serif text-gradient">{stats.liked}</div>
            <div className="text-sm text-muted-foreground">Saved</div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-2">
              <HomeIcon className="w-6 h-6 text-gold" />
            </div>
            <div className="text-2xl font-serif text-gradient">{stats.viewed}</div>
            <div className="text-sm text-muted-foreground">Viewed</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border p-6 mb-6"
        >
          <h2 className="text-lg font-serif mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10 bg-secondary/50 border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="pl-10 bg-secondary/50 border-border"
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Los Angeles"
                    className="pl-10 bg-secondary/50 border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">State</Label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="California"
                  className="bg-secondary/50 border-border"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-6 gradient-emerald text-background"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full border-rose/30 text-rose hover:bg-rose/10 hover:border-rose"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
