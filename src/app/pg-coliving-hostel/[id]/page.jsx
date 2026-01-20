"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Share2,
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Calendar,
  Building2,
  Phone,
  Mail,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Maximize2,
  IndianRupee,
  CheckCircle,
  Users,
  Wifi,
  Car as CarIcon,
  Dumbbell,
  Shield,
  Trees,
  Waves,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import GoogleMapViewer from "@/components/maps/GoogleMapViewer";
import Header from "@/components/Header";
import LocationSheet from "@/components/LocationSheet";
import RoomTypeCard from "@/components/RoomTypeCard";
import InterestDialog from "@/components/InterestDialog";
import RoomTypeSelectionDialog from "@/components/RoomTypeSelectionDialog";
import useLocationStore from "@/stores/locationStore";
import { PROPERTIES_DATA } from "@/constants/propertyData";
import { X } from "lucide-react";
import { ImageIcon } from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params?.id;

  // Zustand store for global location state
  const location = useLocationStore((state) => state.location);
  const searchResult = useLocationStore((state) => state.searchResult);
  const updateFromSearchResult = useLocationStore(
    (state) => state.updateFromSearchResult
  );

  // State management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const [mainImageError, setMainImageError] = useState(false);
  const [galleryImageError, setGalleryImageError] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState({});
  const [sheetMapCenter, setSheetMapCenter] = useState({
    lat: 19.0176,
    lng: 72.8562,
  });
  const [sheetMapMarker, setSheetMapMarker] = useState(null);
  const scrollRef = useRef(null);
  const roomScrollRef = useRef(null);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [currentMenuDayIndex, setCurrentMenuDayIndex] = useState(0);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInterestDialogOpen, setIsInterestDialogOpen] = useState(false);
  const [isRoomSelectionOpen, setIsRoomSelectionOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Fetch property data from API
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/api/pg-hostel/${propertyId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch property: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error(result.message || "Failed to fetch property data");
        }

        // Use API data directly - user-centric approach
        setProperty(result.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  // Auto-carousel effect for Quick Stats
  useEffect(() => {
    if (!property) return;

    const CAROUSEL_INTERVAL = 3000; // milliseconds between slide changes
    const quickStatsLength = 8; // Fixed length for stats

    const carouselInterval = setInterval(() => {
      const totalSlides = Math.ceil(quickStatsLength / 4);
      setCurrentStatIndex((prev) => (prev + 1) % totalSlides);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(carouselInterval);
  }, [property]);

  // Auto-carousel effect for Weekly Menu
  useEffect(() => {
    if (
      !property?.foodMess?.weeklyMenu ||
      property.foodMess.weeklyMenu.length === 0
    )
      return;

    const MENU_CAROUSEL_INTERVAL = 5000; // 5 seconds per day

    const menuCarouselInterval = setInterval(() => {
      setCurrentMenuDayIndex(
        (prev) => (prev + 1) % property.foodMess.weeklyMenu.length
      );
    }, MENU_CAROUSEL_INTERVAL);

    return () => clearInterval(menuCarouselInterval);
  }, [property?.foodMess?.weeklyMenu]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Property Not Found
            </h2>
            <p className="text-gray-600">
              {error || "Unable to load property details"}
            </p>
            <Button onClick={() => window.history.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quick Stats - User-centric information
  const getMinRent = () => {
    if (!property.roomTypes || property.roomTypes.length === 0) return "N/A";
    const prices = property.roomTypes
      .map((r) => r.pricing?.find((p) => p.type === "Monthly Rent")?.amount)
      .filter((p) => p > 0);
    return prices.length > 0
      ? `₹${Math.min(...prices).toLocaleString("en-IN")}`
      : "N/A";
  };

  const getTotalBeds = () => {
    if (!property.roomTypes) return { available: 0, total: 0 };
    return property.roomTypes.reduce(
      (acc, room) => ({
        available: acc.available + (room.availability?.availableBeds || 0),
        total: acc.total + (room.availability?.totalBeds || 0),
      }),
      { available: 0, total: 0 }
    );
  };

  const quickStats = [
    {
      icon: Building2,
      label: "Property Type",
      value: "PG / Hostel",
    },
    {
      icon: Users,
      label: "For",
      value: property.genderAllowed || "All",
    },
    {
      icon: Bed,
      label: "Room Options",
      value: property.roomTypes?.length
        ? `${property.roomTypes.length} Types`
        : "Multiple",
    },
    {
      icon: IndianRupee,
      label: "Rent Starts From",
      value: getMinRent(),
    },
    {
      icon: Wifi,
      label: "Food",
      value: property.foodMess?.available
        ? `${property.foodMess.foodType}`
        : "Self Cooking",
    },
    {
      icon: Shield,
      label: "Managed By",
      value: property.isBrandManaged ? property.brandName : "Owner",
    },
    {
      icon: Calendar,
      label: "Move-in",
      value:
        property.publishStatus === "PUBLISHED" ? "Immediate" : "Contact Owner",
    },
    {
      icon: CheckCircle,
      label: "Available Beds",
      value: (() => {
        const beds = getTotalBeds();
        return `${beds.available}/${beds.total}`;
      })(),
    },
  ];

  // Helper: Get images from API data
  const propertyImages = property.mediaData
    ?.filter((m) => m.type === "image" && m.url)
    .map((m) => m.url) || [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
  ];

  const nextImage = () => {
    setMainImageError(false);
    setCurrentImageIndex((prev) =>
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setMainImageError(false);
    setCurrentImageIndex((prev) =>
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };

  const openImageGallery = (index = 0) => {
    setGalleryImageIndex(index);
    setIsImageGalleryOpen(true);
  };

  const nextGalleryImage = () => {
    setGalleryImageError(false);
    setGalleryImageIndex((prev) =>
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevGalleryImage = () => {
    setGalleryImageError(false);
    setGalleryImageIndex((prev) =>
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };

  // Handle opening location sheet
  const handleOpenLocationSheet = () => {
    const lat = parseFloat(property.lat) || 19.0176;
    const lng = parseFloat(property.lng) || 72.8562;

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
      setSheetMapCenter({ lat, lng });
      setSheetMapMarker({ lat, lng, draggable: true });
    }
    setIsLocationSheetOpen(true);
  };

  // Handle location selection from sheet
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

  // Handle map interaction in sheet
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

  // Handle Show Interest from property page (opens room selection)
  const handleShowPropertyInterest = () => {
    if (property?.roomTypes && property.roomTypes.length > 0) {
      setIsRoomSelectionOpen(true);
    } else {
      // If no room types, show dialog directly
      setIsInterestDialogOpen(true);
    }
  };

  // Handle room selection confirmation
  const handleRoomSelectionConfirm = (rooms) => {
    setSelectedRooms(rooms);
    setIsRoomSelectionOpen(false);
    setIsInterestDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Premium gradient background with decorative elements */}
      <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-purple-500/5"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-conic from-orange-500/20 via-transparent to-orange-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-bl from-orange-500/20 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-purple-600/10 to-transparent blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10">
        {/* Header */}
        <Header
          scrolled={true}
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

        {/* Image Gallery Sheet */}
        <Sheet open={isImageGalleryOpen} onOpenChange={setIsImageGalleryOpen}>
          <SheetContent
            side="full"
            className="bg-black/95 backdrop-blur-xl border-none p-0 overflow-hidden [&>button]:hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <SheetHeader className="p-4 sm:p-6 bg-linear-to-b from-black/80 to-transparent z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <SheetTitle className="text-white text-lg sm:text-xl font-bold text-left">
                      {property.propertyName}
                    </SheetTitle>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 text-left">
                      {galleryImageIndex + 1} / {propertyImages.length}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsImageGalleryOpen(false)}
                    className="rounded-full text-white hover:text-orange-400 hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </SheetHeader>

              {/* Main Image Display */}
              <div className="flex-1 relative">
                <div className="flex items-center justify-center h-full px-4 sm:px-16 py-20">
                  <div className="relative w-full h-full max-w-7xl">
                    {!galleryImageError ? (
                      <Image
                        src={propertyImages[galleryImageIndex]}
                        alt={`${property.propertyName} - Image ${
                          galleryImageIndex + 1
                        }`}
                        fill
                        className="object-contain"
                        priority
                        onError={() => setGalleryImageError(true)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800/80 to-slate-900/80">
                        <ImageIcon className="w-20 h-20 text-slate-500 mb-4" />
                        <p className="text-slate-400 text-lg font-medium">
                          Failed to load image
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white hover:bg-orange-500 hover:scale-110 z-10 transition-all duration-300 border border-white/10 h-12 w-12 p-0 rounded-full shadow-xl"
                  onClick={prevGalleryImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white hover:bg-orange-500 hover:scale-110 z-10 transition-all duration-300 border border-white/10 h-12 w-12 p-0 rounded-full shadow-xl"
                  onClick={nextGalleryImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              {/* Thumbnail Strip Footer */}
              <div className="p-4 sm:p-6 bg-linear-to-t from-black/80 to-transparent">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {propertyImages.map((image, index) => (
                    <button
                      key={index}
                      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === galleryImageIndex
                          ? "ring-2 ring-orange-500 scale-110 shadow-lg shadow-orange-500/50"
                          : "ring-1 ring-white/20 hover:ring-white/50 opacity-60 hover:opacity-100"
                      }`}
                      onClick={() => {
                        setGalleryImageIndex(index);
                        setGalleryImageError(false);
                      }}
                    >
                      {!thumbnailErrors[index] ? (
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={() =>
                            setThumbnailErrors((prev) => ({
                              ...prev,
                              [index]: true,
                            }))
                          }
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/80 to-slate-800/80 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Property Navigation Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-orange-400 transition-all duration-300 group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Search</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-orange-400 transition-all duration-300 hover:scale-110"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`transition-all duration-300 hover:scale-110 ${
                isLiked
                  ? "text-orange-500"
                  : "text-white hover:text-orange-400 hover:bg-white/10"
              }`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </header>

        {/* Hero Section with Image Collage */}
        <div className="relative mt-6 sm:mt-12 mx-3 sm:mx-4 lg:mx-6">
          {/* Image Collage Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-1 sm:gap-2 h-64 sm:h-96 lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10">
            {/* Main large image */}
            <div
              className="col-span-2 row-span-2 relative group cursor-pointer"
              onClick={() => setCurrentImageIndex(0)}
            >
              {!mainImageError ? (
                <>
                  <Image
                    src={propertyImages[currentImageIndex]}
                    alt={property.propertyName}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    priority
                    onError={() => setMainImageError(true)}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-500"></div>
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/80 to-slate-800/80 flex flex-col items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-slate-500 mb-3" />
                  <p className="text-slate-400 text-base font-medium">
                    Failed to load image
                  </p>
                </div>
              )}
              {/* Main image indicator */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border border-white/10">
                {currentImageIndex + 1} / {propertyImages.length}
              </div>
            </div>

            {/* Smaller images */}
            {propertyImages.slice(1, 5).map((image, index) => {
              const imageIndex = index + 1;
              const isActive = currentImageIndex === imageIndex;
              return (
                <div
                  key={imageIndex}
                  className={`relative group cursor-pointer overflow-hidden rounded-md transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-orange-500 shadow-lg shadow-orange-500/50"
                      : "hover:ring-2 hover:ring-white/30"
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(imageIndex);
                    setMainImageError(false);
                  }}
                >
                  {!thumbnailErrors[imageIndex] ? (
                    <>
                      <Image
                        src={image}
                        alt={`${property.propertyName} - Image ${
                          imageIndex + 1
                        }`}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                        onError={() =>
                          setThumbnailErrors((prev) => ({
                            ...prev,
                            [imageIndex]: true,
                          }))
                        }
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700/80 to-slate-800/80 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-slate-500" />
                    </div>
                  )}
                  {/* Show "View all photos" on last image if there are more images */}
                  {index === 3 && propertyImages.length > 5 && (
                    <div
                      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/80 transition-all duration-300 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageGallery(0);
                      }}
                    >
                      <div className="text-white text-center">
                        <Maximize2 className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1" />
                        <p className="text-xs sm:text-sm font-medium">
                          +{propertyImages.length - 5} more
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white hover:bg-orange-500 hover:scale-110 z-10 transition-all duration-300 border border-white/10 h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full shadow-xl"
            onClick={prevImage}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white hover:bg-orange-500 hover:scale-110 z-10 transition-all duration-300 border border-white/10 h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full shadow-xl"
            onClick={nextImage}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Image indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
            {propertyImages.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-orange-500 w-6 sm:w-8 shadow-lg shadow-orange-500/50"
                    : "bg-white/40 hover:bg-white/70 w-1.5 sm:w-2"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>

          {/* Property info overlay */}
          {/* <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 via-black/40 to-transparent text-white rounded-b-lg">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <p className="text-gray-300 text-sm">{property.subtitle}</p>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-orange-500">{property.price}</span>
                    {property.originalPrice && (
                      <>
                        <span className="text-lg text-gray-400 line-through ml-2">{property.originalPrice}</span>
                        <Badge className="bg-orange-500 text-white ml-2">{property.discount}</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300">
                  Book Property
                </Button>
                <Button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 hover:border-orange-500/50">
                  <Play className="w-4 h-4 mr-2" />
                  Take a Live Tour
                </Button>
              </div>
            </div>
          </div> */}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 text-white mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-white">
                  {property.propertyName}
                </h1>
                {property.verificationStatus === "VERIFIED" && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">
                  {property.addressText}
                </p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-orange-500 to-orange-400 bg-clip-text text-white">
                  {getMinRent()}/month
                </span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {property.genderAllowed}
                  </Badge>
                  {property.isBrandManaged && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {property.brandName}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
              <Button
                className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm cursor-pointer h-10 sm:h-11"
                onClick={handleShowPropertyInterest}
              >
                <Play className="w-4 h-4 mr-2" />
                Show Interest
              </Button>
              <Button 
                className="bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white border border-white/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 shadow-lg font-medium text-sm sm:text-base h-10 sm:h-11"
                onClick={() => {
                  const lat = parseFloat(property.lat);
                  const lng = parseFloat(property.lng);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 sm:gap-8">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              {/* Overview Section */}
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl ">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    Overview
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {property.description ||
                        "Welcome to our premium PG/Hostel accommodation. We provide comfortable and affordable living spaces with modern amenities."}
                    </p>
                  </div>
                </div>

                {/* Room Types & Pricing Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-orange-500 text-lg sm:text-2xl font-bold flex items-center gap-2">
                      <Bed className="w-5 h-5 sm:w-6 sm:h-6" />
                      Room Types & Pricing
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-8 w-8 p-0 rounded-full"
                        onClick={() => {
                          if (roomScrollRef.current) {
                            roomScrollRef.current.scrollBy({
                              left: -300,
                              behavior: "smooth",
                            });
                          }
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-8 w-8 p-0 rounded-full"
                        onClick={() => {
                          if (roomScrollRef.current) {
                            roomScrollRef.current.scrollBy({
                              left: 300,
                              behavior: "smooth",
                            });
                          }
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Horizontal Scroll Container */}
                  <div className="relative">
                    <div
                      ref={roomScrollRef}
                      className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                    >
                      {property.roomTypes.map((room) => (
                        <RoomTypeCard key={room.id} room={room} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Common Amenities Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    Amenities
                  </h3>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {property.amenities?.map((amenity, index) => {
                      // Map icon names from API to Lucide icons
                      const getIcon = (iconName) => {
                        const iconMap = {
                          CarIcon: CarIcon,
                          Shield: Shield,
                          Building2: Building2,
                          Users: Users,
                          Wifi: Wifi,
                          Waves: Waves,
                          Trees: Trees,
                        };
                        return iconMap[iconName] || Building2;
                      };
                      const IconComponent = getIcon(amenity.icon);

                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg transition-all duration-300 group ${
                            amenity.available !== false
                              ? "bg-white/5 hover:bg-white/10"
                              : "bg-white/5 opacity-50"
                          }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform ${
                              amenity.available !== false
                                ? "text-orange-500"
                                : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-xs sm:text-sm font-medium ${
                              amenity.available !== false
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          >
                            {amenity.name}
                          </span>
                          {amenity.available !== false && (
                            <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Food & Mess Section */}
                {property.foodMess?.available && (
                  <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                    <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                      Food & Mess
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                      <Card className="bg-linear-to-br from-slate-700/60 to-slate-800/60 border-white/10 backdrop-blur-xl">
                        <CardContent className="p-4 sm:p-5">
                          <h4 className="font-semibold text-white mb-4 text-sm sm:text-base">
                            Meal Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">
                                Available Meals
                              </span>
                              <div className="flex gap-1">
                                {property.foodMess.meals.map((meal, idx) => (
                                  <Badge
                                    key={idx}
                                    className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                                  >
                                    {meal}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Separator className="bg-white/10" />
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">
                                Food Type
                              </span>
                              <span className="text-white font-semibold text-xs sm:text-sm">
                                {property.foodMess.foodType}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">
                                Cooking Allowed
                              </span>
                              <span className="text-white font-semibold text-xs sm:text-sm">
                                {property.foodMess.cookingAllowed
                                  ? "Yes"
                                  : "No"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">
                                Tiffin Service
                              </span>
                              <span className="text-white font-semibold text-xs sm:text-sm">
                                {property.foodMess.tiffinService
                                  ? "Available"
                                  : "Not Available"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">
                                RO Water
                              </span>
                              <span className="text-white font-semibold text-xs sm:text-sm">
                                {property.foodMess.roWater
                                  ? "Available"
                                  : "Not Available"}
                              </span>
                            </div>
                            
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-linear-to-br from-slate-700/60 to-slate-800/60 border-white/10 backdrop-blur-xl">
                        <CardContent className="p-4 sm:p-5">
                          <h4 className="font-semibold text-white mb-4 text-sm sm:text-base">
                            Meal Timings
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                              <span className="text-gray-400 text-xs sm:text-sm">
                                Breakfast
                              </span>
                              <span className="text-white font-semibold text-xs sm:text-sm">
                                {property.foodMess.weeklyMenu?.[0]
                                  ?.breakfastTiming || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                              <span className="text-gray-400 text-xs sm:text-sm">
                                Lunch
                              </span>
                              <span className="text-white font-semibold text-xs sm:text-sm">
                                {property.foodMess.weeklyMenu?.[0]
                                  ?.lunchTiming || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                              <span className="text-gray-400 text-xs sm:text-sm">
                                Dinner
                              </span>
                              <span className="text-white font-semibold text-xs sm:text-sm">
                                {property.foodMess.weeklyMenu?.[0]
                                  ?.dinnerTiming || "N/A"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Weekly Menu Carousel */}
                    {property.foodMess.weeklyMenu &&
                      property.foodMess.weeklyMenu.length > 0 && (
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-semibold text-sm sm:text-base">
                              Weekly Menu
                            </h4>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-8 w-8 p-0 rounded-full"
                                onClick={() =>
                                  setCurrentMenuDayIndex(
                                    (prev) =>
                                      (prev -
                                        1 +
                                        property.foodMess.weeklyMenu.length) %
                                      property.foodMess.weeklyMenu.length
                                  )
                                }
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-8 w-8 p-0 rounded-full"
                                onClick={() =>
                                  setCurrentMenuDayIndex(
                                    (prev) =>
                                      (prev + 1) %
                                      property.foodMess.weeklyMenu.length
                                  )
                                }
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Carousel Container */}
                          <div className="overflow-hidden">
                            <div
                              className="flex transition-transform duration-700 ease-in-out"
                              style={{
                                transform: `translateX(-${
                                  currentMenuDayIndex * 100
                                }%)`,
                              }}
                            >
                              {property.foodMess.weeklyMenu.map(
                                (dayMenu, idx) => (
                                  <div key={idx} className="min-w-full">
                                    <Card className="bg-linear-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-xl border-2 border-orange-500/30 shadow-xl shadow-orange-500/10">
                                      <CardContent className="p-4 sm:p-6">
                                        <div className="flex items-center justify-between mb-4">
                                          <h5 className="text-orange-500 font-bold text-base sm:text-xl flex items-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            {dayMenu.day}
                                          </h5>
                                          <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">
                                            Day {idx + 1}/7
                                          </Badge>
                                        </div>

                                        <div className="grid sm:grid-cols-3 gap-4">
                                          {/* Breakfast */}
                                          <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-3">
                                              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-orange-500 text-xs font-bold">
                                                  B
                                                </span>
                                              </div>
                                              <p className="text-white font-semibold text-sm sm:text-base">
                                                Breakfast
                                              </p>
                                            </div>
                                            <div className="space-y-2">
                                              <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                                                <p className="text-xs text-green-400 font-medium mb-1.5 flex items-center gap-1">
                                                  <CheckCircle className="w-3 h-3" />
                                                  Veg Options
                                                </p>
                                                <ul className="text-xs text-gray-300 space-y-1">
                                                  {dayMenu.breakfast?.veg?.map(
                                                    (item, i) => (
                                                      <li
                                                        key={i}
                                                        className="flex items-start gap-1.5"
                                                      >
                                                        <span className="text-orange-500 mt-0.5">
                                                          •
                                                        </span>
                                                        <span>{item}</span>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                              {dayMenu.breakfast?.nonVeg && (
                                                <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                                                  <p className="text-xs text-red-400 font-medium mb-1.5 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Non-Veg Options
                                                  </p>
                                                  <ul className="text-xs text-gray-300 space-y-1">
                                                    {dayMenu.breakfast?.nonVeg?.map(
                                                      (item, i) => (
                                                        <li
                                                          key={i}
                                                          className="flex items-start gap-1.5"
                                                        >
                                                          <span className="text-orange-500 mt-0.5">
                                                            •
                                                          </span>
                                                          <span>{item}</span>
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          {/* Lunch */}
                                          <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-3">
                                              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-orange-500 text-xs font-bold">
                                                  L
                                                </span>
                                              </div>
                                              <p className="text-white font-semibold text-sm sm:text-base">
                                                Lunch
                                              </p>
                                            </div>
                                            <div className="space-y-2">
                                              <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                                                <p className="text-xs text-green-400 font-medium mb-1.5 flex items-center gap-1">
                                                  <CheckCircle className="w-3 h-3" />
                                                  Veg Options
                                                </p>
                                                <ul className="text-xs text-gray-300 space-y-1">
                                                  {dayMenu.lunch?.veg?.map(
                                                    (item, i) => (
                                                      <li
                                                        key={i}
                                                        className="flex items-start gap-1.5"
                                                      >
                                                        <span className="text-orange-500 mt-0.5">
                                                          •
                                                        </span>
                                                        <span>{item}</span>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                              {dayMenu.lunch?.nonVeg && (
                                                <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                                                  <p className="text-xs text-red-400 font-medium mb-1.5 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Non-Veg Options
                                                  </p>
                                                  <ul className="text-xs text-gray-300 space-y-1">
                                                    {dayMenu.lunch?.nonVeg?.map(
                                                      (item, i) => (
                                                        <li
                                                          key={i}
                                                          className="flex items-start gap-1.5"
                                                        >
                                                          <span className="text-orange-500 mt-0.5">
                                                            •
                                                          </span>
                                                          <span>{item}</span>
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          {/* Dinner */}
                                          <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-3">
                                              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-orange-500 text-xs font-bold">
                                                  D
                                                </span>
                                              </div>
                                              <p className="text-white font-semibold text-sm sm:text-base">
                                                Dinner
                                              </p>
                                            </div>
                                            <div className="space-y-2">
                                              <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                                                <p className="text-xs text-green-400 font-medium mb-1.5 flex items-center gap-1">
                                                  <CheckCircle className="w-3 h-3" />
                                                  Veg Options
                                                </p>
                                                <ul className="text-xs text-gray-300 space-y-1">
                                                  {dayMenu.dinner?.veg?.map(
                                                    (item, i) => (
                                                      <li
                                                        key={i}
                                                        className="flex items-start gap-1.5"
                                                      >
                                                        <span className="text-orange-500 mt-0.5">
                                                          •
                                                        </span>
                                                        <span>{item}</span>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                              {dayMenu.dinner?.nonVeg && (
                                                <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                                                  <p className="text-xs text-red-400 font-medium mb-1.5 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Non-Veg Options
                                                  </p>
                                                  <ul className="text-xs text-gray-300 space-y-1">
                                                    {dayMenu.dinner?.nonVeg?.map(
                                                      (item, i) => (
                                                        <li
                                                          key={i}
                                                          className="flex items-start gap-1.5"
                                                        >
                                                          <span className="text-orange-500 mt-0.5">
                                                            •
                                                          </span>
                                                          <span>{item}</span>
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Carousel Indicators */}
                          <div className="flex justify-center gap-2 mt-4">
                            {property.foodMess.weeklyMenu.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentMenuDayIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  index === currentMenuDayIndex
                                    ? "bg-orange-500 w-8 shadow-lg shadow-orange-500/50"
                                    : "bg-white/30 hover:bg-white/50 w-2"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Rules & Policies Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                    Rules & Policies
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {property.rules.map((rule, index) =>
                      rule.key.toLowerCase() === "other" ? (
                        // Special handling for "Other" type rules - display as full-width text block
                        <div
                          key={index}
                          className="sm:col-span-2 p-3 sm:p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/15 transition-all duration-300"
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-orange-400 text-xs sm:text-sm font-semibold block mb-1">
                                Additional Information
                              </span>
                              <p className="text-white text-xs sm:text-sm leading-relaxed">
                                {rule.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Standard rule display
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                        >
                          <span className="text-gray-400 text-xs sm:text-sm">
                            {rule.key}
                          </span>
                          <span
                            className={`font-semibold text-xs sm:text-sm ${
                              rule.value.toLowerCase() === "yes"
                                ? "text-green-400"
                                : rule.value.toLowerCase() === "no"
                                ? "text-red-400"
                                : "text-white"
                            }`}
                          >
                            {rule.value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

  

                {/* Location & Nearby Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                    Location & Nearby
                  </h3>

                  {/* Map */}
                  <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-white/10 shadow-xl">
                    <iframe
                      src={`https://www.google.com/maps?q=${parseFloat(
                        property.lat
                      )},${parseFloat(property.lng)}&z=15&output=embed`}
                      width="600"
                      height="450"
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${property.propertyName}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Contact Property Manager */}
              <Card className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-orange-500 text-base sm:text-lg font-bold flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Property
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-orange-500/50">
                      <AvatarImage
                        src={
                          property.user?.profileImage ||
                          "/api/placeholder/60/60"
                        }
                      />
                      <AvatarFallback className="bg-linear-to-br from-orange-500 to-orange-600 text-white font-bold">
                        {property.user?.firstName?.[0]}
                        {property.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm sm:text-base">
                        {property.user
                          ? `${property.user.firstName} ${property.user.lastName}`
                          : "Property Owner"}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {property.isBrandManaged
                          ? `${property.brandName} - Owner`
                          : "Property Owner"}
                      </p> 
                    </div>
                  </div>
                  {/* Availability Status */}
                  {/* <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 text-xs sm:text-sm font-medium">Available Beds</span>
                      <span className="text-green-400 text-sm sm:text-base font-bold">
                        {(() => { const beds = getTotalBeds(); return `${beds.available}/${beds.total}`; })()}
                      </span>
                    </div>
                  </div> */}
                  <div className="flex gap-4 flex-wrap  ">
                    {/* <Button className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Phone className="w-4 h-4 mr-2" />
                      Call {property.user?.phone || 'Owner'}
                    </Button> */}
                    {/* <Button    className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Mail className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button> */}
                    {/* <Button    className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Visit
                    </Button> */}
                    {/* <Button   className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Play className="w-4 h-4 mr-2" />
                      Virtual Tour
                    </Button> */}

                    <Button
                      className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm cursor-pointer w-full"
                      onClick={handleShowPropertyInterest}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Show Interest
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Support */}
              {/* <Card className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                <CardHeader className="text-white font-medium  text-sm sm:text-base leading-relaxed">
                     Need help? Our support team is available 24x7! 
                </CardHeader>
                <CardContent>
                    <Button  className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-102 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Mail className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                 </CardContent>
              </Card> */}
            </div>
          </div>
        </div>

        {/* Room Type Selection Dialog */}
        <RoomTypeSelectionDialog
          isOpen={isRoomSelectionOpen}
          onOpenChange={setIsRoomSelectionOpen}
          roomTypes={property?.roomTypes || []}
          onConfirm={handleRoomSelectionConfirm}
        />

        {/* Interest Dialog */}
        <InterestDialog
          isOpen={isInterestDialogOpen}
          onOpenChange={setIsInterestDialogOpen}
          propertyName={property?.propertyName}
          selectedRooms={selectedRooms.length > 0 ? selectedRooms : null}
          propertyDetails={
            selectedRooms.length === 0
              ? [
                  { label: "Property", value: property?.propertyName },
                  {
                    label: "Starting From",
                    value: getMinRent(),
                    className: "text-orange-400",
                  },
                  {
                    label: "Available Beds",
                    value: (() => {
                      const beds = getTotalBeds();
                      return `${beds.available}/${beds.total}`;
                    })(),
                    className: "text-green-400",
                  },
                ]
              : null
          }
        />
      </div>
    </div>
  );
}
