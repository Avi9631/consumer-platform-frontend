/**
 * Property Service
 * API service for property search and retrieval
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Search properties within a radius of a location
 * @param {Object} params - Search parameters
 * @param {number} params.latitude - Center latitude
 * @param {number} params.longitude - Center longitude
 * @param {number} params.radius - Search radius in kilometers
 * @param {string} params.propertyType - Property type filter (optional)
 * @param {string} params.status - Property status filter (optional)
 * @returns {Promise<Array>} Array of properties
 */
export const searchProperties = async ({ latitude, longitude, radius, propertyType, status = 'ACTIVE' }) => {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lng: longitude.toString(),
      radius: radius.toString(),
      status,
    });

    if (propertyType && propertyType !== 'all') {
      params.append('propertyType', propertyType);
    }

    const response = await fetch(`${API_BASE_URL}/api/properties/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Property search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.properties || data.data || [];
  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
};

/**
 * Get property details by ID
 * @param {number} propertyId - Property ID
 * @returns {Promise<Object>} Property details
 */
export const getPropertyDetails = async (propertyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get property details: ${response.statusText}`);
    }

    const data = await response.json();
    return data.property || data.data || null;
  } catch (error) {
    console.error('Error getting property details:', error);
    return null;
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First point latitude
 * @param {number} lng1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lng2 - Second point longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Mock property data for development
 * Replace this with actual API call once backend is ready
 * @param {number} centerLat - Center latitude
 * @param {number} centerLng - Center longitude
 * @param {number} radius - Search radius in kilometers
 * @returns {Array} Array of properties within radius
 */
export const getMockProperties = (centerLat, centerLng, radius) => {
  const mockProperties = [
    {
      propertyId: 1,
      propertyName: 'Luxury Villa in Green Park',
      latitude: 28.5600,
      longitude: 77.2070,
      propertyType: 'villa',
      price: 25000000,
      area: 3500,
      bedrooms: 4,
      bathrooms: 3,
      image: '/api/placeholder/400/300',
      status: 'ACTIVE',
      description: 'Beautiful 4BHK villa with modern amenities',
    },
    {
      propertyId: 2,
      propertyName: 'Modern Apartment in Saket',
      latitude: 28.5244,
      longitude: 77.2066,
      propertyType: 'apartment',
      price: 8500000,
      area: 1800,
      bedrooms: 3,
      bathrooms: 2,
      image: '/api/placeholder/400/300',
      status: 'ACTIVE',
      description: 'Spacious 3BHK apartment with parking',
    },
    {
      propertyId: 3,
      propertyName: 'Commercial Space in Nehru Place',
      latitude: 28.5494,
      longitude: 77.2501,
      propertyType: 'commercial',
      price: 45000000,
      area: 5000,
      bedrooms: 0,
      bathrooms: 4,
      image: '/api/placeholder/400/300',
      status: 'ACTIVE',
      description: 'Prime commercial property in business hub',
    },
    {
      propertyId: 4,
      propertyName: 'Penthouse in Greater Kailash',
      latitude: 28.5494,
      longitude: 77.2410,
      propertyType: 'penthouse',
      price: 35000000,
      area: 4200,
      bedrooms: 5,
      bathrooms: 4,
      image: '/api/placeholder/400/300',
      status: 'ACTIVE',
      description: 'Luxury penthouse with terrace garden',
    },
    {
      propertyId: 5,
      propertyName: 'Cottage in Vasant Kunj',
      latitude: 28.5200,
      longitude: 77.1590,
      propertyType: 'cottage',
      price: 12000000,
      area: 2200,
      bedrooms: 3,
      bathrooms: 2,
      image: '/api/placeholder/400/300',
      status: 'ACTIVE',
      description: 'Cozy cottage in peaceful neighborhood',
    },
    {
      propertyId: 6,
      propertyName: 'Studio Apartment in Hauz Khas',
      latitude: 28.5494,
      longitude: 77.1960,
      propertyType: 'apartment',
      price: 3500000,
      area: 600,
      bedrooms: 1,
      bathrooms: 1,
      image: '/api/placeholder/400/300',
      status: 'ACTIVE',
      description: 'Compact studio perfect for singles',
    },
  ];

  // Filter properties within radius
  const filteredProperties = mockProperties.filter(property => {
    const distance = calculateDistance(
      centerLat,
      centerLng,
      property.latitude,
      property.longitude
    );
    return distance <= radius;
  });

  // Add distance to each property
  return filteredProperties.map(property => ({
    ...property,
    distance: calculateDistance(
      centerLat,
      centerLng,
      property.latitude,
      property.longitude
    ),
  }));
};

const propertyService = {
  searchProperties,
  getPropertyDetails,
  calculateDistance,
  getMockProperties,
};

export default propertyService;
