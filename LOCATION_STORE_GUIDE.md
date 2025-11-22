# Zustand Location Store - Quick Reference

## Installation ✅
Zustand has been installed in the consumer-frontend project.

## Location Store Path
`src/stores/locationStore.js`

## Quick Start

### Import the Store
```javascript
import useLocationStore from '@/stores/locationStore';
```

### Access Location Data
```javascript
// In a component
const location = useLocationStore((state) => state.location);

// Access specific fields (better performance)
const { lat, lng } = useLocationStore((state) => ({
  lat: state.location.lat,
  lng: state.location.lng,
}));
```

### Update Location from Search/Map
```javascript
const updateFromSearchResult = useLocationStore((state) => state.updateFromSearchResult);

// When user selects a location
updateFromSearchResult({
  coordinates: { lat: 19.076, lng: 72.8777 },
  formattedAddress: 'Andheri West, Mumbai',
  refId: 'location-123', // optional
  city: 'Mumbai'
});
```

### Use in API Calls
```javascript
// In a function or component
const location = useLocationStore((state) => state.location);

fetch(`/api/properties?lat=${location.lat}&lng=${location.lng}&refId=${location.refId}`);

// Outside React components
const { lat, lng, refId } = useLocationStore.getState().location;
```

## Location Object Structure
```javascript
{
  lat: number,              // Latitude
  lng: number,              // Longitude
  name: string,             // Display name
  city: string,             // City
  refId: string | null,     // Reference ID for backend
  formattedAddress: string, // Full address
  addressComponents: object | null
}
```

## Common Actions

| Action | Description |
|--------|-------------|
| `updateFromSearchResult(place)` | Primary method - updates location from map/search |
| `setLocation(data)` | Merge update to location |
| `updateLocation(data)` | Complete location update |
| `resetLocation()` | Reset to default (Mumbai) |
| `getCoordinates()` | Get {lat, lng} |
| `getLocationInfo()` | Get full location object |

## Benefits
- ✅ **Global State**: Access from any component
- ✅ **Persistent**: Saved to localStorage
- ✅ **No Prop Drilling**: Direct access everywhere
- ✅ **Type Consistent**: Same structure throughout app
- ✅ **Performance**: Fine-grained subscriptions

## Files Updated
1. ✅ `src/stores/locationStore.js` - Store definition
2. ✅ `src/app/page.js` - Homepage using store
3. ✅ `src/app/search/page.jsx` - Search page using store
4. ✅ `src/stores/README.md` - Full documentation
5. ✅ `src/stores/examples.jsx` - Usage examples

## Next Steps

### For Property APIs
```javascript
// Send location to backend
const fetchProperties = async () => {
  const { lat, lng, refId } = useLocationStore.getState().location;
  
  const response = await fetch('/api/properties', {
    method: 'POST',
    body: JSON.stringify({ latitude: lat, longitude: lng, locationRefId: refId })
  });
};
```

### For Services APIs
```javascript
const fetchServices = async () => {
  const { lat, lng, city } = useLocationStore.getState().location;
  
  return fetch(`/api/services?lat=${lat}&lng=${lng}&city=${city}`);
};
```

### For Products/Listings
```javascript
const fetchListings = async (type) => {
  const location = useLocationStore.getState().location;
  
  return fetch(`/api/listings/${type}`, {
    method: 'POST',
    body: JSON.stringify({
      location: {
        latitude: location.lat,
        longitude: location.lng,
        refId: location.refId,
        city: location.city
      },
      radius: 5 // km
    })
  });
};
```

## Important Notes
- Location is automatically persisted to localStorage
- Default location is Mumbai, Andheri West (19.076, 72.8777)
- Store is available globally - no provider needed
- Use `updateFromSearchResult()` as primary update method
- RefId can be used to link with backend location entities
