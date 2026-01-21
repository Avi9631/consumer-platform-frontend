import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Users,
  IndianRupee,
  Star,
  Utensils,
  Zap,
  Shield,
  Wifi,
  Car,
  Sparkles,
  Award,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CoLivingCard = ({ property }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentRoomTypeIndex, setCurrentRoomTypeIndex] = useState(0);
  const roomTypeScrollRef = useRef(null);

  // Extract property data with fallbacks
  const name = property?.propertyName || "PG/Hostel";
  const pgHostelId = property?.pgHostelId || property?.id;
  const media = property?.media || [];
  const mainImage =
    media[0]?.url ||
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop";

  // All property images for carousel
  const propertyImages = media.length > 0
    ? media.map(m => m.url).filter(Boolean)
    : [mainImage];

  // Auto-carousel effect for images
  useEffect(() => {
    if (propertyImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [propertyImages.length]);

  // Room types with prices for auto-scrolling - extract from roomTypes array
  const roomTypesData = [];
  const roomTypes = property?.roomTypes || [];
  roomTypes.forEach((room) => {
    const monthlyRent = room.pricing?.find(p => p.type === "Monthly Rent");
    if (monthlyRent && monthlyRent.amount > 0) {
      roomTypesData.push({ 
        type: room.category || room.name, 
        price: monthlyRent.amount 
      });
    }
  });

  // Auto-scroll room types
  useEffect(() => {
    if (roomTypesData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentRoomTypeIndex((prev) => (prev + 1) % roomTypesData.length);
    }, 2500); // Change room type every 2.5 seconds

    return () => clearInterval(interval);
  }, [roomTypesData.length]);

  // Location data from API response
  const address = property?.addressText || "Location not specified";
  const locality = property?.locality || "";
  const city = property?.city || "";
  
  // Coordinates from location object (PostGIS Point)
  const locationCoords = property?.location || {};
  const coordinates = locationCoords?.coordinates || [parseFloat(property?.lng) || 0, parseFloat(property?.lat) || 0];
  const longitude = coordinates[0];
  const latitude = coordinates[1];
  const distanceKm = property?.distance_km || null;

  // Price data - calculate min price from roomTypes
  const allPrices = roomTypes
    .map(room => {
      const monthlyRent = room.pricing?.find(p => p.type === "Monthly Rent");
      return monthlyRent?.amount || 0;
    })
    .filter(p => p > 0);
  
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  
  // Extract unique room categories
  const roomCategories = [...new Set(roomTypes.map(rt => rt.category || rt.name).filter(Boolean))];

  // Other details
  const genderAllowed = property?.genderAllowed || "All";
  const description = property?.description || "";
  
  // Count total beds from all room types
  const totalBeds = roomTypes.reduce((sum, room) => {
    // Estimate beds based on category
    const category = (room.category || "").toLowerCase();
    if (category.includes("single")) return sum + 1;
    if (category.includes("double")) return sum + 2;
    if (category.includes("triple")) return sum + 3;
    return sum + 1; // default
  }, 0);
  
  // Food details from foodMess object
  const foodMess = property?.foodMess || {};
  const mealsIncluded = foodMess?.meals || [];
  const foodType = foodMess?.foodType || "Not specified";
  const cookingAllowed = foodMess?.cookingAllowed || false;

  // Brand data
  const isBrandManaged = property?.isBrandManaged || false;
  const brandName = property?.brandName || "";
  const yearBuilt = property?.yearBuilt || null;
  
  // User/Partner info
  const user = property?.user || {};
  const partnerName = user?.derivedUserName || "";
  const verificationStatus = user?.verificationStatus || "";
  const isTrusted = verificationStatus === "APPROVED";

  // Status and flags
  const isPopular = false; // Not in current API response
  const pgHostelCreatedAt = property?.pg_hostel_created_at || null;

  // Amenities (show top 5)
  const amenities = property?.amenities || [];
  const availableAmenities = amenities
    .filter((a) => a.available)
    .slice(0, 5)
    .map((a) => a.name);
  
  // Rules
  const rules = property?.rules || [];
  
  // Availability
  const availability = property?.availability || null;

  const formatPrice = (price) => {
    if (!price) return "N/A";
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const handleCardClick = () => {
    console.log("Navigating to co-living property:", pgHostelId);
    if (pgHostelId) {
      window.open(`/coliving/${pgHostelId}`, "_blank");
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };

  return (
    <Card
      className="py-0 group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 flex flex-col h-full"
      // onClick={handleCardClick}
    >
      {/* Image Carousel Section with Badges */}
      <div className="relative h-48 overflow-hidden">
        {/* Image with transition */}
        <div className="relative w-full h-full">
          {propertyImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${name} - Image ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              } group-hover:scale-110 transition-transform duration-500`}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop";
              }}
            />
          ))}
        </div>

        {/* Carousel Navigation Buttons */}
        {propertyImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {propertyImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-orange-500 w-6"
                      : "bg-white/60 w-1.5 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {isPopular && (
            <Badge className="bg-orange-500 text-white border-none shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          {isTrusted && (
            <Badge className="bg-green-500 text-white border-none shadow-lg">
              <BadgeCheck className="w-3 h-3 mr-1" />
              Trusted
            </Badge>
          )}
          {status === "approve" && (
            <Badge className="bg-blue-500 text-white border-none shadow-lg">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Brand/Partner badge */}
        {(brandName || (isBrandManaged && brandName)) && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-white/90 text-gray-800 border-none shadow-lg backdrop-blur rounded-sm">
              <Award className="w-3 h-3 " />
              {brandName}
            </Badge>
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Image count badge */}
        {/* <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-black/60 text-white border-none">
            {propertyImages.length} photo{propertyImages.length !== 1 ? "s" : ""}
          </Badge>
        </div> */}
      </div>

      {/* Content Section */}
      <CardContent className="p-4 pt-0 flex flex-col flex-1">
        {/* Title and Review */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1 text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
              {name}
            </h3>
            {/* {brandReview && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{brandReview}</span>
              </div>
            )} */}
          </div>
          {/* {brandTag && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {brandTag}
            </p>
          )} */}
        </div>

        {/* Location with distance */}
        <div className="mb-3">
          <div className="flex items-start gap-1 text-gray-600 dark:text-gray-400 text-xs">
            <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-orange-500" />
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1">
                {locality && <span className="font-medium">{locality}, </span>}
                {city}
              </p>
     
            </div>
          </div>
        </div>

 

        {/* Room Types */}
        {/* {roomTypes.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {roomTypes.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className="text-xs"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )} */}

        {/* Amenities Preview */}
        {availableAmenities.length > 0 && (
          <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-nowrap gap-1 overflow-hidden">
              {availableAmenities.slice(0, 3).map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap"
                >
                  {amenity}
                </Badge>
              ))}
              {availableAmenities.length > 3 && (
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  +{availableAmenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Auto-scrolling Room Types & Pricing Section */}
        {roomTypesData.length > 0 && (
          <div className="mb-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="overflow-hidden">
              <div
                className="transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentRoomTypeIndex * 100}%)`,
                  display: "flex",
                }}
              >
                {roomTypesData.map((room, index) => (
                  <div
                    key={index}
                    className="min-w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {room.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        ₹{room.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                        /mo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Room type indicators */}
            {roomTypesData.length > 1 && (
              <div className="flex justify-center gap-1 mt-2">
                {roomTypesData.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all ${
                      index === currentRoomTypeIndex
                        ? "bg-orange-600 w-4"
                        : "bg-orange-300 w-1"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pricing Section - Spacer to push to bottom */}
        <div className="mt-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-orange-500">
                  {formatPrice(minPrice)}
                </span>
                <span className="text-xs text-gray-500">/month</span>
              </div>
              {/* {roomTypes.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {roomTypes.length} room type{roomTypes.length > 1 ? "s" : ""} available
                </p>
              )} */}
            </div>

            <button
              onClick={(e) => {
                handleCardClick()
              }}
              type="button"
              className="cursor-pointer inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-md shrink-0 transition-colors z-20"
            >
              View Details
            </button>
          </div>

          {/* Product ID */}
          {/* {productId && (
            <div className="mt-2 text-xs text-gray-400">
              ID: {productId}
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoLivingCard;
