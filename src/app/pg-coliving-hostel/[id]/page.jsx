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
  const roomScrollRef = useRef(null);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [currentMenuDayIndex, setCurrentMenuDayIndex] = useState(0);

  // Mock property data - in real app, fetch based on propertyId
  const property = {
    id: propertyId,
    title: "Sky View PG & Hostel",
    subtitle: "Sky View PG, Near IIT Gate, Powai, Mumbai, Maharashtra 400076",
    propertyType: "PG / Hostel",
    genderAllowed: "Gents / Ladies / Unisex",
    description: {
      short: "Premium PG accommodation near top colleges and IT parks with modern amenities",
      long: "Sky View PG offers comfortable and affordable accommodation for students and working professionals. Located in the heart of Powai, we provide fully furnished rooms with all modern amenities including WiFi, housekeeping, and 24x7 security."
    },
    ownerName: "Rajesh Kumar",
    managedByBrand: true,
    brandName: "Sky Living",
    yearBuilt: "2019",
    lastRenovated: "2024",
    price: "₹8,000 - ₹18,000/month",
    discount: "10% off on 6-month advance",
    configuration: "Single, Double, Triple Sharing",
    status: "Available",
    possession: "Immediate",
    avgPrice: "₹12,000/month",
    area: "80 - 150 sq.ft per room",
    location: {
      fullAddress: "Sky View PG, Plot No. 42, Near IIT Gate, Powai, Mumbai, Maharashtra 400076",
      landmark: "Opposite Hiranandani Gardens",
      pincode: "400076",
      nearby: {
        colleges: [
          { name: "IIT Bombay", distance: "1.2 km" },
          { name: "VJTI College", distance: "3.5 km" },
          { name: "KJ Somaiya", distance: "2.8 km" }
        ],
        itParks: [
          { name: "Powai IT Park", distance: "800 m" },
          { name: "Mindspace Malad", distance: "4.2 km" }
        ],
        transport: [
          { type: "Bus Stop", name: "IIT Main Gate", distance: "200 m" },
          { type: "Metro", name: "Powai Metro Station", distance: "1.5 km" }
        ],
        hospitals: [
          { name: "Hiranandani Hospital", distance: "2.1 km" },
          { name: "Fortis Hospital", distance: "3.5 km" }
        ]
      }
    },
    roomTypes: [
      {
        id: 1,
        name: "Single Occupancy AC",
        category: "Single sharing",
        ac: true,
        attachedWashroom: true,
        balcony: false,
        roomSize: "120 sq.ft",
        pricing: [
          { type: "Monthly Rent", amount: 18000, currency: "INR", mandatory: true },
          { type: "Security Deposit", amount: 18000, currency: "INR", mandatory: true, refundable: true },
          { type: "Maintenance Charges", amount: 1000, currency: "INR", mandatory: true, frequency: "monthly" },
          { type: "Food (Optional)", amount: 4500, currency: "INR", mandatory: false, frequency: "monthly" },
          { type: "Electricity", amount: 8, currency: "INR", mandatory: true, unit: "per unit", note: "As per actual usage" },
          { type: "Booking Amount", amount: 5000, currency: "INR", mandatory: true, note: "One-time token amount" }
        ],
        available: 2,
        availability: {
          totalBeds: 5,
          availableBeds: 2,
          soldOut: false,
          nextAvailability: "Immediate",
          seasonalPricing: false
        },
        refundPolicy: "100% refund if cancelled 15 days before move-in",
        amenities: [
          { icon: Bed, name: "Queen Size Bed", available: true },
          { icon: Bed, name: "Premium Mattress", available: true },
          { icon: Building2, name: "Large Cupboard", available: true },
          { icon: Building2, name: "Study Table & Chair", available: true },
          { icon: Building2, name: "AC", available: true },
          { icon: Building2, name: "Attached Bathroom", available: true },
          { icon: Wifi, name: "High Speed WiFi", available: true },
          { icon: Building2, name: "Mini Refrigerator", available: true }
        ]
      },
      {
        id: 2,
        name: "Double Sharing AC",
        category: "Double sharing",
        ac: true,
        attachedWashroom: true,
        balcony: true,
        roomSize: "150 sq.ft",
        pricing: [
          { type: "Monthly Rent", amount: 12000, currency: "INR", mandatory: true },
          { type: "Security Deposit", amount: 12000, currency: "INR", mandatory: true, refundable: true },
          { type: "Maintenance Charges", amount: 800, currency: "INR", mandatory: true, frequency: "monthly" },
          { type: "Food (Optional)", amount: 4500, currency: "INR", mandatory: false, frequency: "monthly" },
          { type: "Electricity", amount: 8, currency: "INR", mandatory: true, unit: "per unit", note: "As per actual usage" },
          { type: "Booking Amount", amount: 3000, currency: "INR", mandatory: true, note: "One-time token amount" }
        ],
        available: 5,
        availability: {
          totalBeds: 20,
          availableBeds: 5,
          soldOut: false,
          nextAvailability: "Immediate",
          seasonalPricing: false
        },
        refundPolicy: "100% refund if cancelled 15 days before move-in",
        amenities: [
          { icon: Bed, name: "2 Single Beds", available: true },
          { icon: Bed, name: "Mattress Included", available: true },
          { icon: Building2, name: "2 Cupboards", available: true },
          { icon: Building2, name: "2 Study Tables", available: true },
          { icon: Building2, name: "AC", available: true },
          { icon: Building2, name: "Attached Bathroom", available: true },
          { icon: Building2, name: "Balcony", available: true },
          { icon: Wifi, name: "High Speed WiFi", available: true }
        ]
      },
      {
        id: 3,
        name: "Triple Sharing Non-AC",
        category: "Triple sharing",
        ac: false,
        attachedWashroom: false,
        balcony: false,
        roomSize: "140 sq.ft",
        pricing: [
          { type: "Monthly Rent", amount: 8000, currency: "INR", mandatory: true, note: "Food & electricity included" },
          { type: "Security Deposit", amount: 8000, currency: "INR", mandatory: true, refundable: true },
          { type: "Maintenance Charges", amount: 500, currency: "INR", mandatory: true, frequency: "monthly" },
          { type: "Booking Amount", amount: 2000, currency: "INR", mandatory: true, note: "One-time token amount" }
        ],
        available: 8,
        availability: {
          totalBeds: 20,
          availableBeds: 8,
          soldOut: false,
          nextAvailability: "Immediate",
          seasonalPricing: false
        },
        refundPolicy: "100% refund if cancelled 15 days before move-in",
        amenities: [
          { icon: Bed, name: "3 Single Beds", available: true },
          { icon: Bed, name: "Mattress Included", available: true },
          { icon: Building2, name: "3 Cupboards", available: true },
          { icon: Building2, name: "Study Tables", available: true },
          { icon: Building2, name: "3 Fans", available: true },
          { icon: Building2, name: "Common Bathroom", available: true },
          { icon: Wifi, name: "High Speed WiFi", available: true },
          { icon: Building2, name: "Shared Refrigerator", available: true }
        ]
      }
    ],
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
    commonAmenities: [
      { icon: Wifi, name: "High Speed WiFi", available: true },
      { icon: CarIcon, name: "2-Wheeler Parking", available: true },
      { icon: CarIcon, name: "4-Wheeler Parking", available: false },
      { icon: Shield, name: "CCTV Surveillance", available: true },
      { icon: Shield, name: "Power Backup", available: true },
      { icon: Building2, name: "Lift", available: true },
      { icon: Users, name: "Housekeeping", available: true },
      { icon: Waves, name: "Laundry Service", available: true },
      { icon: Waves, name: "Water Purifier", available: true },
      { icon: Shield, name: "Security Guard", available: true },
      { icon: Shield, name: "Biometric Access", available: true },
      { icon: Trees, name: "Rooftop Access", available: true }
    ],
    foodMess: {
      available: true,
      meals: ["Breakfast", "Lunch", "Dinner"],
      foodType: "Veg & Non-veg",
      cookingAllowed: false,
      tiffinService: true,
      roWater: true,
      rating: 4.2,
      timings: {
        breakfast: "7:00 AM - 9:30 AM",
        lunch: "12:30 PM - 2:30 PM",
        dinner: "7:30 PM - 10:00 PM"
      },
      weeklyMenu: [
        {
          day: "Monday",
          breakfast: { veg: ["Poha", "Tea/Coffee", "Banana"], nonVeg: null },
          lunch: { veg: ["Dal Tadka", "Jeera Rice", "Roti", "Mixed Veg", "Salad"], nonVeg: ["Chicken Curry"] },
          dinner: { veg: ["Paneer Butter Masala", "Roti", "Rice", "Dal", "Curd"], nonVeg: ["Chicken Biryani"] }
        },
        {
          day: "Tuesday",
          breakfast: { veg: ["Upma", "Tea/Coffee", "Boiled Eggs"], nonVeg: ["Omelette"] },
          lunch: { veg: ["Rajma", "Rice", "Roti", "Aloo Gobi", "Papad"], nonVeg: ["Fish Fry"] },
          dinner: { veg: ["Chole", "Bhature", "Rice", "Raita"], nonVeg: ["Mutton Curry"] }
        },
        {
          day: "Wednesday",
          breakfast: { veg: ["Idli Sambhar", "Tea/Coffee", "Chutney"], nonVeg: null },
          lunch: { veg: ["Dal Fry", "Jeera Rice", "Roti", "Bhindi Masala", "Pickle"], nonVeg: ["Chicken Tikka"] },
          dinner: { veg: ["Veg Pulao", "Raita", "Papad"], nonVeg: ["Egg Curry", "Rice"] }
        },
        {
          day: "Thursday",
          breakfast: { veg: ["Paratha", "Curd", "Tea/Coffee", "Pickle"], nonVeg: null },
          lunch: { veg: ["Sambar", "Rice", "Roti", "Cabbage Curry", "Rasam"], nonVeg: ["Prawn Curry"] },
          dinner: { veg: ["Kadai Paneer", "Naan", "Rice", "Dal"], nonVeg: ["Butter Chicken"] }
        },
        {
          day: "Friday",
          breakfast: { veg: ["Dosa", "Sambhar", "Chutney", "Tea/Coffee"], nonVeg: null },
          lunch: { veg: ["Chana Dal", "Rice", "Roti", "Aloo Matar", "Salad"], nonVeg: ["Fish Curry"] },
          dinner: { veg: ["Malai Kofta", "Roti", "Rice", "Dal Makhani"], nonVeg: ["Chicken 65", "Fried Rice"] }
        },
        {
          day: "Saturday",
          breakfast: { veg: ["Puri Bhaji", "Tea/Coffee", "Fruit"], nonVeg: null },
          lunch: { veg: ["Dal Tadka", "Jeera Rice", "Roti", "Mix Veg", "Curd"], nonVeg: ["Mutton Korma"] },
          dinner: { veg: ["Veg Biryani", "Raita", "Papad"], nonVeg: ["Chicken Biryani", "Raita"] }
        },
        {
          day: "Sunday",
          breakfast: { veg: ["Special Breakfast - Chole Bhature", "Tea/Coffee"], nonVeg: ["Chicken Sandwich"] },
          lunch: { veg: ["Special Thali", "Sweet Dish"], nonVeg: ["Special Non-Veg Thali"] },
          dinner: { veg: ["Paneer Tikka", "Naan", "Rice", "Dal", "Ice Cream"], nonVeg: ["Tandoori Chicken", "Special Non-Veg Meal"] }
        }
      ]
    },
    rules: [
      { key: "Gate Closing Time", value: "11:00 PM" },
      { key: "Visitor Policy", value: "Allowed till 9:00 PM with prior notice" },
      { key: "Alcohol", value: "No" },
      { key: "Smoking", value: "No" },
      { key: "Non-veg", value: "Yes" },
      { key: "Pets", value: "No" },
      { key: "Noise Policy", value: "Silence after 10:30 PM" },
      { key: "Minimum Stay", value: "3 months" },
      { key: "Move Out Notice", value: "1 month" },
      { key: "Other", value: "Please maintain cleanliness in common areas and respect fellow residents" }
    ],
    safety: {
      fireSafetyCertificate: true,
      policeVerification: true,
      firstAidKit: true,
      cctvCoverage: "95%",
      emergencyExit: true,
      nightGuard: true
    },
    highlights: [
      "Premium PG accommodation in the heart of Powai",
      "Walking distance to IIT Bombay and major IT parks",
      "Fully furnished rooms with modern amenities and 24x7 WiFi",
      "Hygienic food with veg & non-veg options",
      "24x7 CCTV surveillance and biometric security",
      "Professional housekeeping and laundry services",
      "Flexible payment options with transparent pricing"
    ],
    propertyManager: {
      name: "Sky Living",
      logo: "/api/placeholder/60/60",
      rating: 4.5,
      properties: 12,
      establishedYear: 2015
    },
    contact: {
      name: "Sukruth Shetty",
      role: "Property Manager", 
      image: "/api/placeholder/60/60",
      phone: "+91 98765 43210",
      email: "sukruth@skyliving.com",
      whatsapp: "+91 98765 43210"
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
      label: "Property Type",
      value: property.propertyType
    },
    {
      icon: Users,
      label: "Gender Allowed",
      value: property.genderAllowed
    },
    {
      icon: Bed,
      label: "Room Types",
      value: property.configuration
    },
    {
      icon: IndianRupee,
      label: "Starting From",
      value: property.avgPrice
    },
    {
      icon: Wifi,
      label: "Food Available",
      value: property.foodMess.available ? "Yes" : "No"
    },
    {
      icon: Shield,
      label: "Security",
      value: "24x7 CCTV"
    },
    {
      icon: Calendar,
      label: "Availability",
      value: property.status
    },
    {
      icon: CheckCircle,
      label: "Available Beds",
      value: `${property.roomTypes.reduce((sum, room) => sum + room.availability.availableBeds, 0)}/${property.roomTypes.reduce((sum, room) => sum + room.availability.totalBeds, 0)}`
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

  // Auto-carousel effect for Weekly Menu
  useEffect(() => {
    if (!property.foodMess.weeklyMenu || property.foodMess.weeklyMenu.length === 0) return;
    
    const MENU_CAROUSEL_INTERVAL = 5000; // 5 seconds per day
    
    const menuCarouselInterval = setInterval(() => {
      setCurrentMenuDayIndex((prev) => (prev + 1) % property.foodMess.weeklyMenu.length);
    }, MENU_CAROUSEL_INTERVAL);

    return () => clearInterval(menuCarouselInterval);
  }, [property.foodMess.weeklyMenu]);

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
              <SheetHeader className="p-4 sm:p-6 bg-linear-to-b from-black/80 to-transparent z-10">
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
              <div className="p-4 sm:p-6 bg-linear-to-t from-black/80 to-transparent">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-300 ${
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
 
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 sm:gap-8">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
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
                      {property.description.long}
                    </p>
                    
           
                    <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-5 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-white/10">
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Property Type</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{property.propertyType}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Gender Allowed</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{property.genderAllowed}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Year Built / Renovated</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{property.yearBuilt} / {property.lastRenovated}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Managed By</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{property.managedByBrand ? property.brandName : property.ownerName}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Available Beds</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{property.roomTypes.reduce((sum, room) => sum + room.availability.availableBeds, 0)} / {property.roomTypes.reduce((sum, room) => sum + room.availability.totalBeds, 0)}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Availability</p>
                        <p className="font-semibold text-white text-sm sm:text-base">Immediate</p>
                      </div>
                    </div>
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
                            roomScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
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
                            roomScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                          }
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Horizontal Scroll Container */}
                  <div className="relative">
                    <div ref={roomScrollRef} className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                      {property.roomTypes.map((room) => (
                        <Card key={room.id} className="shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[380px] bg-linear-to-br from-slate-700/60 to-slate-800/60 border-white/10 backdrop-blur-xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 group overflow-hidden snap-start">
                          <CardContent className="p-4 sm:p-5">
                          <div className="mb-4">
                            <h4 className="font-bold text-white text-base sm:text-lg mb-2">{room.name}</h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">{room.category}</Badge>
                              {room.ac && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">AC</Badge>}
                              {room.attachedWashroom && <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Attached Bathroom</Badge>}
                              {room.balcony && <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Balcony</Badge>}
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">Room Size</span>
                              <span className="text-white font-semibold text-xs sm:text-sm">{room.roomSize}</span>
                            </div>
                            <Separator className="bg-white/10" />
                            
                            {/* Dynamic Pricing List */}
                            {room.pricing && room.pricing.map((price, idx) => {
                              const isMainPrice = price.type === "Monthly Rent";
                              return (
                                <div key={idx} className="space-y-1">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <span className={`text-xs sm:text-sm ${isMainPrice ? 'text-gray-300 font-medium' : 'text-gray-400'}`}>
                                        {price.type}
                                        {!price.mandatory && <span className="text-xs text-gray-500 ml-1">(Optional)</span>}
                                      </span>
                                      {price.note && (
                                        <p className="text-xs text-gray-500 mt-0.5">{price.note}</p>
                                      )}
                                    </div>
                                    <span className={`font-semibold text-xs sm:text-sm whitespace-nowrap ml-2 ${isMainPrice ? 'text-orange-500 font-bold text-sm sm:text-base' : 'text-white'}`}>
                                      ₹{price.amount.toLocaleString()}
                                      {price.unit && <span className="text-xs text-gray-400 ml-1">{price.unit}</span>}
                                      {price.refundable && <span className="text-xs text-green-400 ml-1">(Refundable)</span>}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Room Amenities */}
                          {room.amenities && room.amenities.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-white font-semibold text-xs mb-2">Room Amenities</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {room.amenities.map((amenity, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-xs">
                                    <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                                    <span className="text-gray-300 truncate">{amenity.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            {/* Availability Status */}
                            <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                              <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                                <span className="text-green-400 font-medium">Available Beds</span>
                                <span className="text-green-400 font-bold">{room.availability.availableBeds}/{room.availability.totalBeds}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">Next Available</span>
                                <span className="text-white font-semibold">{room.availability.nextAvailability}</span>
                              </div>
                            </div>
                            <Button className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300 text-xs sm:text-sm h-9">
                              Book Now - ₹{room.pricing.find(p => p.type === "Booking Amount")?.amount.toLocaleString() || "0"} Token
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      ))}
                    </div>
                  </div>
                </div>

                          {/* Why choose this property? Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    Why choose this property?
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

                {/* Common Amenities Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    Common Amenities
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-4">Shared facilities available for all residents</p>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {property.commonAmenities.map((amenity, index) => (
                      <div key={index} className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg transition-all duration-300 group ${
                        amenity.available ? 'bg-white/5 hover:bg-white/10' : 'bg-white/5 opacity-50'
                      }`}>
                        <amenity.icon className={`w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform ${
                          amenity.available ? 'text-orange-500' : 'text-gray-500'
                        }`} />
                        <span className={`text-xs sm:text-sm font-medium ${
                          amenity.available ? 'text-white' : 'text-gray-500'
                        }`}>{amenity.name}</span>
                        {amenity.available && (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Food & Mess Section */}
                {property.foodMess.available && (
                  <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                    <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                      Food & Mess
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                      <Card className="bg-linear-to-br from-slate-700/60 to-slate-800/60 border-white/10 backdrop-blur-xl">
                        <CardContent className="p-4 sm:p-5">
                          <h4 className="font-semibold text-white mb-4 text-sm sm:text-base">Meal Details</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">Available Meals</span>
                              <div className="flex gap-1">
                                {property.foodMess.meals.map((meal, idx) => (
                                  <Badge key={idx} className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">{meal}</Badge>
                                ))}
                              </div>
                            </div>
                            <Separator className="bg-white/10" />
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">Food Type</span>
                              <span className="text-white font-semibold text-xs sm:text-sm">{property.foodMess.foodType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">Cooking Allowed</span>
                              <span className="text-white font-semibold text-xs sm:text-sm">{property.foodMess.cookingAllowed ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">Tiffin Service</span>
                              <span className="text-white font-semibold text-xs sm:text-sm">{property.foodMess.tiffinService ? 'Available' : 'Not Available'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-xs sm:text-sm">RO Water</span>
                              <span className="text-white font-semibold text-xs sm:text-sm">{property.foodMess.roWater ? 'Available' : 'Not Available'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-orange-500 fill-current" />
                              <span className="text-white font-semibold text-xs sm:text-sm">{property.foodMess.rating} Food Rating</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-linear-to-br from-slate-700/60 to-slate-800/60 border-white/10 backdrop-blur-xl">
                        <CardContent className="p-4 sm:p-5">
                          <h4 className="font-semibold text-white mb-4 text-sm sm:text-base">Meal Timings</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                              <span className="text-gray-400 text-xs sm:text-sm">Breakfast</span>
                              <span className="text-white font-semibold text-xs sm:text-sm">{property.foodMess.timings.breakfast}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                              <span className="text-gray-400 text-xs sm:text-sm">Lunch</span>
                              <span className="text-white font-semibold text-xs sm:text-sm">{property.foodMess.timings.lunch}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                              <span className="text-gray-400 text-xs sm:text-sm">Dinner</span>
                              <span className="text-white font-semibold text-xs sm:text-sm">{property.foodMess.timings.dinner}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Weekly Menu Carousel */}
                    {property.foodMess.weeklyMenu && property.foodMess.weeklyMenu.length > 0 && (
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-semibold text-sm sm:text-base">Weekly Menu</h4>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-8 w-8 p-0 rounded-full"
                              onClick={() => setCurrentMenuDayIndex((prev) => (prev - 1 + property.foodMess.weeklyMenu.length) % property.foodMess.weeklyMenu.length)}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-8 w-8 p-0 rounded-full"
                              onClick={() => setCurrentMenuDayIndex((prev) => (prev + 1) % property.foodMess.weeklyMenu.length)}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Carousel Container */}
                        <div className="overflow-hidden">
                          <div 
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentMenuDayIndex * 100}%)` }}
                          >
                            {property.foodMess.weeklyMenu.map((dayMenu, idx) => (
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
                                            <span className="text-orange-500 text-xs font-bold">B</span>
                                          </div>
                                          <p className="text-white font-semibold text-sm sm:text-base">Breakfast</p>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                                            <p className="text-xs text-green-400 font-medium mb-1.5 flex items-center gap-1">
                                              <CheckCircle className="w-3 h-3" />
                                              Veg Options
                                            </p>
                                            <ul className="text-xs text-gray-300 space-y-1">
                                              {dayMenu.breakfast.veg.map((item, i) => (
                                                <li key={i} className="flex items-start gap-1.5">
                                                  <span className="text-orange-500 mt-0.5">•</span>
                                                  <span>{item}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                          {dayMenu.breakfast.nonVeg && (
                                            <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                                              <p className="text-xs text-red-400 font-medium mb-1.5 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Non-Veg Options
                                              </p>
                                              <ul className="text-xs text-gray-300 space-y-1">
                                                {dayMenu.breakfast.nonVeg.map((item, i) => (
                                                  <li key={i} className="flex items-start gap-1.5">
                                                    <span className="text-orange-500 mt-0.5">•</span>
                                                    <span>{item}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Lunch */}
                                      <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                          <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-orange-500 text-xs font-bold">L</span>
                                          </div>
                                          <p className="text-white font-semibold text-sm sm:text-base">Lunch</p>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                                            <p className="text-xs text-green-400 font-medium mb-1.5 flex items-center gap-1">
                                              <CheckCircle className="w-3 h-3" />
                                              Veg Options
                                            </p>
                                            <ul className="text-xs text-gray-300 space-y-1">
                                              {dayMenu.lunch.veg.map((item, i) => (
                                                <li key={i} className="flex items-start gap-1.5">
                                                  <span className="text-orange-500 mt-0.5">•</span>
                                                  <span>{item}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                          {dayMenu.lunch.nonVeg && (
                                            <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                                              <p className="text-xs text-red-400 font-medium mb-1.5 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Non-Veg Options
                                              </p>
                                              <ul className="text-xs text-gray-300 space-y-1">
                                                {dayMenu.lunch.nonVeg.map((item, i) => (
                                                  <li key={i} className="flex items-start gap-1.5">
                                                    <span className="text-orange-500 mt-0.5">•</span>
                                                    <span>{item}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Dinner */}
                                      <div className="bg-white/5 p-3 sm:p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                          <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-orange-500 text-xs font-bold">D</span>
                                          </div>
                                          <p className="text-white font-semibold text-sm sm:text-base">Dinner</p>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                                            <p className="text-xs text-green-400 font-medium mb-1.5 flex items-center gap-1">
                                              <CheckCircle className="w-3 h-3" />
                                              Veg Options
                                            </p>
                                            <ul className="text-xs text-gray-300 space-y-1">
                                              {dayMenu.dinner.veg.map((item, i) => (
                                                <li key={i} className="flex items-start gap-1.5">
                                                  <span className="text-orange-500 mt-0.5">•</span>
                                                  <span>{item}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                          {dayMenu.dinner.nonVeg && (
                                            <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                                              <p className="text-xs text-red-400 font-medium mb-1.5 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Non-Veg Options
                                              </p>
                                              <ul className="text-xs text-gray-300 space-y-1">
                                                {dayMenu.dinner.nonVeg.map((item, i) => (
                                                  <li key={i} className="flex items-start gap-1.5">
                                                    <span className="text-orange-500 mt-0.5">•</span>
                                                    <span>{item}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            ))}
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
                                  ? 'bg-orange-500 w-8 shadow-lg shadow-orange-500/50' 
                                  : 'bg-white/30 hover:bg-white/50 w-2'
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
                    {property.rules.map((rule, index) => (
                      rule.key.toLowerCase() === "other" ? (
                        // Special handling for "Other" type rules - display as full-width text block
                        <div key={index} className="sm:col-span-2 p-3 sm:p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/15 transition-all duration-300">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 shrink-0" />
                            <div>
                              <span className="text-orange-400 text-xs sm:text-sm font-semibold block mb-1">Additional Information</span>
                              <p className="text-white text-xs sm:text-sm leading-relaxed">{rule.value}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Standard rule display
                        <div key={index} className="flex justify-between items-center p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                          <span className="text-gray-400 text-xs sm:text-sm">{rule.key}</span>
                          <span className={`font-semibold text-xs sm:text-sm ${
                            rule.value.toLowerCase() === 'yes' ? 'text-green-400' : 
                            rule.value.toLowerCase() === 'no' ? 'text-red-400' : 
                            'text-white'
                          }`}>
                            {rule.value}
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Safety & Security Section */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                  <h3 className="text-orange-500 text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                    Safety & Security
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <CheckCircle className={`w-5 h-5 ${property.safety.fireSafetyCertificate ? 'text-green-500' : 'text-gray-500'}`} />
                      <span className="text-white text-xs sm:text-sm">Fire Safety Certificate</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <CheckCircle className={`w-5 h-5 ${property.safety.policeVerification ? 'text-green-500' : 'text-gray-500'}`} />
                      <span className="text-white text-xs sm:text-sm">Police Verification</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <CheckCircle className={`w-5 h-5 ${property.safety.firstAidKit ? 'text-green-500' : 'text-gray-500'}`} />
                      <span className="text-white text-xs sm:text-sm">First Aid Kit</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <Shield className="w-5 h-5 text-orange-500" />
                      <div>
                        <span className="text-white text-xs sm:text-sm block">CCTV Coverage</span>
                        <span className="text-gray-400 text-xs">{property.safety.cctvCoverage}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <CheckCircle className={`w-5 h-5 ${property.safety.emergencyExit ? 'text-green-500' : 'text-gray-500'}`} />
                      <span className="text-white text-xs sm:text-sm">Emergency Exit</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <CheckCircle className={`w-5 h-5 ${property.safety.nightGuard ? 'text-green-500' : 'text-gray-500'}`} />
                      <span className="text-white text-xs sm:text-sm">24x7 Night Guard</span>
                    </div>
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
                    <iframe src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&z=15&output=embed`} width="600" height="450" className="w-full"   loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
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
                      <AvatarImage src={property.contact.image} />
                      <AvatarFallback className="bg-linear-to-br from-orange-500 to-orange-600 text-white font-bold">SS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm sm:text-base">{property.contact.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-400">{property.contact.role}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Available 24x7</p>
                    </div>
                              
                  
                  </div>
                  {/* Availability Status */}
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 text-xs sm:text-sm font-medium">Available Beds</span>
                      <span className="text-green-400 text-sm sm:text-base font-bold">{property.roomTypes.reduce((sum, room) => sum + room.availability.availableBeds, 0)}/{property.roomTypes.reduce((sum, room) => sum + room.availability.totalBeds, 0)}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap  ">
                    <Button className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                    <Button    className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button    className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Visit
                    </Button>
                    <Button   className="  bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Play className="w-4 h-4 mr-2" />
                      Virtual Tour
                    </Button>
                  </div>
                </CardContent>
              </Card>

 
              {/* Chat Support */}
              <Card className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
                <CardHeader className="text-white font-medium  text-sm sm:text-base leading-relaxed">
                     Need help? Our support team is available 24x7! 
                </CardHeader>
                <CardContent>
                    <Button  className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-102 font-semibold text-sm h-10 sm:h-11 cursor-pointer">
                      <Mail className="w-4 h-4 mr-2" />
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
