import { Bed, Building2, Wifi, Car as CarIcon, Shield, Users, Waves, Trees } from "lucide-react";

// Helper functions for data transformation
export const getPriceRange = (roomTypes) => {
  if (!roomTypes || roomTypes.length === 0) return 'N/A';
  const prices = roomTypes
    .map(room => room.pricing?.find(p => p.type === 'Monthly Rent')?.amount)
    .filter(price => price !== undefined);
  if (prices.length === 0) return 'N/A';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `₹${min.toLocaleString('en-IN')}/month` : `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}/month`;
};

export const getAvgPrice = (roomTypes) => {
  if (!roomTypes || roomTypes.length === 0) return 'N/A';
  const prices = roomTypes
    .map(room => room.pricing?.find(p => p.type === 'Monthly Rent')?.amount)
    .filter(price => price !== undefined);
  if (prices.length === 0) return 'N/A';
  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  return `₹${Math.round(avg).toLocaleString('en-IN')}/month`;
};

export const getConfiguration = (roomTypes) => {
  if (!roomTypes || roomTypes.length === 0) return 'N/A';
  const categories = [...new Set(roomTypes.map(room => room.category).filter(Boolean))];
  return categories.join(', ') || 'N/A';
};

export const getRoomSizeRange = (roomTypes) => {
  if (!roomTypes || roomTypes.length === 0) return 'N/A';
  const sizes = roomTypes.map(room => room.roomSize).filter(size => size !== undefined);
  if (sizes.length === 0) return 'N/A';
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  return min === max ? `${min} sq.ft` : `${min} - ${max} sq.ft`;
};

export const extractPincode = (address) => {
  const match = address?.match(/\b\d{6}\b/);
  return match ? match[0] : 'N/A';
};

export const transformRoomTypes = (roomTypes) => {
  if (!roomTypes || roomTypes.length === 0) return [];
  
  return roomTypes.map((room, index) => ({
    id: index + 1,
    name: room.name,
    category: room.category,
    ac: room.amenities?.some(a => a.name?.toLowerCase().includes('ac')),
    attachedWashroom: room.amenities?.some(a => a.name?.toLowerCase().includes('bathroom')),
    balcony: room.amenities?.some(a => a.name?.toLowerCase().includes('balcony')),
    roomSize: room.roomSize ? `${room.roomSize} sq.ft` : 'N/A',
    pricing: room.pricing || [],
    available: room.availability?.availableBeds || 0,
    availability: room.availability || {
      totalBeds: 0,
      availableBeds: 0,
      soldOut: true,
      nextAvailability: 'N/A',
      seasonalPricing: false
    },
    refundPolicy: room.refundPolicy || 'Contact property owner for refund policy',
    amenities: transformRoomAmenities(room.amenities),
    images: transformRoomImages(room.images)
  }));
};

export const transformRoomAmenities = (amenities) => {
  if (!amenities || amenities.length === 0) return [];
  
  return amenities.map(amenity => ({
    icon: Building2,
    name: amenity.name,
    available: amenity.available !== false
  }));
};

export const transformRoomImages = (images) => {
  if (!images || images.length === 0) return [];
  return images.map(img => img.url).filter(Boolean);
};

export const transformImages = (mediaData) => {
  if (!mediaData || mediaData.length === 0) return [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
  ];
  
  const images = mediaData
    .filter(media => media.type === 'image' && media.url)
    .map(media => media.url);
  
  return images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
  ];
};

export const transformCommonAmenities = (amenities) => {
  if (!amenities || amenities.length === 0) return [];
  
  const iconMap = {
    'wifi': Wifi,
    'parking': CarIcon,
    'security': Shield,
    'cctv': Shield,
    'guard': Shield,
    'biometric': Shield,
    'housekeeping': Users,
    'laundry': Waves,
    'water': Waves,
    'lift': Building2,
    'rooftop': Trees,
    'backup': Shield,
    'power': Shield
  };
  
  return amenities.map(amenity => {
    const nameLower = amenity.name?.toLowerCase() || '';
    let icon = Building2;
    
    for (const [key, value] of Object.entries(iconMap)) {
      if (nameLower.includes(key)) {
        icon = value;
        break;
      }
    }
    
    return {
      icon,
      name: amenity.name,
      available: amenity.available !== false
    };
  });
};

export const transformFoodMess = (foodMess) => {
  if (!foodMess || !foodMess.available) {
    return {
      available: false,
      meals: [],
      foodType: 'N/A',
      cookingAllowed: false,
      tiffinService: false,
      roWater: false,
      rating: 0,
      timings: {},
      weeklyMenu: []
    };
  }
  
  return {
    available: foodMess.available,
    meals: foodMess.meals || [],
    foodType: foodMess.foodType || 'N/A',
    cookingAllowed: foodMess.cookingAllowed || false,
    tiffinService: false,
    roWater: false,
    rating: 4.0,
    timings: extractTimings(foodMess.weeklyMenu),
    weeklyMenu: transformWeeklyMenu(foodMess.weeklyMenu) || []
  };
};

