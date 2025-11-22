"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * CarouselSection Component
 * Reusable horizontal scrollable carousel with navigation arrows
 */
export default function CarouselSection({ 
  title, 
  subtitle, 
  icon, 
  children,
  className = "" 
}) {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={`py-8 md:py-12 relative z-10 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            {icon && icon}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
              {title}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => scrollCarousel("left")}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => scrollCarousel("right")}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>

        {subtitle && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
