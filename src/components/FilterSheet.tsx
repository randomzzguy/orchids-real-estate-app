"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Filters } from "@/lib/types";
import { MapPin, DollarSign, BedDouble, Bath, Sparkles, RotateCcw } from "lucide-react";

const propertyTypes = ["House", "Condo", "Land"];
const amenityOptions = [
  "Pool", "Gym", "Home Office", "Smart Home", "Pet-friendly",
  "Beach Access", "Hot Tub", "Fireplace", "Wine Cellar", "Outdoor Kitchen",
  "Rooftop Access", "Doorman", "Garden", "Ski Storage", "EV Charging",
  "Solar", "Guest House", "Boat Dock", "Marina Access", "Spa"
];

type FilterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

export function FilterSheet({ open, onOpenChange, filters, onFiltersChange }: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
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
    setLocalFilters(defaultFilters);
  };

  const togglePropertyType = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl bg-card border-border">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-serif text-gradient">Filters</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-emerald"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(90vh-160px)] py-6">
          <div className="space-y-8 px-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-emerald" />
                <h3 className="text-lg font-medium">Location</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Country</Label>
                  <Input
                    value={localFilters.country}
                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, country: e.target.value }))}
                    placeholder="USA"
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">State</Label>
                  <Input
                    value={localFilters.state}
                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, state: e.target.value }))}
                    placeholder="California"
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">City</Label>
                  <Input
                    value={localFilters.city}
                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Los Angeles"
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Zip Code</Label>
                  <Input
                    value={localFilters.zipCode}
                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="90210"
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-medium">Property Type</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => togglePropertyType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      localFilters.propertyTypes.includes(type)
                        ? "gradient-emerald text-background"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-medium">Price Range</h3>
              </div>
              <div className="px-2">
                <Slider
                  value={[localFilters.minPrice, localFilters.maxPrice]}
                  onValueChange={([min, max]) => setLocalFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))}
                  min={0}
                  max={10000000}
                  step={50000}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-emerald font-medium">{formatPrice(localFilters.minPrice)}</span>
                  <span className="text-emerald font-medium">{formatPrice(localFilters.maxPrice)}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BedDouble className="w-5 h-5 text-emerald" />
                <h3 className="text-lg font-medium">Bedrooms</h3>
              </div>
              <div className="px-2">
                <Slider
                  value={[localFilters.minBedrooms, localFilters.maxBedrooms]}
                  onValueChange={([min, max]) => setLocalFilters((prev) => ({ ...prev, minBedrooms: min, maxBedrooms: max }))}
                  min={0}
                  max={10}
                  step={1}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{localFilters.minBedrooms}+ beds</span>
                  <span className="text-muted-foreground">{localFilters.maxBedrooms} beds</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Bath className="w-5 h-5 text-emerald" />
                <h3 className="text-lg font-medium">Bathrooms</h3>
              </div>
              <div className="px-2">
                <Slider
                  value={[localFilters.minBathrooms, localFilters.maxBathrooms]}
                  onValueChange={([min, max]) => setLocalFilters((prev) => ({ ...prev, minBathrooms: min, maxBathrooms: max }))}
                  min={0}
                  max={10}
                  step={1}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{localFilters.minBathrooms}+ baths</span>
                  <span className="text-muted-foreground">{localFilters.maxBathrooms} baths</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-medium">Amenities</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Checkbox
                      checked={localFilters.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                      className="border-border data-[state=checked]:bg-emerald data-[state=checked]:border-emerald"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
          <Button
            onClick={handleApply}
            className="w-full h-12 gradient-emerald text-background font-semibold hover:opacity-90"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
