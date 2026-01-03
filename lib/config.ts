// Application configuration

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "MetroMind",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    description: "Real-time city intelligence for Bengaluru citizens",
  },

  apis: {
    // Google Maps is optional - using OpenStreetMap (free, open-source)
    googleMaps: {
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      required: false,
    },
    gemini: {
      key: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      required: false,
    },
  },

  // Clerk authentication (configured via environment variables)
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },

  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    pwa: process.env.NEXT_PUBLIC_ENABLE_PWA !== "false",
    offlineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE !== "false",
  },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },

  // Default locations
  defaultLocation: {
    lat: 12.9716,
    lng: 77.5946,
    city: "Bengaluru",
    district: "Bengaluru Urban",
    country: "India",
  },

  // API endpoints - using Google APIs (optional)
  endpoints: {
    geocoding: "https://maps.googleapis.com/maps/api/geocode/json",
    places: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    directions: "https://maps.googleapis.com/maps/api/directions/json",
  },

  // Cache settings
  cache: {
    locationTTL: 10 * 60 * 1000, // 10 minutes
    weatherTTL: 15 * 60 * 1000, // 15 minutes
    trafficTTL: 5 * 60 * 1000, // 5 minutes
  },
}

// Environment detection
export const isDevelopment = process.env.NODE_ENV === "development"
export const isProduction = process.env.NODE_ENV === "production"
export const isTest = process.env.NODE_ENV === "test"
