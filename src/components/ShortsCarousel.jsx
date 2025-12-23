"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShortVideoCard from "@/components/ShortVideoCard";

/**
 * ShortsCarousel Component
 * Displays a horizontal scrollable carousel of short videos
 */
export default function ShortsCarousel({ shorts = [], title = "Short Videos" }) {
  const [hoveredId, setHoveredId] = useState(null);
  const scrollRef = useRef(null);

  const handleHover = (id, isHovered) => {
    setHoveredId(isHovered ? id : null);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 240; // Width of card + gap
      const newScrollLeft =
        scrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (!shorts || shorts.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-4 md:px-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Watch quick property tours and highlights
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="hidden sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="hidden sm:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Shorts Container */}
      <div className="relative group/carousel">
        {/* Left Gradient Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity" />

        {/* Right Gradient Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity" />

        {/* Shorts Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-6"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {shorts.map((short) => (
            <ShortVideoCard
              key={short.id}
              tour={short}
              isHovered={hoveredId === short.id}
              onHover={handleHover}
            />
          ))}
        </div>

        {/* Mobile Navigation Buttons (Overlay) */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("left")}
          className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("right")}
          className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* View All Link */}
      <div className="flex justify-center mt-6">
        <Button variant="link" className="text-primary">
          View All Shorts →
        </Button>
      </div>
    </div>
  );
}
