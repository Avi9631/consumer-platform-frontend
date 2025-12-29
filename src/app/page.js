"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

// Components
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CarouselSection from "@/components/CarouselSection";
import VirtualTourCard from "@/components/ShortVideoCard";
import PropertyCard from "@/components/PropertyCard";
import PgHostelCard from "@/components/PgHostelCard";
import DeveloperCard from "@/components/DeveloperCard";
import LocationSheet from "@/components/LocationSheet";

// Hooks
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { usePropertyFilter } from "@/hooks/usePropertyFilter";

// Store
import useLocationStore from "@/stores/locationStore";

// Data
import { PROPERTIES_DATA, VIRTUAL_TOURS_DATA, DEVELOPERS_DATA } from "@/constants/propertyData";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  const [pgHostelData, setPgHostelData] = useState([]);
  const [pgHostelLoading, setPgHostelLoading] = useState(false);
  const [pgHostelError, setPgHostelError] = useState(null);
  const [developerData, setDeveloperData] = useState([]);
  const [developerLoading, setDeveloperLoading] = useState(false);
  const [developerError, setDeveloperError] = useState(null);

  // Custom hooks
  const scrolled = useScrollDetection(50);
  const filteredProperties = usePropertyFilter(
    PROPERTIES_DATA,
    location,
    5
  );

  // Fetch PG Hostel data
  useEffect(() => {
    const fetchPgHostelData = async () => {
      setPgHostelLoading(true);
      setPgHostelError(null);
      
      try {
        const lat = location.lat || 12.95461130;
        const lng = location.lng || 77.70833860;
        const radius = 9;
        
        const response = await fetch(
          `http://localhost:3000/api/pg-hostel/search-nearby?lat=${lat}&lng=${lng}&radius=${radius}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("PG Hostel Data:", data);
        setPgHostelData(data?.data?.pgHostels || data || []);
        console.log("=== PG Hostel Data Fetched ===", data?.data?.pgHostels);
      } catch (error) {
        console.error("Error fetching PG hostel data:", error);
        setPgHostelError(error.message);
        setPgHostelData([]);
      } finally {
        setPgHostelLoading(false);
      }
    };

    fetchPgHostelData();
  }, [location.lat, location.lng]);

  // Fetch Developer data
  useEffect(() => {
    const fetchDeveloperData = async () => {
      setDeveloperLoading(true);
      setDeveloperError(null);
      
      try {
        const response = await fetch(
          `http://localhost:3000/api/developer-consumer-api/list?page=1&limit=20`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Developer Data:", result);
        setDeveloperData(result?.data || []);
        console.log("=== Developer Data Fetched ===", result?.data);
      } catch (error) {
        console.error("Error fetching developer data:", error);
        setDeveloperError(error.message);
        setDeveloperData([]);
      } finally {
        setDeveloperLoading(false);
      }
    };

    fetchDeveloperData();
  }, []);

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
          <div className="flex items-center gap-3  "> 
          <div>
            Virtual {" "}
            <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
              Tours
            </span>{" "}</div>
            <Link href={'/developer'}><Button  size="sm">Explore More</Button></Link>
          </div>
        }
        className="my-3"
        // subtitle="Hover over videos to auto-play • Swipe to explore more"
        // className="bg-gradient-to-b from-[#3d1f2f] via-[#2d1b1f] to-[#1a0f1f]"
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
          <div className="flex items-center gap-3  "> 
          <div>
            Top {" "}
            <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
              Projects
            </span>{" "}</div>
            <Link href={'/projects'} target="_blank"><Button  size="sm" className="cursor-pointer">Explore More</Button></Link>
          </div>
        }
        className="my-3"
        // subtitle="Swipe to explore more assured properties"
        // className="bg-gradient-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#3d1f2f]"
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


      {/* Trusted Developers Section */}
      <CarouselSection
        title={
          <div className="flex items-center gap-3  "> 
          <div>
            Top {" "}
            <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
              Developers
            </span>{" "}</div>
            <Link href={'/developer'} target="_blank"><Button  size="sm">Explore More</Button></Link>
          </div>
        }
        className="my-3"
        // subtitle="Explore projects by India's leading real estate developers"
        // className="bg-gradient-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#3d1f2f]"
      >
        {developerLoading ? (
          <div className="w-full text-center py-12">
            <Card className="inline-block p-6">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Loading...</h3>
              <p className="text-muted-foreground">Fetching trusted developers</p>
            </Card>
          </div>
        ) : developerError ? (
          <div className="w-full text-center py-12">
            <Card className="inline-block p-6">
              <MapPin className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Error Loading Data</h3>
              <p className="text-muted-foreground">{developerError}</p>
            </Card>
          </div>
        ) : developerData.length > 0 ? (
          developerData.map((developer) => (
            <div key={developer.id} className="shrink-0 w-[240px] xs:w-[260px] sm:w-[270px]">
              <DeveloperCard
                developer={developer}
                onClick={() => console.log(`Developer clicked: ${developer.name}`)}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-12">
            <Card className="inline-block p-6">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Developers Found</h3>
              <p className="text-muted-foreground">
                Unable to load developer data at the moment
              </p>
            </Card>
          </div>
        )}
      </CarouselSection>

      {/* PG HOSTELS COLIVING Properties Section */}
      <CarouselSection
        title={
          <div className="flex items-center gap-3  "> 
          <div>
            Top {" "}
            <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
              Pg Hostel Co-living
            </span>{" "}</div>
            <Link href={'/pg-hostel-coliving'} target="_blank"><Button  size="sm">Explore More</Button></Link>
          </div>
        }
        className="my-3"
        // subtitle="Swipe to explore more PG, Hostels & Co-living spaces"
        // className="bg-gradient-to-b from-[#3d1f2f] via-[#2d1b1f to-[#1a0f1f]] "
      >
        {pgHostelLoading ? (
          <div className="w-full text-center py-12">
            <Card className="inline-block p-6">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Loading...</h3>
              <p className="text-muted-foreground">Fetching nearby PG & Hostels</p>
            </Card>
          </div>
        ) : pgHostelError ? (
          <div className="w-full text-center py-12">
            <Card className="inline-block p-6">
              <MapPin className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Error Loading Data</h3>
              <p className="text-muted-foreground">{pgHostelError}</p>
            </Card>
          </div>
        ) : pgHostelData.length > 0 ? (
          pgHostelData.map((property) => (
            <PgHostelCard key={property.pgHostelId || property.pg_hostel_id || property.id} property={property} />
          ))
        ) : (
          <div className="w-full text-center py-12">
            <Card className="inline-block p-6">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No PG/Hostels Found</h3>
              <p className="text-muted-foreground">
                Try selecting a different location or increasing the search radius
              </p>
            </Card>
          </div>
        )}
      </CarouselSection>
    </div>
  );
}
