"use client";

import {
  Home,
  Bed,
  Bath,
  MapPin,
  Heart,
  Phone,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "./ui/button";

/**
 * PropertyCard Component
 * Enhanced property card with image carousel
 * Supports both legacy property format and new JSON structure
 */
export default function PropertyCard({
  property,
  onClick,
  variant = "horizontal",
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const autoPlayRef = useRef(null);

  // Get all images from media_data for carousel
  const getImages = () => {
    const mediaData = property.media_data || property.mediaData;

    if (!mediaData || !Array.isArray(mediaData) || mediaData.length === 0) {
      // Fallback to single image property
      if (property.image) return [property.image];
      return ["/placeholder-property.jpg"];
    }

    const images = mediaData
      .filter((media) => media.type === "image" && media.url)
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

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
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
      const askingPrice = property.pricing.find(
        (p) => p.type === "asking_price"
      );
      return askingPrice ? askingPrice.value : property.price;
    }
    return property.price;
  };

  // Get property name
  const getPropertyName = () => {
    if (property.customPropertyName) return property.customPropertyName;
    if (property.projectName) return property.projectName;
    if (property.propertyName) return property.propertyName;
    return property.title || "Untitled Property";
  };

  // Get area to display
  const getArea = () => {
    if (property.superArea) return property.superArea;
    if (property.carpetArea) return property.carpetArea;
    return property.area;
  };

  // Get location string
  const getLocation = () => {
    // If location is a string, return it
    if (typeof property.location === "string") {
      return property.location;
    }

    // Build location from locality and city
    if (property.locality && property.city) {
      return `${property.locality}, ${property.city}`;
    }

    // Try address_text (snake_case from backend)
    if (property.address_text) {
      const parts = property.address_text.split(",");
      return parts.slice(0, 2).join(", ");
    }

    // Try addressText (camelCase)
    if (property.addressText) {
      const parts = property.addressText.split(",");
      return parts.slice(0, 2).join(", ");
    }

    // Fallback to city or locality
    return property.city || property.locality || "Location";
  };

  // Get bedrooms and bathrooms
  const bedrooms = property.bedrooms
    ? typeof property.bedrooms === "string"
      ? parseInt(property.bedrooms)
      : property.bedrooms
    : 0;
  const bathrooms = property.bathrooms
    ? typeof property.bathrooms === "string"
      ? parseInt(property.bathrooms)
      : property.bathrooms
    : 0;

  // Get display name
  const getDisplayName = () => {
    return getPropertyName();
  };

  // Get display location
  const getDisplayLocation = () => {
    return getLocation();
  };

  // Get display price
  const getDisplayPrice = () => {
    // If price is already formatted as string
    if (typeof property.price === "string" && property.price.includes("₹")) {
      return property.price;
    }

    // Get numeric price
    const numericPrice = getPrice();
    if (numericPrice) {
      return formatPrice(numericPrice);
    }

    // For PG hostels with room_types
    if (
      property.room_types &&
      Array.isArray(property.room_types) &&
      property.room_types.length > 0
    ) {
      const minPrice = Math.min(
        ...property.room_types.map((rt) => rt.price || 0).filter((p) => p > 0)
      );
      if (minPrice) {
        return `From ${formatPrice(minPrice)}/month`;
      }
    }

    return "Price on request";
  };

  // Get BHK or room type info
  const getBhkInfo = () => {
    if (property.bhk) return property.bhk;
    if (bedrooms > 0) return `${bedrooms} BHK`;

    // For PG hostels, show room types
    if (property.room_types && Array.isArray(property.room_types)) {
      const types = property.room_types
        .map((rt) => rt.room_type || rt.type)
        .filter(Boolean);
      if (types.length > 0) {
        return types.slice(0, 2).join(", ");
      }
    }

    return "";
  };

  // Get developer/brand name
  const getDeveloperName = () => {
    if (property.developer) return property.developer;
    if (property.brand_name) return property.brand_name;
    if (property.is_brand_managed) return "Brand Managed";
    return "Independent";
  };

  // Check if property is verified
  const isVerified = () => {
    return (
      property.verificationStatus === "VERIFIED" ||
      property.verification_status === "VERIFIED" ||
      property.isVerified === true
    );
  };

  // Get property status badges
  const getStatusBadge = () => {
    if (property.status === "ready_to_move") {
      return "Ready to Move";
    }
    if (property.status === "under_construction") {
      return "Under Construction";
    }
    return null;
  };

  // Toggle favorite
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(property);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="shrink-0 w-[220px] sm:w-[260px] md:w-[300px] group hover:shadow-[0_8px_40px_rgba(251,146,60,0.35)] transition-all duration-500 overflow-hidden p-0 border-primary/10 hover:border-primary/40 hover:scale-[1.02] cursor-pointer flex flex-col gap-0"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Image Carousel */}
        <div className="relative w-full h-full">
          {images.map((imgSrc, index) => (
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
                  src={imgSrc}
                  alt={`${getDisplayName()} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => handleImageError(index)}
                  onLoadingComplete={() => setImageLoading(false)}
                  priority={index === 0}
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, 300px"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex flex-col items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-slate-500 mb-3" />
                  <p className="text-slate-400 text-sm font-medium">
                    Image unavailable
                  </p>
                </div>
              )}
            </div>
          ))}
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-[2]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none z-[2]"></div>
        </div>

        {/* Carousel Navigation - Only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Carousel Dots */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 md:left-4 right-3 md:right-4 flex justify-between items-start gap-2 z-20">
          <div className="flex flex-wrap gap-1.5">
            {getStatusBadge() && (
              <Badge
                variant="secondary"
                className="backdrop-blur-lg bg-blue-500/30 text-blue-200 border-blue-400/40 shadow-lg"
              >
                {getStatusBadge()}
              </Badge>
            )}
            {isVerified() && (
              <Badge
                variant="secondary"
                className="backdrop-blur-lg bg-green-500/30 text-green-200 border-green-400/40 shadow-lg"
              >
                <BadgeCheck className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex gap-1.5 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="icon-sm"
              className="rounded-full backdrop-blur-lg bg-white/20 hover:bg-white/30 border-white/30 shadow-lg transition-all duration-300 hover:scale-110"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isFavorite
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-white"
                }`}
              />
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              className="rounded-full backdrop-blur-lg bg-white/20 hover:bg-white/30 border-white/30 shadow-lg transition-all duration-300 hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Developer Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3 z-20">
          <Badge
            variant="secondary"
            className="backdrop-blur-lg bg-black/40 text-white border-white/20 shadow-lg font-medium"
          >
            {getDeveloperName()}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-3 md:p-4 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm">
        {/* Title */}
        <h3 className="text-sm md:text-base font-bold text-white line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-300">
          {getDisplayName()}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-white/70 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <p className="line-clamp-1">{getDisplayLocation()}</p>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-2 mb-3 text-white/80 flex-wrap">
          {getBhkInfo() && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
              <Home className="w-3 h-3" />
              <span className="text-xs font-medium">{getBhkInfo()}</span>
            </div>
          )}
          {bedrooms > 0 && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
              <Bed className="w-3 h-3" />
              <span className="text-xs font-medium">{bedrooms}</span>
            </div>
          )}
          {bathrooms > 0 && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
              <Bath className="w-3 h-3" />
              <span className="text-xs font-medium">{bathrooms}</span>
            </div>
          )}
          {getArea() && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
              <span className="text-xs font-medium">{getArea()} sq.ft</span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
          <div className="flex-1">
            <p className="text-sm md:text-base font-bold text-primary">
              {getDisplayPrice()}
            </p>
            <p className="text-xs text-white/60">
              {property.propertyType || "Property"}
            </p>
          </div>
          <Button
            size="sm"
            className="whitespace-nowrap cursor-pointer font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary/90 text-xs text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            VIEW DETAILS
          </Button>
        </div>
      </div>
    </Card>
  );
}
