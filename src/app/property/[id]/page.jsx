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
import useLocationStore from "@/stores/locationStore";
import { PROPERTIES_DATA } from "@/constants/propertyData";
import { X } from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params?.id;

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
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  // Mock property data - in real app, fetch based on propertyId
  const property = {
    id: propertyId,
    title: "Lodha Solitaire",
    subtitle: "Lodha Solitaire, Maulana Azad Road, off Sant Rasta, Mahalakshmi, Mumbai, Maharashtra 400011",
    price: "₹5.65 Cr - 8.44 Cr",
    originalPrice: "₹6.2 Cr - 9.1 Cr",
    discount: "9% off",
    configuration: "3 BHK, 4 BHK",
    status: "Under construction",
    possession: "Possession in Dec 2027",
    avgPrice: "₹40,949/sq.ft",
    area: "1206 - 1727 sq.ft",
    images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1599423300746-b62533397364?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800&h=600&fit=crop"
],
    amenities: [
      { icon: Shield, name: "CCTV / Video Surveillance" },
      { icon: CarIcon, name: "Car Parking Space" }, 
      { icon: Dumbbell, name: "Gymnasium" },
      { icon: Waves, name: "Swimming Pool" },
      { icon: Trees, name: "Landscaped Gardens" },
      { icon: Wifi, name: "High Speed Internet" },
      { icon: Users, name: "Community Hall" },
      { icon: Shield, name: "24x7 Security" }
    ],
    highlights: [
      "Premium Residential Project in the heart of South Mumbai",
      "Spacious 3&amp;4 BHK luxury homes with high-end interiors and finishes",
      "World-class amenities for an exclusive living experience",
      "Eco-friendly and sustainable features for a refined lifestyle",
      "Seamless connectivity to key locations via the Eastern Express Highway"
    ],
    developer: {
      name: "Lodha Group",
      logo: "/api/placeholder/60/60",
      rating: 4.5,
      projects: 45
    },
    agent: {
      name: "Sukruth Shetty",
      role: "Relationship Manager", 
      image: "/api/placeholder/60/60",
      phone: "+91 98765 43210",
      email: "sukruth@lodha.com"
    },
    coordinates: {
      lat: 19.0176,
       lng: 72.8562
    }
  };

  // Quick Stats data
  const quickStats = [
    {
      icon: Building2,
      label: "Configuration",
      value: property.configuration
    },
    {
      icon: Square,
      label: "Area",
      value: property.area
    },
    {
      icon: Calendar,
      label: "Status",
      value: property.status
    },
    {
      icon: IndianRupee,
      label: "Avg. Price",
      value: property.avgPrice
    },
    {
      icon: Building2,
      label: "Configuration",
      value: property.configuration
    },
    {
      icon: Square,
      label: "Area",
      value: property.area
    },
    {
      icon: Calendar,
      label: "Status",
      value: property.status
    },
    {
      icon: IndianRupee,
      label: "Avg. Price",
      value: property.avgPrice
    }
  ];

  // Auto-carousel effect for Quick Stats
  useEffect(() => {
    const CAROUSEL_INTERVAL = 3000; // milliseconds between slide changes
    const totalSlides = Math.ceil(quickStats.length / 4);

    const carouselInterval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % totalSlides);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(carouselInterval);
  }, [quickStats.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const openImageGallery = (index = 0) => {
    setGalleryImageIndex(index);
    setIsImageGalleryOpen(true);
  };

  const nextGalleryImage = () => {
    setGalleryImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevGalleryImage = () => {
    setGalleryImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  // Handle opening location sheet
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
                  <div className="relative w-full h-full max-w-6xl">
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
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">

             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 text-white mb-8">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 bg-linear-to-r from-white to-gray-300 bg-clip-text text-white">{property.title}</h1>
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 shrink-0" />
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">{property.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-orange-500 to-orange-400 bg-clip-text text-white">{property.price}</span>
      
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
              {/* Quick Stats Carousel */}
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    ref={scrollRef}
                    className="flex gap-3 sm:gap-4 transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentStatIndex * 100}%)` }}
                  >
                    {Array.from({ length: Math.ceil(quickStats.length / 4) }).map((_, slideIndex) => (
                      <div key={slideIndex} className="min-w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {quickStats.slice(slideIndex * 4, (slideIndex + 1) * 4).map((stat, index) => (
                          <Card key={index} className="bg-linear-to-br from-slate-800/80 to-slate-900/80 border-white/10 backdrop-blur-xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 hover:scale-105 group">
                            <CardContent className="p-3 sm:p-4 text-center">
                              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                              <p className="text-xs sm:text-sm text-gray-400 mb-1">{stat.label}</p>
                              <p className="font-semibold text-white text-xs sm:text-sm">{stat.value}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: Math.ceil(quickStats.length / 4) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStatIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentStatIndex 
                          ? 'bg-orange-500 w-8 shadow-lg shadow-orange-500/50' 
                          : 'bg-white/30 hover:bg-white/50 w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Overview Section */}
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl ">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                     Overview
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      Lodha Solitaire is a luxury residential development in Mahalaxmi, Mumbai, offering 3 & 4 BHK Luxury Homes with world-class amenities. Designed with meticulous interior planning, high-end fixtures, and an ultra-modern architectural concept, Lodha Solitaire redefines luxury living.
                    </p>
                    
           
                    <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-5 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-white/10">
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Configuration</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{property.configuration}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Under construction</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{property.possession}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">RERA Carpet Area</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{property.area}</p>
                      </div>
                    </div>
                  </div>
                </div>

                          {/* Why consider buying this property? Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    Why consider buying this property?
                  </h3>
                   <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        {property.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{highlight}</p>
                          </div>
                        ))}
                      </div>
                </div>

                {/* Amenities Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    Amenities
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                        <amenity.icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                        <span className="text-white text-xs sm:text-sm font-medium">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Floor Plan Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    Price & Floor Plan
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-4 sm:p-5 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all duration-300">
                      <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Price Range</h4>
                      <p className="text-xl sm:text-2xl font-bold bg-linear-to-r from-orange-500 to-orange-400 bg-clip-text text-white">{property.price}</p>
                      {property.originalPrice && (
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Original Price: <span className="line-through">{property.originalPrice}</span></p>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all duration-300">
                      <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Average Price per sq.ft</h4>
                      <p className="text-lg sm:text-xl font-bold bg-linear-to-r from-orange-500 to-orange-400 bg-clip-text text-white">{property.avgPrice}</p>
                    </div>
                  </div>
                </div>

                {/* Locality Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    Locality
                  </h3>
                  <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-white/10 shadow-xl">
                    {/* <GoogleMapViewer 
                      center={property.coordinates}
                      markers={[{
                        lat: property.coordinates.lat,
                        lng: property.coordinates.lng,
                        title: property.title
                      }]}
                      zoom={15}
                    /> */}
                    
                  <iframe src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&z=15&output=embed`} width="600" height="450" className="w-full"   loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

                  </div>
 
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Developer Info */}
              <Card className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 sticky top-24">
                {/* <CardHeader>
                  <CardTitle className="text-orange-500 text-base sm:text-lg font-bold flex items-center gap-2">
                    <div className="w-1 h-5 bg-linear-to-b from-orange-500 to-orange-600 rounded-full"></div>
                    Developer
                  </CardTitle>
                </CardHeader> */}
                <CardContent>
                  <div className="flex items-center gap-3  ">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-orange-500/50">
                      <AvatarImage src={property.developer.logo} />
                      <AvatarFallback className="bg-linear-to-br from-orange-500 to-orange-600 text-white font-bold">LG</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm sm:text-base mb-1">{property.developer.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 fill-current" />
                        <span className="text-xs sm:text-sm text-gray-400">{property.developer.rating} • {property.developer.projects} Projects</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Agent */}
              <Card className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-orange-500 text-base sm:text-lg font-bold flex items-center gap-2">
                    Visit property from your home
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
