'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Sliders, Home, Building2, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OlaMapSearch from '@/components/maps/OlaMapSearch';
import OlaMapViewer from '@/components/maps/OlaMapViewer';
import { getMockProperties } from '@/lib/services/propertyService';

const PROPERTY_TYPES = [
  { value: 'all', label: 'All Types', icon: Home },
  { value: 'apartment', label: 'Apartment', icon: Building2 },
  { value: 'villa', label: 'Villa', icon: Home },
  { value: 'penthouse', label: 'Penthouse', icon: Building2 },
  { value: 'cottage', label: 'Cottage', icon: Home },
  { value: 'commercial', label: 'Commercial', icon: Building2 },
];

const RADIUS_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 2, label: '2 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
  { value: 50, label: '50 km' },
];

export default function PropertySearchPage() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5);
  const [propertyType, setPropertyType] = useState('all');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [showFilters, setShowFilters] = useState(true);

  // Handle location selection from search
  const handleLocationSelect = (location) => {
    if (location?.coordinates) {
      setSelectedLocation(location);
      setMapCenter(location.coordinates);
      searchProperties(location.coordinates, searchRadius, propertyType);
    }
  };

  // Search properties based on location and filters
  const searchProperties = async (coordinates, radius, type) => {
    setLoading(true);
    try {
      // Using mock data for now - replace with actual API call
      const results = getMockProperties(coordinates.lat, coordinates.lng, radius);
      
      // Filter by property type if specified
      let filteredResults = results;
      if (type && type !== 'all') {
        filteredResults = results.filter(prop => prop.propertyType === type);
      }
      
      setProperties(filteredResults);
    } catch (error) {
      console.error('Error searching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle radius change
  const handleRadiusChange = (value) => {
    const newRadius = value[0];
    setSearchRadius(newRadius);
    if (selectedLocation?.coordinates) {
      searchProperties(selectedLocation.coordinates, newRadius, propertyType);
    }
  };

  // Handle property type change
  const handlePropertyTypeChange = (value) => {
    setPropertyType(value);
    if (selectedLocation?.coordinates) {
      searchProperties(selectedLocation.coordinates, searchRadius, value);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedLocation(null);
    setSearchRadius(5);
    setPropertyType('all');
    setProperties([]);
    setMapCenter({ lat: 28.6139, lng: 77.2090 });
  };

  // Get map markers for all properties
  const getPropertyMarkers = () => {
    return properties.map(property => ({
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
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Dream Property
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search properties by location and customize your search radius
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search & Filters Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="w-5 h-5 text-orange-600" />
                  Search Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <OlaMapSearch
                  onPlaceSelect={handleLocationSelect}
                  placeholder="Search for a location..."
                  initialValue={selectedLocation?.formattedAddress || ''}
                />

                {selectedLocation && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedLocation.locality || selectedLocation.city || 'Selected Location'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                          {selectedLocation.formattedAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Filters Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sliders className="w-5 h-5 text-orange-600" />
                    Filters
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showFilters && (
                <CardContent className="space-y-6">
                  {/* Property Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Property Type
                    </label>
                    <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Radius */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Search Radius
                      </label>
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {searchRadius} km
                      </Badge>
                    </div>
                    <Slider
                      value={[searchRadius]}
                      onValueChange={handleRadiusChange}
                      min={1}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 km</span>
                      <span>50 km</span>
                    </div>
                  </div>

                  {/* Quick Radius Buttons */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quick Select
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {RADIUS_OPTIONS.map((option) => (
                        <Button
                          key={option.value}
                          variant={searchRadius === option.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleRadiusChange([option.value])}
                          className="w-full"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {(selectedLocation || propertyType !== 'all' || searchRadius !== 5) && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Results Summary */}
            {selectedLocation && (
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{properties.length}</p>
                      <p className="text-sm text-orange-100">
                        {properties.length === 1 ? 'Property Found' : 'Properties Found'}
                      </p>
                    </div>
                    <Home className="w-12 h-12 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map & Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  Map View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border">
                  <OlaMapViewer
                    center={mapCenter}
                    zoom={selectedLocation ? 13 : 11}
                    markers={selectedLocation ? getPropertyMarkers() : []}
                    height="500px"
                    interactive={true}
                    showCurrentLocation={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Properties List */}
            {loading ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600 dark:text-gray-400">Searching properties...</p>
                  </div>
                </CardContent>
              </Card>
            ) : !selectedLocation ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Start Your Search
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        Search for a location using the search bar to find properties in that area.
                        You can adjust the search radius and filter by property type.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : properties.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Home className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Properties Found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        Try adjusting your search radius or property type filters to see more results.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Available Properties
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((property) => (
                    <Card
                      key={property.propertyId}
                      className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                    >
                      <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Home className="w-16 h-16 text-gray-400" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-orange-600 text-white">
                            {property.distance.toFixed(1)} km away
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                              {property.propertyName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                              {property.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize">
                              {property.propertyType}
                            </Badge>
                            {property.bedrooms > 0 && (
                              <Badge variant="outline">
                                {property.bedrooms} BHK
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {property.area} sq.ft
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                              <p className="text-xl font-bold text-orange-600">
                                {formatPrice(property.price)}
                              </p>
                            </div>
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
