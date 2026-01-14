"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Sliders,
  Home,
  Building2,
  Filter,
  X,
  Map,
  List,
  Bed,
  Bath,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GoogleMapSearch from "@/components/maps/GoogleMapSearch";
import GoogleMapViewer from "@/components/maps/GoogleMapViewer";
import { searchProperties } from "@/lib/services/propertyService";
import Header from "@/components/Header";
import FilterSheet from "@/components/FilterSheet";
import LocationSheet from "@/components/LocationSheet";
import PropertyCard from "@/components/PropertyCard";
import useLocationStore from "@/stores/locationStore";

export default function PropertySearchPage() {
  // Zustand store for global location state
  const location = useLocationStore((state) => state.location);
  const searchResult = useLocationStore((state) => state.searchResult);
  const updateFromSearchResult = useLocationStore(
    (state) => state.updateFromSearchResult
  );

  // Local state
  const [searchRadius, setSearchRadius] = useState(5);
  const [propertyType, setPropertyType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: location.lat,
    lng: location.lng,
  });
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [sheetMapCenter, setSheetMapCenter] = useState({
    lat: location.lat,
    lng: location.lng,
  });
  const [sheetMapMarker, setSheetMapMarker] = useState(null);
  const [priceRange, setPriceRange] = useState("any");
  const [minBedrooms, setMinBedrooms] = useState("any");
  const [minBathrooms, setMinBathrooms] = useState("any");
  const [listingType, setListingType] = useState("sale");
  const [showBoundary, setShowBoundary] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [scrolled, setScrolled] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  // Auto-search when location is available
  useEffect(() => {
    if (location?.lat && location?.lng) {
      console.log('Location available, triggering search:', location);
      searchPropertiesData(
        { lat: location.lat, lng: location.lng },
        searchRadius,
        propertyType,
        priceRange,
        minBedrooms,
        minBathrooms
      );
    }
  }, [location?.lat, location?.lng]);

  // Handle location selection from search
  const handleLocationSelect = (place) => {
    if (place?.coordinates) {
      // Update global location store
      updateFromSearchResult(place);
      setMapCenter(place.coordinates);
      searchPropertiesData(place.coordinates, searchRadius, propertyType);
    }
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
      setMapCenter(place.coordinates);
      searchProperties(place.coordinates, searchRadius, propertyType);
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
    setMapCenter({ lat: data.lat, lng: data.lng });
    searchPropertiesData(
      { lat: data.lat, lng: data.lng },
      searchRadius,
      propertyType
    );
  };

  // Search property listings based on location and filters
  const searchPropertiesData = async (
    coordinates,
    radius,
    type,
    price,
    beds,
    baths
  ) => {
    setLoading(true);
    try {
      // Call the Property API
      const result = await searchProperties({
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        radius: radius,
        propertyType: type,
        status: 'ACTIVE'
      });

      console.log('Property search results:', result);
      setProperties(result);
      setTotalResults(result.length);
    } catch (error) {
      console.error("Error searching properties:", error);
      setProperties([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters button
  const applyFilters = () => {
    if (location?.lat && location?.lng) {
      searchPropertiesData(
        { lat: location.lat, lng: location.lng },
        searchRadius,
        propertyType,
        priceRange,
        minBedrooms,
        minBathrooms
      );
    }
  };

  // Handle radius change
  const handleRadiusChange = (value) => {
    const newRadius = value[0];
    setSearchRadius(newRadius);
    if (location?.lat && location?.lng) {
      searchPropertiesData(
        { lat: location.lat, lng: location.lng },
        newRadius,
        propertyType,
        priceRange,
        minBedrooms,
        minBathrooms
      );
    }
  };

  // Handle property type change
  const handlePropertyTypeChange = (value) => {
    setPropertyType(value);
    if (location?.lat && location?.lng) {
      searchPropertiesData(
        { lat: location.lat, lng: location.lng },
        searchRadius,
        value,
        priceRange,
        minBedrooms,
        minBathrooms
      );
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchRadius(5);
    setPropertyType("all");
    setPriceRange("any");
    setMinBedrooms("any");
    setMinBathrooms("any");
    setProperties([]);
    setTotalResults(0);
    // Keep the current location from store, just clear search results
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  // Get map markers for all properties
  const getPropertyMarkers = () => {
    return properties.map((property) => ({
      lat: property.latitude,
      lng: property.longitude,
      popup: property.propertyName || property.title,
    }));
  };

  // Format price in INR
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <>
      

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
      </div>
     
        {/* Top Navigation Bar */}
        <div className="  sticky top-14 z-40">
          <div className="px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full max-w-screen-2xl mx-auto">
              <div className="flex-1 w-full sm:max-w-2xl min-w-0">
                {/* <GoogleMapSearch
                  onPlaceSelect={handleLocationSelect}
                  placeholder="Search address, city..."
                  initialValue={location?.formattedAddress || ""}
                /> */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start border bg-transparent hover:bg-primary/5 min-w-0 max-w-full cursor-pointer"
                  onClick={handleOpenLocationSheet}
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary drop-shadow-[0_0_8px_rgba(251,146,60,0.8)] shrink-0" />
                  <span className="truncate text-left ml-1 sm:ml-2 min-w-0">
                    {location?.formattedAddress || "Select Location"}
                  </span>
                </Button>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-auto">
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilterSheetOpen(true)}
                  className="gap-1 sm:gap-2 whitespace-nowrap relative"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <span className="sm:hidden">Filter</span>
                  {(priceRange !== "any" ||
                    minBedrooms !== "any" ||
                    minBathrooms !== "any" ||
                    propertyType !== "all") && (
                    <Badge
                      variant="default"
                      className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                    >
                      •
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Sheet */}
        <FilterSheet
          open={filterSheetOpen}
          onOpenChange={setFilterSheetOpen}
          listingType={listingType}
          setListingType={setListingType}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minBedrooms={minBedrooms}
          setMinBedrooms={setMinBedrooms}
          minBathrooms={minBathrooms}
          setMinBathrooms={setMinBathrooms}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          searchRadius={searchRadius}
          setSearchRadius={setSearchRadius}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden w-full mt-16">
          {/* Property Listings Section */}
          <div
            className={`${
              showMap ? "w-1/2" : "w-full"
            } overflow-y-auto   transition-all duration-300 min-w-0`}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading properties...
                </p>
              </div>
            ) : !location?.lat ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center px-8">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Search for homes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg">
                    Enter an address, neighborhood, city, or ZIP code above to
                    start exploring properties
                  </p>
                </div>
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center px-8">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Home className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No Properties found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg mb-4">
                    Try adjusting your filters or search in a different area
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-2"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-2 sm:p-4 w-full">
                {/* Results count */}
                <div className="mb-4 text-sm text-gray-400">
                  Found {totalResults} propert{totalResults !== 1 ? 'ies' : 'y'} near your location
                </div>
                {/* Property Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
                  {properties.map((property) => (
                      <PropertyCard
                        key={property.propertyId}
                        property={property}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
