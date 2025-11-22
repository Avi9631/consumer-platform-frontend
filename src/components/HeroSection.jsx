"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import GoogleMapSearch from "@/components/maps/GoogleMapSearch";
import useLocationStore from "@/stores/locationStore";

/**
 * HeroSection Component
 * Main hero banner with search functionality
 */
export default function HeroSection({ onSearchSelect }) {
  const location = useLocationStore((state) => state.location);
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

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-4 relative z-50"
        >
          <GoogleMapSearch
            onPlaceSelect={onSearchSelect}
            placeholder="Type to search for address or location..."
            className="w-full"
            initialValue={location.formattedAddress || location.name}
          />
        </motion.div>
      </div>
    </section>
  );
}
