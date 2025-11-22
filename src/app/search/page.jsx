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
import { getMockProperties } from "@/lib/services/propertyService";
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
  const [properties, setProperties] = useState([]);
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

  // Handle location selection from search
  const handleLocationSelect = (place) => {
    if (place?.coordinates) {
      // Update global location store
      updateFromSearchResult(place);
      setMapCenter(place.coordinates);
      searchProperties(place.coordinates, searchRadius, propertyType);
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
    searchProperties(
      { lat: data.lat, lng: data.lng },
      searchRadius,
      propertyType
    );
  };

  // Search properties based on location and filters
  const searchProperties = async (
    coordinates,
    radius,
    type,
    price,
    beds,
    baths
  ) => {
    setLoading(true);
    try {
      // Using mock data for now - replace with actual API call
      const results = getMockProperties(
        coordinates.lat,
        coordinates.lng,
        radius
      );

      // Filter by property type if specified
      let filteredResults = results;
      if (type && type !== "all") {
        filteredResults = filteredResults.filter(
          (prop) => prop.propertyType === type
        );
      }

      // Filter by price range
      if (price && price !== "any") {
        const priceFilter = PRICE_RANGES.find((p) => p.value === price);
        if (priceFilter) {
          filteredResults = filteredResults.filter(
            (prop) =>
              prop.price >= priceFilter.min && prop.price <= priceFilter.max
          );
        }
      }

      // Filter by bedrooms
      if (beds && beds !== "any") {
        filteredResults = filteredResults.filter(
          (prop) => prop.bedrooms >= parseInt(beds)
        );
      }

      // Filter by bathrooms
      if (baths && baths !== "any") {
        filteredResults = filteredResults.filter(
          (prop) => prop.bathrooms >= parseInt(baths)
        );
      }

      setProperties(filteredResults);
    } catch (error) {
      console.error("Error searching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters button
  const applyFilters = () => {
    if (location?.lat && location?.lng) {
      searchProperties(
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
      searchProperties(
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
      searchProperties(
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
    // Keep the current location from store, just clear search results
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  // Get map markers for all properties
  const getPropertyMarkers = () => {
    return properties.map((property) => ({
      lat: property.latitude,
      lng: property.longitude,
      popup: property.propertyName,
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

      <div className="flex flex-col h-screen bg-white dark:bg-gray-900 pt-16">
        {/* Top Navigation Bar */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-16 z-40">
          <div className="px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 max-w-screen-2xl mx-auto">
              <div className="flex-1 w-full sm:max-w-2xl">
                <GoogleMapSearch
                  onPlaceSelect={handleLocationSelect}
                  placeholder="Search address, city..."
                  initialValue={location?.formattedAddress || ""}
                />
              </div>

              <div className="flex items-center gap-2">
                {/* <Button
                  variant="outline"
                  size="default"
                  onClick={() => setShowMap(!showMap)}
                  className="gap-1 sm:gap-2 flex-1 sm:flex-none"
                >
                  {showMap ? (
                    <>
                      <List className="h-4 w-4" />
                      <span className="hidden sm:inline">List View</span>
                      <span className="sm:hidden">List</span>
                    </>
                  ) : (
                    <>
                      <Map className="h-4 w-4" />
                      <span className="hidden sm:inline">Map View</span>
                      <span className="sm:hidden">Map</span>
                    </>
                  )}
                </Button> */}

                <Button
                  variant="outline" size="lg"
                  onClick={() => setFilterSheetOpen(true)}
                  className="gap-1 sm:gap-2 flex-1 sm:flex-none relative"
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
        <div className="flex flex-1 overflow-hidden">
 
          {/* Property Listings Section */}
          <div
            className={`${
              showMap ? "w-1/2" : "w-full"
            } overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300`}
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
                    No homes found
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
              <div className="p-4 space-y-3">
                {/* Sort Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Homes for Sale near {location.city || "Selected Location"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {properties.length} result
                      {properties.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price-low">
                        Price (Low to High)
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price (High to Low)
                      </SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="bedrooms">Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Cards */}
                <div className="space-y-3">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.propertyId}
                      property={property}
                      onClick={() => {
                        // Handle property card click - navigate to detail page
                        console.log('Property clicked:', property.propertyId);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
