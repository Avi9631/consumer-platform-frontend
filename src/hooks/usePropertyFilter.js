import { useMemo } from "react";

/**
 * Calculate distance between two coordinates using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Custom hook to filter properties based on location and radius
 * @param {Array} properties - Array of property objects
 * @param {Object} selectedLocation - Selected location with lat/lng
 * @param {number} radius - Radius in kilometers (default: 5)
 * @returns {Array} - Filtered properties within the radius
 */
export function usePropertyFilter(properties, selectedLocation, radius = 5) {
  const filteredProperties = useMemo(() => {
    if (!selectedLocation) return properties;
    
    return properties.filter((property) => {
      const distance = calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        property.lat,
        property.lng
      );
      return distance <= radius;
    });
  }, [properties, selectedLocation, radius]);

  return filteredProperties;
}

export { calculateDistance };
