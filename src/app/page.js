"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Heart,
  Phone,
  Play,
  ChevronLeft,
  ChevronRight,
  Search,
  Navigation2,
  X,
} from "lucide-react";
import OlaMapSearch from "@/components/maps/OlaMapSearch";
import OlaMapViewer from "@/components/maps/OlaMapViewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Property data (moved outside component to prevent re-creation)
const PROPERTIES_DATA = [
  {
    id: 1,
    name: "Esto Arkis",
    location: "Andheri West",
    lat: 19.1136,
    lng: 72.8697,
    price: "₹1.64 Cr - 3.84 Cr",
    bhk: "1, 2, 3 BHK",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=500&fit=crop",
    developer: "ESTO GROUP",
  },
  {
    id: 2,
    name: "Shree Gopaldham",
    location: "Kandivali West",
    lat: 19.2074,
    lng: 72.832,
    price: "₹3.45 Cr - 5.64 Cr",
    bhk: "3, 4 BHK",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=500&fit=crop",
    developer: "JEEVEE",
  },
  {
    id: 3,
    name: "Serenova Kolte Patil",
    location: "Andheri West",
    lat: 19.12,
    lng: 72.86,
    price: "₹3.2 Cr - 4.93 Cr",
    bhk: "2, 3 BHK",
    image:
      "https://images.unsplash.com/photo-1565402170291-8491f14678db?w=400&h=500&fit=crop",
    developer: "KOLTE PATIL",
  },
  {
    id: 4,
    name: "Raghav Ananta",
    location: "Vikhroli",
    lat: 19.1107,
    lng: 72.9253,
    price: "₹1.1 Cr - 2.3 Cr",
    bhk: "1, 2, 3 BHK",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=500&fit=crop",
    developer: "RAGHAV",
  },
  {
    id: 5,
    name: "Shapoorji Minerva",
    location: "Mahalaxmi",
    lat: 18.9826,
    lng: 72.8233,
    price: "₹14.22 Cr - 14.75 Cr",
    bhk: "3, 5, 4 BHK",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=500&fit=crop",
    developer: "SHAPOORJI PALLONJI",
  },
  {
    id: 6,
    name: "Peninsula Heights",
    location: "Andheri West",
    lat: 19.11,
    lng: 72.875,
    price: "₹2.1 Cr - 3.5 Cr",
    bhk: "2, 3 BHK",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=500&fit=crop",
    developer: "PENINSULA",
  },
];

