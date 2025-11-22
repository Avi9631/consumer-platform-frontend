# Ola Maps Components

This directory contains refactored, production-ready components for integrating Ola Maps in the consumer frontend application.

## 🏗️ Architecture

The Ola Maps integration follows a clean, modular architecture:

```
src/
├── components/maps/          # UI Components
│   ├── OlaMapSearch.jsx     # Search component with autocomplete
│   ├── OlaMapViewer.jsx     # Interactive map viewer
│   ├── LocationPicker.jsx   # Complete location picker (Search + Map)
│   ├── MapErrorBoundary.jsx # Error handling wrapper
│   └── index.js             # Centralized exports
├── hooks/                    # Custom React Hooks
│   ├── useOlaMapSearch.js   # Search logic & state management
│   └── useOlaMapViewer.js   # Map viewer logic & state management
├── lib/
│   ├── constants/maps.js    # Configuration constants
│   └── services/            # API Services
│       ├── olaMapsService.js   # Ola Maps API integration
│       └── olaMapsLoader.js    # SDK loader utility
```

## 📦 Components

### OlaMapSearch
Autocomplete search component with debounced suggestions.

**Features:**
- Debounced search (300ms)
- Keyboard navigation (Arrow keys, Enter, Escape)
- Error handling with user-friendly messages
- Customizable placeholder and initial value

**Usage:**
```jsx
import { OlaMapSearch } from '@/components/maps';

<OlaMapSearch
  onPlaceSelect={(place) => console.log(place)}
  placeholder="Search location..."
  initialValue=""
/>
```

### OlaMapViewer
Interactive map with marker placement and drag.

**Features:**
- Click to place marker
- Drag marker to reposition
- Current location button
- Fullscreen mode
- Reverse geocoding on marker placement

**Usage:**
```jsx
import { OlaMapViewer } from '@/components/maps';

<OlaMapViewer
  center={{ lat: 28.6139, lng: 77.2090 }}
  zoom={15}
  marker={{ lat: 28.6139, lng: 77.2090, draggable: true }}
  onMapClick={(data) => console.log(data)}
  onMarkerDragEnd={(data) => console.log(data)}
  height="400px"
  interactive={true}
  showCurrentLocation={true}
/>
```

### LocationPicker
Complete solution combining search and map.

**Features:**
- Integrated search and map
- Selected location display with badges
- City and locality extraction
- Clear selection button
- Helpful instructions

**Usage:**
```jsx
import { LocationPicker } from '@/components/maps';

<LocationPicker
  value={null}
  onChange={(location) => console.log(location)}
  initialCenter={{ lat: 28.6139, lng: 77.2090 }}
  height="400px"
/>
```

### MapErrorBoundary
Error boundary for graceful error handling.

**Usage:**
```jsx
import { MapErrorBoundary, LocationPicker } from '@/components/maps';

<MapErrorBoundary onReset={() => console.log('Reset')}>
  <LocationPicker onChange={handleChange} />
</MapErrorBoundary>
```

## 🎣 Custom Hooks

### useOlaMapSearch
Manages search state, debouncing, and place selection.

**Returns:** `[state, handlers]`

### useOlaMapViewer
Manages map initialization, markers, and interactions.

**Returns:** `[state, handlers, refs]`

## ⚙️ Configuration

All configuration is centralized in `lib/constants/maps.js`:

- Map defaults (center, zoom, height)
- Search configuration (debounce delay, min query length)
- Geolocation options
- Error messages
- Map styles and marker config

## 🔑 Environment Setup

Create `.env.local` file:
```
NEXT_PUBLIC_OLA_MAPS_API_KEY=your_api_key_here
```

## 🎨 Styling

Components use:
- Tailwind CSS for styling
- shadcn/ui components for UI elements
- Lucide React for icons
- Custom marker SVG with configurable colors

## 🐛 Error Handling

All components include:
- Try-catch blocks for API calls
- User-friendly error messages
- Loading states
- Fallback UI for failures
- Error boundary wrapper available

## 📝 Best Practices

1. **Always wrap maps in MapErrorBoundary** for production
2. **Use constants** from `lib/constants/maps.js` instead of magic numbers
3. **Handle loading states** - all hooks provide loading flags
4. **Validate coordinates** before using them
5. **Clean up effects** - hooks handle cleanup automatically

## 🔄 Refactoring Done

- ✅ Eliminated duplicate service files
- ✅ Created reusable custom hooks
- ✅ Centralized configuration constants
- ✅ Improved error handling
- ✅ Added comprehensive JSDoc documentation
- ✅ Consistent code style and patterns
- ✅ Removed code duplication
- ✅ Better separation of concerns
