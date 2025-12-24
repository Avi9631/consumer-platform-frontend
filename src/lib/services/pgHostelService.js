/**
 * PG/Co-living/Hostel Service
 * API service for PG/Hostel search and retrieval
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Search PG/Hostels near a location
 * @param {Object} params - Search parameters
 * @param {number} params.latitude - Center latitude
 * @param {number} params.longitude - Center longitude
 * @param {number} params.radius - Search radius in kilometers (default: 5)
 * @param {string} params.genderAllowed - Gender filter (MALE, FEMALE, UNISEX) (optional)
 * @param {boolean} params.isBrandManaged - Brand managed filter (optional)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 50)
 * @returns {Promise<Object>} Search results with pgHostels array and pagination
 */
export const searchNearbyPgHostels = async ({ 
  latitude, 
  longitude, 
  radius = 5, 
  genderAllowed = null,
  isBrandManaged = null,
  page = 1,
  limit = 50
}) => {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lng: longitude.toString(),
      radius: radius.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });

    if (genderAllowed) {
      params.append('genderAllowed', genderAllowed);
    }

    if (isBrandManaged !== null) {
      params.append('isBrandManaged', isBrandManaged.toString());
    }

    const response = await fetch(`${API_BASE_URL}/api/pg-hostel/search-nearby?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PG Hostel search failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Backend returns: { success, data: { pgHostels, searchCenter, pagination } }
    const responseData = result.data || {};
    
    return {
      pgHostels: responseData.pgHostels || [],
      pagination: responseData.pagination || {},
      total: responseData.pagination?.total || 0,
      searchCenter: responseData.searchCenter || null
    };
  } catch (error) {
    console.error('Error searching PG Hostels:', error);
    return {
      pgHostels: [],
      pagination: {},
      total: 0
    };
  }
};

/**
 * Get PG/Hostel details by ID
 * @param {number} pgHostelId - PG/Hostel ID
 * @returns {Promise<Object>} PG/Hostel details
 */
export const getPgHostelById = async (pgHostelId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pg-hostel/${pgHostelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get PG/Hostel details: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result.pgHostel || null;
  } catch (error) {
    console.error('Error getting PG/Hostel details:', error);
    return null;
  }
};

/**
 * Get PG/Hostel details by slug
 * @param {string} slug - PG/Hostel slug
 * @returns {Promise<Object>} PG/Hostel details
 */
export const getPgHostelBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pg-hostel/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get PG/Hostel details: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result.pgHostel || null;
  } catch (error) {
    console.error('Error getting PG/Hostel details:', error);
    return null;
  }
};

/**
 * List PG/Hostels with filters and pagination
 * @param {Object} params - List parameters
 * @param {string} params.publishStatus - Publish status filter (optional)
 * @param {string} params.verificationStatus - Verification status filter (optional)
 * @param {string} params.city - City filter (optional)
 * @param {string} params.locality - Locality filter (optional)
 * @param {string} params.genderAllowed - Gender filter (optional)
 * @param {boolean} params.isBrandManaged - Brand managed filter (optional)
 * @param {string} params.search - Search query (optional)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 50)
 * @returns {Promise<Object>} List results with pgHostels array and pagination
 */
export const listPgHostels = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/pg-hostel/list?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list PG/Hostels: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Backend returns: { success, data: { pgHostels, pagination } }
    const responseData = result.data || {};
    
    return {
      pgHostels: responseData.pgHostels || [],
      pagination: responseData.pagination || {},
      total: responseData.pagination?.total || 0
    };
  } catch (error) {
    console.error('Error listing PG/Hostels:', error);
    return {
      pgHostels: [],
      pagination: {},
      total: 0
    };
  }
};
