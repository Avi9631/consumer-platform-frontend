# Component Breakdown Documentation

## Overview
This document details the refactoring of the monolithic `page.js` component into a modular, maintainable component architecture.

## Architecture Summary

### Original Structure
- **Single File**: ~1050 lines
- **Mixed Concerns**: Data, logic, UI all in one component
- **Hard to Maintain**: Difficult to test and reuse

### New Structure
- **9 Separate Modules**: Split into focused, reusable components
- **Clear Separation**: Data, hooks, utilities, and UI components separated
- **Easy to Test**: Each component can be tested independently

---

## Component Breakdown

### 1. **Data Layer** (`src/constants/propertyData.js`)
**Purpose**: Centralized data storage

**Exports**:
- `PROPERTIES_DATA` - Array of property objects
- `LOCATIONS_DATA` - Array of Mumbai locations
- `VIRTUAL_TOURS_DATA` - Array of virtual tour objects

**Benefits**:
- Easy to update data without touching UI code
- Can be replaced with API calls later
- Reusable across multiple components

---

### 2. **Custom Hooks**

#### `useScrollDetection.js`
**Purpose**: Detect scroll position for header styling

**API**:
```javascript
const scrolled = useScrollDetection(threshold);
// threshold: number (default: 50) - pixels to trigger
// returns: boolean - whether scrolled past threshold
```

**Usage**:
```javascript
const scrolled = useScrollDetection(50);
// Use scrolled state to conditionally apply styles
```

---

#### `usePropertyFilter.js`
**Purpose**: Filter properties by location and radius

**API**:
```javascript
const filteredProperties = usePropertyFilter(properties, location, radius);
// properties: Array - list of properties
// location: Object {lat, lng} - center point
// radius: number (default: 5) - radius in km
// returns: Array - filtered properties
```

**Features**:
- Uses Haversine formula for accurate distance calculation
- Memoized for performance
- Also exports `calculateDistance` utility

---

### 3. **Utility Functions** (`src/lib/utils/videoHelpers.js`)

#### `getYouTubeEmbedUrl(url)`
**Purpose**: Convert YouTube URLs to embed format

**Supports**:
- YouTube Shorts
- Regular YouTube videos (watch?v=)
- youtu.be links

**Parameters**: Autoplay, mute, loop, controls hidden

#### `truncateAddress(address, maxLength)`
**Purpose**: Truncate long addresses for display

---

### 4. **UI Components**

#### `Header.jsx`
**Purpose**: Application header with navigation

**Props**:
```javascript
{
  scrolled: boolean,          // Controls header style
  selectedLocation: Object,   // Current location
  onOpenLocationSheet: func   // Handler to open location sheet
}
```

**Features**:
- Responsive design
- Location display button
- User avatar
- Dynamic styling based on scroll

---

#### `HeroSection.jsx`
**Purpose**: Landing hero with search

**Props**:
```javascript
{
  onSearchSelect: func  // Callback when search item selected
}
```

**Features**:
- Animated entrance (framer-motion)
- Integrated OlaMapSearch
- Sunset gradient effects
- Responsive text sizing

---

#### `LocationSheet.jsx`
**Purpose**: Full-screen location selector with map

**Props**:
```javascript
{
  isOpen: boolean,
  onOpenChange: func,
  searchResult: Object,
  mapCenter: Object {lat, lng},
  mapMarker: Object {lat, lng, draggable},
  onSearchSelect: func,
  onMapInteraction: func
}
```

**Features**:
- Full-screen overlay
- Integrated map viewer
- Draggable marker
- Address confirmation
- Coordinate display

---

#### `CarouselSection.jsx`
**Purpose**: Reusable horizontal scrollable carousel

**Props**:
```javascript
{
  title: ReactNode,      // Section title
  subtitle: string,      // Optional subtitle
  icon: ReactNode,       // Optional icon
  children: ReactNode,   // Carousel items
  className: string      // Additional CSS classes
}
```

**Features**:
- Left/right navigation arrows
- Smooth scrolling
- Responsive spacing
- Hide scrollbar
- Reusable for any content

---

#### `VirtualTourCard.jsx`
**Purpose**: Individual virtual tour card with video

**Props**:
```javascript
{
  tour: Object {
    id, title, price, location,
    videoUrl, thumbnail
  },
  isHovered: boolean,
  onHover: func(id, isHovering)
}
```

**Features**:
- Video autoplay on hover
- YouTube iframe support
- Native video support
- Play indicator
- Gradient overlays