// Locations data (moved outside component to prevent re-creation)
const LOCATIONS_DATA = [
  { name: "Andheri West", lat: 19.1136, lng: 72.8697 },
  { name: "Andheri East", lat: 19.1197, lng: 72.8478 },
  { name: "Kandivali West", lat: 19.2074, lng: 72.832 },
  { name: "Kandivali East", lat: 19.2083, lng: 72.8547 },
  { name: "Mahalaxmi", lat: 18.9826, lng: 72.8233 },
  { name: "Vikhroli", lat: 19.1107, lng: 72.9253 },
  { name: "Bandra West", lat: 19.0544, lng: 72.8181 },
  { name: "Bandra East", lat: 19.0591, lng: 72.8406 },
  { name: "Juhu", lat: 19.1075, lng: 72.8263 },
  { name: "Versova", lat: 19.1317, lng: 72.8103 },
  { name: "Powai", lat: 19.1197, lng: 72.9058 },
  { name: "Worli", lat: 19.0134, lng: 72.8177 },
  { name: "Lower Parel", lat: 19.0013, lng: 72.8267 },
  { name: "Dadar West", lat: 19.0189, lng: 72.8428 },
  { name: "Dadar East", lat: 19.0178, lng: 72.8478 },
  { name: "Malad West", lat: 19.1864, lng: 72.8365 },
  { name: "Malad East", lat: 19.1932, lng: 72.8489 },
  { name: "Goregaon West", lat: 19.1663, lng: 72.8526 },
  { name: "Goregaon East", lat: 19.1663, lng: 72.8697 },
  { name: "Borivali West", lat: 19.2307, lng: 72.8567 },
  { name: "Borivali East", lat: 19.2411, lng: 72.8611 },
];

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState({
    city: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    name: "Andheri West",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [hoveredTourId, setHoveredTourId] = useState(null);
  const videoRefs = useRef({});
  const carouselRef = useRef(null);
  const assuredCarouselRef = useRef(null);

  // Search suggestions data - combines locations, developers, and projects
  const searchSuggestions = useMemo(() => {
    const locationSuggestions = LOCATIONS_DATA.map((loc) => ({
      name: loc.name,
      category: "location",
      description: "Mumbai",
      lat: loc.lat,
      lng: loc.lng,
    }));

    const developerSuggestions = [
      {
        name: "ESTO GROUP",
        category: "developer",
        description: "Premium Real Estate Developer",
      },
      {
        name: "JEEVEE",
        category: "developer",
        description: "Luxury Residential Projects",
      },
      {
        name: "KOLTE PATIL",
        category: "developer",
        description: "Quality Construction",
      },
      {
        name: "RAGHAV",
        category: "developer",
        description: "Affordable Housing",
      },
      {
        name: "SHAPOORJI PALLONJI",
        category: "developer",
        description: "Ultra Luxury Properties",
      },
      {
        name: "PENINSULA",
        category: "developer",
        description: "Prime Locations",
      },
    ];

    const projectSuggestions = PROPERTIES_DATA.map((prop) => ({
      name: prop.name,
      category: "project",
      description: `${prop.location} • ${prop.bhk}`,
      lat: prop.lat,
      lng: prop.lng,
    }));

    return [
      ...locationSuggestions,
      ...developerSuggestions,
      ...projectSuggestions,
    ];
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    // Handle YouTube Shorts
    if (url.includes("youtube.com/shorts/")) {
      const videoId = url.split("shorts/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1`;
    }
    // Handle regular YouTube videos
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1`;
    }
    // Handle youtu.be links
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1`;
    }
    // Return original URL for non-YouTube videos
    return url;
  };

  // Handle video play/pause on hover
  const handleTourHover = (tourId, isHovering) => {
    setHoveredTourId(isHovering ? tourId : null);
    const iframe = videoRefs.current[tourId];
    if (iframe && iframe.tagName === "IFRAME") {
      // For YouTube iframes, control via src manipulation
      const currentSrc = iframe.getAttribute("data-src") || "";
      if (isHovering) {
        iframe.src = getYouTubeEmbedUrl(currentSrc);
      } else {
        iframe.src = "";
      }
    } else if (iframe && iframe.tagName === "VIDEO") {
      // For regular video tags
      if (isHovering) {
        iframe.play().catch((e) => console.log("Video play failed:", e));
      } else {
        iframe.pause();
        iframe.currentTime = 0;
      }
    }
  };

  // Scroll carousel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Scroll assured carousel
  const scrollAssuredCarousel = (direction) => {
    if (assuredCarouselRef.current) {
      const scrollAmount = 400;
      assuredCarouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const virtualTours = [
    {
      id: 1,
      title: "SPACIOUS 3 BHK HOMES",
      price: "₹1.75 CR ONWARDS",
      location: "Andheri West",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=700&fit=crop",
    },
    {
      id: 2,
      title: "LUXURY APARTMENTS",
      price: "₹2.5 CR ONWARDS",
      location: "Kandivali West",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=700&fit=crop",
    },
    {
      id: 3,
      title: "PREMIUM 4 BHK",
      price: "₹3.2 CR ONWARDS",
      location: "Mahalaxmi",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=700&fit=crop",
    },
    {
      id: 4,
      title: "MODERN LIVING",
      price: "₹1.95 CR ONWARDS",
      location: "Vikhroli",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=700&fit=crop",
    },
    {
      id: 5,
      title: "SEA VIEW VILLAS",
      price: "₹5.2 CR ONWARDS",
      location: "Mahalaxmi",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=700&fit=crop",
    },
    {
      id: 6,
      title: "SMART HOMES",
      price: "₹2.8 CR ONWARDS",
      location: "Andheri West",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=700&fit=crop",
    },
    {
      id: 7,
      title: "SPACIOUS 3 BHK HOMES",
      price: "₹1.75 CR ONWARDS",
      location: "Andheri West",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=700&fit=crop",
    },
    {
      id: 8,
      title: "LUXURY APARTMENTS",
      price: "₹2.5 CR ONWARDS",
      location: "Kandivali West",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=700&fit=crop",
    },
    {
      id: 9,
      title: "PREMIUM 4 BHK",
      price: "₹3.2 CR ONWARDS",
      location: "Mahalaxmi",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=700&fit=crop",
    },
    {
      id: 10,
      title: "MODERN LIVING",
      price: "₹1.95 CR ONWARDS",
      location: "Vikhroli",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=700&fit=crop",
    },
    {
      id: 11,
      title: "SEA VIEW VILLAS",
      price: "₹5.2 CR ONWARDS",
      location: "Mahalaxmi",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=700&fit=crop",
    },
    {
      id: 12,
      title: "SMART HOMES",
      price: "₹2.8 CR ONWARDS",
      location: "Andheri West",
      videoUrl: "https://www.youtube.com/shorts/974aaQLU4Ks",
      thumbnail:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=700&fit=crop",
    },
  ];

  // Filter properties based on selected location (5km radius)
  const filteredProperties = useMemo(() => {
    return PROPERTIES_DATA.filter((property) => {
      const distance = calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        property.lat,
        property.lng
      );
      return distance <= 5; // 5km radius
    });
  }, [selectedLocation]);

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    if (
      suggestion.category === "location" ||
      suggestion.category === "project"
    ) {
      // Update location if the suggestion has coordinates
      if (suggestion.lat && suggestion.lng) {
        setSelectedLocation({
          city: "Mumbai",
          lat: suggestion.lat,
          lng: suggestion.lng,
          name: suggestion.name,
        });
        setShowMap(true);
      }
    }
    // For developer searches, you might want to filter properties
    // This is where you'd add developer-specific filtering logic
  };

  const [searchResult, setSearchResult] = useState(null);
  const [mapLocation, setMapLocation] = useState(null);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [sheetMapCenter, setSheetMapCenter] = useState({
    lat: 19.076,
    lng: 72.8777,
  });
  const [sheetMapMarker, setSheetMapMarker] = useState(null);

  const handleLocationChange = (location) => {
    console.log("Location selected:", location);
    setSelectedLocation(location);
  };

  const handleSearchSelect = (place) => {
    console.log("=== Address Selected ===");
    console.log("Address:", place.formattedAddress);
    console.log("Latitude:", place.coordinates?.lat);
    console.log("Longitude:", place.coordinates?.lng);
    console.log("Full Place Details:", place);
    console.log("=======================");

    setSearchResult(place);

    // Update map location if coordinates are available
    if (place.coordinates) {
      setSelectedLocation({
        city: "Mumbai",
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
        name: place.formattedAddress,
      });
      setShowMap(true);
    }
  };

  const handleMapInteraction = (data) => {
    console.log("Map interaction:", data);
    setMapLocation(data);
  };

  // Handle opening the location sheet
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

  // Handle search in the sheet
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

      // Update the main search result
      setSearchResult(place);
      setSelectedLocation({
        city: "Mumbai",
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
        name: place.formattedAddress,
      });
    }
  };

  // Handle map interaction in the sheet
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

  // Truncate address for display
  const truncateAddress = (address, maxLength = 40) => {
    if (!address) return "";
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#1a0f1f] relative overflow-x-hidden">
      {/* Sunset Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Large orange sun glow */}
        <div className="absolute top-20 left-1/2 w-[700px] h-[700px] bg-gradient-radial from-orange-500/20 via-orange-600/10 to-transparent rounded-full blur-[120px] -translate-x-1/2 animate-pulse"></div>
        {/* Purple twilight glow */}
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-purple-500/15 via-purple-600/5 to-transparent rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        {/* Amber horizon glow */}
        <div
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        {/* Horizontal sunset gradient */}
        <div className="absolute inset-x-0 top-1/4 h-[300px] bg-gradient-to-b from-orange-500/5 via-rose-500/5 to-transparent"></div>
      </div>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-[0_0_30px_rgba(251,146,60,0.15)] border-b border-primary/20"
            : "bg-gradient-to-b from-background/60 to-transparent backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold hover:scale-105 transition-transform cursor-pointer">
            Real
            <span className="text-primary drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]">
              Estate
            </span>
          </div>
          <div className="flex items-center gap-3">
            {selectedLocation && (
              <Sheet
                open={isLocationSheetOpen}
                onOpenChange={setIsLocationSheetOpen}
              >
                <Button
                  variant="outline"
                  onClick={handleOpenLocationSheet}
                  className="hidden md:flex items-center gap-2 rounded-full bg-primary/10 border-primary/20 hover:bg-primary/20"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {selectedLocation.name}
                  </span>
                </Button>

                {/* Full Screen Sheet with Map */}
                <SheetContent side="full" className="p-0 overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Header with Search */}
                    <SheetHeader className="p-4 md:p-6 border-b bg-background/95 backdrop-blur-sm z-10">
                      <div className="flex items-center justify-between mb-4">
                        <SheetTitle className="text-left">
                          Select Your Location
                        </SheetTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsLocationSheetOpen(false)}
                          className="rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                      <SheetDescription className="text-left mb-4">
                        Search for an address or drag the marker on the map to
                        adjust your location
                      </SheetDescription>

                      {/* Search Bar in Sheet */}
                      <div className="w-full">
                        <OlaMapSearch
                          onPlaceSelect={handleSheetSearchSelect}
                          placeholder="Type to search for address or location..."
                          className="w-full"
                          initialValue={searchResult?.formattedAddress || ''}
                        />
                      </div>
                    </SheetHeader>

                    {/* Map Viewer - Full Height */}
                    <div className="flex-1 relative">
                      <OlaMapViewer
                        center={sheetMapCenter}
                        zoom={16}
                        marker={sheetMapMarker}
                        onMarkerDragEnd={handleSheetMapInteraction}
                        onMapClick={handleSheetMapInteraction}
                        height="100%"
                        interactive={true}
                        showCurrentLocation={true}
                      />
                    </div>

                    {/* Footer with Selected Address */}
                    {searchResult && (
                      <div className="p-4 md:p-6 border-t bg-background/95 backdrop-blur-sm">
                        <div className="flex items-start gap-3 mb-4">
                          <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold mb-1">
                              Selected Location:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {searchResult.formattedAddress}
                            </p>
                            {searchResult.coordinates && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  Lat: {searchResult.coordinates.lat.toFixed(6)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Lng: {searchResult.coordinates.lng.toFixed(6)}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => setIsLocationSheetOpen(false)}
                        >
                          Confirm Location
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <Avatar>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[400px] md:h-[500px] flex items-center justify-center overflow-visible pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop"
            alt="City skyline"
            fill
            className="object-cover opacity-40"
            priority
          />
          {/* Premium Orange Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-[#2d1b1f]/70 to-[#1a0f1f]/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f1f] via-transparent to-orange-500/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-transparent to-purple-600/20"></div>

          {/* Enhanced Sunset rays effect */}
          <div className="absolute inset-0 overflow-hidden opacity-40">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/4 left-1/2 w-[3px] h-[700px] origin-top"
                style={{
                  transform: `translateX(-50%) rotate(${i * 18}deg)`,
                  background: `linear-gradient(to bottom, rgba(251, 146, 60, ${
                    0.25 - i * 0.008
                  }) 0%, rgba(249, 115, 22, ${
                    0.15 - i * 0.006
                  }) 40%, transparent 70%)`,
                }}
              />
            ))}
          </div>

          {/* Glowing orbs */}
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div
            className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-amber-500/15 rounded-full blur-[80px] animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 px-4"
          >
            Find your dream home
            <span className="text-primary drop-shadow-[0_0_25px_rgba(251,146,60,0.9)]">
              .
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 px-4"
          >
            Location-based real estate marketplace • Select any area on map •
            5km radius search
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-4 relative z-50"
          >
            <OlaMapSearch
              onPlaceSelect={handleSearchSelect}
              placeholder="Type to search for address or location..."
              className="w-full"
            />
            
          </motion.div>
        </div>
      </section>

      {/* Virtual Tours Carousel Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-[#2d1b1f] via-[#3d1f2f] to-[#2d1b1f] overflow-hidden relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              {/* <Badge className="gap-2">
                 New
              </Badge> */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                ✨Trending{" "}
                <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
                  Properties
                </span>
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => scrollCarousel("left")}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => scrollCarousel("right")}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Horizontal Scrollable Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {virtualTours.map((tour) => (
              <Card
                key={tour.id}
                className="shrink-0 w-[180px] sm:w-[200px] md:w-[220px] group cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden p-0"
                onMouseEnter={() => handleTourHover(tour.id, true)}
                onMouseLeave={() => handleTourHover(tour.id, false)}
              >
                <div className="relative aspect-9/16">
                  {/* Video/iframe element */}
                  {tour.videoUrl.includes("youtube.com") ||
                  tour.videoUrl.includes("youtu.be") ? (
                    <>
                      <Image
                        src={tour.thumbnail}
                        alt={tour.title}
                        fill
                        className="object-cover"
                      />
                      <iframe
                        ref={(el) => (videoRefs.current[tour.id] = el)}
                        data-src={tour.videoUrl}
                        title={tour.title}
                        className="w-full h-full object-cover absolute inset-0 z-10"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ border: "none" }}
                      />
                    </>
                  ) : (
                    <video
                      ref={(el) => (videoRefs.current[tour.id] = el)}
                      src={tour.videoUrl}
                      poster={tour.thumbnail}
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

                  {/* Play Indicator */}
                  {hoveredTourId !== tour.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary/60 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
                        <Play
                          className="w-6 h-6 text-white ml-0.5"
                          fill="currentColor"
                        />
                      </div>
                    </div>
                  )}

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                    <Badge className="mb-1 text-[10px]">{tour.title}</Badge>
                    <p className="text-xs font-semibold text-white">
                      {tour.price}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      📍 {tour.location}
                    </p>
                  </div>

                  {/* Hover to Play Text */}
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                  >
                    {hoveredTourId === tour.id ? "▶ Playing" : "▶ Hover"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Hover over videos to auto-play • Swipe to explore more
          </p>
        </div>
      </section>

      {/* Assured Properties Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#1a0f1f] relative z-10 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                <span className="text-primary drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">
                  Assured
                </span>{" "}
                Properties
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => scrollAssuredCarousel("left")}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => scrollAssuredCarousel("right")}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Horizontal Scrollable Carousel */}
          <div
            ref={assuredCarouselRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {PROPERTIES_DATA.length > 0 ? (
              PROPERTIES_DATA.map((property, index) => (
                <Card
                  key={property.id}
                  className="shrink-0 w-[220px] sm:w-[240px] md:w-[280px] group hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] transition-all duration-300 overflow-hidden p-0 border-primary/10 hover:border-primary/30"
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
                          <p className="text-sm md:text-lg font-bold text-primary">
                            {property.price}
                          </p>
                          <p className="text-xs md:text-sm text-white/60">
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
              ))
            ) : (
              <div className="w-full text-center py-12">
                <Card className="inline-block p-6">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    No Properties Found
                  </h3>
                  <p className="text-muted-foreground">
                    Try selecting a different location or zoom out on the map
                  </p>
                </Card>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Swipe to explore more assured properties
          </p>
        </div>
      </section>
    </div>
  );
}
