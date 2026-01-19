"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PropertyCard } from "@/components/PropertyCard";
import { BottomNav } from "@/components/BottomNav";
import { FilterSheet } from "@/components/FilterSheet";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { Property, Filters } from "@/lib/types";
import { SlidersHorizontal, Loader2, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const defaultFilters: Filters = {
  country: "",
  state: "",
  city: "",
  zipCode: "",
  propertyTypes: [],
  minPrice: 0,
  maxPrice: 10000000,
  minBedrooms: 0,
  maxBedrooms: 10,
  minBathrooms: 0,
  maxBathrooms: 10,
  amenities: [],
};

export default function DiscoverPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    
    let query = supabase
      .from("properties")
      .select("*")
      .eq("is_active", true);

    if (filters.country) query = query.eq("country", filters.country);
    if (filters.state) query = query.eq("state", filters.state);
    if (filters.city) query = query.ilike("city", `%${filters.city}%`);
    if (filters.zipCode) query = query.eq("zip_code", filters.zipCode);
    if (filters.propertyTypes.length > 0) {
      query = query.in("property_type", filters.propertyTypes);
    }
    query = query.gte("price", filters.minPrice).lte("price", filters.maxPrice);
    query = query.gte("bedrooms", filters.minBedrooms).lte("bedrooms", filters.maxBedrooms);
    query = query.gte("bathrooms", filters.minBathrooms).lte("bathrooms", filters.maxBathrooms);

    if (user) {
      const { data: likedIds } = await supabase
        .from("property_likes")
        .select("property_id")
        .eq("user_id", user.id);
      
      const { data: dismissedIds } = await supabase
        .from("property_dismissals")
        .select("property_id")
        .eq("user_id", user.id);

      const excludeIds = [
        ...(likedIds?.map(l => l.property_id) || []),
        ...(dismissedIds?.map(d => d.property_id) || []),
      ];

      if (excludeIds.length > 0) {
        query = query.not("id", "in", `(${excludeIds.join(",")})`);
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load properties");
      console.error(error);
    } else {
      setProperties(data || []);
      setCurrentIndex(0);
    }
    
    setIsLoading(false);
  }, [supabase, filters, user]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSwipe = async (direction: "left" | "right") => {
    const property = properties[currentIndex];
    if (!property || !user) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    if (direction === "right") {
      const { error } = await supabase.from("property_likes").upsert({
        user_id: user.id,
        property_id: property.id,
        liked: true,
      });
      if (error) console.error(error);
      else toast.success("Added to favorites!", { duration: 1500 });
    } else {
      const { error } = await supabase.from("property_dismissals").upsert({
        user_id: user.id,
        property_id: property.id,
      });
      if (error) console.error(error);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleRefresh = () => {
    fetchProperties();
  };

  const visibleProperties = properties.slice(currentIndex, currentIndex + 2);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center">
              <Home className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-serif text-gradient">Nestify</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="text-muted-foreground hover:text-emerald"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(true)}
              className="text-muted-foreground hover:text-emerald relative"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {(filters.city || filters.propertyTypes.length > 0 || filters.amenities.length > 0) && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16 px-4 pb-4">
        <div className="relative w-full max-w-md mx-auto" style={{ height: "calc(100vh - 180px)" }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-12 h-12 text-emerald animate-spin" />
              <p className="text-muted-foreground">Finding your perfect homes...</p>
            </div>
          ) : visibleProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full gap-4 text-center px-6"
            >
              <div className="w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center mb-2">
                <Home className="w-10 h-10 text-background" />
              </div>
              <h2 className="text-2xl font-serif">No More Properties</h2>
              <p className="text-muted-foreground">
                You&apos;ve seen all available properties matching your criteria. 
                Try adjusting your filters or check back later!
              </p>
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                  className="border-border hover:border-emerald/50"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Adjust Filters
                </Button>
                <Button
                  onClick={handleRefresh}
                  className="gradient-emerald text-background"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {visibleProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSwipe={handleSwipe}
                  isTop={index === 0}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      <FilterSheet
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <BottomNav />
    </div>
  );
}
