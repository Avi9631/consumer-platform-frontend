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
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  ExternalLink,
  PlayCircle,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Camera,
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
import useLocationStore from "@/stores/locationStore";
import Header from "@/components/Header";
import CarouselSection from "@/components/CarouselSection";
import ShortVideoCard from "@/components/ShortVideoCard";
import { VIRTUAL_TOURS_DATA } from "@/constants/propertyData";

export default function DeveloperDetailPage() {
  const params = useParams();
  const developerId = params?.id;

  // Zustand store for global location state
  const location = useLocationStore((state) => state.location);
  const searchResult = useLocationStore((state) => state.searchResult);
  const updateFromSearchResult = useLocationStore(
    (state) => state.updateFromSearchResult
  );

  // State management
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [activeProjectTab, setActiveProjectTab] = useState("all");
  const [hoveredTourId, setHoveredTourId] = useState(null);

  // Fetch developer data from API
  useEffect(() => {
    const fetchDeveloperData = async () => {
      if (!developerId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/developer-consumer-api/${developerId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch developer data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.data)
        setDeveloper(data?.data);
      } catch (err) {
        console.error('Error fetching developer:', err);
        setError(err.message || 'Failed to load developer data');
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperData();
  }, [developerId]);

  const nextImage = () => {
    if (!developer?.images) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === developer.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!developer?.images) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? developer.images.length - 1 : prevIndex - 1
    );
  };

  const openImageGallery = (index = 0) => {
    setGalleryImageIndex(index);
    setIsImageGalleryOpen(true);
  };

  const nextGalleryImage = () => {
    if (!developer?.images) return;
    setGalleryImageIndex((prevIndex) =>
      prevIndex === developer.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevGalleryImage = () => {
    if (!developer?.images) return;
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
      setSheetMapMarker({
        lat,
        lng,
        title: place.formatted_address || place.name,
      });
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
  const filteredProjects = developer?.projects ? developer.projects.filter((project) => {
    if (activeProjectTab === "all") return true;
    if (activeProjectTab === "ongoing")
      return (
        project.status === "Ongoing" || project.status === "Under Construction"
      );
    if (activeProjectTab === "completed")
      return (
        project.status === "Completed" ||
        project.status === "Ready to Move" ||
        project.status === "Operational"
      );
    if (activeProjectTab === "upcoming")
      return project.status === "New Launch" || project.status === "Pre-Launch";
    return true;
  }) : [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#1a0f1f] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading developer information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#1a0f1f] text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-4">
            <Building2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Error Loading Developer</h2>
            <p className="text-gray-300 mb-4">{error}</p>
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

  // No data state
  if (!developer) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#1a0f1f] text-white flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Developer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#1a0f1f] via-[#2d1b1f] to-[#1a0f1f] text-white relative overflow-hidden">
      {/* Sunset Ambient Glow Effects - matching home page */}
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
          <SheetContent
            side="full"
            className="bg-black/95 backdrop-blur-xl border-none p-0 overflow-hidden [&>button]:hidden"
          >
            {developer && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <SheetHeader className="p-4 sm:p-6 bg-linear-to-b from-black/80 to-transparent z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <SheetTitle className="text-white text-lg sm:text-xl font-bold text-left">
                      {developer.name}
                    </SheetTitle>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 text-left">
                      {galleryImageIndex + 1} / {developer.images?.length || 0}
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
                    {developer?.images?.[galleryImageIndex] && (
                    <Image
                      src={developer.images[galleryImageIndex]}
                      alt={`${developer.name} - Image ${galleryImageIndex + 1}`}
                      fill
                      className="object-contain"
                      priority
                    />
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
                  {developer?.images?.map((image, index) => (
                    <button
                      key={index}
                      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === galleryImageIndex
                          ? "ring-2 ring-orange-500 scale-110 shadow-lg shadow-orange-500/50"
                          : "ring-1 ring-white/20 hover:ring-white/50 opacity-60 hover:opacity-100"
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
            )}
          </SheetContent>
        </Sheet>

        {/* Developer Navigation Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-[#2d1b1f]/80 backdrop-blur-xl">
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

        {/* Main Content */}
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 lg:gap-6 text-white mb-4 sm:mb-6 md:mb-8">
            <div className="flex-1">
              <h1 className="text-xl px-3 sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2 md:mb-3 bg-linear-to-r from-white to-gray-300 bg-clip-text text-white">
                {developer?.name || 'Developer'}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {developer?.establishedYear && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-sm">
                    Since {developer.establishedYear}
                  </span>
                </div>
                )}
                {developer?.projectsCompleted && (
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Building2 className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-sm">
                    {developer.projectsCompleted}+ Projects
                  </span>
                </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 sm:gap-8">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              {/* About Section */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-3   ">
                  <h3 className="text-orange-500 text-base sm:text-lg md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    About {developer?.name || 'Developer'}
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {developer?.description || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Virtual Tours Carousel */}
              <CarouselSection
                title={
                  <>
                    <h3 className="text-orange-500 text-base sm:text-lg md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      Media Coverage
                    </h3>
                  </>
                }
                subtitle="Hover over videos to auto-play • Swipe to explore more"
                className="p-0"
              >
                {VIRTUAL_TOURS_DATA.map((tour) => (
                  <ShortVideoCard
                    key={tour.id}
                    tour={tour}
                    isHovered={hoveredTourId === tour.id}
                    onHover={setHoveredTourId}
                  />
                ))}
              </CarouselSection>

              {/* Projects Section */}
              <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-3  ">
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
                    className={`text-xs sm:text-sm ${
                      activeProjectTab === "all"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-600/50"
                    }`}
                  >
                    All ({developer?.projects?.length || 0})
                  </Button>
                  <Button
                    variant={
                      activeProjectTab === "ongoing" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setActiveProjectTab("ongoing")}
                    className={`text-xs sm:text-sm ${
                      activeProjectTab === "ongoing"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-600/50"
                    }`}
                  >
                    Ongoing (
                    {
                      developer?.projects?.filter(
                        (p) =>
                          p.status === "Ongoing" ||
                          p.status === "Under Construction"
                      ).length || 0
                    }
                    )
                  </Button>
                  <Button
                    variant={
                      activeProjectTab === "completed" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setActiveProjectTab("completed")}
                    className={`text-xs sm:text-sm ${
                      activeProjectTab === "completed"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-600/50"
                    }`}
                  >
                    Completed (
                    {
                      developer?.projects?.filter(
                        (p) =>
                          p.status === "Completed" ||
                          p.status === "Ready to Move" ||
                          p.status === "Operational"
                      ).length || 0
                    }
                    )
                  </Button>
                  <Button
                    variant={
                      activeProjectTab === "upcoming" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setActiveProjectTab("upcoming")}
                    className={`text-xs sm:text-sm ${
                      activeProjectTab === "upcoming"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-slate-700/50 border-white/20 text-gray-300 hover:bg-slate-600/50"
                    }`}
                  >
                    New (
                    {
                      developer?.projects?.filter(
                        (p) =>
                          p.status === "New Launch" || p.status === "Pre-Launch"
                      ).length || 0
                    }
                    )
                  </Button>
                </div>

                {/* Projects Table - Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-700/50 border-b border-white/10">
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Configuration
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Price Range
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Possession
                        </th>
                        <th className="text-center p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project, index) => (
                        <tr
                          key={project.id}
                          className={`border-b border-white/5 hover:bg-slate-700/30 transition-colors ${
                            index % 2 === 0
                              ? "bg-slate-800/20"
                              : "bg-slate-800/10"
                          }`}
                        >
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
                                <p className="font-semibold text-white text-sm">
                                  {project.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {project.type}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-300">
                            {project.type}
                          </td>
                          <td className="p-3">
                            <div className="flex items-start gap-1 max-w-[180px]">
                              <MapPin className="h-3 w-3 text-orange-500 mt-1 shrink-0" />
                              <span className="text-xs text-gray-300">
                                {project.location}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-300">
                            {project.configuration}
                          </td>
                          <td className="p-3 text-sm font-medium text-green-400">
                            {project.price}
                          </td>
                          <td className="p-3">
                            <Badge
                              className={
                                project.status === "Completed" ||
                                project.status === "Ready to Move" ||
                                project.status === "Operational"
                                  ? "bg-green-600 text-xs"
                                  : project.status === "Ongoing" ||
                                    project.status === "Under Construction"
                                  ? "bg-orange-600 text-xs"
                                  : "bg-orange-500 text-xs"
                              }
                            >
                              {project.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-gray-300">
                            {project.possession}
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-xs"
                            >
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
                    <Card
                      key={project.id}
                      className="overflow-hidden bg-slate-700/30 border-white/10 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300"
                    >
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
                            <h4 className="font-semibold text-white text-sm sm:text-base line-clamp-1">
                              {project.name}
                            </h4>
                            <Badge
                              className={
                                project.status === "Completed" ||
                                project.status === "Ready to Move" ||
                                project.status === "Operational"
                                  ? "bg-green-600 text-[10px] sm:text-xs shrink-0"
                                  : project.status === "Ongoing" ||
                                    project.status === "Under Construction"
                                  ? "bg-orange-600 text-[10px] sm:text-xs shrink-0"
                                  : "bg-orange-500 text-[10px] sm:text-xs shrink-0"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                            {project.type}
                          </p>
                          <div className="flex items-start gap-1 mb-2">
                            <MapPin className="h-3 w-3 text-orange-500 mt-0.5 shrink-0" />
                            <span className="text-xs text-gray-300 line-clamp-1">
                              {project.location}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Config: </span>
                              <span className="text-gray-300">
                                {project.configuration}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Price: </span>
                              <span className="text-green-400 font-medium">
                                {project.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 pb-3 flex items-center justify-between border-t border-white/5 pt-2">
                        <span className="text-[10px] text-gray-500">
                          Possession: {project.possession}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-xs h-7"
                        >
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
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-4 space-y-4 sm:space-y-6">
                {/* Contact Card */}
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl  p-3">
                  <h3 className="text-orange-500 text-lg font-bold mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </h3>

                  <div className="space-y-3 mb-4">
                    {developer?.contact?.corporateOffice && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Corporate Office
                        </p>
                        <p className="text-sm text-gray-300">
                          {developer.contact.corporateOffice}
                        </p>
                      </div>
                    </div>
                    )}

                    {developer?.contact?.corporateOffice && <Separator className="bg-white/10" />}

                    {developer?.contact?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm font-medium text-gray-300">
                          {developer.contact.phone}
                        </p>
                      </div>
                    </div>
                    )}

                    {developer?.contact?.customerCare && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Customer Care
                        </p>
                        <p className="text-sm font-medium text-gray-300">
                          {developer.contact.customerCare}
                        </p>
                      </div>
                    </div>
                    )}

                    {developer?.contact?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-300 break-all">
                          {developer.contact.email}
                        </p>
                      </div>
                    </div>
                    )}

                    {developer?.contact?.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Website</p>
                        <a
                          href={`https://${developer.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-orange-400 hover:text-orange-300 hover:underline"
                        >
                          {developer.contact.website}
                        </a>
                      </div>
                    </div>
                    )}
                  </div>
                </div>

                {/* Social Media */}
                {developer?.socialMedia && (
                <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl  p-3">
                  <h3 className="text-orange-500 text-base sm:text-lg font-bold mb-3 sm:mb-4">
                    Follow Us
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {developer.socialMedia.linkedin && (
                    <a
                      href={developer.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-500/30"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5 text-blue-400" />
                    </a>
                    )}
                    {developer.socialMedia.twitter && (
                    <a
                      href={developer.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-sky-500/20 hover:bg-sky-500/30 rounded-lg transition-colors border border-sky-500/30"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5 text-sky-400" />
                    </a>
                    )}
                    {developer.socialMedia.facebook && (
                    <a
                      href={developer.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-500/30"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5 text-blue-400" />
                    </a>
                    )}
                    {developer.socialMedia.instagram && (
                    <a
                      href={developer.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg transition-colors border border-pink-500/30"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5 text-pink-400" />
                    </a>
                    )}
                    {developer.socialMedia.youtube && (
                    <a
                      href={developer.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/30"
                      aria-label="YouTube"
                    >
                      <PlayCircle className="h-5 w-5 text-red-400" />
                    </a>
                    )}
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-linear-to-br from-slate-800 to-slate-900 rounded-xl border border-white/20 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Contact {developer?.name || 'Developer'}
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                    placeholder="Enter your phone"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-300">
                    Message
                  </label>
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
