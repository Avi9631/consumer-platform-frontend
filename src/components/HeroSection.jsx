"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import GoogleMapSearch from "@/components/maps/GoogleMapSearch";
import useLocationStore from "@/stores/locationStore";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";

/**
 * HeroSection Component
 * Main hero banner with search functionality
 */
export default function HeroSection({ onSearchSelect, onOpenLocationSheet, selectedLocation}) {
  const location = useLocationStore((state) => state.location);
  
  console.log("HeroSection Props:", { onSearchSelect, onOpenLocationSheet, selectedLocation });
  return (
    <section className="relative min-h-[400px] md:h-[500px] flex items-center justify-center overflow-visible pt-16 bg-gradient-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#3d1f2f]">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop"
          alt="City skyline"
          fill
          className="object-cover opacity-40"
          priority
        />
        {/* Premium Orange Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-[#2d1b1f]/70 to-[#1a0f1f]/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f1f] via-transparent to-orange-500/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-transparent to-purple-600/20"></div>

        {/* Enhanced Sunset rays effect */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/4 left-1/2 w-[3px] h-[700px] origin-top"
              style={{
                transform: `translateX(-50%) rotate(${i * 18}deg)`,
                background: `linear-gradient(to bottom, rgba(251, 146, 60, ${
                  0.25 - i * 0.008
                }) 0%, rgba(249, 115, 22, ${
                  0.15 - i * 0.006
                }) 40%, transparent 70%)`,
              }}
            />
          ))}
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-amber-500/15 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 px-4"
        >
          Find your dream home
          <span className="text-primary drop-shadow-[0_0_25px_rgba(251,146,60,0.9)]">
            .
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 px-4"
        >
          Location-based real estate marketplace • Select any area on map •
          5km radius search
        </motion.p>

        {/* Enhanced Address Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-4 relative z-50"
        >
          <div className="relative group">
            {/* Glowing background effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-orange-600 via-primary to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500 pointer-events-none"></div>
            
            {/* Main button container */}
            <div className="relative bg-linear-to-r from-background/95 to-background/90 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-[0_8px_32px_rgba(251,146,60,0.15)] overflow-hidden">
              <Button
                variant="ghost"
                onClick={(e) => {
                  console.log("=== BUTTON CLICKED ===");
                  console.log("Event target:", e.target);
                  console.log("Event currentTarget:", e.currentTarget);
                  console.log("onOpenLocationSheet function:", onOpenLocationSheet);
                  console.log("typeof onOpenLocationSheet:", typeof onOpenLocationSheet);
                  
                  if (onOpenLocationSheet && typeof onOpenLocationSheet === 'function') {
                    console.log("Calling onOpenLocationSheet...");
                    onOpenLocationSheet();
                    console.log("onOpenLocationSheet called successfully");
                  } else {
                    console.error("onOpenLocationSheet is not a function:", onOpenLocationSheet);
                  }
                }}
                className="w-full h-16 px-6 py-4 bg-transparent hover:bg-primary/5 border-0 rounded-2xl group/btn transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.25)] cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    {/* Enhanced icon with glow */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary rounded-full blur-sm opacity-30 group-hover/btn:opacity-50 transition-all duration-300"></div>
                      <div className="relative bg-primary/20 p-3 rounded-full border border-primary/30 group-hover/btn:bg-primary/30 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                      </div>
                    </div>
                    
                    {/* Location text with better typography */}
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-muted-foreground/80 font-medium tracking-wider uppercase">
                        Current Location
                      </span>
                      <span className="text-base font-semibold text-foreground truncate max-w-[200px] md:max-w-[300px] group-hover/btn:text-primary transition-colors duration-300">
                        {selectedLocation.name || "Select Location"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Change location indicator */}
                  <div className="flex items-center gap-2 text-muted-foreground group-hover/btn:text-primary transition-colors duration-300">
                    <span className="text-sm font-medium hidden md:inline">Change</span>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </div>
              </Button>
              
              {/* Subtle animated border */}
              <div className="absolute inset-0 rounded-2xl border border-primary/10 group-hover:border-primary/30 transition-all duration-500 pointer-events-none"></div>
            </div>
            
            {/* Optional floating badge for premium feel */}
            {selectedLocation.name && (
              <div className="absolute -top-2 -right-2 bg-linear-to-r from-primary to-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-pulse">
                <span className="font-medium">✨ Active</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
