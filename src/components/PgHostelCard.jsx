"use client";

import {
  Home,
  Users,
  Utensils,
  MapPin,
  Heart,
  Phone,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

/**
 * PgHostelCard Component
 * Enhanced PG/Hostel/Co-living property card with image carousel
 * Designed specifically for the PG hostel data structure from backend
 */
export default function PgHostelCard({ property, onClick }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const autoPlayRef = useRef(null);

  // Get all images from mediaData for carousel
  const getImages = () => {
    const mediaData = property.mediaData || property.media_data;

    if (!mediaData || !Array.isArray(mediaData) || mediaData.length === 0) {
      return ["/placeholder-pg.jpg"];
    }

    const images = mediaData
      .filter((media) => media.type === "image" && media.url)
      .map((media) => media.url);

    return images.length > 0 ? images : ["/placeholder-pg.jpg"];
  };

  const images = getImages();

  // Handle individual image errors
  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  // Auto-play carousel
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
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (!numPrice || numPrice === 0) return "Contact for price";

    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(2)} L`;
    } else if (numPrice >= 1000) {
      return `₹${(numPrice / 1000).toFixed(1)}K`;
    }
    return `₹${numPrice.toLocaleString("en-IN")}`;
  };

  // Get property name
  const getPropertyName = () => {
    return (
      property.propertyName || property.property_name || "Untitled Property"
    );
  };

  // Get location string
  const getLocation = () => {
    if (property.locality && property.city) {
      return `${property.locality}, ${property.city}`;
    }
    if (property.addressText || property.address_text) {
      const address = property.addressText || property.address_text;
      const parts = address.split(",");
      return parts.slice(0, 2).join(", ");
    }
    return property.city || property.locality || "Location";
  };

  // Get starting price from room types
  const getStartingPrice = () => {
    if (
      !property.roomTypes ||
      !Array.isArray(property.roomTypes) ||
      property.roomTypes.length === 0
    ) {
      return "Contact for price";
    }

    const prices = property.roomTypes
      .map((room) => {
        if (!room.pricing || !Array.isArray(room.pricing)) return 0;
        const monthlyRent = room.pricing.find(
          (p) => p.type === "Monthly Rent" || p.type === "monthly_rent"
        );
        return monthlyRent?.amount || 0;
      })
      .filter((price) => price > 0);

    if (prices.length === 0) return "Contact for price";

    const minPrice = Math.min(...prices);
    return `Starting ${formatPrice(minPrice)}/mo`;
  };

  // Get room types summary
  const getRoomTypesSummary = () => {
    if (
      !property.roomTypes ||
      !Array.isArray(property.roomTypes) ||
      property.roomTypes.length === 0
    ) {
      return "Various rooms available";
    }

    const categories = [
      ...new Set(property.roomTypes.map((rt) => rt.category).filter(Boolean)),
    ];

    if (categories.length === 0) {
      return `${property.roomTypes.length} room type${
        property.roomTypes.length > 1 ? "s" : ""
      }`;
    }

    return categories.slice(0, 2).join(", ");
  };

  // Get brand/management name
  const getBrandName = () => {
    if (property.isBrandManaged || property.is_brand_managed) {
      return property.brandName || property.brand_name || "Brand Managed";
    }
    return "Independent";
  };



  // Get gender badge
  const getGenderBadge = () => {
    const gender = property.genderAllowed || property.gender_allowed;
    if (!gender) return null;

    const colors = {
      Male: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Female: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      Unisex: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    };

    return (
      <Badge
        variant="secondary"
        className={`backdrop-blur-md ${colors[gender] || ""}`}
      >
        {gender}
      </Badge>
    );
  };

  // Check if food is available
  const hasFoodService = () => {
    const foodMess = property.foodMess || property.food_mess;
    return (
      foodMess && (foodMess.available === true || foodMess.meals?.length > 0)
    );
  };

  // Check if verified
  const isVerified = () => {
    return (
      property.verificationStatus === "VERIFIED" ||
      property.verification_status === "VERIFIED"
    );
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
    } else {

      window.location.href = `/pg-coliving-hostel/${property.pgHostelId}`;
    }
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="shrink-0 w-[220px] sm:w-[260px] md:w-[300px] group hover:shadow-[0_8px_40px_rgba(251,146,60,0.35)] transition-all duration-500 overflow-hidden p-0 border-primary/10 hover:border-primary/40 hover:scale-[1.02] flex flex-col gap-0"
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
                  alt={`${getPropertyName()} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => handleImageError(index)}
                  onLoadingComplete={() => setImageLoading(false)}
                  priority={index === 0}
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 240px, 280px"
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
                  }`}                  aria-label={`Go to image ${index + 1}`}                />
              ))}
            </div>
          </>
        )}

        {/* Top Actions */}
        <div className="absolute top-3 left-3 md:left-4 right-3 md:right-4 flex justify-between items-start gap-2 z-20">
          <div className="flex flex-wrap gap-1.5">
            {getGenderBadge()}
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
                  isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-white"
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

        {/* Brand Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3 z-20">
          <Badge variant="secondary" className="backdrop-blur-lg bg-black/40 text-white border-white/20 shadow-lg font-medium">
            {getBrandName()}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-3 md:p-4 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm md:text-base font-bold text-white line-clamp-1 flex-1 group-hover:text-primary transition-colors duration-300">
            {getPropertyName()}
          </h3>
          {property.rating && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/20 flex-shrink-0">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-white">{property.rating}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-white/70 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <p className="line-clamp-1">{getLocation()}</p>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-2 mb-3 text-white/80 flex-wrap">
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
            <Home className="w-3 h-3" />
            <span className="text-xs font-medium">{property.roomTypes?.length || 0}</span>
          </div>
          {hasFoodService() && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
              <Utensils className="w-3 h-3" />
              <span className="text-xs font-medium">Food</span>
            </div>
          )}
          {property.commonAmenities?.length > 0 && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/10">
              <Users className="w-3 h-3" />
              <span className="text-xs font-medium">
                {property.commonAmenities.length}+
              </span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
          <div className="flex-1">
            <p className="text-sm md:text-base font-bold text-primary">
              {getStartingPrice()}
            </p>
            <p className="text-xs text-white/60 line-clamp-1">
              {getRoomTypesSummary()}
            </p>
          </div>
          <Button 
            size="sm" 
            className="whitespace-nowrap font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-primary hover:bg-primary/90 text-xs md:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            VIEW
          </Button>
        </div>
      </div>
    </Card>
  );
}
