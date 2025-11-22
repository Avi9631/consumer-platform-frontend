'use client';

import { useState } from 'react';
import { LocationPicker, OlaMapSearch, OlaMapViewer } from '@/components/maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';

export default function OlaMapsExamples() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [mapLocation, setMapLocation] = useState(null);

  const handleLocationChange = (location) => {
    console.log('Location selected:', location);
    setSelectedLocation(location);
  };

  const handleSearchSelect = (place) => {
    console.log('Search result:', place);
    setSearchResult(place);
  };

  const handleMapInteraction = (data) => {
    console.log('Map interaction:', data);
    setMapLocation(data);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Ola Maps Integration Examples</h1>
        <p className="text-muted-foreground">
          Demonstrations of Ola Maps components for the consumer frontend
        </p>
      </div>

      {/* Full Location Picker Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Complete Location Picker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LocationPicker
            onChange={handleLocationChange}
            height="400px"
            initialCenter={{ lat: 28.6139, lng: 77.2090 }}
            placeholder="Search for any location..."
          />
          
          {selectedLocation && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                Selected Location Data:
              </h4>
              <pre className="text-sm text-green-700 dark:text-green-300 overflow-auto">
                {JSON.stringify(selectedLocation, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Only Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Search Component Only
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <OlaMapSearch
            onPlaceSelect={handleSearchSelect}
            placeholder="Search for places..."
          />
          
          {searchResult && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-200">
                    {searchResult.formattedAddress}
                  </p>
                  {searchResult.coordinates && (
                    <div className="flex gap-2 mt-2">
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Viewer Only Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Interactive Map Viewer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <OlaMapViewer
            center={{ lat: 19.0760, lng: 72.8777 }} // Mumbai coordinates
            zoom={12}
            marker={{ 
              lat: 19.0760, 
              lng: 72.8777, 
              draggable: true 
            }}
            onMarkerDragEnd={handleMapInteraction}
            onMapClick={handleMapInteraction}
            height="350px"
            interactive={true}
            showCurrentLocation={true}
          />
          
          {mapLocation && (
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">
                Map Interaction Result:
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                <strong>Address:</strong> {mapLocation.address || 'No address found'}
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {mapLocation.lat.toFixed(6)}, {mapLocation.lng.toFixed(6)}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use in Your Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Basic Usage:</h4>
            <pre className="text-sm overflow-auto">
{`import { LocationPicker } from '@/components/maps';

function MyComponent() {
  const [location, setLocation] = useState(null);
  
  return (
    <LocationPicker
      onChange={(loc) => setLocation(loc)}
      height="400px"
    />
  );
}`}
            </pre>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Environment Setup:</h4>
            <p className="text-sm mb-2">Make sure you have this in your <code>.env.local</code> file:</p>
            <pre className="text-sm">
{`NEXT_PUBLIC_OLA_MAPS_API_KEY=your_api_key_here`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}