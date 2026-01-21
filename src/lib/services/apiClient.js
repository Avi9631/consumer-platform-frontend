/**
 * API Client with automatic token refresh
 * Handles Bearer token authentication and automatic token refresh on 401
 */

let authContextRef = null;

/**
 * Initialize the API client with auth context reference
 * Call this from your root layout or app component
 */
export function initializeApiClient(authContext) {
  authContextRef = authContext;
}

/**
 * Fetch wrapper with automatic token refresh
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(url, options = {}) {
  let response;

  // Get headers from context
  const authHeaders = authContextRef?.getAuthHeaders?.() || {};
  const accessToken = authContextRef?.accessToken;

  // Merge headers
  const headers = {
    "Content-Type": "application/json",
    ...authHeaders,
    ...options.headers,
  };

  // Make the request
  response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Include cookies
  });

  // If 401 (Unauthorized), try to refresh token and retry
  if (response.status === 401 && accessToken && authContextRef?.refreshAccessToken) {
    const tokenRefreshed = await authContextRef.refreshAccessToken();

    if (tokenRefreshed) {
      // Get new auth headers and retry
      const newAuthHeaders = authContextRef.getAuthHeaders();
      const retryHeaders = {
        "Content-Type": "application/json",
        ...newAuthHeaders,
        ...options.headers,
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });
    }
  }

  return response;
}

/**
 * Convenience method for GET requests
 */
export async function apiGet(url, options = {}) {
  return apiFetch(url, {
    method: "GET",
    ...options,
  });
}

/**
 * Convenience method for POST requests
 */
export async function apiPost(url, data, options = {}) {
  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Convenience method for PUT requests
 */
export async function apiPut(url, data, options = {}) {
  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Convenience method for PATCH requests
 */
export async function apiPatch(url, data, options = {}) {
  return apiFetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Convenience method for DELETE requests
 */
export async function apiDelete(url, options = {}) {
  return apiFetch(url, {
    method: "DELETE",
    ...options,
  });
}
