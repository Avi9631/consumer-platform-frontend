/**
 * Co-Living Service
 * Service for co-living space search and retrieval using local data
 */

import colivingData from '@/app/coliving/colivingdata.js';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Search Co-Living Spaces near a location using PostGIS geometry
 * @param {Object} params - Search parameters
 * @param {number} params.latitude - Center latitude
 * @param {number} params.longitude - Center longitude
 * @param {number} params.radius - Search radius in kilometers (default: 5)
 * @param {string} params.sharingType - Sharing type filter (single, double, triple, studio) (optional)
 * @param {number} params.minPrice - Minimum price filter (optional)
 * @param {number} params.maxPrice - Maximum price filter (optional)
 * @param {string} params.foodOption - Food option filter (Inclusive, Optional) (optional)
 * @param {boolean} params.isPopular - Show only popular properties (optional)
 * @param {string} params.brandName - Filter by brand name (optional)
 * @param {array} params.amenities - Array of required amenities (optional)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 50)
 * @returns {Promise<Object>} Search results with coLivingSpaces array and pagination
 */
export const searchNearbyCoLiving = async ({ 
  latitude, 
  longitude, 
  radius = 5, 
  sharingType = null,
  minPrice = null,
  maxPrice = null,
  foodOption = null,
  isPopular = null,
  brandName = null,
  amenities = [],
  page = 1,
  limit = 50
}) => {
  try {
    // Get all co-living spaces from local data
    const allSpaces = colivingData.data || [];

    // Filter by distance using PostGIS coordinates
    let filteredSpaces = allSpaces.filter(space => {
      const coords = space.geometry?.coordinates || [0, 0];
      const spaceLng = coords[0];
      const spaceLat = coords[1];
      const distance = calculateDistance(latitude, longitude, spaceLat, spaceLng);
      return distance <= radius;
    });

    // Filter by sharing type
    if (sharingType && sharingType !== 'all') {
      filteredSpaces = filteredSpaces.filter(space => {
        const price = space.price || {};
        const sharingLower = sharingType.toLowerCase();
        
        if (sharingLower === 'single' && price.single_sharing > 0) return true;
        if (sharingLower === 'double' && price.double_sharing > 0) return true;
        if (sharingLower === 'triple' && price.triple_sharing > 0) return true;
        if (sharingLower === 'studio' && price.studio_apartment > 0) return true;
        
        return false;
      });
    }

    // Filter by price range
    if (minPrice !== null || maxPrice !== null) {
      filteredSpaces = filteredSpaces.filter(space => {
        const price = space.price || {};
        const prices = [
          price.single_sharing,
          price.double_sharing,
          price.triple_sharing,
          price.studio_apartment
        ].filter(p => p && p > 0);
        
        if (prices.length === 0) return false;
        
        const minSpacePrice = Math.min(...prices);
        
        if (minPrice !== null && minSpacePrice < minPrice) return false;
        if (maxPrice !== null && minSpacePrice > maxPrice) return false;
        
        return true;
      });
    }

    // Filter by food option
    if (foodOption && foodOption !== 'all') {
      filteredSpaces = filteredSpaces.filter(space => {
        const foodAndBeverage = space.other_detail?.food_and_beverage || '';
        return foodAndBeverage.toLowerCase() === foodOption.toLowerCase();
      });
    }

    // Filter by popular
    if (isPopular !== null) {
      filteredSpaces = filteredSpaces.filter(space => {
        return space.is_popular?.value === isPopular;
      });
    }

    // Filter by brand name
    if (brandName && brandName !== 'all') {
      filteredSpaces = filteredSpaces.filter(space => {
        return space.brand?.name?.toLowerCase() === brandName.toLowerCase();
      });
    }

    // Filter by amenities
    if (amenities && amenities.length > 0) {
      filteredSpaces = filteredSpaces.filter(space => {
        const spaceAmenities = space.amenties || [];
        return amenities.every(requiredAmenity => 
          spaceAmenities.some(a => 
            a.name.toLowerCase() === requiredAmenity.toLowerCase() && a.is_available
          )
        );
      });
    }

    // Sort by distance
    filteredSpaces = filteredSpaces.map(space => {
      const coords = space.geometry?.coordinates || [0, 0];
      const distance = calculateDistance(latitude, longitude, coords[1], coords[0]);
      return { ...space, distance };
    }).sort((a, b) => a.distance - b.distance);

    // Apply pagination
    const total = filteredSpaces.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSpaces = filteredSpaces.slice(startIndex, endIndex);

    return {
      coLivingSpaces: paginatedSpaces,
      total: total,
      page: page,
      limit: limit,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error('Error searching co-living spaces:', error);
    throw error;
  }
};

/**
 * Get Co-Living Space by ID with complete details
 * @param {string} id - Co-living space ID
 * @returns {Promise<Object>} Complete co-living space details
 */
export const getCoLivingById = async (id) => {
  try {
    const allSpaces = colivingData.data || [];
    const space = allSpaces.find(s => s._id.trim() == id.trim());
    console.log(id)
    console.log(space)
    if (!space) {
      // Check if ID might be a city ID (common mistake)
      const isCityId = allSpaces.some(s => 
        s.location?.city?._id === id || 
        s.location?.city?.id === id
      );
      
      if (isCityId) {
        throw new Error('This appears to be a city ID, not a co-living space ID. Please check the correct property URL.');
      }
      
      throw new Error('Co-living space not found. This ID may not exist or might belong to a different property type (PG/Hostel).');
    }
    
    return space;
  } catch (error) {
    console.error('Error fetching co-living space:', error);
    throw error;
  }
};

/**
 * Get Co-Living Space by Slug
 * @param {string} slug - Co-living space slug
 * @returns {Promise<Object>} Complete co-living space details
 */
export const getCoLivingBySlug = async (slug) => {
  try {
    const allSpaces = colivingData.data || [];
    const space = allSpaces.find(s => s.slug === slug);
    
    if (!space) {
      throw new Error('Co-living space not found');
    }
    
    return space;
  } catch (error) {
    console.error('Error fetching co-living space by slug:', error);
    throw error;
  }
};

/**
 * Get all brands for co-living
 * @returns {Promise<Array>} Array of brand objects
 */
export const getCoLivingBrands = async () => {
  try {
    const allSpaces = colivingData.data || [];
    const brands = [];
    const brandMap = new Map();
    
    allSpaces.forEach(space => {
      if (space.brand && space.brand.name && !brandMap.has(space.brand._id)) {
        brandMap.set(space.brand._id, space.brand);
        brands.push(space.brand);
      }
    });
    
    return brands;
  } catch (error) {
    console.error('Error fetching co-living brands:', error);
    throw error;
  }
};

/**
 * Get available amenities
 * @returns {Promise<Array>} Array of amenity names
 */
export const getCoLivingAmenities = async () => {
  try {
    const allSpaces = colivingData.data || [];
    const amenitiesSet = new Set();
    
    allSpaces.forEach(space => {
      if (space.amenties) {
        space.amenties.forEach(amenity => {
          if (amenity.is_available) {
            amenitiesSet.add(amenity.name);
          }
        });
      }
    });
    
    return Array.from(amenitiesSet).sort();
  } catch (error) {
    console.error('Error fetching amenities:', error);
    throw error;
  }
};
