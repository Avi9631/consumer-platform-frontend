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

export default function Home() {

  useEffect(() => {
    redirectToColiving();
  }, []);

  const redirectToColiving = () =>  {
    console.log("Redirecting to /coliving");   window.location.href = "/coliving";
  }

 

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

      {/* Features & Categories Combined Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 mx-auto space-y-12">
        {/* Explore By Category Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Categories */}
          <div>
            <Card className="border-0 bg-transparent h-fit">
              <CardHeader>
                <div className="flex flex-col items-center lg:items-start">
                  <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Explore By Category
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {[
                  {
                    title: "For Men",
                    gradient: "from-blue-500/20 to-cyan-500/20",
                    icon: "👨",
                  },
                  {
                    title: "For Women",
                    gradient: "from-pink-500/20 to-purple-500/20",
                    icon: "👩",
                  },
                  {
                    title: "Coliving - Unisex",
                    gradient: "from-orange-500/20 to-yellow-500/20",
                    icon: "🏘️",
                  },
                ].map((category, index) => (
                  <Card
                    key={index}
                    className={`bg-gradient-to-br ${category.gradient} backdrop-blur-sm border-white/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
                  >
                    <CardContent className="flex items-center gap-4">
                      <div className="text-4xl flex-shrink-0">
                        {category.icon}
                      </div>
                      <h3 className="text-base font-bold text-white mb-0.5">
                        {category.title}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Image with Title Border */}
          <div className="relative flex flex-col">
            <div className="ml-6 flex-1 rounded-lg overflow-hidden">
              <img
                src="https://static.wixstatic.com/media/489126_d4fc78aa2987441995a8f6e69ea20b02~mv2.jpg/v1/crop/x_532,y_247,w_1990,h_1775/fill/w_1360,h_1212,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_20250122_165600405_edited.jpg"
                alt="Premium Living Spaces"
                className="w-full h-100 object-cover rounded-lg"
              />
            </div>
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
            <Link href={"/pg-coliving-hostel"} target="_blank">
              <Button size="sm" className="group">
                Explore More
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        }
        className="my-3"
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
              className="shrink-0 w-[240px] xs:w-[260px] sm:w-[270px]"
            >
              <PgHostelCard
                property={property}
                onClick={() => {
                  console.log(`PG Hostel clicked: ${property.name}`);
                  window.open(
                    `/pg-coliving-hostel/${property.pgHostelId}`,
                    "_blank",
                  );
                }}
              />
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

      {/* Trusted PG Hostels Section */}
      <CarouselSection
        title={
          <div className="flex items-center gap-3">
            <div>
              Featured {" "}
              <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
                PG for Men
              </span>{" "}
            </div>
            <Link href={"/pg-coliving-hostel"} target="_blank">
              <Button size="sm" className="group">
                Explore More
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        }
        className="my-3"
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
              className="shrink-0 w-[240px] xs:w-[260px] sm:w-[270px]"
            >
              <PgHostelCard
                property={property}
                onClick={() => {
                  console.log(`PG Hostel clicked: ${property.name}`);
                  window.open(
                    `/pg-coliving-hostel/${property.pgHostelId}`,
                    "_blank",
                  );
                }}
              />
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

      {/* Trusted PG Hostels Section */}
      <CarouselSection
        title={
          <div className="flex items-center gap-3">
            <div>
              Featured {" "}
              <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
                PG for Women
              </span>{" "}
            </div>
            <Link href={"/pg-coliving-hostel"} target="_blank">
              <Button size="sm" className="group">
                Explore More
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        }
        className="my-3"
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
              className="shrink-0 w-[240px] xs:w-[260px] sm:w-[270px]"
            >
              <PgHostelCard
                property={property}
                onClick={() => {
                  console.log(`PG Hostel clicked: ${property.name}`);
                  window.open(
                    `/pg-coliving-hostel/${property.pgHostelId}`,
                    "_blank",
                  );
                }}
              />
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
       
       
       
            {/* Features & Categories Combined Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 mx-auto space-y-12">
        {/* Your Comfort, Our Priority Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Image with Title Border */}
          <div className="relative flex flex-col  ">
            <div className="ml-6 flex-1 rounded-lg overflow-hidden">
              <img
                src="https://static.wixstatic.com/media/489126_d4fc78aa2987441995a8f6e69ea20b02~mv2.jpg/v1/crop/x_532,y_247,w_1990,h_1775/fill/w_1360,h_1212,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_20250122_165600405_edited.jpg"
                alt="Quality Living Experience"
                className="w-full h-100 object-cover rounded-lg"
              />
            </div>
          </div>
          {/* Features */}
          <div className="">
            <Card className="border-0 bg-transparent h-fit">
              <CardHeader>
                <div className="flex flex-col items-center lg:items-start">
                  <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Your Comfort, Our Priority
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: Shield,
                    title: "Verified Properties",
                    description: "All listings verified for safety and quality",
                    color: "text-emerald-500",
                  },
                  {
                    icon: DollarSign,
                    title: "Zero Brokerage",
                    description:
                      "Direct contact with owners, no hidden charges",
                    color: "text-blue-500",
                  },
                  {
                    icon: Heart,
                    title: "24/7 Support",
                    description: "Always here to help with any concerns",
                    color: "text-pink-500",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <CardContent className="flex items-center gap-4">
                      <feature.icon
                        className={`w-10 h-10 ${feature.color} group-hover:scale-110 transition-transform flex-shrink-0`}
                      />
                      <div>
                        <h3 className="text-base font-semibold text-white mb-0.5">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="  mx-auto">
          <Card className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/20" />
            <CardContent className="py-4 text-center relative z-10">
              <Zap className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Find Your Perfect Stay?
              </h2>
              <p className="text-white/90 mb-8 text-lg">
                Join thousands of happy residents who found their ideal
                accommodation with us
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pg-coliving-hostel" target="_blank">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8"
                  >
                    <MapPin className="mr-2 w-5 h-5" /> Start Searching
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">About Us</h3>
              <p className="text-gray-400 text-sm">
                Your trusted platform for finding verified PG accommodations,
                hostels, and co-living spaces across India.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="/pg-coliving-hostel"
                    className="hover:text-primary transition-colors"
                  >
                    All Properties
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📧 support@example.com</li>
                <li>📞 +91 1234567890</li>
                <li>📍 Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 PG Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
