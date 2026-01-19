"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { Property } from "@/lib/types";
import { Sparkles, MapPin, BedDouble, Bath, Heart, Loader2, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function HotMatchesPage() {
  const [suggestions, setSuggestions] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchAISuggestions = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setAnalyzing(true);

      const { data: likes } = await supabase
        .from("property_likes")
        .select("property_id")
        .eq("user_id", user.id)
        .eq("liked", true);

      const { data: dismissals } = await supabase
        .from("property_dismissals")
        .select("property_id")
        .eq("user_id", user.id);

      const excludeIds = [
        ...(likes?.map(l => l.property_id) || []),
        ...(dismissals?.map(d => d.property_id) || []),
      ];

      let likedPropertyTypes: string[] = [];
      let likedPriceRange = { min: 0, max: 10000000 };

      if (likes && likes.length > 0) {
        const { data: likedProperties } = await supabase
          .from("properties")
          .select("*")
          .in("id", likes.map(l => l.property_id));

        if (likedProperties && likedProperties.length > 0) {
          likedPropertyTypes = [...new Set(likedProperties.map(p => p.property_type))];
          const prices = likedProperties.map(p => p.price);
          const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          likedPriceRange = {
            min: Math.max(0, avgPrice * 0.7),
            max: avgPrice * 1.3,
          };
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalyzing(false);

      let query = supabase
        .from("properties")
        .select("*")
        .eq("is_active", true);

      if (excludeIds.length > 0) {
        query = query.not("id", "in", `(${excludeIds.join(",")})`);
      }

      if (likedPropertyTypes.length > 0) {
        query = query.in("property_type", likedPropertyTypes);
      }

      query = query
        .gte("price", likedPriceRange.min)
        .lte("price", likedPriceRange.max);

      const { data } = await query.order("created_at", { ascending: false }).limit(10);

      setSuggestions(data || []);
      setIsLoading(false);
    };

    fetchAISuggestions();
  }, [user, supabase]);

  const handleLike = async (property: Property) => {
    if (!user) return;
    
    const { error } = await supabase.from("property_likes").upsert({
      user_id: user.id,
      property_id: property.id,
      liked: true,
    });

    if (error) {
      toast.error("Failed to save property");
    } else {
      toast.success("Added to favorites!");
      setSuggestions(prev => prev.filter(p => p.id !== property.id));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-serif">Hot Matches</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold/10 border border-gold/20">
            <Zap className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs text-gold font-medium">AI Powered</span>
          </div>
        </div>
      </header>

      <main className="pt-20 px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
              className="w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10 text-background" />
            </motion.div>
            <div className="text-center">
              {analyzing ? (
                <>
                  <p className="text-lg font-medium mb-1">Analyzing Your Taste...</p>
                  <p className="text-sm text-muted-foreground">Our AI is learning your preferences</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium mb-1">Finding Perfect Matches...</p>
                  <p className="text-sm text-muted-foreground">Almost there!</p>
                </>
              )}
            </div>
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : suggestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-2">
              <TrendingUp className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-serif">Keep Swiping!</h2>
            <p className="text-muted-foreground">
              Like more properties so our AI can learn your preferences and suggest perfect matches.
            </p>
            <Link href="/discover">
              <Button className="gradient-gold text-background mt-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Discover Properties
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6 max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-4 border border-gold/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <span className="font-medium">AI Analysis Complete</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on your swipe history, we found {suggestions.length} properties you might love!
              </p>
            </motion.div>

            {suggestions.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden card-glow relative"
              >
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full gradient-gold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-background" />
                  <span className="text-xs font-bold text-background">{Math.floor(80 + Math.random() * 15)}% Match</span>
                </div>
                
                <div className="relative h-48">
                  <img
                    src={property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full glass border border-emerald/30">
                    <span className="text-sm font-bold text-emerald">{formatPrice(property.price)}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-serif line-clamp-1">{property.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground shrink-0 ml-2">
                      {property.property_type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm">{property.city}, {property.state}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <BedDouble className="w-4 h-4 text-emerald" />
                      <span className="text-sm">{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4 text-emerald" />
                      <span className="text-sm">{property.bathrooms} baths</span>
                    </div>
                  </div>

                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => handleLike(property)}
                    className="w-full gradient-emerald text-background"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Favorites
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