---

#### `PropertyCard.jsx`
**Purpose**: Individual property card

**Props**:
```javascript
{
  property: Object {
    id, name, location, lat, lng,
    price, bhk, image, developer
  }
}
```

**Features**:
- Responsive card layout
- Favorite/call actions
- Developer badge
- Hover effects
- Book visit button

---

## Refactored Main Page (`page-refactored.js`)

### Structure
```
Home Component (150 lines vs 1050 lines)
├── State Management (centralized)
├── Custom Hooks (imported)
├── Event Handlers (organized)
└── Render (clean JSX)
    ├── Background Effects
    ├── Header
    ├── LocationSheet
    ├── HeroSection
    ├── VirtualTours Carousel
    └── Properties Carousel
```

### Benefits
- **90% reduction** in component size
- **Clear responsibilities** for each section
- **Easy to modify** individual features
- **Testable** - each component isolated
- **Reusable** - components can be used elsewhere

---

## Migration Guide

### Step 1: Backup Original
```bash
# Keep original file for reference
mv src/app/page.js src/app/page-original.js
```

### Step 2: Use Refactored Version
```bash
# Rename refactored version
mv src/app/page-refactored.js src/app/page.js
```

### Step 3: Verify Functionality
- Test search functionality
- Test location selection
- Test property filtering
- Test carousel scrolling
- Test video hover behavior

---

## Component Dependencies

```
page.js
├── Header.jsx
│   ├── ui/avatar
│   ├── ui/button
│   └── ui/sheet
├── HeroSection.jsx
│   ├── framer-motion
│   ├── maps/OlaMapSearch
│   └── next/image
├── LocationSheet.jsx
│   ├── maps/OlaMapSearch
│   ├── maps/OlaMapViewer
│   └── ui/sheet, badge, button
├── CarouselSection.jsx
│   └── ui/button
├── VirtualTourCard.jsx
│   ├── ui/card, badge
│   ├── next/image
│   └── utils/videoHelpers
├── PropertyCard.jsx
│   ├── ui/card, badge, button
│   └── next/image
├── hooks/useScrollDetection
├── hooks/usePropertyFilter
└── constants/propertyData
```

---

## Future Improvements

### 1. API Integration
Replace `constants/propertyData.js` with API calls:
```javascript
// services/propertyService.js
export async function fetchProperties() {
  const response = await fetch('/api/properties');
  return response.json();
}
```

### 2. Add Tests
```javascript
// __tests__/PropertyCard.test.jsx
import { render, screen } from '@testing-library/react';
import PropertyCard from '@/components/PropertyCard';

test('renders property name', () => {
  render(<PropertyCard property={mockProperty} />);
  expect(screen.getByText('Esto Arkis')).toBeInTheDocument();
});
```

### 3. Performance Optimization
- Implement virtual scrolling for large lists
- Lazy load images
- Code split carousel sections

### 4. Accessibility
- Add ARIA labels
- Keyboard navigation for carousel
- Focus management in modals

---

## File Structure

```
consumer-frontend/
├── src/
│   ├── app/
│   │   ├── page.js (refactored main page)
│   │   └── page-original.js (backup)
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── LocationSheet.jsx
│   │   ├── CarouselSection.jsx
│   │   ├── VirtualTourCard.jsx
│   │   ├── PropertyCard.jsx
│   │   ├── maps/
│   │   └── ui/
│   ├── constants/
│   │   └── propertyData.js
│   ├── hooks/
│   │   ├── useScrollDetection.js
│   │   └── usePropertyFilter.js
│   └── lib/
│       └── utils/
│           └── videoHelpers.js
```

---

## Summary

### What Changed
✅ **Split 1050 lines** into 9 focused modules  
✅ **Extracted reusable components** (Header, HeroSection, etc.)  
✅ **Created custom hooks** for common logic  
✅ **Separated data** from components  
✅ **Added utility functions** for video handling  

### What Stayed the Same
✅ All original functionality preserved  
✅ Same UI/UX experience  
✅ Same dependencies (no new packages)  
✅ Same performance characteristics  

### What Improved
✅ **Maintainability** - easier to update individual features  
✅ **Testability** - can test components in isolation  
✅ **Reusability** - components can be used in other pages  
✅ **Readability** - clear component boundaries  
✅ **Scalability** - easier to add new features  

---

## Questions & Support

For questions about the refactored architecture, refer to:
- Individual component files (well-commented)
- This documentation
- Original `page-original.js` for comparison
