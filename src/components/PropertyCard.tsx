"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import type { Property } from "@/lib/types";
import { Heart, X, Eye, MapPin, BedDouble, Bath, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PropertyCardProps = {
  property: Property;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
};

export function PropertyCard({ property, onSwipe, isTop }: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [showXPop, setShowXPop] = useState(false);
  const [exitX, setExitX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 100;
      if (info.offset.x > threshold) {
        setShowHeartPop(true);
        setExitX(500);
        setTimeout(() => onSwipe("right"), 300);
      } else if (info.offset.x < -threshold) {
        setShowXPop(true);
        setExitX(-500);
        setTimeout(() => onSwipe("left"), 300);
      } else {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      }
    },
    [onSwipe, x]
  );

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      setShowHeartPop(true);
      setExitX(500);
      animate(x, 500, { duration: 0.3 });
    } else {
      setShowXPop(true);
      setExitX(-500);
      animate(x, -500, { duration: 0.3 });
    }
    setTimeout(() => onSwipe(direction), 300);
  };

  const nextImage = () => {
    if (property.images.length > 1) {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images.length > 1) {
      setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
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
    <motion.div
      ref={cardRef}
      className={cn(
        "absolute w-full h-full swipe-card",
        isTop ? "z-10" : "z-0"
      )}
      style={{ x, rotate }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      animate={{ 
        scale: isTop ? 1 : 0.95, 
        opacity: isTop ? 1 : 0.7,
        x: exitX,
        transition: { duration: 0.3 }
      }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-card border border-border card-glow">
        <div className="relative w-full h-[65%]">
          <motion.img
            key={currentImage}
            src={property.images[currentImage] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"}
            alt={property.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

          {property.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {property.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      idx === currentImage ? "bg-emerald w-4" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          <motion.div
            className="absolute top-6 left-6 px-6 py-3 rounded-2xl bg-emerald/90 border-2 border-emerald"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-xl font-bold text-background">LIKE</span>
          </motion.div>

          <motion.div
            className="absolute top-6 right-6 px-6 py-3 rounded-2xl bg-rose/90 border-2 border-rose"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-xl font-bold text-background">NOPE</span>
          </motion.div>

          {showHeartPop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="w-32 h-32 text-emerald fill-emerald animate-heart-pop" />
            </div>
          )}

          {showXPop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <X className="w-32 h-32 text-rose animate-heart-pop" />
            </div>
          )}

          <div className="absolute top-4 right-4">
            <div className="px-4 py-2 rounded-full glass border border-emerald/30">
              <span className="text-lg font-bold text-emerald">{formatPrice(property.price)}</span>
            </div>
          </div>

          {property.virtual_tour_url && (
            <a
              href={property.virtual_tour_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 left-4 px-3 py-2 rounded-full glass border border-gold/30 flex items-center gap-2 hover:border-gold/60 transition-colors"
            >
              <Eye className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">3D Tour</span>
            </a>
          )}
        </div>

        <div className="p-6 h-[35%] flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-serif line-clamp-1">{property.title}</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
              {property.property_type}
            </span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.city}, {property.state}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-5 h-5 text-emerald" />
              <span className="font-medium">{property.bedrooms}</span>
              <span className="text-muted-foreground text-sm">beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-5 h-5 text-emerald" />
              <span className="font-medium">{property.bathrooms}</span>
              <span className="text-muted-foreground text-sm">baths</span>
            </div>
            {property.sqft && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-5 h-5 text-emerald" />
                <span className="font-medium">{property.sqft.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">sqft</span>
              </div>
            )}
          </div>

          {property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {property.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="text-xs px-2.5 py-1 rounded-full bg-emerald/10 text-emerald border border-emerald/20"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-6 mt-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleButtonSwipe("left")}
              className="w-16 h-16 rounded-full border-2 border-rose/50 hover:border-rose hover:bg-rose/10 transition-all group"
            >
              <X className="w-8 h-8 text-rose group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => handleButtonSwipe("right")}
              className="w-20 h-20 rounded-full gradient-emerald hover:opacity-90 transition-all group shadow-lg shadow-emerald/30"
            >
              <Heart className="w-10 h-10 text-background group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
