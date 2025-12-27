/**
 * Developer Service
 * API service for developer search, listing, and retrieval
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Get developers with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10, max: 100)
 * @returns {Promise<Object>} Paginated developer list
 */
export const getDevelopers = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/developer-consumer-api/list?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching developers:', error);
    throw error;
  }
};

/**
 * Search developers by name
 * @param {Object} params - Search parameters
 * @param {string} params.name - Search term for developer name
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10, max: 100)
 * @returns {Promise<Object>} Search results with developers array and pagination
 */
export const searchDevelopers = async ({ name, page = 1, limit = 10 }) => {
  try {
    if (!name || name.trim() === '') {
      throw new Error('Search name is required');
    }

    const params = new URLSearchParams({
      name: name.trim(),
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/developer-consumer-api/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching developers:', error);
    throw error;
  }
};

/**
 * Get developer by ID
 * @param {string} developerId - Developer unique identifier
 * @returns {Promise<Object>} Developer details
 */
export const getDeveloperById = async (developerId) => {
  try {
    if (!developerId) {
      throw new Error('Developer ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/api/developer-consumer-api/${developerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching developer by ID:', error);
    throw error;
  }
};

/**
 * Get metadata from developer data
 * @returns {Promise<Object>} Developer metadata
 */
export const getDeveloperMetadata = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/developer-consumer-api/metadata`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching developer metadata:', error);
    throw error;
  }
};
