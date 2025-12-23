"use client";

import { Home, Bed, Bath, MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";

/**
 * PropertyCard Component
 * Displays property information in a horizontal card layout for search results
 * Supports both legacy property format and new JSON structure
 */
export default function PropertyCard({ property, onClick, variant = "horizontal" }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Format price in INR
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseInt(price) : price;
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
      const askingPrice = property.pricing.find(p => p.type === 'asking_price');
      return askingPrice ? askingPrice.value : property.price;
    }
    return property.price;
  };

  // Get property name
  const getPropertyName = () => {
    if (property.customPropertyName) return property.customPropertyName;
    if (property.projectName) return property.projectName;
    if (property.propertyName) return property.propertyName;
    return property.title || 'Untitled Property';
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
    if (typeof property.location === 'string') {
      return property.location;
    }
    
    // Build location from locality and city
    if (property.locality && property.city) {
      return `${property.locality}, ${property.city}`;
    }
    
    // Try address_text (snake_case from backend)
    if (property.address_text) {
      const parts = property.address_text.split(',');
      return parts.slice(0, 2).join(', ');
    }
    
    // Try addressText (camelCase)
    if (property.addressText) {
      const parts = property.addressText.split(',');
      return parts.slice(0, 2).join(', ');
    }
    
    // Fallback to city or locality
    return property.city || property.locality || 'Location';
  };

  // Get bedrooms and bathrooms
  const bedrooms = property.bedrooms ? (typeof property.bedrooms === 'string' ? parseInt(property.bedrooms) : property.bedrooms) : 0;
  const bathrooms = property.bathrooms ? (typeof property.bathrooms === 'string' ? parseInt(property.bathrooms) : property.bathrooms) : 0;

  // Get image URL - handle both formats
  const getImageUrl = () => {
    // Direct image property
    if (property.image) return property.image;
    
    // From media_data array
    if (property.media_data && Array.isArray(property.media_data) && property.media_data.length > 0) {
      const firstImage = property.media_data.find(media => media.type === 'image' || media.media_type === 'image');
      return firstImage?.url || property.media_data[0]?.url;
    }
    
    // Fallback placeholder
    return '/placeholder-property.jpg';
  };

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
    if (typeof property.price === 'string' && property.price.includes('₹')) {
      return property.price;
    }
    
    // Get numeric price
    const numericPrice = getPrice();
    if (numericPrice) {
      return formatPrice(numericPrice);
    }
    
    // For PG hostels with room_types
    if (property.room_types && Array.isArray(property.room_types) && property.room_types.length > 0) {
      const minPrice = Math.min(...property.room_types.map(rt => rt.price || 0).filter(p => p > 0));
      if (minPrice) {
        return `From ${formatPrice(minPrice)}/month`;
      }
    }
    
    return 'Price on request';
  };

  // Get BHK or room type info
  const getBhkInfo = () => {
    if (property.bhk) return property.bhk;
    if (bedrooms > 0) return `${bedrooms} BHK`;
    
    // For PG hostels, show room types
    if (property.room_types && Array.isArray(property.room_types)) {
      const types = property.room_types.map(rt => rt.room_type || rt.type).filter(Boolean);
      if (types.length > 0) {
        return types.slice(0, 2).join(', ');
      }
    }
    
    return '';
  };

  // Get developer/brand name
  const getDeveloperName = () => {
    if (property.developer) return property.developer;
    if (property.brand_name) return property.brand_name;
    if (property.is_brand_managed) return 'Brand Managed';
    return 'Independent';
  };

  // Toggle favorite
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
<Card
                  key={property.id}
                  className="shrink-0 w-[220px] sm:w-[240px] md:w-[280px] group hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] transition-all duration-300 overflow-hidden p-0 border-primary/10 hover:border-primary/30"
                >
                  <div className="relative aspect-3/4">
                    <Image
                      src={getImageUrl()}
                      alt={getDisplayName()}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                    {/* Top Actions */}
                    <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex justify-between items-start">
                      <Badge variant="secondary" className="backdrop-blur-md">
                        {getDeveloperName()}
                      </Badge>
                      <div className="flex gap-1.5 md:gap-2">
                        <Button
                          variant="secondary"
                          size="icon-sm"
                          className="rounded-full backdrop-blur-md"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon-sm"
                          className="rounded-full backdrop-blur-md"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="text-base md:text-xl font-bold mb-1 text-white">
                        {getDisplayName()}
                      </h3>
                      <p className="text-xs md:text-sm text-white/80 mb-2">
                        {getDisplayLocation()}
                      </p>
                      <div className="flex justify-between items-end gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-primary">
                            {getDisplayPrice()}
                          </p>
                          <p className="text-xs  text-white/60">
                            {getBhkInfo()}
                          </p>
                        </div>
                        <Button size="sm" className="whitespace-nowrap">
                          BOOK VISIT
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
  );
}
