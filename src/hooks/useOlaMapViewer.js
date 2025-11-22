/**
 * useOlaMapViewer Hook
 * Custom hook for managing map viewer state and interactions
 */

import { useEffect, useRef, useState } from 'react';
import { reverseGeocode, getCurrentLocation } from '@/lib/services/olaMapsService';
import { loadOlaMapsSDK } from '@/lib/services/olaMapsLoader';
import { 
  MAP_DEFAULTS, 
  MAP_STYLES, 
  MARKER_CONFIG, 
  ERROR_MESSAGES,
  MAP_EVENTS 
} from '@/lib/constants/maps';

/**
 * @typedef {Object} MapState
 * @property {boolean} isMapLoaded - Whether map is loaded
 * @property {boolean} isLoadingLocation - Whether current location is being fetched
 * @property {string|null} loadError - Load error message if any
 * @property {boolean} isFullscreen - Fullscreen state
 */

/**
 * @typedef {Object} MapHandlers
 * @property {() => Promise<void>} handleGetCurrentLocation - Get current location
 * @property {() => void} toggleFullscreen - Toggle fullscreen mode
 */

/**
 * Custom hook for Ola Map viewer functionality
 * @param {Object} options - Hook options
 * @param {Object} options.center - Map center coordinates
 * @param {number} options.zoom - Initial zoom level
 * @param {Object} options.marker - Marker configuration
 * @param {(data: Object) => void} options.onMapClick - Map click callback
 * @param {(data: Object) => void} options.onMarkerDragEnd - Marker drag callback
 * @param {boolean} options.interactive - Whether map is interactive
 * @returns {[MapState, MapHandlers, Object]}
 */
export function useOlaMapViewer({
  center = MAP_DEFAULTS.CENTER,
  zoom = MAP_DEFAULTS.ZOOM,
  marker = null,
  onMapClick = null,
  onMarkerDragEnd = null,
  interactive = true,
} = {}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapIdRef = useRef(`ola-map-${Math.random().toString(36).substr(2, 9)}`);
  const lastMarkerPositionRef = useRef(null);
  
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add or update marker function
  const addOrUpdateMarker = (lat, lng, draggable = true) => {
    if (!mapRef.current) {
      return;
    }

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    try {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = `${MARKER_CONFIG.DEFAULT_ICON.width}px`;
      el.style.height = `${MARKER_CONFIG.DEFAULT_ICON.height}px`;
      el.style.cursor = draggable ? 'move' : 'pointer';
      el.innerHTML = `
        <svg width="${MARKER_CONFIG.DEFAULT_ICON.width}" height="${MARKER_CONFIG.DEFAULT_ICON.height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                fill="${MARKER_CONFIG.DEFAULT_ICON.color}" 
                stroke="${MARKER_CONFIG.DEFAULT_ICON.strokeColor}" 
                stroke-width="${MARKER_CONFIG.DEFAULT_ICON.strokeWidth}"/>
          <circle cx="12" cy="9" r="2.5" fill="${MARKER_CONFIG.DEFAULT_ICON.strokeColor}"/>
        </svg>
      `;

      if (!window.OlaMaps?.Marker) {
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
        newMarker.on(MAP_EVENTS.DRAG_END, async () => {
          const lngLat = newMarker.getLngLat();
          try {
            const addressData = await reverseGeocode(lngLat.lat, lngLat.lng);
            onMarkerDragEnd({
              lat: lngLat.lat,
              lng: lngLat.lng,
              address: addressData?.formattedAddress || '',
              addressComponents: addressData?.addressComponents || [],
            });
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            onMarkerDragEnd({ 
              lat: lngLat.lat, 
              lng: lngLat.lng, 
              address: '', 
              addressComponents: [] 
            });
          }
        });
      }

      markerRef.current = newMarker;
      mapRef.current.setCenter([lng, lat]);
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  // Handle map click
  const handleMapClick = async (lat, lng) => {
    if (interactive) {
      addOrUpdateMarker(lat, lng, true);
      
      if (onMapClick) {
        try {
          const addressData = await reverseGeocode(lat, lng);
          onMapClick({
            lat,
            lng,
            address: addressData?.formattedAddress || '',
            addressComponents: addressData?.addressComponents || [],
          });
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          onMapClick({ lat, lng, address: '', addressComponents: [] });
        }
      }
    }
  };

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
      alert(ERROR_MESSAGES.GEOLOCATION_FAILED);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Initialize SDK and map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initializeMap = () => {
      if (!window.OlaMaps && !window.OlaMapsSDK) {
        return;
      }

      if (!mapContainerRef.current || mapRef.current) {
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY;
      if (!apiKey) {
        setLoadError(ERROR_MESSAGES.API_KEY_MISSING);
        return;
      }

      try {
        if (!mapContainerRef.current.id) {
          mapContainerRef.current.id = mapIdRef.current;
        }

        if (!window.OlaMaps) {
          throw new Error(ERROR_MESSAGES.SDK_NOT_AVAILABLE);
        }

        const olaMapsInstance = new window.OlaMaps({ apiKey });

        const map = olaMapsInstance.init({
          style: MAP_STYLES.DEFAULT_LIGHT,
          container: mapContainerRef.current.id,
          center: [center.lng, center.lat],
          zoom: zoom,
        });

        map.on(MAP_EVENTS.LOAD, () => {
          setIsMapLoaded(true);
          mapRef.current = map;

          if (interactive && onMapClick) {
            map.on(MAP_EVENTS.CLICK, (e) => {
              const { lng, lat } = e.lngLat;
              handleMapClick(lat, lng);
            });
          }

          if (marker) {
            addOrUpdateMarker(marker.lat, marker.lng, marker.draggable);
          }
        });

        map.on(MAP_EVENTS.ERROR, (e) => {
          const errorMessage = e.error?.message || '';
          if (errorMessage.includes('3d_model') || errorMessage.includes('vectordata')) {
            return;
          }
          setLoadError(`Map error: ${errorMessage || ERROR_MESSAGES.MAP_INIT_FAILED}`);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setLoadError(error.message || ERROR_MESSAGES.MAP_INIT_FAILED);
      }
    };

    const loadAndInitialize = async () => {
      try {
        await loadOlaMapsSDK();
        initializeMap();
      } catch (error) {
        console.error('Failed to load Ola Maps SDK:', error);
        setLoadError(error.message || ERROR_MESSAGES.SDK_LOAD_FAILED);
      }
    };

    loadAndInitialize();

    return () => {
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

  // Update marker when prop changes
  useEffect(() => {
    if (!isMapLoaded || !marker || typeof marker.lat !== 'number' || typeof marker.lng !== 'number') {
      return;
    }
    
    const lastPos = lastMarkerPositionRef.current;
    if (lastPos && lastPos.lat === marker.lat && lastPos.lng === marker.lng) {
      return;
    }
    
    lastMarkerPositionRef.current = { lat: marker.lat, lng: marker.lng };
    addOrUpdateMarker(marker.lat, marker.lng, marker.draggable !== false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker, isMapLoaded]);

  const state = {
    isMapLoaded,
    isLoadingLocation,
    loadError,
    isFullscreen,
  };

  const handlers = {
    handleGetCurrentLocation,
    toggleFullscreen,
  };

  const refs = {
    mapContainerRef,
    mapRef,
    markerRef,
    mapIdRef,
  };

  return [state, handlers, refs];
}
