"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Share2,
  MapPin,
  Phone,
  Mail,
  Building2,
  Calendar,
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Home,
  Clock,
  Star,
  TrendingUp,
  Briefcase,
  Shield,
  FileText,
  ExternalLink,
  Download,
  Video,
  PlayCircle,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  MessageCircle,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import LocationSheet from "@/components/LocationSheet";
import  useLocationStore  from "@/stores/locationStore";
import Header from "@/components/Header";

export default function DeveloperDetailPage() {
  const params = useParams();
  const developerId = params?.id;

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
  const projectScrollRef = useRef(null);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [activeProjectTab, setActiveProjectTab] = useState("all");

  // Mock developer data - in real app, fetch based on developerId
  const developer = {
    id: developerId,
    name: "Prestige Group",
    tagline: "Building Dreams Since 1986",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
    type: "Real Estate Developer",
    establishedYear: 1986,
    yearsOfExperience: 38,
    headquarters: "Bangalore, Karnataka",
    description: {
      short: "Leading real estate developer with a legacy of trust and excellence across residential, commercial, and retail spaces.",
      long: "Prestige Group is one of India's leading real estate developers with a track record of over 38 years. The group has developed properties across residential, commercial, retail, leisure, and hospitality segments. With a strong presence in South India and expanding footprint across major metros, Prestige Group has delivered over 280 projects spanning 150 million sq. ft. The company is known for its commitment to quality, timely delivery, and customer satisfaction."
    },
    rating: 4.7,
    totalReviews: 2847,
    projectsCompleted: 280,
    projectsOngoing: 45,
    projectsUpcoming: 28,
    totalAreaDeveloped: "150 Million sq.ft",
    totalCustomers: "85,000+",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    certifications: [
      { name: "ISO 9001:2015", icon: Award, verified: true },
      { name: "IGBC Platinum", icon: Award, verified: true },
      { name: "RERA Registered", icon: Shield, verified: true },
      { name: "CREDAI Member", icon: CheckCircle, verified: true }
    ],
    awards: [
      {
        year: 2024,
        title: "Best Residential Developer - South India",
        organization: "Asia Pacific Property Awards"
      },
      {
        year: 2023,
        title: "Developer of the Year",
        organization: "CNBC-Awaaz Real Estate Awards"
      },
      {
        year: 2023,
        title: "Excellence in Sustainability",
        organization: "Indian Green Building Council"
      },
      {
        year: 2022,
        title: "Most Trusted Brand",
        organization: "Brand Trust Report"
      }
    ],
    specializations: [
      "Luxury Apartments",
      "Villa Communities",
      "Commercial Complexes",
      "IT Parks",
      "Shopping Malls",
      "Hospitality Projects",
      "Integrated Townships"
    ],
    operatingCities: [
      "Bangalore",
      "Chennai",
      "Hyderabad",
      "Kochi",
      "Mysore",
      "Mangalore",
      "Goa",
      "Mumbai"
    ],
    projects: [
      {
        id: 1,
        name: "Prestige City",
        type: "Integrated Township",
        status: "Ongoing",
        location: "Sarjapur Road, Bangalore",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
        price: "₹65 Lakhs - ₹2.5 Cr",
        configuration: "1, 2, 3, 4 BHK",
        size: "180 acres",
        units: 10000,
        completionDate: "Dec 2027",
        possession: "Dec 2027",
        highlights: ["Largest Township in Bangalore", "40+ Amenities", "IGBC Gold Certified"],
        reraNumber: "PRM/KA/RERA/1251/310/PR/171117/001526"
      },
      {
        id: 2,
        name: "Prestige Park Grove",
        type: "Residential Apartments",
        status: "Ready to Move",
        location: "Whitefield, Bangalore",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
        price: "₹1.2 Cr - ₹2.8 Cr",
        configuration: "2, 3, 4 BHK",
        size: "12 acres",
        units: 1046,
        completionDate: "Completed",
        possession: "Immediate",
        highlights: ["Prime Location", "24+ Amenities", "Vastu Compliant"],
        reraNumber: "PRM/KA/RERA/1251/308/PR/171117/000693"
      },
      {
        id: 3,
        name: "Prestige Falcon City",
        type: "Residential Apartments",
        status: "Under Construction",
        location: "Kanakapura Road, Bangalore",
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop",
        price: "₹55 Lakhs - ₹1.8 Cr",
        configuration: "1, 2, 3 BHK",
        size: "47 acres",
        units: 3570,
        completionDate: "Jun 2026",
        possession: "Jun 2026",
        highlights: ["Club House", "Sports Facilities", "School Nearby"],
        reraNumber: "PRM/KA/RERA/1251/309/PR/171117/001234"
      },
      {
        id: 4,
        name: "Prestige Tech Platina",
        type: "Commercial Office",
        status: "Completed",
        location: "Outer Ring Road, Bangalore",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
        price: "₹8,500/sq.ft",
        configuration: "Office Spaces",
        size: "8 acres",
        units: "2.5 Million sq.ft",
        completionDate: "Completed",
        possession: "Ready",
        highlights: ["Grade A Office", "100% Occupied", "LEED Platinum"],
        reraNumber: "PRM/KA/RERA/1251/310/COM/171117/001892"
      },
      {
        id: 5,
        name: "Prestige Shantiniketan",
        type: "Luxury Apartments",
        status: "Completed",
        location: "Whitefield, Bangalore",
        image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&h=300&fit=crop",
        price: "₹2.5 Cr - ₹8 Cr",
        configuration: "3, 4, 5 BHK",
        size: "105 acres",
        units: 2300,
        completionDate: "Completed",
        possession: "Immediate",
        highlights: ["Ultra Luxury", "60+ Amenities", "Iconic Landmark"],
        reraNumber: "PRM/KA/RERA/1251/308/PR/171117/000501"
      },
      {
        id: 6,
        name: "Prestige Lakeside Habitat",
        type: "Villa Community",
        status: "Under Construction",
        location: "Varthur, Bangalore",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop",
        price: "₹3.5 Cr - ₹7 Cr",
        configuration: "3, 4, 5 BHK Villas",
        size: "35 acres",
        units: 268,
        completionDate: "Mar 2026",
        possession: "Mar 2026",
        highlights: ["Lakefront Villas", "Gated Community", "Private Gardens"],
        reraNumber: "PRM/KA/RERA/1251/309/PR/171117/002156"
      },
      {
        id: 7,
        name: "Prestige Mall",
        type: "Retail & Entertainment",
        status: "Operational",
        location: "Brigade Road, Bangalore",
        image: "https://images.unsplash.com/photo-1555529902-5261145633bf?w=400&h=300&fit=crop",
        price: "₹15,000/sq.ft",
        configuration: "Retail Spaces",
        size: "6 acres",
        units: "1.2 Million sq.ft",
        completionDate: "Completed",
        possession: "Operational",
        highlights: ["Premium Mall", "200+ Brands", "Multiplex"],
        reraNumber: "PRM/KA/RERA/1251/310/RET/171117/001347"
      },
      {
        id: 8,
        name: "Prestige Ocean Pearl",
        type: "Residential Apartments",
        status: "New Launch",
        location: "OMR, Chennai",
        image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&h=300&fit=crop",
        price: "₹85 Lakhs - ₹2.2 Cr",
        configuration: "2, 3, 4 BHK",
        size: "15 acres",
        units: 856,
        completionDate: "Dec 2028",
        possession: "Dec 2028",
        highlights: ["Beachside Living", "Resort-style Amenities", "Smart Homes"],
        reraNumber: "TN/29/Building/0123/2024"
      }
    ],
    keyPeople: [
      {
        name: "Irfan Razack",
        designation: "Chairman & Managing Director",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
        bio: "Visionary leader with 38+ years in real estate"
      },
      {
        name: "Rezwan Razack",
        designation: "Joint Managing Director",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
        bio: "Expert in project execution and customer relations"
      },
      {
        name: "Noaman Razack",
        designation: "Joint Managing Director",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
        bio: "Specialist in commercial and retail development"
      }
    ],
    financials: {
      revenue: "₹12,500 Cr (FY 2023-24)",
      marketCap: "₹45,000 Cr",
      debtToEquity: "0.8:1",
      listed: true,
      stockSymbol: "PRESTIGE"
    },
    contact: {
      corporateOffice: "Prestige Falcon Tower, Brunton Road, Bangalore - 560001",
      phone: "+91 80 2559 9000",
      email: "info@prestigeconstructions.com",
      website: "www.prestigeconstructions.com",
      customerCare: "1800 123 4567"
    },
    socialMedia: {
      linkedin: "https://linkedin.com/company/prestige-group",
      twitter: "https://twitter.com/prestigegroup",
      facebook: "https://facebook.com/prestigegroup",
      instagram: "https://instagram.com/prestigegroup",
      youtube: "https://youtube.com/prestigegroup"
    },
    timeline: [
      { year: 1986, event: "Founded in Bangalore" },
      { year: 1995, event: "First Commercial Project" },
      { year: 2010, event: "Listed on BSE & NSE" },
      { year: 2015, event: "100th Project Milestone" },
      { year: 2020, event: "Expansion to Multiple Cities" },
      { year: 2024, event: "280+ Projects Delivered" }
    ],
    highlights: [
      "38+ years of legacy and trust in real estate",
      "280+ projects delivered across 150 million sq.ft",
      "45 ongoing projects worth ₹25,000+ Crores",
      "85,000+ happy families across India",
      "IGBC Platinum & ISO 9001:2015 certified",
      "Presence in 8+ major cities",
      "Award-winning design and architecture",
      "Timely delivery with quality commitment"
    ]
  };

  // Quick Stats data
  const quickStats = [
    {
      icon: Calendar,
      label: "Established",
      value: developer.establishedYear.toString()
    },
    {
      icon: TrendingUp,
      label: "Experience",
      value: `${developer.yearsOfExperience}+ Years`
    },
    {
      icon: Building2,
      label: "Projects Completed",
      value: `${developer.projectsCompleted}+`
    },
    {
      icon: Clock,
      label: "Ongoing Projects",
      value: developer.projectsOngoing.toString()
    },
    {
      icon: Users,
      label: "Happy Customers",
      value: developer.totalCustomers
    },
    {
      icon: Home,
      label: "Area Developed",
      value: developer.totalAreaDeveloped
    },
    {
      icon: Star,
      label: "Rating",
      value: `${developer.rating}/5.0`
    },
    {
      icon: Award,
      label: "Certifications",
      value: developer.certifications.length.toString()
    }
  ];

  // Auto-carousel effect for Quick Stats
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStatIndex((prevIndex) =>
        prevIndex + 3 >= quickStats.length ? 0 : prevIndex + 3
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [quickStats.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === developer.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? developer.images.length - 1 : prevIndex - 1
    );
  };

  const openImageGallery = (index = 0) => {
    setGalleryImageIndex(index);
    setIsImageGalleryOpen(true);
  };

  const nextGalleryImage = () => {
    setGalleryImageIndex((prevIndex) =>
      prevIndex === developer.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevGalleryImage = () => {
    setGalleryImageIndex((prevIndex) =>
      prevIndex === 0 ? developer.images.length - 1 : prevIndex - 1
    );
  };

  // Handle opening location sheet
  const handleOpenLocationSheet = () => {
    setIsLocationSheetOpen(true);
    if (location?.coordinates) {
      setSheetMapCenter({
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      });
      setSheetMapMarker({
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
        title: location.name || "Selected Location",
      });
    }
  };

  // Handle location selection from sheet
  const handleSheetSearchSelect = (place) => {
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setSheetMapCenter({ lat, lng });
      setSheetMapMarker({ lat, lng, title: place.formatted_address || place.name });
      updateFromSearchResult(place);
    }
  };

  // Handle map interaction in sheet
  const handleSheetMapInteraction = (data) => {
    if (data.center) {
      setSheetMapCenter(data.center);
    }
    if (data.marker) {
      setSheetMapMarker(data.marker);
    }
    if (data.searchResult) {
      updateFromSearchResult(data.searchResult);
    }
  };

  // Filter projects by status
  const filteredProjects = developer.projects.filter((project) => {
    if (activeProjectTab === "all") return true;
    if (activeProjectTab === "ongoing") return project.status === "Ongoing" || project.status === "Under Construction";
    if (activeProjectTab === "completed") return project.status === "Completed" || project.status === "Ready to Move" || project.status === "Operational";
    if (activeProjectTab === "upcoming") return project.status === "New Launch" || project.status === "Pre-Launch";
    return true;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#1a0f1f] text-white relative overflow-hidden">
      {/* Sunset Ambient Glow Effects - matching home page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-1/2 w-[700px] h-[700px] bg-gradient-radial from-orange-500/20 via-orange-600/10 to-transparent rounded-full blur-[120px] -translate-x-1/2 animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-purple-500/15 via-purple-600/5 to-transparent rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div className="absolute inset-x-0 top-1/4 h-[300px] bg-linear-to-b from-orange-500/5 via-rose-500/5 to-transparent"></div>
      </div>

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
                      {developer.name}
                    </SheetTitle>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 text-left">
                      {galleryImageIndex + 1} / {developer.images.length}
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
                      src={developer.images[galleryImageIndex]}
                      alt={`${developer.name} - Image ${galleryImageIndex + 1}`}
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
                  {developer.images.map((image, index) => (
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
        
        {/* Developer Navigation Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-[#2d1b1f]/80 backdrop-blur-xl">
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
        <div className="relative mt-4 sm:mt-6 md:mt-12 mx-2 sm:mx-3 md:mx-4 lg:mx-6">
          {/* Image Collage Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-1 sm:gap-2 h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10">
            {/* Main large image */}
            <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => openImageGallery(currentImageIndex)}>
              <Image 
                src={developer.images[currentImageIndex]} 
                alt={developer.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-500"></div>
              {/* Main image indicator */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border border-white/10">
                {currentImageIndex + 1} / {developer.images.length}
              </div>
            </div>
            
            {/* Smaller images */}
            {developer.images.slice(1, 5).map((image, index) => {
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
                    alt={`${developer.name} - Image ${imageIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                  {/* Show "View all photos" on last image if there are more images */}
                  {index === 3 && developer.images.length > 5 && (
                    <div 
                      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/80 transition-all duration-300 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageGallery(0);
                      }}
                    >
                      <div className="text-white text-center">
                        <Maximize2 className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1" />
                        <p className="text-xs sm:text-sm font-medium">+{developer.images.length - 5} more</p>
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
            {developer.images.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-orange-500 w-6 sm:w-8 shadow-lg shadow-orange-500/50' : 'bg-white/40 hover:bg-white/70 w-1.5 sm:w-2'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 lg:gap-6 text-white mb-4 sm:mb-6 md:mb-8">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2 md:mb-3 bg-linear-to-r from-white to-gray-300 bg-clip-text text-white">{developer.name}</h1>
              <div className="flex items-start gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed">{developer.tagline}</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm">{developer.rating}</span>
                  <span className="text-gray-300 text-xs">({developer.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-sm">Since {developer.establishedYear}</span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Building2 className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-sm">{developer.projectsCompleted}+ Projects</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
              <Button className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 border-none font-semibold text-sm sm:text-base h-10 sm:h-11"
                onClick={() => setShowContactModal(true)}
              >
                Contact Developer
              </Button>
              <Button className="bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white border border-white/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 shadow-lg font-medium text-sm sm:text-base h-10 sm:h-11"
                onClick={() => openImageGallery(0)}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                View Portfolio
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
                    className="flex gap-2 sm:gap-3 md:gap-4 transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentStatIndex * 100}%)` }}
                  >
                    {Array.from({ length: Math.ceil(quickStats.length / 4) }).map((_, slideIndex) => (
                      <div key={slideIndex} className="min-w-full grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                        {quickStats.slice(slideIndex * 4, (slideIndex + 1) * 4).map((stat, index) => (
                          <Card key={index} className="bg-linear-to-br from-slate-800/80 to-slate-900/80 border-white/10 backdrop-blur-xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 hover:scale-105 group">
                            <CardContent className="p-2 sm:p-3 md:p-4 text-center">
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

              {/* About Section */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                  <h3 className="text-orange-500 text-base sm:text-lg md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    About {developer.name}
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {developer.description.long}
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-5 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-white/10">
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Type</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{developer.type}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Headquarters</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{developer.headquarters}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Video */}
              {developer.videoUrl && (
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                  <h3 className="text-orange-500 text-base sm:text-lg md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                    <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                    Company Overview
                  </h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/10">
                    <iframe
                      src={developer.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Projects Section */}
              <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                <h3 className="text-orange-500 text-base sm:text-lg md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  Projects Portfolio
                </h3>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={activeProjectTab === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveProjectTab("all")}
                    className={`text-xs sm:text-sm ${activeProjectTab === "all" ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-600/50'}`}
                  >
                    All ({developer.projects.length})
                  </Button>
                  <Button
                    variant={activeProjectTab === "ongoing" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveProjectTab("ongoing")}
                    className={`text-xs sm:text-sm ${activeProjectTab === "ongoing" ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-600/50'}`}
                  >
                    Ongoing ({developer.projects.filter(p => p.status === "Ongoing" || p.status === "Under Construction").length})
                  </Button>
                  <Button
                    variant={activeProjectTab === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveProjectTab("completed")}
                    className={`text-xs sm:text-sm ${activeProjectTab === "completed" ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-600/50'}`}
                  >
                    Completed ({developer.projects.filter(p => p.status === "Completed" || p.status === "Ready to Move" || p.status === "Operational").length})
                  </Button>
                  <Button
                    variant={activeProjectTab === "upcoming" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveProjectTab("upcoming")}
                    className={`text-xs sm:text-sm ${activeProjectTab === "upcoming" ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-600/50'}`}
                  >
                    New ({developer.projects.filter(p => p.status === "New Launch" || p.status === "Pre-Launch").length})
                  </Button>
                </div>

                {/* Projects Table - Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-700/50 border-b border-white/10">
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Project</th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Type</th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Location</th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Configuration</th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Price Range</th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Possession</th>
                        <th className="text-center p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project, index) => (
                        <tr key={project.id} className={`border-b border-white/5 hover:bg-slate-700/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/10'}`}>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={project.image}
                                  alt={project.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-white text-sm">{project.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{project.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-300">{project.type}</td>
                          <td className="p-3">
                            <div className="flex items-start gap-1 max-w-[180px]">
                              <MapPin className="h-3 w-3 text-orange-500 mt-1 shrink-0" />
                              <span className="text-xs text-gray-300">{project.location}</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-300">{project.configuration}</td>
                          <td className="p-3 text-sm font-medium text-green-400">{project.price}</td>
                          <td className="p-3">
                            <Badge className={
                              project.status === "Completed" || project.status === "Ready to Move" || project.status === "Operational"
                                ? "bg-green-600 text-xs"
                                : project.status === "Ongoing" || project.status === "Under Construction"
                                ? "bg-orange-600 text-xs"
                                : "bg-orange-500 text-xs"
                            }>
                              {project.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-gray-300">{project.possession}</td>
                          <td className="p-3 text-center">
                            <Button variant="outline" size="sm" className="gap-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-xs">
                              View <ExternalLink className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Projects Cards - Mobile & Tablet */}
                <div className="md:hidden space-y-3">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden bg-slate-700/30 border-white/10 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                      <div className="flex gap-3 p-3">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-white text-sm sm:text-base line-clamp-1">{project.name}</h4>
                            <Badge className={
                              project.status === "Completed" || project.status === "Ready to Move" || project.status === "Operational"
                                ? "bg-green-600 text-[10px] sm:text-xs shrink-0"
                                : project.status === "Ongoing" || project.status === "Under Construction"
                                ? "bg-orange-600 text-[10px] sm:text-xs shrink-0"
                                : "bg-orange-500 text-[10px] sm:text-xs shrink-0"
                            }>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mb-2 line-clamp-1">{project.type}</p>
                          <div className="flex items-start gap-1 mb-2">
                            <MapPin className="h-3 w-3 text-orange-500 mt-0.5 shrink-0" />
                            <span className="text-xs text-gray-300 line-clamp-1">{project.location}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Config: </span>
                              <span className="text-gray-300">{project.configuration}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Price: </span>
                              <span className="text-green-400 font-medium">{project.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 pb-3 flex items-center justify-between border-t border-white/5 pt-2">
                        <span className="text-[10px] text-gray-500">Possession: {project.possession}</span>
                        <Button variant="outline" size="sm" className="gap-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-xs h-7">
                          Details <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No projects found in this category</p>
                  </div>
                )}
              </div>

              {/* Specializations */}
              <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                <h3 className="text-orange-500 text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {developer.specializations.map((spec, index) => (
                    <Badge key={index} className="text-sm py-1 px-3 bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Operating Cities */}
              <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                <h3 className="text-orange-500 text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Operating Cities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {developer.operatingCities.map((city, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                      <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-300">{city}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards & Recognition */}
              <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                <h3 className="text-orange-500 text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Awards & Recognition
                </h3>
                <div className="space-y-3">
                  {developer.awards.map((award, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-linear-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
                          <Award className="h-6 w-6 text-yellow-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{award.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{award.organization}</p>
                        <p className="text-xs text-gray-500 mt-1">{award.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leadership Team */}
              <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                <h3 className="text-orange-500 text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Leadership Team
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {developer.keyPeople.map((person, index) => (
                    <div key={index} className="text-center p-4 bg-slate-700/30 rounded-lg border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                      <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-orange-500/30">
                        <Image
                          src={person.image}
                          alt={person.name}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <h3 className="font-semibold text-sm text-white">{person.name}</h3>
                      <p className="text-xs text-gray-400 mb-2">{person.designation}</p>
                      <p className="text-xs text-gray-500">{person.bio}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Timeline */}
              <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                <h3 className="text-orange-500 text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Milestones
                </h3>
                <div className="space-y-4">
                  {developer.timeline.map((milestone, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-orange-500/30">
                          <CheckCircle className="h-5 w-5 text-orange-500" />
                        </div>
                        {index < developer.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-orange-500/30 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-orange-400">{milestone.year}</p>
                        <p className="text-sm text-gray-300 mt-1">{milestone.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-4 space-y-4 sm:space-y-6">
                {/* Contact Card */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                  <h3 className="text-orange-500 text-lg font-bold mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Corporate Office</p>
                        <p className="text-sm text-gray-300">{developer.contact.corporateOffice}</p>
                      </div>
                    </div>
                    
                    <Separator className="bg-white/10" />
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm font-medium text-gray-300">{developer.contact.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Customer Care</p>
                        <p className="text-sm font-medium text-gray-300">{developer.contact.customerCare}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-300 break-all">{developer.contact.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Website</p>
                        <a href={`https://${developer.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-orange-400 hover:text-orange-300 hover:underline">
                          {developer.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full gap-2 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none shadow-lg" onClick={() => setShowContactModal(true)}>
                    <MessageCircle className="h-4 w-4" />
                    Get in Touch
                  </Button>
                </div>

                {/* Certifications */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                  <h3 className="text-orange-500 text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {developer.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                        <cert.icon className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-300">{cert.name}</p>
                        </div>
                        {cert.verified && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financials */}
                {developer.financials && (
                  <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                    <h3 className="text-orange-500 text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Financial Highlights
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-700/50 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Annual Revenue</p>
                        <p className="text-sm font-semibold text-gray-300">{developer.financials.revenue}</p>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                        <p className="text-sm font-semibold text-gray-300">{developer.financials.marketCap}</p>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Stock Symbol</p>
                        <p className="text-sm font-semibold text-gray-300">{developer.financials.stockSymbol}</p>
                      </div>
                      <div className="p-3 bg-slate-700/50 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Debt to Equity</p>
                        <p className="text-sm font-semibold text-gray-300">{developer.financials.debtToEquity}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Media */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                  <h3 className="text-orange-500 text-base sm:text-lg font-bold mb-3 sm:mb-4">Follow Us</h3>
                  <div className="grid grid-cols-5 gap-2">
                    <a
                      href={developer.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-500/30"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5 text-blue-400" />
                    </a>
                    <a
                      href={developer.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-sky-500/20 hover:bg-sky-500/30 rounded-lg transition-colors border border-sky-500/30"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5 text-sky-400" />
                    </a>
                    <a
                      href={developer.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-500/30"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5 text-blue-400" />
                    </a>
                    <a
                      href={developer.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg transition-colors border border-pink-500/30"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5 text-pink-400" />
                    </a>
                    <a
                      href={developer.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/30"
                      aria-label="YouTube"
                    >
                      <PlayCircle className="h-5 w-5 text-red-400" />
                    </a>
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-white/10">
                  <h3 className="text-orange-500 text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Key Highlights
                  </h3>
                  <ul className="space-y-2">
                    {developer.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Contact {developer.name}</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-300">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-300">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                    placeholder="Enter your phone"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-300">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-300">Message</label>
                  <textarea
                    className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-white placeholder-gray-500"
                    rows="4"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                
                <Button className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none shadow-lg">
                  Submit Inquiry
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
