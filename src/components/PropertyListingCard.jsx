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
export default function PropertyListingCard({ property, onClick, variant = "horizontal" }) {
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
    if (property.locality && property.city) {
      return `${property.locality}, ${property.city}`;
    }
    if (property.addressText) {
      // Extract first part of address
      const parts = property.addressText.split(',');
      return parts.slice(0, 2).join(', ');
    }
    return property.city || property.locality || 'Location';
  };

  // Get bedrooms and bathrooms
  const bedrooms = property.bedrooms ? (typeof property.bedrooms === 'string' ? parseInt(property.bedrooms) : property.bedrooms) : 0;
  const bathrooms = property.bathrooms ? (typeof property.bathrooms === 'string' ? parseInt(property.bathrooms) : property.bathrooms) : 0;

  // Toggle favorite
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
<Card
                  key={property.id}
                  className="shrink-0  cursor-pointer group hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] transition-all duration-300 overflow-hidden p-0 border-primary/10 hover:border-primary/30"
                >
                  <div className="relative aspect-3/4">
                    <Image
                      src={property.image}
                      alt={property.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                    {/* Top Actions */}
                    <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex justify-between items-start">
                      <Badge variant="secondary" className="backdrop-blur-md">
                        {property.developer}
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
                        {property.name}
                      </h3>
                      <p className="text-xs md:text-sm text-white/80 mb-2">
                        {property.location}
                      </p>
                      <div className="flex justify-between items-end gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-primary">
                            {property.price}
                          </p>
                          <p className="text-xs  text-white/60">
                            {property.bhk}
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
