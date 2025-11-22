"use client";

import { Home, Bed, Bath, MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
      onClick={onClick}
      className="hover:shadow-xl transition-all cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-500"
    >
      <div className="flex">
        {/* Property Image */}
        <div className="w-64 h-48 flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="w-12 h-12 text-gray-400" />
          </div>
          
          {/* Favorite Button */}
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-50 transition-colors"
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>

          {/* Property Status Badge */}
          {property.isNewProperty && (
            <Badge className="absolute top-2 left-2 bg-green-500">
              New
            </Badge>
          )}
        </div>

        {/* Property Details */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(getPrice())}
              </p>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                {bedrooms > 0 && (
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {bedrooms} bd
                  </span>
                )}
                {bathrooms > 0 && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {bathrooms} ba
                  </span>
                )}
                {getArea() && <span>{getArea()} sqft</span>}
              </div>
            </div>
            <Badge variant="secondary" className="capitalize">
              {property.propertyType}
            </Badge>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 font-medium">
            {getPropertyName()}
          </p>
          
          {property.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {property.description}
            </p>
          )}

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{getLocation()}</span>
          </div>

          {/* Additional Property Info */}
          <div className="flex flex-wrap gap-2 mb-3">
            {property.furnishingStatus && (
              <Badge variant="outline" className="text-xs capitalize">
                {property.furnishingStatus.replace('_', ' ')}
              </Badge>
            )}
            {property.facing && (
              <Badge variant="outline" className="text-xs capitalize">
                {property.facing} Facing
              </Badge>
            )}
            {property.possessionStatus && property.possessionStatus !== 'ready' && (
              <Badge variant="outline" className="text-xs capitalize">
                {property.possessionStatus.replace('_', ' ')}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            {property.distance !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {property.distance.toFixed(1)} km away
              </p>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {property.listingType === 'sale' ? 'For Sale' : property.listingType === 'rent' ? 'For Rent' : 'Listed by Agent'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
