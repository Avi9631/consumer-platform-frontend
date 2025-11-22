"use client";

import { useState } from "react";
import { MapPin, Card as CardIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

// Components
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CarouselSection from "@/components/CarouselSection";
import VirtualTourCard from "@/components/VirtualTourCard";
import PropertyCard from "@/components/PropertyCard";
import LocationSheet from "@/components/LocationSheet";

// Hooks
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { usePropertyFilter } from "@/hooks/usePropertyFilter";

// Data
import {
  PROPERTIES_DATA,
  VIRTUAL_TOURS_DATA,
} from "@/constants/propertyData";

export default function Home() {
  // State management
  const [selectedLocation, setSelectedLocation] = useState({
    city: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    name: "Andheri West",
  });
  const [hoveredTourId, setHoveredTourId] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [sheetMapCenter, setSheetMapCenter] = useState({
    lat: 19.076,
    lng: 72.8777,
  });
  const [sheetMapMarker, setSheetMapMarker] = useState(null);

  // Custom hooks
  const scrolled = useScrollDetection(50);
  const filteredProperties = usePropertyFilter(
    PROPERTIES_DATA,
    selectedLocation,
    5
  );

  // Event handlers
  const handleSearchSelect = (place) => {
    console.log("=== Address Selected ===");
    console.log("Address:", place.formattedAddress);
    console.log("Latitude:", place.coordinates?.lat);
    console.log("Longitude:", place.coordinates?.lng);
    console.log("Full Place Details:", place);
    console.log("=======================");

    setSearchResult(place);

    if (place.coordinates) {
      setSelectedLocation({
        city: "Mumbai",
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
        name: place.formattedAddress,
      });
    }
  };

  const handleOpenLocationSheet = () => {
    if (searchResult && searchResult.coordinates) {
      setSheetMapCenter({
        lat: searchResult.coordinates.lat,
        lng: searchResult.coordinates.lng,
      });
      setSheetMapMarker({
        lat: searchResult.coordinates.lat,
        lng: searchResult.coordinates.lng,
        draggable: true,
      });
    }
    setIsLocationSheetOpen(true);
  };

  const handleSheetSearchSelect = (place) => {
    console.log("Sheet search selected:", place);

    if (place.coordinates) {
      setSheetMapCenter({
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
      });
      setSheetMapMarker({
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
        draggable: true,
      });

      setSearchResult(place);
      setSelectedLocation({
        city: "Mumbai",
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
        name: place.formattedAddress,
      });
    }
  };

  const handleSheetMapInteraction = (data) => {
    console.log("Sheet map interaction:", data);

    const place = {
      formattedAddress: data.address || "Selected Location",
      coordinates: {
        lat: data.lat,
        lng: data.lng,
      },
      addressComponents: data.addressComponents,
    };

    setSearchResult(place);
    setSelectedLocation({
      city: "Mumbai",
      lat: data.lat,
      lng: data.lng,
      name: data.address || "Selected Location",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#1a0f1f] relative overflow-x-hidden">
      {/* Sunset Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-1/2 w-[700px] h-[700px] bg-gradient-radial from-orange-500/20 via-orange-600/10 to-transparent rounded-full blur-[120px] -translate-x-1/2 animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-purple-500/15 via-purple-600/5 to-transparent rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute inset-x-0 top-1/4 h-[300px] bg-gradient-to-b from-orange-500/5 via-rose-500/5 to-transparent"></div>
      </div>

      {/* Header */}
      <Header
        scrolled={scrolled}
        selectedLocation={selectedLocation}
        onOpenLocationSheet={handleOpenLocationSheet}
      />

      {/* Location Sheet */}
      <LocationSheet
        isOpen={isLocationSheetOpen}
        onOpenChange={setIsLocationSheetOpen}
        searchResult={searchResult}
        mapCenter={sheetMapCenter}
        mapMarker={sheetMapMarker}
        onSearchSelect={handleSheetSearchSelect}
        onMapInteraction={handleSheetMapInteraction}
      />

      {/* Hero Section */}
      <HeroSection onSearchSelect={handleSearchSelect} />

      {/* Virtual Tours Carousel */}
      <CarouselSection
        title={
          <>
            ✨Trending{" "}
            <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
              Properties
            </span>
          </>
        }
        subtitle="Hover over videos to auto-play • Swipe to explore more"
        className="bg-gradient-to-b from-[#3d1f2f] via-[#2d1b1f] to-[#1a0f1f]"
      >
        {VIRTUAL_TOURS_DATA.map((tour) => (
          <VirtualTourCard
            key={tour.id}
            tour={tour}
            isHovered={hoveredTourId === tour.id}
            onHover={setHoveredTourId}
          />
        ))}
      </CarouselSection>

      {/* Assured Properties Section */}
      <CarouselSection
        title={
          <>
            <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
              Assured
            </span>{" "}
            Projects
          </>
        }
        subtitle="Swipe to explore more assured properties"
        className="bg-gradient-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#3d1f2f]"
      >
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <div className="w-full text-center py-12">
            <Card className="inline-block p-6">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground">
                Try selecting a different location or zoom out on the map
              </p>
            </Card>
          </div>
        )}
      </CarouselSection>
    </div>
  );
}
