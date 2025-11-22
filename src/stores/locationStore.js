import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Location Store
 * Global state management for selected location with persistence
 * 
 * Stores:
 * - Latitude and Longitude coordinates
 * - Location reference ID
 * - Formatted address/name
 * - City information
 * 
 * This location data is used globally to filter:
 * - Properties
 * - Services
 * - Products
 * - Listings based on user's selected location
 */

const useLocationStore = create(
  persist(
    (set, get) => ({
      // Location state
      location: {
        lat: 19.076,
        lng: 72.8777,
        name: 'Andheri West',
        city: 'Mumbai',
        refId: null, // Reference ID if needed for API calls
        formattedAddress: 'Andheri West, Mumbai',
        addressComponents: null,
      },

      // Search result from map interaction
      searchResult: null,

      // Actions
      setLocation: (locationData) => {
        set({
          location: {
            ...get().location,
            ...locationData,
          },
        });
      },

      updateLocation: ({ lat, lng, name, city, refId, formattedAddress, addressComponents }) => {
        set({
          location: {
            lat,
            lng,
            name: name || formattedAddress || get().location.name,
            city: city || get().location.city,
            refId: refId || null,
            formattedAddress: formattedAddress || name || get().location.formattedAddress,
            addressComponents: addressComponents || null,
          },
        });
      },

      setSearchResult: (result) => {
        set({ searchResult: result });
      },

      // Update location from search/map interaction
      updateFromSearchResult: (place) => {
        if (!place || !place.coordinates) return;

        const newLocation = {
          lat: place.coordinates.lat,
          lng: place.coordinates.lng,
          name: place.formattedAddress || place.name || 'Selected Location',
          formattedAddress: place.formattedAddress || place.name || 'Selected Location',
          addressComponents: place.addressComponents || null,
          refId: place.refId || place.id || null,
          city: place.city || get().location.city,
        };

        set({
          location: newLocation,
          searchResult: place,
        });
      },

      // Reset to default location
      resetLocation: () => {
        set({
          location: {
            lat: 19.076,
            lng: 72.8777,
            name: 'Andheri West',
            city: 'Mumbai',
            refId: null,
            formattedAddress: 'Andheri West, Mumbai',
            addressComponents: null,
          },
          searchResult: null,
        });
      },

      // Get coordinates for API calls
      getCoordinates: () => {
        const { lat, lng } = get().location;
        return { lat, lng };
      },

      // Get location info for display
      getLocationInfo: () => {
        return get().location;
      },
    }),
    {
      name: 'location-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        location: state.location,
        searchResult: state.searchResult,
      }),
    }
  )
);

export default useLocationStore;
