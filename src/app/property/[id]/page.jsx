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
  Loader2,
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
import useLocationStore from "@/stores/locationStore";
import { PROPERTIES_DATA } from "@/constants/propertyData";
import { X } from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params?.id;

  // Fetch property data state
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Zustand store for global location state
  const location = useLocationStore((state) => state.location);
  const searchResult = useLocationStore((state) => state.searchResult);
  const updateFromSearchResult = useLocationStore((state) => state.updateFromSearchResult);

  // State management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const [sheetMapCenter, setSheetMapCenter] = useState({
    lat: 19.0176,
    lng: 72.8562,
  });
  const [sheetMapMarker, setSheetMapMarker] = useState(null);
  const scrollRef = useRef(null);

  // Fetch property data from API
  useEffect(() => {
    if (!propertyId) return;

    const fetchPropertyData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/property/${propertyId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property data');
        }
        const result = await response.json();
        if (result.success && result.data) {
          setPropertyData(result.data);
        } else {
          throw new Error(result.message || 'Failed to load property');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  // Helper function to map features to amenities with icons
  const mapFeaturesToAmenities = (features) => {
    const featureIconMap = {
      'cctv_surveillance': { icon: Shield, name: "CCTV Surveillance" },
      'visitor_parking': { icon: CarIcon, name: "Visitor Parking" },
      'gym': { icon: Dumbbell, name: "Gymnasium" },
      'swimming_pool': { icon: Waves, name: "Swimming Pool" },
      'jogging_track': { icon: Trees, name: "Jogging Track" },
      'gated_society': { icon: Shield, name: "Gated Society" },
      'children_play_area': { icon: Users, name: "Children Play Area" },
      'water_supply_247': { icon: Waves, name: "24x7 Water Supply" },
      'maintenance_staff': { icon: Users, name: "Maintenance Staff" },
      'fire_safety': { icon: Shield, name: "Fire Safety" },
      'power_backup': { icon: Shield, name: "Power Backup" },
      'piped_gas': { icon: Shield, name: "Piped Gas" }
    };

    return features.map(feature => 
      featureIconMap[feature] || { icon: Shield, name: feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }
    );
  };

  // Helper function to format price
  const formatPrice = (pricing) => {
    if (!pricing || pricing.length === 0) return 'Price on Request';
    const askingPrice = pricing.find(p => p.type === 'asking_price');
    if (!askingPrice) return 'Price on Request';
    
    const price = askingPrice.value;
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Helper function to format area
  const formatArea = (carpetArea, superArea) => {
    if (superArea) return `${superArea} sq.ft`;
    if (carpetArea) return `${carpetArea} sq.ft`;
    return 'N/A';
  };

  // Map API data to component structure
  const property = propertyData ? {
    id: propertyData.propertyId,
    title: propertyData.title || propertyData.propertyName,
    subtitle: propertyData.addressText || `${propertyData.locality}, ${propertyData.city}`,
    price: formatPrice(propertyData.pricing),
    configuration: propertyData.bedrooms ? `${propertyData.bedrooms} BHK` : 'N/A',
    status: propertyData.possessionStatus === 'ready' ? 'Ready to Move' : 'Under Construction',
    possession: propertyData.availableFrom ? `Available from ${new Date(propertyData.availableFrom).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : 'Immediate',
    avgPrice: propertyData.pricing && propertyData.carpetArea ? 
      `₹${Math.round(propertyData.pricing.find(p => p.type === 'asking_price')?.value / propertyData.carpetArea).toLocaleString('en-IN')}/sq.ft` : 'N/A',
    area: formatArea(propertyData.carpetArea, propertyData.superArea),
    carpetArea: propertyData.carpetArea,
    superArea: propertyData.superArea,
    description: propertyData.description,
    images: propertyData.mediaData?.length > 0 ? 
      propertyData.mediaData.map(media => media.url) : 
      ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"],
    amenities: mapFeaturesToAmenities(propertyData.features || []),
    features: propertyData.features || [],
    highlights: [
      propertyData.description || "Premium residential property",
      propertyData.projectName ? `Part of ${propertyData.projectName}` : null,
      propertyData.furnishingStatus ? `${propertyData.furnishingStatus.charAt(0).toUpperCase() + propertyData.furnishingStatus.slice(1)} Furnished` : null,
      propertyData.ownershipType ? `${propertyData.ownershipType.charAt(0).toUpperCase() + propertyData.ownershipType.slice(1)} Ownership` : null,
      propertyData.isGated ? "Gated Community" : null,
      propertyData.fireSafety ? "Fire Safety Systems" : null,
      propertyData.petFriendly ? "Pet Friendly" : null,
    ].filter(Boolean).slice(0, 6),
    bedrooms: propertyData.bedrooms,
    bathrooms: propertyData.bathrooms,
    facing: propertyData.facing,
    view: propertyData.view,
    floorNumber: propertyData.floorNumber,
    totalFloors: propertyData.totalFloors,
    unitNumber: propertyData.unitNumber,
    towerName: propertyData.towerName,
    isUnitNumberPrivate: propertyData.isUnitNumberPrivate,
    ageOfProperty: propertyData.ageOfProperty,
    furnishingStatus: propertyData.furnishingStatus,
    furnishingDetails: propertyData.furnishingDetails,
    projectName: propertyData.projectName,
    propertyType: propertyData.propertyType,
    listingType: propertyData.listingType,
    propertyPosition: propertyData.propertyPosition,
    ownershipType: propertyData.ownershipType,
    measurementMethod: propertyData.measurementMethod,
    areaConfig: propertyData.areaConfig,
    isPriceNegotiable: propertyData.isPriceNegotiable,
    isPriceVerified: propertyData.isPriceVerified,
    isNewProperty: propertyData.isNewProperty,
    isGated: propertyData.isGated,
    fireSafety: propertyData.fireSafety,
    hasIntercom: propertyData.hasIntercom,
    petFriendly: propertyData.petFriendly,
    hasEmergencyExit: propertyData.hasEmergencyExit,
    flooringTypes: propertyData.flooringTypes,
    smartHomeDevices: propertyData.smartHomeDevices,
    reraIds: propertyData.reraIds,
    pricing: propertyData.pricing,
    possessionDate: propertyData.possessionDate,
    showMapExact: propertyData.showMapExact,
    city: propertyData.city,
    locality: propertyData.locality,
    landmark: propertyData.landmark,
    developer: {
      name: propertyData.creator?.derivedUserName || "Property Owner",
      logo: "/api/placeholder/60/60",
      rating: 4.5,
      projects: 1
    },
    agent: {
      name: propertyData.creator?.derivedUserName || "Property Owner",
      role: "Property Owner",
      image: "/api/placeholder/60/60",
      phone: propertyData.creator?.phone || "Contact via platform",
      email: propertyData.creator?.email || "",
      verificationStatus: propertyData.creator?.verificationStatus
    },
    coordinates: {
      lat: propertyData.lat || 19.0176,
      lng: propertyData.lng || 72.8562
    },
    createdDate: propertyData.v_created_date,
    createdTime: propertyData.v_created_time,
    updatedDate: propertyData.v_updated_date,
    updatedTime: propertyData.v_updated_time
  } : null;

  // Quick Stats data
  const quickStats = property ? [
    {
      icon: Building2,
      label: "Property Type",
      value: property.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) : 'N/A'
    },
    {
      icon: IndianRupee,
      label: "Listing Type",
      value: property.listingType ? property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1) : 'N/A'
    },
    {
      icon: Building2,
      label: "Configuration",
      value: property.configuration
    },
    {
      icon: Square,
      label: "Carpet Area",
      value: property.carpetArea ? `${property.carpetArea} sq.ft` : 'N/A'
    },
    {
      icon: Square,
      label: "Super Area",
      value: property.superArea ? `${property.superArea} sq.ft` : 'N/A'
    },
    {
      icon: Calendar,
      label: "Status",
      value: property.status
    },
    {
      icon: IndianRupee,
      label: "Avg. Price/sq.ft",
      value: property.avgPrice
    },
    {
      icon: Bed,
      label: "Bedrooms",
      value: property.bedrooms || 'N/A'
    },
    {
      icon: Bath,
      label: "Bathrooms",
      value: property.bathrooms || 'N/A'
    },
    {
      icon: Building2,
      label: "Floor",
      value: property.floorNumber ? `${property.floorNumber}/${property.totalFloors}` : 'N/A'
    },
    {
      icon: Building2,
      label: "Facing",
      value: property.facing ? property.facing.charAt(0).toUpperCase() + property.facing.slice(1) : 'N/A'
    },
    {
      icon: Calendar,
      label: "Age",
      value: property.ageOfProperty ? `${property.ageOfProperty} years` : property.isNewProperty ? 'New' : 'N/A'
    }
  ] : [];



  const nextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const openImageGallery = (index = 0) => {
    setGalleryImageIndex(index);
    setIsImageGalleryOpen(true);
  };

  const nextGalleryImage = () => {
    if (!property) return;
    setGalleryImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevGalleryImage = () => {
    if (!property) return;
    setGalleryImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  // Handle opening location sheet
  const handleOpenLocationSheet = () => {
    if (!property) return;
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
        lat: property.coordinates.lat,
        lng: property.coordinates.lng,
      });
      setSheetMapMarker({
        lat: property.coordinates.lat,
        lng: property.coordinates.lng,
        draggable: true,
      });
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

 

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-orange-500 hover:bg-orange-600"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No property data
  if (!property) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Property not found</p>
        </div>
      </div>
    );
  }

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
          <SheetContent side="full" className="bg-black/95 backdrop-blur-xl border-none p-0 overflow-hidden [&>button]:hidden">
            <div className="h-full flex flex-col">
              {/* Header */}
              <SheetHeader className="p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <SheetTitle className="text-white text-lg sm:text-xl font-bold text-left">
                      {property.title}
                    </SheetTitle>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 text-left">
                      {galleryImageIndex + 1} / {property.images.length}
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
                    <Image
                      src={property.images[galleryImageIndex]}
                      alt={`${property.title} - Image ${galleryImageIndex + 1}`}
                      fill
                      className="object-contain"
                      priority
                    />
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
              <div className="p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === galleryImageIndex
                          ? 'ring-2 ring-orange-500 scale-110 shadow-lg shadow-orange-500/50'
                          : 'ring-1 ring-white/20 hover:ring-white/50 opacity-60 hover:opacity-100'
                      }`}
                      onClick={() => setGalleryImageIndex(index)}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
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
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-orange-400 transition-all duration-300 group">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Search</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-orange-400 transition-all duration-300 hover:scale-110">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`transition-all duration-300 hover:scale-110 ${isLiked ? 'text-orange-500' : 'text-white hover:text-orange-400 hover:bg-white/10'}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </header>

        {/* Hero Section with Image Collage */}
        <div className="relative mt-6 sm:mt-12 mx-3 sm:mx-4 lg:mx-6">
          {/* Image Collage Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-1 sm:gap-2 h-64 sm:h-96 lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10">
            {/* Main large image */}
            <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setCurrentImageIndex(0)}>
              <Image 
                src={property.images[currentImageIndex]} 
                alt={property.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-500"></div>
              {/* Main image indicator */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border border-white/10">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>
            
            {/* Smaller images */}
            {property.images.slice(1, 5).map((image, index) => {
              const imageIndex = index + 1;
              const isActive = currentImageIndex === imageIndex;
              return (
                <div 
                  key={imageIndex} 
                  className={`relative group cursor-pointer overflow-hidden rounded-md transition-all duration-300 ${
                    isActive ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/50' : 'hover:ring-2 hover:ring-white/30'
                  }`}
                  onClick={() => setCurrentImageIndex(imageIndex)}
                >
                  <Image 
                    src={image} 
                    alt={`${property.title} - Image ${imageIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                  {/* Show "View all photos" on last image if there are more images */}
                  {index === 3 && property.images.length > 5 && (
                    <div 
                      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/80 transition-all duration-300 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageGallery(0);
                      }}
                    >
                      <div className="text-white text-center">
                        <Maximize2 className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1" />
                        <p className="text-xs sm:text-sm font-medium">+{property.images.length - 5} more</p>
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
            {property.images.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-orange-500 w-6 sm:w-8 shadow-lg shadow-orange-500/50' : 'bg-white/40 hover:bg-white/70 w-1.5 sm:w-2'
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
        <div className="container mx-auto py-6 px-3 sm:px-4 lg:px-6 sm:py-8">

             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 text-white mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-white">{property.title}</h1>
                  {property.isNewProperty && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      NEW
                    </Badge>
                  )}
                </div>
                
                {/* Property Type & Listing Type Badges */}
                <div className="flex items-center gap-2 mb-3">
                  {property.propertyType && (
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs capitalize">
                      {property.propertyType}
                    </Badge>
                  )}
                  {property.listingType && (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs capitalize">
                      For {property.listingType}
                    </Badge>
                  )}
                </div>

                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 shrink-0" />
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">{property.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl  font-bold bg-linear-to-r from-orange-500 to-orange-400 bg-clip-text text-white">{property.price}</span>
                  {property.isPriceNegotiable && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      Negotiable
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                <Button className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 border-none font-semibold text-sm sm:text-base h-10 sm:h-11">
                  Book Property
                </Button>
                <Button className="bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white border border-white/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 shadow-lg font-medium text-sm sm:text-base h-10 sm:h-11">
                  <Play className="w-4 h-4 mr-2" />
                  Take a Live Tour
                </Button>
              </div>
            </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">

              {/* Overview Section */}
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl ">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                     Overview
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {property.description || 'Premium residential property with modern amenities and excellent connectivity.'}
                    </p>
                    
                    {/* Property Details Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {/* Quick Stats Information */}
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Property Type</p>
                        <p className="font-semibold text-white text-sm">{property.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) : 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Listing Type</p>
                        <p className="font-semibold text-white text-sm">{property.listingType ? property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1) : 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Configuration</p>
                        <p className="font-semibold text-white text-sm">{property.configuration}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Carpet Area</p>
                        <p className="font-semibold text-white text-sm">{property.carpetArea ? `${property.carpetArea} sq.ft` : 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Super Area</p>
                        <p className="font-semibold text-white text-sm">{property.superArea ? `${property.superArea} sq.ft` : 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Property Status</p>
                        <p className="font-semibold text-white text-sm">{property.status}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Avg. Price/sq.ft</p>
                        <p className="font-semibold text-white text-sm">{property.avgPrice}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Bedrooms</p>
                        <p className="font-semibold text-white text-sm">{property.bedrooms || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Bathrooms</p>
                        <p className="font-semibold text-white text-sm">{property.bathrooms || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Floor</p>
                        <p className="font-semibold text-white text-sm">{property.floorNumber ? `${property.floorNumber}/${property.totalFloors}` : 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                        <p className="text-xs text-gray-400 mb-1">Age of Property</p>
                        <p className="font-semibold text-white text-sm">{property.ageOfProperty ? `${property.ageOfProperty} years` : property.isNewProperty ? 'New' : 'N/A'}</p>
                      </div>
                      {property.facing && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all">
                          <p className="text-xs text-gray-400 mb-1">Facing</p>
                          <p className="font-semibold text-white text-sm capitalize">{property.facing}</p>
                        </div>
                      )}
                      {property.view && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1">View</p>
                          <p className="font-semibold text-white text-sm capitalize">{property.view.replace(/_/g, ' ')}</p>
                        </div>
                      )}
                      {property.towerName && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1">Tower</p>
                          <p className="font-semibold text-white text-sm">{property.towerName}</p>
                        </div>
                      )}
                      {property.unitNumber && !property.isUnitNumberPrivate && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1">Unit Number</p>
                          <p className="font-semibold text-white text-sm">{property.unitNumber}</p>
                        </div>
                      )}
                      {property.propertyPosition && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1">Position</p>
                          <p className="font-semibold text-white text-sm capitalize">{property.propertyPosition}</p>
                        </div>
                      )}
                      {property.ownershipType && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1">Ownership</p>
                          <p className="font-semibold text-white text-sm capitalize">{property.ownershipType}</p>
                        </div>
                      )}
                      {property.measurementMethod && (
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1">Measurement Method</p>
                          <p className="font-semibold text-white text-sm capitalize">{property.measurementMethod.replace(/_/g, ' ')}</p>
                        </div>
                      )}
                      {property.areaConfig && property.areaConfig.length > 0 && property.areaConfig.map((area, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1 capitalize">{area.type} Area</p>
                          <p className="font-semibold text-white text-sm">{area.value} sq.ft</p>
                        </div>
                      ))}
                    </div>

                    {property.furnishingStatus && (
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-2">Furnishing Status</p>
                        <p className="font-semibold text-white text-sm capitalize mb-3">{property.furnishingStatus} Furnished</p>
                        
                        {/* Furnishing Details */}
                        {property.furnishingDetails && Object.keys(property.furnishingDetails).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-xs text-gray-400 mb-2">Includes:</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(property.furnishingDetails).map(([key, value]) => 
                                value && (
                                  <Badge key={key} variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Flooring & Interiors Section */}
                {(property.flooringTypes?.length > 0 || property.smartHomeDevices?.length > 0) && (
                  <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                    <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                      Interiors & Smart Features
                    </h3>
                    
                    {property.flooringTypes?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2 font-semibold">Flooring Types</p>
                        <div className="flex flex-wrap gap-2">
                          {property.flooringTypes.map((type, index) => (
                            <Badge key={index} className="bg-white/5 text-white border-white/20 hover:bg-white/10">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {property.smartHomeDevices?.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-3 font-semibold">Smart Home Features</p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {property.smartHomeDevices.map((device, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-orange-500" />
                              <span className="text-white text-xs capitalize">{device.replace(/_/g, ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Security & Safety Features */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    Security & Safety
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {property.isGated && (
                      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-white text-sm">Gated Society</span>
                      </div>
                    )}
                    {property.fireSafety && (
                      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-white text-sm">Fire Safety</span>
                      </div>
                    )}
                    {property.hasIntercom && (
                      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-white text-sm">Intercom Facility</span>
                      </div>
                    )}
                    {property.hasEmergencyExit && (
                      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-white text-sm">Emergency Exit</span>
                      </div>
                    )}
                    {property.petFriendly && (
                      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-white text-sm">Pet Friendly</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* RERA Information */}
                {property.reraIds && property.reraIds.length > 0 && (
                  <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                    <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                      RERA Information
                    </h3>
                    <div className="space-y-2">
                      {property.reraIds.map((rera, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs text-gray-400 mb-1">RERA ID</p>
                          <p className="font-semibold text-white text-sm font-mono">{rera.id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

 

                {/* Amenities Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    Amenities & Features
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {property.amenities.length > 0 ? (
                      property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                          <amenity.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                          <span className="text-white text-xs sm:text-sm font-medium">{amenity.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm col-span-3">No amenities listed</p>
                    )}
                  </div>
                </div>

                {/* Price & Payment Details Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    Pricing Details
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {/* Main Price Display */}
                    <div className="p-4 sm:p-5 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Asking Price</h4>
                          <p className="text-xl sm:text-2xl font-bold bg-linear-to-r from-orange-500 to-orange-400 bg-clip-text text-white">{property.price}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {property.isPriceNegotiable && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                              Negotiable
                            </Badge>
                          )}
                          {property.isPriceVerified && (
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Price Breakdown */}
                      {property.pricing && property.pricing.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs text-gray-400 mb-2">Price Breakdown</p>
                          <div className="space-y-2">
                            {property.pricing.map((price, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 capitalize">{price.type.replace(/_/g, ' ')}:</span>
                                <span className="text-white font-semibold">
                                  ₹{(price.value).toLocaleString('en-IN')}
                                  {price.unit !== 'total' && ` (${price.unit})`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Average Price per sq.ft */}
                    <div className="p-4 sm:p-5 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all duration-300">
                      <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Average Price per sq.ft</h4>
                      <p className="text-lg sm:text-xl font-bold bg-linear-to-r from-orange-500 to-orange-400 bg-clip-text text-white">{property.avgPrice}</p>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    Location
                  </h3>
                  
                  {/* Location Details */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {property.city && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">City</p>
                        <p className="font-semibold text-white text-sm">{property.city}</p>
                      </div>
                    )}
                    {property.locality && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">Locality</p>
                        <p className="font-semibold text-white text-sm">{property.locality}</p>
                      </div>
                    )}
                    {property.landmark && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">Landmark</p>
                        <p className="font-semibold text-white text-sm">{property.landmark}</p>
                      </div>
                    )}
                    {property.projectName && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400 mb-1">Project Name</p>
                        <p className="font-semibold text-white text-sm">{property.projectName}</p>
                      </div>
                    )}
                  </div>

                  {/* Map */}
                  <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-white/10 shadow-xl">
                    <iframe 
                      src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&z=15&output=embed`} 
                      width="600" 
                      height="450" 
                      className="w-full h-full"   
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
 
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Property Owner/Creator Info */}
              <Card className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-orange-500 text-base sm:text-lg font-bold flex items-center gap-2">
                    <div className="w-1 h-5 bg-linear-to-b from-orange-500 to-orange-600 rounded-full"></div>
                    Property Owner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-orange-500/50">
                      <AvatarImage src={property.agent.image} />
                      <AvatarFallback className="bg-linear-to-br from-orange-500 to-orange-600 text-white font-bold">
                        {property.agent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm sm:text-base mb-1">{property.agent.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-400">{property.agent.role}</p>
                      {property.agent.verificationStatus && (
                        <Badge 
                          className={`mt-1 text-xs ${
                            property.agent.verificationStatus === 'APPROVED' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {property.agent.verificationStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  {property.agent.phone && (
                    <div className="p-3 bg-white/5 rounded-lg mb-2">
                      <p className="text-xs text-gray-400 mb-1">Phone</p>
                      <p className="text-sm text-white font-medium">{property.agent.phone}</p>
                    </div>
                  )}
                  {property.agent.email && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Email</p>
                      <p className="text-sm text-white font-medium break-all">{property.agent.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Listing Information */}
              <Card className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-orange-500 text-base sm:text-lg font-bold flex items-center gap-2">
                    <div className="w-1 h-5 bg-linear-to-b from-orange-500 to-orange-600 rounded-full"></div>
                    Listing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                    <span className="text-xs text-gray-400">Property ID</span>
                    <span className="text-sm text-white font-medium">#{property.id}</span>
                  </div>
                  {property.createdDate && (
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-xs text-gray-400">Listed On</span>
                      <span className="text-sm text-white font-medium">{property.createdDate}</span>
                    </div>
                  )}
                  {property.updatedDate && (
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-xs text-gray-400">Last Updated</span>
                      <span className="text-sm text-white font-medium">{property.updatedDate}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Agent */}
              <Card className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-orange-500 text-base sm:text-lg font-bold flex items-center gap-2">
                    Schedule a Visit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4  ">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-orange-500/50">
                      <AvatarImage src={property.agent.image} />
                      <AvatarFallback className="bg-linear-to-br from-orange-500 to-orange-600 text-white font-bold">SS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm sm:text-base">{property.agent.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-400">{property.agent.role}</p>
                      <p className="text-xs text-gray-500 mt-0.5">One of our RMs will assist you.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <Button className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11">
                      <Play className="w-4 h-4 mr-2" />
                      Take a Live Tour
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 text-sm h-10 sm:h-11 font-medium">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book a Visit
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 text-sm h-10 sm:h-11 font-medium">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Support */}
              <Card className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                <CardContent className=" ">
                     <p className="text-white font-medium mb-3 text-sm sm:text-base leading-relaxed">Our team is here to help you with any questions!</p>
                    <Button className="w-full bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11">
                      Start Chat
                    </Button>
                 </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
