"use client";

import { useState } from "react";
import { MapPin, Card as CardIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

// Components
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CarouselSection from "@/components/CarouselSection";
import VirtualTourCard from "@/components/ShortVideoCard";
import PropertyCard from "@/components/PropertyCard";
import LocationSheet from "@/components/LocationSheet";

// Hooks
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { usePropertyFilter } from "@/hooks/usePropertyFilter";

// Store
import useLocationStore from "@/stores/locationStore";

// Data
import { PROPERTIES_DATA, VIRTUAL_TOURS_DATA } from "@/constants/propertyData";

export default function Home() {
  // Zustand store for global location state
  const location = useLocationStore((state) => state.location);
  const searchResult = useLocationStore((state) => state.searchResult);
  const updateFromSearchResult = useLocationStore((state) => state.updateFromSearchResult);
  const setSearchResult = useLocationStore((state) => state.setSearchResult);

  // Local state for UI
  const [hoveredTourId, setHoveredTourId] = useState(null);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [sheetMapCenter, setSheetMapCenter] = useState({
    lat: location.lat,
    lng: location.lng,
  });
  const [sheetMapMarker, setSheetMapMarker] = useState(null);

  // Custom hooks
  const scrolled = useScrollDetection(50);
  const filteredProperties = usePropertyFilter(
    PROPERTIES_DATA,
    location,
    5
  );

  // Event handlers using Zustand store
  const handleSearchSelect = (place) => {
    console.log("=== Address Selected ===");
    console.log("Address:", place.formattedAddress);
    console.log("Latitude:", place.coordinates?.lat);
    console.log("Longitude:", place.coordinates?.lng);
    console.log("Ref ID:", place.refId || place.id);
    console.log("Full Place Details:", place);
    console.log("=======================");

    // Update global location store
    updateFromSearchResult(place);
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
    } else {
      setSheetMapCenter({
        lat: location.lat,
        lng: location.lng,
      });
      setSheetMapMarker({
        lat: location.lat,
        lng: location.lng,
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

      // Update global location store
      updateFromSearchResult(place);
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
      refId: data.refId || null,
    };

    // Update global location store
    updateFromSearchResult(place);
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
        selectedLocation={location}
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
      <HeroSection onSearchSelect={handleSearchSelect}  selectedLocation={location}
        onOpenLocationSheet={handleOpenLocationSheet}/>

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
        {PROPERTIES_DATA.length > 0 ? (
          PROPERTIES_DATA.map((property) => (
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


      {/* PG HOSTELS COLIVING Properties Section */}
      <CarouselSection
        title={
          <> ✨Top {" "}
            <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
              Pg Hostel Co-living
            </span>{" "}
            
          </>
        }
        subtitle="Swipe to explore more assured properties"
        className="bg-gradient-to-b from-[#3d1f2f] via-[#2d1b1f to-[#1a0f1f]] "
      >
        {PROPERTIES_DATA.length > 0 ? (
          PROPERTIES_DATA.map((property) => (
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
