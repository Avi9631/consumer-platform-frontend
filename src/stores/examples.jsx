/**
 * Example Component - Using Location Store
 * 
 * This file demonstrates how to use the Zustand location store
 * in any component across the application.
 */

'use client';

import useLocationStore from '@/stores/locationStore';

/**
 * Example 1: Basic Usage - Display Current Location
 */
export function LocationDisplay() {
  const location = useLocationStore((state) => state.location);

  return (
    <div>
      <h3>Current Location</h3>
      <p>Name: {location.name}</p>
      <p>City: {location.city}</p>
      <p>Coordinates: {location.lat}, {location.lng}</p>
      {location.refId && <p>Reference ID: {location.refId}</p>}
    </div>
  );
}

/**
 * Example 2: Using Only Specific Fields (Performance Optimized)
 * Only re-renders when lat/lng changes
 */
export function LocationCoordinates() {
  const { lat, lng } = useLocationStore((state) => ({
    lat: state.location.lat,
    lng: state.location.lng,
  }));

  return (
    <div>
      Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
    </div>
  );
}

/**
 * Example 3: Updating Location from a Form
 */
export function LocationSelector() {
  const updateLocation = useLocationStore((state) => state.updateLocation);

  const handleSelectLocation = () => {
    updateLocation({
      lat: 19.076,
      lng: 72.8777,
      name: 'Andheri West',
      city: 'Mumbai',
      refId: 'mumbai-andheri-123',
      formattedAddress: 'Andheri West, Mumbai, Maharashtra',
    });
  };

  return (
    <button onClick={handleSelectLocation}>
      Select Andheri West
    </button>
  );
}

/**
 * Example 4: Using Location in API Calls
 */
export async function fetchNearbyProperties() {
  // Access store outside of React components
  const { lat, lng, refId } = useLocationStore.getState().location;

  const response = await fetch(
    `/api/properties?lat=${lat}&lng=${lng}&refId=${refId}&radius=5`
  );
  
  return response.json();
}

/**
 * Example 5: Updating from Map/Search Result
 */
export function MapSearchHandler({ searchResult }) {
  const updateFromSearchResult = useLocationStore(
    (state) => state.updateFromSearchResult
  );

  const handlePlaceSelect = (place) => {
    // place should have structure: { coordinates: {lat, lng}, formattedAddress, refId?, ... }
    updateFromSearchResult(place);
  };

  return (
    <button onClick={() => handlePlaceSelect(searchResult)}>
      Use This Location
    </button>
  );
}

/**
 * Example 6: Reset to Default Location
 */
export function LocationReset() {
  const resetLocation = useLocationStore((state) => state.resetLocation);

  return (
    <button onClick={resetLocation}>
      Reset to Default Location
    </button>
  );
}

/**
 * Example 7: Using Multiple Store Values and Actions
 */
export function LocationManager() {
  const location = useLocationStore((state) => state.location);
  const searchResult = useLocationStore((state) => state.searchResult);
  const updateFromSearchResult = useLocationStore((state) => state.updateFromSearchResult);
  const resetLocation = useLocationStore((state) => state.resetLocation);

  return (
    <div>
      <h3>Location Manager</h3>
      <p>Current: {location.name}</p>
      {searchResult && (
        <p>Last Search: {searchResult.formattedAddress}</p>
      )}
      <button onClick={resetLocation}>Reset</button>
    </div>
  );
}

/**
 * Example 8: Conditional Rendering Based on Location
 */
export function LocationBasedContent() {
  const locationName = useLocationStore((state) => state.location.name);
  const city = useLocationStore((state) => state.location.city);

  if (city === 'Mumbai') {
    return <div>Welcome to Mumbai! Showing Mumbai properties...</div>;
  }

  return <div>Showing properties near {locationName}</div>;
}

/**
 * Example 9: Using Location Store in Server Actions/API Routes
 * (Note: This works in client components that call server actions)
 */
export function PropertyFetcher() {
  const getCoordinates = useLocationStore((state) => state.getCoordinates);

  const handleFetchProperties = async () => {
    const { lat, lng } = getCoordinates();
    
    // Call your API with coordinates
    const data = await fetch(`/api/properties?lat=${lat}&lng=${lng}`);
    return data.json();
  };

  return (
    <button onClick={handleFetchProperties}>
      Fetch Properties for Current Location
    </button>
  );
}

/**
 * Example 10: Accessing Store Outside React Components
 */
export function utilityFunction() {
  // Direct access to current state
  const currentLocation = useLocationStore.getState().location;
  
  // Direct access to actions
  const { updateLocation, resetLocation } = useLocationStore.getState();
  
  console.log('Current location:', currentLocation);
  
  // Update if needed
  // updateLocation({ city: 'Delhi' });
}
