"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Shield,
  Clock,
  Wifi,
  Star,
  Users,
  Home as HomeIcon,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Zap,
  Heart,
  DollarSign,
  Building2,
  Award,
  Headphones,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Components
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CarouselSection from "@/components/CarouselSection";
import VirtualTourCard from "@/components/ShortVideoCard";
import PropertyCard from "@/components/PropertyCard";
import PgHostelCard from "@/components/PgHostelCard";
import DeveloperCard from "@/components/DeveloperCard";
import LocationSheet from "@/components/LocationSheet";
import PropertyListingCard from "@/components/PropertyListingCard";

// Hooks
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { usePropertyFilter } from "@/hooks/usePropertyFilter";

// Store
import useLocationStore from "@/stores/locationStore";

// Data
import {
  PROPERTIES_DATA,
  VIRTUAL_TOURS_DATA,
  DEVELOPERS_DATA,
} from "@/constants/propertyData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CoLivingCard from "@/components/CoLivingCard";

export default function Home() {
  // Zustand store for global location state
  const location = useLocationStore((state) => state.location);
  const searchResult = useLocationStore((state) => state.searchResult);
  const updateFromSearchResult = useLocationStore(
    (state) => state.updateFromSearchResult,
  );
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
  const [propertyListData, setPropertyListData] = useState([]);
  const [propertyListLoading, setPropertyListLoading] = useState(false);
  const [propertyListError, setPropertyListError] = useState(null);

  // Custom hooks
  const scrolled = useScrollDetection(50);
  const filteredProperties = usePropertyFilter(PROPERTIES_DATA, location, 5);

  // Fetch PG Hostel data
  useEffect(() => {
    const fetchPgHostelData = async () => {
      setPgHostelLoading(true);
      setPgHostelError(null);

      try {
        const lat = location.lat || 12.9546113;
        const lng = location.lng || 77.7083386;
        const radius = 9;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pg-hostel/search?lat=${lat}&lng=${lng}&radius=${radius}`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/developer-consumer-api/list?page=1&limit=20`,
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

  // Fetch Property List data
  useEffect(() => {
    const fetchPropertyListData = async () => {
      setPropertyListLoading(true);
      setPropertyListError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/property/list?page=1&limit=20`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Property List Data:", result);
        setPropertyListData(result?.data?.properties || []);
        console.log(
          "=== Property List Data Fetched ===",
          result?.data?.properties,
        );
      } catch (error) {
        console.error("Error fetching property list data:", error);
        setPropertyListError(error.message);
        setPropertyListData([]);
      } finally {
        setPropertyListLoading(false);
      }
    };

    fetchPropertyListData();
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
      <HeroSection
        onSearchSelect={handleSearchSelect}
        selectedLocation={location}
        onOpenLocationSheet={handleOpenLocationSheet}
      />


            {/* Virtual Tours Carousel */}
      <CarouselSection
        title={
          <div className="flex items-center gap-3  ">
            <div>
              Virtual {" "}  
              <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
                Tours
              </span> 
            </div>
            <Link href={"/developer"}>
              <Button size="sm">Explore More</Button>
            </Link>
          </div>
        }
        className=""
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
{/* CTA Banner */}
<section className="my-8 px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch mx-auto">

    {/* CTA Card */}
    <Card className="lg:col-span-2 bg-gradient-to-r from-primary via-purple-500 to-blue-500 border-0 overflow-hidden relative h-full self-stretch">
      <div className="absolute inset-0 bg-black/20" />
      <CardContent className="py-8 px-6 text-center relative z-10 h-full flex flex-col justify-center">
        <Zap className="w-12 h-12 text-white mx-auto mb-4 animate-pulse" />

        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
          Ready to Find Your Perfect Stay?
        </h2>

        <p className="text-white/90 mb-6">
          Join thousands of happy residents who found their ideal accommodation with us
        </p>

        <div className="flex justify-center">
          <Link href="/coliving/search" target="_blank">
            <Button size="lg" variant="secondary">
              <MapPin className="mr-2 w-5 h-5" />
              Start Searching
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>

    {/* CTA Image */}
    <div className="lg:ml-6 rounded-lg overflow-hidden self-stretch">
      <img
        src="https://static.wixstatic.com/media/489126_d4fc78aa2987441995a8f6e69ea20b02~mv2.jpg"
        alt="Premium Living Spaces"
        className="w-full h-full object-cover"
      />
    </div>

  </div>
</section>


 
      {/* Trusted PG Hostels Section */}
      <CarouselSection
        title={
          <div className="flex items-center gap-3">
            <div>
              Featured {" "}
              <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
                Coliving Spaces
              </span>{" "}
            </div>
 
          </div>
        }
        className="my-3 "
      >
        {pgHostelLoading ? (
          <div className="w-full text-center py-12">
            <Card className="inline-block p-6">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">Loading...</h3>
              <p className="text-muted-foreground">
                Fetching trusted pg hostels
              </p>
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
            <div
              key={property.pgHostelId || property.pg_hostel_id || property.id}
              className="shrink-0 w-[270px] xs:w-[290px] sm:w-[310px]"
            >
              {/* <PgHostelCard
                property={property}
                onClick={() => {
                  console.log(`PG Hostel clicked: ${property.name}`);
                  window.open(
                    `/pg-coliving-hostel/${property.pgHostelId}`,
                    "_blank",
                  );
                }}
              /> */}

              <CoLivingCard key={property.pgHostelId} property={property} className="hover:shadow-2xl"/>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-12">
            <Card className="inline-block p-6">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No PG Hostels Found</h3>
              <p className="text-muted-foreground">
                Unable to load pg hostel data at the moment
              </p>
            </Card>
          </div>
        )}
      </CarouselSection>
 
 

{/* Co-Living Focused Footer */}
<footer className="bg-black/30 border-t border-white/10">
  <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">

    {/* Top Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-10 lg:mb-12">

      {/* Brand */}
      <div className="sm:col-span-2 md:col-span-2">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Zybrick</h3>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
          Zybrick is a curated co-living discovery platform built for modern urban living.
          We go beyond listings—uncovering legal risks, pricing inconsistencies, and
          locality challenges so you move in with absolute confidence.
        </p>

 
      </div>

      {/* Explore */}
      <div>
        <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Explore</h4>
        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
          <li><Link href="/stays" className="hover:text-primary">All Co-Living Spaces</Link></li>
          <li><Link href="/stays?type=managed" className="hover:text-primary">Managed Co-Living</Link></li>
          <li><Link href="/stays?type=studio" className="hover:text-primary">Studio Living</Link></li>
          <li><Link href="/stays?type=shared" className="hover:text-primary">Shared Living</Link></li>
          <li><Link href="/verified" className="hover:text-primary">Verified Listings</Link></li>
        </ul>
      </div>

      {/* Cities */}
      <div>
        <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Cities</h4>
        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
          <li><Link href="/bangalore" className="hover:text-primary">Bangalore</Link></li>
          <li><Link href="/hyderabad" className="hover:text-primary">Hyderabad</Link></li>
          <li><Link href="/pune" className="hover:text-primary">Pune</Link></li>
          <li><Link href="/chennai" className="hover:text-primary">Chennai</Link></li>
          <li><Link href="/coming-soon" className="hover:text-primary">More Cities</Link></li>
        </ul>
      </div>

      {/* Company */}
      <div>
        <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Company</h4>
        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
          <li><Link href="/about" className="hover:text-primary">About Zybrick</Link></li>
          <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
          <li><Link href="/blog" className="hover:text-primary">Insights & Guides</Link></li>
          <li><Link href="/list-property" className="hover:text-primary">List Your Co-Living</Link></li>
          <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-white/10 pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
      <p className="text-xs text-gray-500 text-center md:text-left">
        © {new Date().getFullYear()} Zybrick Technologies Pvt. Ltd. All rights reserved.
      </p>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-400">
        <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-primary">Terms of Use</Link>
        <Link href="/disclaimer" className="hover:text-primary">Disclaimer</Link>
      </div>
    </div>
  </div>
</footer>

    </div>
  );
}
