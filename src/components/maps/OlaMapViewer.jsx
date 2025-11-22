import { useEffect, useRef, useState } from 'react';
import { MapPin, Maximize2, Minimize2, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reverseGeocode, getCurrentLocation } from '@/lib/services/olaMapsService';
import { loadOlaMapsSDK } from '@/lib/services/olaMapsLoader';
import { cn } from '@/lib/utils';

/**
 * OlaMapViewer Component
 * Interactive map component with marker placement and drag functionality
 * Uses Ola Maps Web SDK
 */
export default function OlaMapViewer({
  center = { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
  zoom = 15,
  marker = null,
  markers = [], // Support multiple markers
  onMarkerDragEnd = null,
  onMapClick = null,
  height = '400px',
  className = '',
  interactive = true,
  showCurrentLocation = true,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const markersRef = useRef([]); // Store multiple markers
  const mapIdRef = useRef(`ola-map-${Math.random().toString(36).substr(2, 9)}`);
  const lastMarkerPositionRef = useRef(null); // Track last marker position to prevent unnecessary updates
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Initialize Ola Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Load SDK and initialize map
    const loadAndInitialize = async () => {
      try {
        await loadOlaMapsSDK();
        initializeMap();
      } catch (error) {
        console.error('Failed to load Ola Maps SDK:', error);
        setLoadError(error.message || 'Failed to load map');
      }
    };

    loadAndInitialize();

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn('Error removing map:', e);
        }
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize map function
  const initializeMap = () => {
    if (!window.OlaMaps && !window.OlaMapsSDK) {
      console.warn('OlaMaps SDK not available yet, waiting...');
      return;
    }

    if (!mapContainerRef.current) {
      console.warn('Map container not available');
      return;
    }

    if (mapRef.current) {
      console.warn('Map already initialized');
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY ;
    if (!apiKey) {
      const error = 'Ola Maps API key not found. Please add VITE_OLA_MAPS_API_KEY to your .env file';
      console.error(error);
      setLoadError(error);
      return;
    }

    try {
      // Ensure container has ID
      if (!mapContainerRef.current.id) {
        mapContainerRef.current.id = mapIdRef.current;
      }

      console.log('Initializing Ola Maps with:', {
        containerId: mapContainerRef.current.id,
        center: [center.lng, center.lat],
        zoom: zoom,
        hasApiKey: !!apiKey,
        windowOlaMaps: typeof window.OlaMaps,
        windowOlaMapsSDK: typeof window.OlaMapsSDK
      });

      // Initialize the map using Ola Maps SDK
      // The Ola Maps SDK follows this pattern:
      // 1. Create OlaMaps instance with API key
      // 2. Call .init() to create the actual map
      
      if (!window.OlaMaps) {
        throw new Error('Ola Maps SDK not properly loaded (window.OlaMaps not found)');
      }

      // Create OlaMaps instance with API key
      const olaMapsInstance = new window.OlaMaps({
        apiKey: apiKey,
      });

      // Initialize the map with configuration
      // Explicitly include API key in style URL to ensure it's sent
      const map = olaMapsInstance.init({
        style: `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=${apiKey}`,
        container: mapContainerRef.current.id,
        center: [center.lng, center.lat],
        zoom: zoom,
        attributionControl: false,
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: true,
        trackResize: true,
      });

      console.log('Map initialized successfully:', !!map);
      
      // Store map reference immediately to prevent re-initialization
      mapRef.current = map;

      // Wait for map to load
      map.on('load', () => {
        console.log('✅ Map loaded successfully');
        setIsMapLoaded(true);

        // Add click handler if interactive
        if (interactive && onMapClick) {
          map.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            handleMapClick(lat, lng);
          });
        }

        // Add initial marker if provided
        if (marker) {
          addOrUpdateMarker(marker.lat, marker.lng, marker.draggable);
        }
      });

      map.on('error', (e) => {
        console.error('❌ Map error event:', e);
        
        const errorMessage = e.error?.message || '';
        const errorString = String(errorMessage).toLowerCase();
        
        // Check if it's a style fetch error (usually API key or CORS issue)
        if (errorString.includes('style.json') || errorString.includes('failed to fetch')) {
          console.error('🔴 Style fetch failed - this usually means:');
          console.error('   1. Invalid API key');
          console.error('   2. Network/CORS issue');
          console.error('   3. API service is down');
          console.error('   Current API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');
          
          // Set a user-friendly error message
          setLoadError(
            'Unable to connect to Ola Maps service. Please check your API key and internet connection.'
          );
          return;
        }
        
        // Ignore non-critical errors (3D models, vector data)
        if (
          errorString.includes('3d_model') || 
          errorString.includes('vectordata')
        ) {
          console.warn('⚠️ Ignoring non-critical map error:', errorMessage);
          return;
        }
        
        // For other errors, show a generic message
        console.error('🔴 Critical map error:', errorMessage);
        setLoadError(`Map error: ${errorMessage || 'Unknown error occurred'}`);
      });
    } catch (error) {
      console.error('Error initializing Ola Map:', error);
      setLoadError(error.message || 'Failed to initialize map');
    }
  };

  // Add or update marker on map
  const addOrUpdateMarker = (lat, lng, draggable = true) => {
    if (!mapRef.current) {
      console.error('Cannot add marker - map not initialized');
      return;
    }

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    try {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = draggable ? 'move' : 'pointer';
      el.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                fill="#ea580c" stroke="#fff" stroke-width="2"/>
          <circle cx="12" cy="9" r="2.5" fill="#fff"/>
        </svg>
      `;

      // Create marker using Ola Maps SDK
      if (!window.OlaMaps || !window.OlaMaps.Marker) {
        console.error('Ola Maps Marker class not available');
        return;
      }

      const newMarker = new window.OlaMaps.Marker({
        element: el,
        draggable: draggable && interactive,
      })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      // Handle drag end
      if (draggable && interactive && onMarkerDragEnd) {
        newMarker.on('dragend', async () => {
          const lngLat = newMarker.getLngLat();
          await handleMarkerDrag(lngLat.lat, lngLat.lng);
        });
      }

      markerRef.current = newMarker;

      // Simply set center without animation to avoid excessive API calls
      mapRef.current.setCenter([lng, lat]);
      
      console.log('✅ Marker positioned at:', lat, lng);
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  // Handle map click
  const handleMapClick = async (lat, lng) => {
    if (interactive) {
      addOrUpdateMarker(lat, lng, true);
      
      if (onMapClick) {
        // Get address from coordinates
        try {
          console.log('🔍 Reverse geocoding:', { lat, lng });
          const addressData = await reverseGeocode(lat, lng);
          console.log('🌍 Reverse geocode result:', addressData);
          
          const payload = {
            lat,
            lng,
            address: addressData?.formattedAddress || '',
            addressComponents: addressData?.addressComponents || [],
          };
          
          console.log('📤 Sending to onMapClick:', payload);
          onMapClick(payload);
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          onMapClick({ lat, lng, address: '', addressComponents: [] });
        }
      }
    }
  };

  // Handle marker drag
  const handleMarkerDrag = async (lat, lng) => {
    if (onMarkerDragEnd) {
      try {
        console.log('🔍 Reverse geocoding (drag):', { lat, lng });
        const addressData = await reverseGeocode(lat, lng);
        console.log('🌍 Reverse geocode result (drag):', addressData);
        
        const payload = {
          lat,
          lng,
          address: addressData?.formattedAddress || '',
          addressComponents: addressData?.addressComponents || [],
        };
        
        console.log('📤 Sending to onMarkerDragEnd:', payload);
        onMarkerDragEnd(payload);
      } catch (error) {
        console.error('Error reverse geocoding:', error);
        onMarkerDragEnd({ lat, lng, address: '', addressComponents: [] });
      }
    }
  };

  // Update marker when prop changes
  useEffect(() => {
    if (!isMapLoaded || !marker || typeof marker.lat !== 'number' || typeof marker.lng !== 'number') {
      return;
    }
    
    // Check if position has actually changed to prevent infinite loops
    const lastPos = lastMarkerPositionRef.current;
    if (lastPos && lastPos.lat === marker.lat && lastPos.lng === marker.lng) {
      return;
    }
    
    console.log('📍 Updating marker:', marker.lat, marker.lng);
    lastMarkerPositionRef.current = { lat: marker.lat, lng: marker.lng };
    addOrUpdateMarker(marker.lat, marker.lng, marker.draggable !== false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker?.lat, marker?.lng, isMapLoaded]);

  // Add multiple markers support
  const addMultipleMarkers = (markersList) => {
    if (!mapRef.current || !isMapLoaded) {
      console.error('Cannot add markers - map not initialized');
      return;
    }

    // Clear existing markers
    markersRef.current.forEach((m) => {
      try {
        m.remove();
      } catch (e) {
        console.warn('Error removing marker:', e);
      }
    });
    markersRef.current = [];

    // Add new markers
    markersList.forEach((markerData, index) => {
      if (typeof markerData.lat !== 'number' || typeof markerData.lng !== 'number') {
        return;
      }

      try {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '28px';
        el.style.height = '28px';
        el.style.cursor = 'pointer';
        el.innerHTML = `
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                  fill="#ea580c" stroke="#fff" stroke-width="2"/>
            <circle cx="12" cy="9" r="2.5" fill="#fff"/>
          </svg>
        `;

        const newMarker = new window.OlaMaps.Marker({
          element: el,
          draggable: false,
        })
          .setLngLat([markerData.lng, markerData.lat])
          .addTo(mapRef.current);

        // Add popup if available
        if (markerData.popup && window.OlaMaps.Popup) {
          const popup = new window.OlaMaps.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
          }).setHTML(`<div class="text-sm font-medium p-2">${markerData.popup}</div>`);

          newMarker.setPopup(popup);
        }

        markersRef.current.push(newMarker);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });

    // Fit bounds to show all markers if more than one
    if (markersList.length > 1) {
      try {
        const bounds = new window.OlaMaps.LngLatBounds();
        markersList.forEach((markerData) => {
          bounds.extend([markerData.lng, markerData.lat]);
        });
        mapRef.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15,
        });
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  };

  // Update multiple markers when markers prop changes
  useEffect(() => {
    if (!isMapLoaded || !markers || markers.length === 0) {
      return;
    }

    console.log('📍 Updating multiple markers:', markers.length);
    addMultipleMarkers(markers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, isMapLoaded]);

  // Note: We don't need a separate effect for center because addOrUpdateMarker already centers the map
  // The center prop is only used for initial map setup in initializeMap()

  // Get current location
  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      
      if (mapRef.current) {
        mapRef.current.setCenter([location.lng, location.lat]);
        mapRef.current.setZoom(16);
      }

      addOrUpdateMarker(location.lat, location.lng, true);

      if (onMapClick) {
        const addressData = await reverseGeocode(location.lat, location.lng);
        onMapClick({
          lat: location.lat,
          lng: location.lng,
          address: addressData?.formattedAddress || '',
          addressComponents: addressData?.addressComponents || [],
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Unable to get your current location. Please check your browser settings.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden border-2 border-muted',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} id={mapIdRef.current} className="w-full h-full" />

      {/* Loading Overlay */}
      {!isMapLoaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
          <div className="text-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
            {!process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY  && (
              <p className="text-xs text-red-500 mt-2">
                API key missing. Please check .env file.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
          <div className="text-center p-6 bg-background rounded-lg border-2 border-red-200 dark:border-red-800 max-w-md mx-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Map</h3>
            <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
            <div className="text-xs text-left bg-muted p-3 rounded mb-3">
              <p className="font-semibold mb-1">Common causes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Invalid or expired Ola Maps API key</li>
                <li>Internet connection issues</li>
                <li>CORS policy restrictions</li>
                <li>Ola Maps service unavailable</li>
              </ul>
            </div>
            <div className="text-xs text-left bg-muted p-3 rounded">
              <p className="font-semibold mb-1">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verify NEXT_PUBLIC_OLA_MAPS_API_KEY in .env</li>
                <li>Restart the development server</li>
                <li>Check browser console for details</li>
                <li>Test API key at <a href="https://maps.olakrutrim.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">maps.olakrutrim.com</a></li>
              </ul>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      )}

      {/* Map Controls */}
      {isMapLoaded && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Fullscreen Toggle */}
          <Button
            size="sm"
            variant="secondary"
            className="h-10 w-10 p-0 shadow-lg"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>

          {/* Current Location */}
          {showCurrentLocation && (
            <Button
              size="sm"
              variant="secondary"
              className="h-10 w-10 p-0 shadow-lg"
              onClick={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              title="Get Current Location"
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      )}

      {/* Interactive Hint */}
      {interactive && isMapLoaded && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <MapPin className="w-3 h-3 text-orange-500" />
            Click on map or drag marker to set location
          </p>
        </div>
      )}
    </div>
  );
}
