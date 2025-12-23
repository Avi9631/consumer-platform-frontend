"use client";

import { Home, Users, Utensils, MapPin, Heart, Phone, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

/**
 * PgHostelCard Component
 * Displays PG/Hostel/Co-living property information in a card layout
 * Designed specifically for the PG hostel data structure from backend
 */
export default function PgHostelCard({ property, onClick }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Format price in INR
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (!numPrice || numPrice === 0) return 'Contact for price';
    
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
    return property.propertyName || property.property_name || 'Untitled Property';
  };

  // Get location string
  const getLocation = () => {
    if (property.locality && property.city) {
      return `${property.locality}, ${property.city}`;
    }
    if (property.addressText || property.address_text) {
      const address = property.addressText || property.address_text;
      const parts = address.split(',');
      return parts.slice(0, 2).join(', ');
    }
    return property.city || property.locality || 'Location';
  };

  // Get starting price from room types
  const getStartingPrice = () => {
    if (!property.roomTypes || !Array.isArray(property.roomTypes) || property.roomTypes.length === 0) {
      return 'Contact for price';
    }

    const prices = property.roomTypes
      .map(room => {
        if (!room.pricing || !Array.isArray(room.pricing)) return 0;
        const monthlyRent = room.pricing.find(p => p.type === 'Monthly Rent' || p.type === 'monthly_rent');
        return monthlyRent?.amount || 0;
      })
      .filter(price => price > 0);

    if (prices.length === 0) return 'Contact for price';

    const minPrice = Math.min(...prices);
    return `Starting ${formatPrice(minPrice)}/mo`;
  };

  // Get room types summary
  const getRoomTypesSummary = () => {
    if (!property.roomTypes || !Array.isArray(property.roomTypes) || property.roomTypes.length === 0) {
      return 'Various rooms available';
    }

    const categories = [...new Set(property.roomTypes.map(rt => rt.category).filter(Boolean))];
    
    if (categories.length === 0) {
      return `${property.roomTypes.length} room type${property.roomTypes.length > 1 ? 's' : ''}`;
    }

    return categories.slice(0, 2).join(', ');
  };

  // Get brand/management name
  const getBrandName = () => {
    if (property.isBrandManaged || property.is_brand_managed) {
      return property.brandName || property.brand_name || 'Brand Managed';
    }
    return 'Independent';
  };

  // Get main image from mediaData
  const getMainImage = () => {
    const mediaData = property.mediaData || property.media_data;
    
    if (!mediaData || !Array.isArray(mediaData) || mediaData.length === 0) {
      return '/placeholder-pg.jpg';
    }

    // Find first image
    const firstImage = mediaData.find(media => 
      media.type === 'image' && media.url
    );

    return firstImage?.url || mediaData[0]?.url || '/placeholder-pg.jpg';
  };

  // Get gender badge
  const getGenderBadge = () => {
    const gender = property.genderAllowed || property.gender_allowed;
    if (!gender) return null;

    const colors = {
      'Male': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Female': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'Unisex': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    };

    return (
      <Badge variant="secondary" className={`backdrop-blur-md ${colors[gender] || ''}`}>
        {gender}
      </Badge>
    );
  };

  // Check if food is available
  const hasFoodService = () => {
    const foodMess = property.foodMess || property.food_mess;
    return foodMess && (foodMess.available === true || foodMess.meals?.length > 0);
  };

  // Check if verified
  const isVerified = () => {
    return property.verificationStatus === 'VERIFIED' || 
           property.verification_status === 'VERIFIED';
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
      // Navigate to detail page
      const slug = property.slug || property.pgHostelId || property.pg_hostel_id;
      window.location.href = `/pg-coliving-hostel/${property.pgHostelId}`;
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className="shrink-0 w-[220px] sm:w-[240px] md:w-[280px] group hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] transition-all duration-300 overflow-hidden p-0 border-primary/10 hover:border-primary/30 cursor-pointer"
    >
      <div className="relative aspect-3/4">
        <Image
          src={getMainImage()}
          alt={getPropertyName()}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

        {/* Top Actions */}
        <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex justify-between items-start gap-2">
          <div className="flex flex-wrap gap-1.5">
            {getGenderBadge()}
            {isVerified() && (
              <Badge variant="secondary" className="backdrop-blur-md bg-green-500/20 text-green-300 border-green-500/30">
                <BadgeCheck className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex gap-1.5 md:gap-2">
            <Button
              variant="secondary"
              size="icon-sm"
              className="rounded-full backdrop-blur-md"
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              className="rounded-full backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          {/* Brand Badge */}
          <Badge variant="secondary" className="backdrop-blur-md mb-2">
            {getBrandName()}
          </Badge>

          <h3 className="text-base md:text-xl font-bold mb-1 text-white line-clamp-1">
            {getPropertyName()}
          </h3>
          
          <div className="flex items-center gap-1 text-xs md:text-sm text-white/80 mb-2">
            <MapPin className="w-3 h-3" />
            <p className="line-clamp-1">{getLocation()}</p>
          </div>

          {/* Amenities Icons */}
          <div className="flex items-center gap-3 mb-3 text-white/70">
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="text-xs">{property.roomTypes?.length || 0}</span>
            </div>
            {hasFoodService() && (
              <div className="flex items-center gap-1">
                <Utensils className="w-4 h-4" />
              </div>
            )}
            {property.commonAmenities?.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">{property.commonAmenities.length}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end gap-2">
            <div className="flex-1">
              <p className="text-sm font-bold text-primary">
                {getStartingPrice()}
              </p>
              <p className="text-xs text-white/60 line-clamp-1">
                {getRoomTypesSummary()}
              </p>
            </div>
            <Button size="sm" className="whitespace-nowrap">
              VIEW DETAILS
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
