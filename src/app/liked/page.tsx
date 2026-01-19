"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { Property } from "@/lib/types";
import { Heart, MapPin, BedDouble, Bath, Trash2, MessageCircle, Loader2, Home, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function LikedPage() {
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const fetchLikedProperties = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      const { data: likes } = await supabase
        .from("property_likes")
        .select("property_id")
        .eq("user_id", user.id)
        .eq("liked", true);

      if (likes && likes.length > 0) {
        const propertyIds = likes.map((l) => l.property_id);
        const { data: properties } = await supabase
          .from("properties")
          .select("*")
          .in("id", propertyIds);
        
        setLikedProperties(properties || []);
      } else {
        setLikedProperties([]);
      }
      
      setIsLoading(false);
    };

    fetchLikedProperties();
  }, [user, supabase]);

  const handleRemove = async (propertyId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from("property_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", propertyId);

    if (error) {
      toast.error("Failed to remove property");
    } else {
      setLikedProperties((prev) => prev.filter((p) => p.id !== propertyId));
      toast.success("Removed from favorites");
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
            <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
              <Heart className="w-5 h-5 text-background fill-background" />
            </div>
            <span className="text-xl font-serif">Favorites</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {likedProperties.length} {likedProperties.length === 1 ? "property" : "properties"}
          </span>
        </div>
      </header>

      <main className="pt-20 px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 text-emerald animate-spin" />
            <p className="text-muted-foreground">Loading your favorites...</p>
          </div>
        ) : likedProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-2">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-serif">No Favorites Yet</h2>
            <p className="text-muted-foreground">
              Start swiping right on properties you love to save them here!
            </p>
            <Link href="/discover">
              <Button className="gradient-emerald text-background mt-4">
                <Home className="w-4 h-4 mr-2" />
                Start Discovering
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4 max-w-lg mx-auto">
            <AnimatePresence>
              {likedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden card-glow"
                >
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
                    {property.virtual_tour_url && (
                      <a
                        href={property.virtual_tour_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 left-3 px-2.5 py-1.5 rounded-full glass border border-gold/30 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold" />
                        <span className="text-xs font-medium text-gold">3D</span>
                      </a>
                    )}
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

                    <div className="flex gap-2">
                      <Link href={`/messages?property=${property.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-emerald/30 hover:bg-emerald/10 hover:border-emerald"
                        >
                          <MessageCircle className="w-4 h-4 mr-2 text-emerald" />
                          Contact
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemove(property.id)}
                        className="border-rose/30 hover:bg-rose/10 hover:border-rose"
                      >
                        <Trash2 className="w-4 h-4 text-rose" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
