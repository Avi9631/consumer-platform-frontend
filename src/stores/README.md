# Location Store Documentation

## Overview
The location store uses Zustand for global state management of user's selected location. This location is persisted in localStorage and used throughout the application to filter properties, services, products, and listings.

## Store Structure

### State
```javascript
location: {
  lat: number,           // Latitude coordinate
  lng: number,           // Longitude coordinate
  name: string,          // Location display name
  city: string,          // City name
  refId: string | null,  // Reference ID for API calls
  formattedAddress: string,
  addressComponents: object | null
}
searchResult: object | null  // Last search result from map
```

### Actions

#### `updateFromSearchResult(place)`
Primary method for updating location from map search/interaction.
```javascript
const updateFromSearchResult = useLocationStore(state => state.updateFromSearchResult);

updateFromSearchResult({
  coordinates: { lat: 19.076, lng: 72.8777 },
  formattedAddress: 'Andheri West, Mumbai',
  refId: 'location-123',
  city: 'Mumbai'
});
```

#### `setLocation(locationData)`
Merge updates to location object.
```javascript
const setLocation = useLocationStore(state => state.setLocation);

setLocation({ city: 'Delhi', refId: 'new-ref' });
```

#### `updateLocation(data)`
Complete location update.
```javascript
const updateLocation = useLocationStore(state => state.updateLocation);

updateLocation({
  lat: 19.076,
  lng: 72.8777,
  name: 'Andheri West',
  city: 'Mumbai',
  refId: 'loc-123'
});
```

#### `resetLocation()`
Reset to default location (Mumbai, Andheri West).

#### `getCoordinates()`
Get current coordinates for API calls.
```javascript
const getCoordinates = useLocationStore(state => state.getCoordinates);
const { lat, lng } = getCoordinates();
```

#### `getLocationInfo()`
Get complete location information.

## Usage Examples

### Basic Usage
```javascript
import useLocationStore from '@/stores/locationStore';

function MyComponent() {
  const location = useLocationStore(state => state.location);
  const updateFromSearchResult = useLocationStore(state => state.updateFromSearchResult);
  
  return (
    <div>
      <p>Current: {location.name}</p>
      <p>Coordinates: {location.lat}, {location.lng}</p>
    </div>
  );
}
```

### Using Specific Fields
```javascript
// Only subscribe to coordinates
const { lat, lng } = useLocationStore(state => ({
  lat: state.location.lat,
  lng: state.location.lng
}));

// Only subscribe to name
const locationName = useLocationStore(state => state.location.name);
```

### API Integration
```javascript
function fetchNearbyProperties() {
  const { lat, lng, refId } = useLocationStore.getState().location;
  
  return fetch(`/api/properties?lat=${lat}&lng=${lng}&refId=${refId}`);
}
```

### Reset Location
```javascript
const resetLocation = useLocationStore(state => state.resetLocation);

<button onClick={resetLocation}>Reset to Default</button>
```

## Benefits

1. **Global Access**: Access location anywhere in the app without prop drilling
2. **Persistence**: Location is saved in localStorage and restored on page reload
3. **Type Safety**: Consistent location object structure across the app
4. **Performance**: Fine-grained subscriptions prevent unnecessary re-renders
5. **Centralized**: Single source of truth for location data

## Integration Points

The location store is used by:
- Header component (displays current location)
- LocationSheet (updates location from map)
- Property filtering (filters by coordinates)
- API calls (sends lat/lng/refId to backend)
- Search components (updates location on search)

## Persistence

Location data is persisted to localStorage with the key `location-storage`. This means:
- User's location preference survives page refreshes
- Last searched location is remembered across sessions
- No need to select location on every visit