export const extractTimings = (weeklyMenu) => {
  if (!weeklyMenu || weeklyMenu.length === 0) return {};
  const firstDay = weeklyMenu[0];
  return {
    breakfast: firstDay.breakfastTiming || 'N/A',
    lunch: firstDay.lunchTiming || 'N/A',
    dinner: firstDay.dinnerTiming || 'N/A'
  };
};

export const transformWeeklyMenu = (weeklyMenu) => {
  if (!weeklyMenu || weeklyMenu.length === 0) return [];
  
  return weeklyMenu.map(menu => ({
    day: menu.day,
    breakfast: {
      veg: menu.breakfast?.veg || [],
      nonVeg: menu.breakfast?.nonVeg || null
    },
    lunch: {
      veg: menu.lunch?.veg || [],
      nonVeg: menu.lunch?.nonVeg || null
    },
    dinner: {
      veg: menu.dinner?.veg || [],
      nonVeg: menu.dinner?.nonVeg || null
    }
  }));
};

export const generateHighlights = (apiData) => {
  const highlights = [];
  
  if (apiData.propertyName) {
    highlights.push(`${apiData.propertyName} in ${apiData.city}`);
  }
  
  if (apiData.isBrandManaged && apiData.brandName) {
    highlights.push(`Managed by ${apiData.brandName}`);
  }
  
  if (apiData.roomTypes && apiData.roomTypes.length > 0) {
    highlights.push(`${apiData.roomTypes.length} room types available`);
  }
  
  if (apiData.foodMess?.available) {
    highlights.push(`${apiData.foodMess.foodType} food available`);
  }
  
  if (apiData.commonAmenities && apiData.commonAmenities.length > 0) {
    highlights.push(`${apiData.commonAmenities.length}+ amenities`);
  }
  
  if (apiData.verificationStatus === 'VERIFIED') {
    highlights.push('Verified property');
  }
  
  return highlights.length > 0 ? highlights : [
    'Premium accommodation',
    'Modern amenities',
    'Professional management'
  ];
};

export const transformApiData = (apiData) => {
  return {
    id: apiData.pgHostelId,
    title: apiData.propertyName,
    subtitle: apiData.addressText || '',
    propertyType: "PG / Hostel",
    genderAllowed: apiData.genderAllowed,
    description: {
      short: apiData.description?.substring(0, 100) || '',
      long: apiData.description || ''
    },
    ownerName: apiData.user ? `${apiData.user.firstName} ${apiData.user.lastName}` : 'N/A',
    managedByBrand: apiData.isBrandManaged,
    brandName: apiData.brandName || '',
    yearBuilt: apiData.yearBuilt?.toString() || 'N/A',
    lastRenovated: 'N/A',
    price: getPriceRange(apiData.roomTypes),
    discount: '',
    configuration: getConfiguration(apiData.roomTypes),
    status: apiData.publishStatus === 'PUBLISHED' ? 'Available' : 'Not Available',
    possession: 'Immediate',
    avgPrice: getAvgPrice(apiData.roomTypes),
    area: getRoomSizeRange(apiData.roomTypes),
    location: {
      fullAddress: apiData.addressText,
      landmark: apiData.landmark || '',
      pincode: extractPincode(apiData.addressText),
      nearby: {
        colleges: [],
        itParks: [],
        transport: [],
        hospitals: []
      }
    },
    roomTypes: transformRoomTypes(apiData.roomTypes),
    images: transformImages(apiData.mediaData),
    commonAmenities: transformCommonAmenities(apiData.commonAmenities),
    foodMess: transformFoodMess(apiData.foodMess),
    rules: apiData.rules || [],
    safety: {
      fireSafetyCertificate: false,
      policeVerification: false,
      firstAidKit: false,
      cctvCoverage: 'N/A',
      emergencyExit: false,
      nightGuard: false
    },
    highlights: generateHighlights(apiData),
    propertyManager: apiData.isBrandManaged ? {
      name: apiData.brandName,
      logo: "/api/placeholder/60/60",
      rating: 4.5,
      properties: 0,
      establishedYear: apiData.yearBuilt
    } : null,
    contact: {
      name: apiData.user ? `${apiData.user.firstName} ${apiData.user.lastName}` : 'N/A',
      role: "Property Owner",
      image: "/api/placeholder/60/60",
      phone: apiData.user?.phone || 'N/A',
      email: apiData.user?.email || 'N/A',
      whatsapp: apiData.user?.phone || 'N/A'
    },
    coordinates: {
      lat: parseFloat(apiData.lat) || 19.0176,
      lng: parseFloat(apiData.lng) || 72.8562
    }
  };
};
