"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  /**
   * Refresh access token using refresh token
   * Cookies are automatically sent with credentials: 'include'
   */
  const refreshAccessToken = useCallback(async () => {
    if (isRefreshing) return false;

    setIsRefreshing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        return true;
      } else {
        // Refresh failed, logout user
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  /**
   * Login user with data from OTP verification
   * Tokens are managed via httpOnly cookies
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /**
   * Logout user and clear cookies
   */
  const logout = async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isRefreshing,
        login,
        logout,
        updateUser,
        refreshAccessToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
