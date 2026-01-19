"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { Property } from "@/lib/types";
import { MapPin, BedDouble, Bath, Loader2, Map as MapIcon, ExternalLink, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MapPage() {
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
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
        if (properties && properties.length > 0) {
          setSelectedProperty(properties[0]);
        }
      }
      
      setIsLoading(false);
    };

    fetchLikedProperties();
  }, [user, supabase]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const openInMaps = (property: Property) => {
    if (property.latitude && property.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ", " + property.city + ", " + property.state)}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
              <MapIcon className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-serif">Map View</span>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 text-emerald animate-spin" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        ) : likedProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-2">
              <MapIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-serif">No Properties to Show</h2>
            <p className="text-muted-foreground">
              Like some properties first to see them on the map!
            </p>
            <Link href="/discover">
              <Button className="gradient-emerald text-background mt-4">
                Start Discovering
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="relative">
            <div className="h-[50vh] bg-secondary relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald/5 to-gold/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-lg mx-auto p-4">
                  {likedProperties.map((property, index) => {
                    const top = 20 + (index % 3) * 30;
                    const left = 15 + (index % 4) * 20;
                    return (
                      <motion.button
                        key={property.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                        onClick={() => setSelectedProperty(property)}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          selectedProperty?.id === property.id
                            ? "gradient-emerald scale-125 z-10 animate-pulse-glow"
                            : "bg-card border border-border hover:scale-110"
                        }`}
                        style={{ top: `${top}%`, left: `${left}%` }}
                      >
                        <MapPin className={`w-5 h-5 ${
                          selectedProperty?.id === property.id ? "text-background" : "text-emerald"
                        }`} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedProperty && openInMaps(selectedProperty)}
                  className="glass border-border hover:border-emerald/50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            </div>

            {selectedProperty && (
              <motion.div
                key={selectedProperty.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4"
              >
                <div className="bg-card rounded-2xl border border-border overflow-hidden card-glow max-w-lg mx-auto">
                  <div className="relative h-40">
                    <img
                      src={selectedProperty.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full glass border border-emerald/30">
                      <span className="text-sm font-bold text-emerald">{formatPrice(selectedProperty.price)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-serif mb-2">{selectedProperty.title}</h3>
                    
                    <div className="flex items-center gap-1 text-muted-foreground mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-sm">{selectedProperty.address}, {selectedProperty.city}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4 text-emerald" />
                        <span className="text-sm">{selectedProperty.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4 text-emerald" />
                        <span className="text-sm">{selectedProperty.bathrooms} baths</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => openInMaps(selectedProperty)}
                      className="w-full gradient-emerald text-background"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 max-w-lg mx-auto">
                All Saved Properties ({likedProperties.length})
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-4 max-w-lg mx-auto scrollbar-hide">
                {likedProperties.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className={`shrink-0 w-24 rounded-xl overflow-hidden border transition-all ${
                      selectedProperty?.id === property.id
                        ? "border-emerald ring-2 ring-emerald/20"
                        : "border-border"
                    }`}
                  >
                    <img
                      src={property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400"}
                      alt={property.title}
                      className="w-full h-16 object-cover"
                    />
                    <div className="p-2 bg-card">
                      <p className="text-xs font-medium line-clamp-1">{property.city}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
