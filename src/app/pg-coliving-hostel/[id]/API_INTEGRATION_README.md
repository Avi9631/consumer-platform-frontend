# PG/Hostel Detail Page - API Integration

## Overview
The PG/Hostel detail page has been enhanced to fetch and display real data from the backend API instead of using mock data.

## Changes Made

### 1. API Integration (`page.jsx`)
- **Added API fetching logic** using `useEffect` hook
- **Endpoint**: `http://localhost:3000/api/pg-hostel/{id}`
- **Loading states**: Shows spinner while fetching data
- **Error handling**: Displays user-friendly error messages if API fails
- **Data transformation**: Converts API response to match component structure

### 2. Data Transformers (`dataTransformers.js`)
Created a separate module with helper functions to transform API data:

#### Key Transformation Functions:
- **`transformApiData(apiData)`**: Main function that maps API response to component format
- **`getPriceRange(roomTypes)`**: Calculates price range from room types
- **`getAvgPrice(roomTypes)`**: Calculates average price
- **`getConfiguration(roomTypes)`**: Extracts room configuration (Single, Double, Triple)
- **`getRoomSizeRange(roomTypes)`**: Gets min-max room size range
- **`transformRoomTypes(roomTypes)`**: Converts room type data structure
- **`transformImages(mediaData)`**: Extracts image URLs from media data
- **`transformCommonAmenities(amenities)`**: Maps amenities with appropriate icons
- **`transformFoodMess(foodMess)`**: Converts food/mess data structure
- **`transformWeeklyMenu(weeklyMenu)`**: Formats weekly menu data
- **`generateHighlights(apiData)`**: Creates property highlights from API data

### 3. API Response Mapping

#### From API:
```json
{
  "pgHostelId": 2,
  "propertyName": "SUNRISE PG / HOSTELS",
  "addressText": "#23, 2A Cross Rd...",
  "genderAllowed": "Unisex",
  "lat": "12.95461130",
  "lng": "77.70833860",
  "roomTypes": [...],
  "commonAmenities": [...],
  "foodMess": {...},
  "user": {...}
}
```

#### To Component Format:
```javascript
{
  id: 2,
  title: "SUNRISE PG / HOSTELS",
  subtitle: "#23, 2A Cross Rd...",
  propertyType: "PG / Hostel",
  genderAllowed: "Unisex",
  coordinates: { lat: 12.95461130, lng: 77.70833860 },
  roomTypes: [...],
  commonAmenities: [...],
  foodMess: {...},
  contact: {...}
}
```

### 4. Features Implemented

✅ **Real-time data fetching** from backend API
✅ **Loading spinner** during data fetch
✅ **Error handling** with user-friendly messages
✅ **Data transformation** to maintain component compatibility
✅ **Fallback images** when no media is available
✅ **Dynamic price calculation** based on room types
✅ **Amenities icon mapping** based on amenity names
✅ **Weekly menu transformation** with proper structure
✅ **Property highlights generation** from API data
✅ **Owner/contact information** from user data

### 5. Loading States

**Loading UI:**
```jsx
<div className="flex flex-col items-center justify-center">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  <p className="text-gray-600">Loading property details...</p>
</div>
```

**Error UI:**
```jsx
<div className="flex flex-col items-center justify-center">
  <div className="text-red-500 text-6xl">⚠️</div>
  <h2 className="text-2xl font-bold">Property Not Found</h2>
  <p className="text-gray-600">{error}</p>
  <Button onClick={() => window.history.back()}>Go Back</Button>
</div>
```

### 6. Dynamic Features

- **Price Range**: Automatically calculated from all room types
- **Configuration**: Dynamically shows available sharing types (Single, Double, Triple)
- **Availability**: Shows total and available beds count
- **Images**: Uses media data from API with fallback to placeholder images
- **Amenities**: Maps common amenities with appropriate Lucide icons
- **Food Menu**: Displays weekly menu with breakfast, lunch, and dinner options
- **Contact Info**: Shows property owner details from user data

## Usage

### Testing the Integration

1. **Start backend server**: Make sure `http://localhost:3000` is running
2. **Navigate to**: `http://localhost:3000/pg-coliving-hostel/2`
3. **Expected behavior**:
   - Shows loading spinner initially
   - Fetches data from API
   - Transforms and displays real property data
   - Shows error if API fails or property not found

### API Response Structure Expected

The component expects the API to return:
```json
{
  "status": 200,
  "success": true,
  "message": "PG/Hostel fetched successfully",
  "data": {
    "pgHostelId": number,
    "propertyName": string,
    "addressText": string,
    "genderAllowed": string,
    "lat": string,
    "lng": string,
    "city": string,
    "locality": string,
    "roomTypes": [...],
    "commonAmenities": [...],
    "foodMess": {...},
    "rules": [...],
    "mediaData": [...],
    "user": {...}
  }
}
```

## Benefits

1. **Dynamic Content**: Property details update automatically when API data changes
2. **Maintainability**: Separate transformation logic makes code easier to maintain
3. **Scalability**: Easy to add new fields or modify transformations
4. **User Experience**: Loading and error states improve UX
5. **Type Safety**: Consistent data structure throughout the component

## Future Enhancements

- Add caching to reduce API calls
- Implement optimistic updates
- Add retry logic for failed requests
- Integrate with React Query or SWR for better data management
- Add real-time updates using WebSockets
- Implement lazy loading for images
- Add skeleton loaders for better loading experience

## Testing Checklist

- [ ] Property loads successfully with valid ID
- [ ] Loading spinner appears during fetch
- [ ] Error message shows for invalid ID
- [ ] All images display correctly
- [ ] Room types render with proper data
- [ ] Amenities show with correct icons
- [ ] Food menu displays weekly schedule
- [ ] Contact information is correct
- [ ] Map shows accurate coordinates
- [ ] Pricing information is accurate

## Notes

- The component maintains backward compatibility with the mock data structure
- All transformations handle missing/null data gracefully
- Default fallback values are provided for optional fields
- Icon mapping is case-insensitive for amenities
