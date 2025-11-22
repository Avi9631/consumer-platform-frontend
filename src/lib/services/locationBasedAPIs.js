/**
 * Backend API Integration Examples
 * 
 * This file shows how to send location data from Zustand store
 * to your backend APIs for filtering properties, services, and products
 */

import useLocationStore from '@/stores/locationStore';

/**
 * 1. Fetch Properties Based on Location
 * 
 * Backend endpoint expects: POST /api/properties/search
 * Body: { latitude, longitude, locationRefId, radius }
 */
export async function fetchPropertiesByLocation(radius = 5, filters = {}) {
  const { lat, lng, refId } = useLocationStore.getState().location;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      latitude: lat,
      longitude: lng,
      locationRefId: refId,
      radius, // in kilometers
      ...filters, // bedrooms, bathrooms, priceRange, etc.
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch properties');
  return response.json();
}

/**
 * 2. Fetch Services Based on Location
 * 
 * Backend endpoint expects: GET /api/services?lat=x&lng=y&refId=z&type=service_type
 */
export async function fetchServicesByLocation(serviceType = 'all') {
  const { lat, lng, refId, city } = useLocationStore.getState().location;

  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    city,
    type: serviceType,
    radius: '10', // 10km radius for services
  });

  if (refId) params.append('refId', refId);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/services?${params}`
  );

  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
}

/**
 * 3. Fetch Products/Listings Based on Location
 * 
 * Backend endpoint expects: POST /api/listings
 * Body: { location: { latitude, longitude, refId }, category, filters }
 */
export async function fetchListingsByLocation(category = 'all', filters = {}) {
  const location = useLocationStore.getState().location;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: {
        latitude: location.lat,
        longitude: location.lng,
        refId: location.refId,
        city: location.city,
        name: location.name,
      },
      category,
      radius: 5,
      ...filters,
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch listings');
  return response.json();
}

/**
 * 4. Fetch Nearby Agents/Developers
 * 
 * Backend endpoint expects: GET /api/agents/nearby?lat=x&lng=y&radius=z
 */
export async function fetchNearbyAgents(radius = 10) {
  const { lat, lng } = useLocationStore.getState().location;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/agents/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
  );

  if (!response.ok) throw new Error('Failed to fetch agents');
  return response.json();
}

/**
 * 5. Save User's Preferred Location to Backend
 * 
 * Backend endpoint expects: POST /api/user/preferences/location
 * Body: { latitude, longitude, refId, name, city }
 */
export async function saveUserLocationPreference(userId) {
  const location = useLocationStore.getState().location;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user/preferences/location`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Your auth token
      },
      body: JSON.stringify({
        userId,
        location: {
          latitude: location.lat,
          longitude: location.lng,
          refId: location.refId,
          name: location.name,
          city: location.city,
          formattedAddress: location.formattedAddress,
        },
      }),
    }
  );

  if (!response.ok) throw new Error('Failed to save location preference');
  return response.json();
}

/**
 * 6. Search Properties with Advanced Filters
 * 
 * Backend endpoint expects: POST /api/properties/advanced-search
 */
export async function advancedPropertySearch(filters) {
  const { lat, lng, refId, city } = useLocationStore.getState().location;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/properties/advanced-search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: {
          latitude: lat,
          longitude: lng,
          refId,
          city,
        },
        filters: {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          bedrooms: filters.bedrooms,
          bathrooms: filters.bathrooms,
          propertyType: filters.propertyType,
          amenities: filters.amenities,
          radius: filters.radius || 5,
        },
        sort: filters.sortBy || 'recommended',
        page: filters.page || 1,
        limit: filters.limit || 20,
      }),
    }
  );

  if (!response.ok) throw new Error('Failed to search properties');
  return response.json();
}

/**
 * 7. Get Location Statistics/Analytics
 * 
 * Backend endpoint expects: GET /api/analytics/location?lat=x&lng=y
 */
export async function getLocationAnalytics() {
  const { lat, lng, refId } = useLocationStore.getState().location;

  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
  });

  if (refId) params.append('refId', refId);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/location?${params}`
  );

  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
}

/**
 * 8. React Hook for Fetching Data Based on Location Changes
 * 
 * Usage in component:
 * const { properties, loading, error } = useLocationBasedProperties();
 */
import { useState, useEffect } from 'react';

export function useLocationBasedProperties(filters = {}) {
  const location = useLocationStore((state) => state.location);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPropertiesByLocation(filters.radius, filters);
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if we have valid coordinates
    if (location.lat && location.lng) {
      loadProperties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.lat, location.lng, location.refId]); // Re-fetch when location changes

  return { properties, loading, error };
}

/**
 * 9. Example Component Using Location-Based Data
 */
export function PropertiesNearMe() {
  const location = useLocationStore((state) => state.location);
  const { properties, loading, error } = useLocationBasedProperties({ radius: 5 });

  if (loading) return <div>Loading properties near {location.name}...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Properties near {location.name}</h2>
      <p>
        Found {properties.length} properties within 5km of your location
      </p>
      {/* Render properties */}
    </div>
  );
}

/**
 * 10. Backend Controller Example (Node.js/Express)
 * 
 * This is how your backend should handle location-based queries
 */
/*
// backend/controllers/propertyController.js

export async function searchProperties(req, res) {
  try {
    const { latitude, longitude, locationRefId, radius, ...filters } = req.body;

    // Query properties within radius using PostGIS or similar
    const properties = await Property.findAll({
      where: {
        // Use ST_DWithin for PostGIS
        location: sequelize.literal(
          `ST_DWithin(
            location::geography,
            ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
            ${radius * 1000}
          )`
        ),
        ...filters, // Apply other filters
      },
      order: [
        [sequelize.literal(`ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
        )`), 'ASC']
      ],
    });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
      location: {
        latitude,
        longitude,
        refId: locationRefId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
*/

/**
 * Environment Variables to Add
 * 
 * In your .env.local file:
 * NEXT_PUBLIC_API_URL=http://localhost:3000
 * or
 * NEXT_PUBLIC_API_URL=https://api.yourdomain.com
 */
