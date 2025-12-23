# Quick Testing Guide

## How to Test the API Integration

### 1. Prerequisites
- Backend server running on `http://localhost:3000`
- Frontend running on its development server
- PG/Hostel with ID `2` exists in the database

### 2. Test Scenarios

#### Scenario 1: Successful Data Load
**Steps:**
1. Navigate to: `http://localhost:3000/pg-coliving-hostel/2`
2. **Expected:**
   - Loading spinner appears briefly
   - Property details load with real data:
     - Title: "SUNRISE PG / HOSTELS"
     - Location: Bengaluru, Rajasree Layout
     - 2 room types displayed
     - Common amenities shown
     - Weekly food menu displayed

#### Scenario 2: Property Not Found
**Steps:**
1. Navigate to: `http://localhost:3000/pg-coliving-hostel/999`
2. **Expected:**
   - Loading spinner appears briefly
   - Error message: "Property Not Found"
   - "Go Back" button displayed

#### Scenario 3: Network Error
**Steps:**
1. Stop the backend server
2. Navigate to: `http://localhost:3000/pg-coliving-hostel/2`
3. **Expected:**
   - Loading spinner appears
   - Error message with connection error
   - "Go Back" button displayed

### 3. Data Verification Checklist

Compare displayed data with API response:

#### Basic Information
- [ ] Property name matches `propertyName`
- [ ] Address matches `addressText`
- [ ] Gender allowed shows correctly
- [ ] City and locality displayed

#### Room Types
- [ ] All room types from API are displayed
- [ ] Room names match
- [ ] Pricing shows correct monthly rent
- [ ] Availability (beds) displays correctly
- [ ] Room images load (if available)

#### Amenities
- [ ] Common amenities list matches API
- [ ] Icons display correctly
- [ ] Available/unavailable status shown

#### Food & Mess
- [ ] Food availability status correct
- [ ] Meal types (Breakfast, Lunch) displayed
- [ ] Food type (Veg & Non-veg) shown
- [ ] Weekly menu displays (if available)

#### Contact Information
- [ ] Owner name from `user.firstName` and `user.lastName`
- [ ] Phone number matches `user.phone`
- [ ] Email matches `user.email`

#### Location
- [ ] Map shows correct coordinates (lat/lng)
- [ ] Address displays correctly

#### Media
- [ ] Property images load from `mediaData`
- [ ] Fallback image shows if no media available

### 4. API Response Example

The component expects this structure from the API:

```json
{
  "status": 200,
  "success": true,
  "data": {
    "pgHostelId": 2,
    "propertyName": "SUNRISE PG / HOSTELS",
    "addressText": "#23, 2A Cross Rd, Rajasree Layout...",
    "genderAllowed": "Unisex",
    "lat": "12.95461130",
    "lng": "77.70833860",
    "city": "Bengaluru",
    "roomTypes": [...],
    "commonAmenities": [...],
    "foodMess": {...},
    "user": {...}
  }
}
```

### 5. Browser Console Checks

Open browser console (F12) and verify:
- [ ] No JavaScript errors
- [ ] API call logs: `GET http://localhost:3000/api/pg-hostel/2`
- [ ] Response status: 200
- [ ] No CORS errors

### 6. Network Tab Verification

In Chrome DevTools > Network:
1. Filter by "XHR" or "Fetch"
2. Find the API call
3. Verify:
   - Request URL correct
   - Status Code: 200
   - Response contains expected data

### 7. Common Issues & Solutions

#### Issue: "Property Not Found" even though property exists
**Solution:** 
- Check backend server is running
- Verify API endpoint URL is correct
- Check property ID in URL matches database

#### Issue: Loading spinner never stops
**Solution:**
- Check browser console for errors
- Verify API response format matches expected structure
- Check network tab for failed requests

#### Issue: Images not loading
**Solution:**
- Verify `mediaData` in API response contains valid URLs
- Check CORS settings on image URLs
- Verify image URLs are accessible

#### Issue: Data displays but looks wrong
**Solution:**
- Check data transformation in `dataTransformers.js`
- Verify API response structure matches expected format
- Check for null/undefined values in API response

### 8. Performance Testing

- [ ] Page loads within 2 seconds
- [ ] Images lazy load properly
- [ ] Smooth scrolling on room types carousel
- [ ] No memory leaks on component unmount

### 9. Mobile Testing

Test on mobile devices or DevTools mobile view:
- [ ] Responsive layout works
- [ ] Touch interactions work (carousels, buttons)
- [ ] Images load appropriately sized
- [ ] Contact buttons functional

### 10. Browser Compatibility

Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Quick Debug Commands

### Check API Response in Terminal
```bash
curl http://localhost:3000/api/pg-hostel/2
```

### Check Frontend Dev Server
```bash
# In consumer-frontend directory
npm run dev
```

### Check Backend Server
```bash
# In partner-platform-backend directory
npm start
```

## Expected Data Flow

1. User navigates to `/pg-coliving-hostel/2`
2. Component mounts and triggers `useEffect`
3. API call to `http://localhost:3000/api/pg-hostel/2`
4. Backend returns JSON response
5. `transformApiData()` converts API data to component format
6. `setProperty()` updates state
7. Component re-renders with real data
8. User sees property details

## Success Indicators

✅ No console errors
✅ Data displays correctly
✅ Images load
✅ Map shows correct location
✅ Contact information visible
✅ Room types with pricing
✅ Amenities list
✅ Food menu (if available)
