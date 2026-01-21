"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook for making authenticated API requests with automatic token refresh
 * @returns {object} Object with API methods (get, post, put, patch, delete)
 */
export function useApi() {
  const auth = useAuth();

  const apiFetch = useCallback(
    async (url, options = {}) => {
      let response;

      // Merge headers (cookies are sent automatically)
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      // Make the request (cookies sent automatically with credentials: 'include')
      response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      // If 401 (Unauthorized), try to refresh token and retry
      if (response.status === 401 && !auth.isRefreshing) {
        const tokenRefreshed = await auth.refreshAccessToken();

        if (tokenRefreshed) {
          // Retry request with refreshed cookies
          response = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
          });
        }
      }

      return response;
    },
    [auth]
  );

  return {
    fetch: apiFetch,
    get: useCallback(
      (url, options = {}) =>
        apiFetch(url, { method: "GET", ...options }),
      [apiFetch]
    ),
    post: useCallback(
      (url, data, options = {}) =>
        apiFetch(url, { method: "POST", body: JSON.stringify(data), ...options }),
      [apiFetch]
    ),
    put: useCallback(
      (url, data, options = {}) =>
        apiFetch(url, { method: "PUT", body: JSON.stringify(data), ...options }),
      [apiFetch]
    ),
    patch: useCallback(
      (url, data, options = {}) =>
        apiFetch(url, {
          method: "PATCH",
          body: JSON.stringify(data),
          ...options,
        }),
      [apiFetch]
    ),
    delete: useCallback(
      (url, options = {}) =>
        apiFetch(url, { method: "DELETE", ...options }),
      [apiFetch]
    ),
  };
}
