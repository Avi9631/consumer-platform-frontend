"use client";

import {
  Home,
  Bed,
  Bath,
  MapPin,
  Heart,
  ImageIcon,
  Maximize2,
  Building2,
  TreePine,
  ChevronLeft,
  ChevronRight,
  LandPlot,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/**
 * PropertyListingCard Component
 * Different card designs for different property types
 */
export default function PropertyListingCard({
  property,
  onClick,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef(null);

  // Get property type
  const propertyType = property.propertyType || property.property_type || 'apartment';

  // Get all images from mediaData
  const getImages = () => {
    const mediaData = property.mediaData || [];
    
    if (!mediaData || !Array.isArray(mediaData) || mediaData.length === 0) {
      return ["/placeholder-property.jpg"];
    }

    const images = mediaData
      .filter((media) => media.docType === "media" && media.url)
      .map((media) => media.url);

    return images.length > 0 ? images : ["/placeholder-property.jpg"];
  };

  const images = getImages();

  // Handle individual image errors
  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  // Auto-play carousel on hover
  useEffect(() => {
    if (isHovered && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered, images.length]);

  // Navigate carousel
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Format price in INR
  const formatPrice = (price) => {
    const numPrice = typeof price === "string" ? parseInt(price) : price;
    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(2)} L`;
    }
    return `₹${numPrice.toLocaleString("en-IN")}`;
  };

  // Get price from pricing array or fallback to property.price
  const getPrice = () => {
    if (property.pricing && property.pricing.length > 0) {
      const askingPrice = property.pricing.find((p) => p.type === "asking_price");
      return askingPrice ? askingPrice.value : null;
    }
    return null;
  };

  // Get property name
  const propertyName = property.customPropertyName || property.projectName || property.propertyName || property.title || "Property";

  // Get location
  const location = property.locality && property.city ? `${property.locality}, ${property.city}` : property.addressText || "Location";

  // Get area
  const area = property.superArea || property.carpetArea;

  // Get bedrooms/bathrooms
  const bedrooms = property.bedrooms ? (typeof property.bedrooms === "string" ? parseInt(property.bedrooms) : property.bedrooms) : 0;
  const bathrooms = property.bathrooms ? (typeof property.bathrooms === "string" ? parseInt(property.bathrooms) : property.bathrooms) : 0;

  // Property type configurations
  const getPropertyTypeConfig = () => {
    const configs = {
      // Residential properties - Vertical card with emphasis on living spaces
      apartment: {
        icon: Building2,
        color: "from-blue-500 to-blue-600",
        bgGradient: "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30",
        layout: "vertical",
        showBedBath: true,
        showArea: true,
      },
      villa: {
        icon: Home,
        color: "from-purple-500 to-purple-600",
        bgGradient: "from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30",
        layout: "vertical",
        showBedBath: true,
        showArea: true,
      },
      duplex: {
        icon: Building2,
        color: "from-indigo-500 to-indigo-600",
        bgGradient: "from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30",
        layout: "vertical",
        showBedBath: true,
        showArea: true,
      },
      independent_house: {
        icon: Home,
        color: "from-green-500 to-green-600",
        bgGradient: "from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30",
        layout: "vertical",
        showBedBath: true,
        showArea: true,
      },
      penthouse: {
        icon: Building2,
        color: "from-amber-500 to-amber-600",
        bgGradient: "from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30",
        layout: "vertical",
        showBedBath: true,
        showArea: true,
      },
      studio: {
        icon: Building2,
        color: "from-pink-500 to-pink-600",
        bgGradient: "from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/30",
        layout: "vertical",
        showBedBath: false,
        showArea: true,
      },
      independent_floor: {
        icon: Building2,
        color: "from-teal-500 to-teal-600",
        bgGradient: "from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/30",
        layout: "vertical",
        showBedBath: true,
        showArea: true,
      },
      // Land properties - Horizontal card with emphasis on area
      plot: {
        icon: LandPlot,
        color: "from-orange-500 to-orange-600",
        bgGradient: "from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30",
        layout: "vertical",
        showBedBath: false,
        showArea: true,
      },
      farmhouse: {
        icon: TreePine,
        color: "from-emerald-500 to-emerald-600",
        bgGradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30",
        layout: "vertical",
        showBedBath: true,
        showArea: true,
      },
      agricultural_land: {
        icon: TreePine,
        color: "from-lime-500 to-lime-600",
        bgGradient: "from-lime-50 to-lime-100 dark:from-lime-950/50 dark:to-lime-900/30",
        layout: "vertical",
        showBedBath: false,
        showArea: true,
      },
    };

    return configs[propertyType] || configs.apartment;
  };

  const config = getPropertyTypeConfig();
  const TypeIcon = config.icon;

  // Render vertical layout
  return (
    <Card
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="shrink-0 w-[220px] sm:w-[260px] md:w-[300px] group hover:shadow-[0_8px_40px_rgba(251,146,60,0.35)] transition-all duration-500 overflow-hidden p-0 border-primary/10 hover:border-primary/40 hover:scale-[1.02] cursor-pointer flex flex-col gap-0"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Image Carousel */}
        <div className="relative w-full h-full">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentImageIndex
                  ? "opacity-100 scale-100 z-[1]"
                  : "opacity-0 scale-105 z-0"
              }`}
            >
              {!imageErrors[index] ? (
                <Image
                  src={img}
                  alt={`${propertyName} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => handleImageError(index)}
                  priority={index === 0}
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, 300px"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex flex-col items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-slate-500 mb-3" />
                  <p className="text-slate-400 text-sm font-medium">Image unavailable</p>
                </div>
              )}
            </div>
          ))}
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-[2]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none z-[2]"></div>
        </div>

        {/* Carousel Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Carousel Dots */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 md:left-4 right-3 md:right-4 flex justify-between items-start gap-2 z-20">
          <div className="flex flex-wrap gap-1.5">
            {/* Property Type Badge */}
            <Badge className={`backdrop-blur-lg bg-gradient-to-r ${config.color} text-white border-0 shadow-lg`}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {propertyType.replace(/_/g, " ").toUpperCase()}
            </Badge>
            {/* Listing Type Badge */}
            <Badge className="backdrop-blur-lg bg-white/90 text-gray-900 border-0 shadow-lg">
              {property.listingType === "sale" ? "FOR SALE" : "FOR RENT"}
            </Badge>
          </div>
          <div className="flex gap-1.5 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="icon-sm"
              className="rounded-full backdrop-blur-lg bg-white/20 hover:bg-white/30 border-white/30 shadow-lg transition-all duration-300 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isFavorite
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-white"
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-3 md:p-4 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm">
        {/* Title */}
        <h3 className="text-sm md:text-base font-bold text-white line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-300">
          {propertyName}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-white/70 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <p className="line-clamp-1">{location}</p>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-2 mb-3 text-white/80 flex-wrap">
          {config.showBedBath && bedrooms > 0 && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
              <Bed className="w-3 h-3" />
              <span className="text-xs font-medium">{bedrooms}</span>
            </div>
          )}
          {config.showBedBath && bathrooms > 0 && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
              <Bath className="w-3 h-3" />
              <span className="text-xs font-medium">{bathrooms}</span>
            </div>
          )}
          {config.showArea && area && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
              <Maximize2 className="w-3 h-3" />
              <span className="text-xs font-medium">{area} sqft</span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
          <div className="flex-1">
            <p className="text-sm md:text-base font-bold text-primary">
              {formatPrice(getPrice())}
            </p>
 
          </div>
          <Button
            size="sm"
            className="whitespace-nowrap cursor-pointer font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary/90 text-xs text-white"
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick(property);
            }}
          >
            VIEW DETAILS
          </Button>
        </div>
      </div>
    </Card>
  );
}
