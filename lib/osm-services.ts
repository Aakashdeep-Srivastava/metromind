// lib/osm-services.ts - OpenStreetMap Services (Free & Open Source)

// Types for location services
export interface LocationDetails {
  lat: number
  lng: number
  displayName: string
  district: string
  city: string
  country: string
  address: {
    road?: string
    suburb?: string
    city?: string
    state?: string
    country?: string
    postcode?: string
  }
}

export interface SearchResult {
  placeId: string
  lat: number
  lng: number
  displayName: string
  type: string
  importance: number
  address: {
    road?: string
    suburb?: string
    city?: string
    state?: string
    country?: string
  }
}

export interface PlaceResult {
  name: string
  lat: number
  lng: number
  type: string
  distance?: number
  address?: string
}

// Cache utility
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number) {
    this.cache.set(key, { data, timestamp: Date.now(), ttl })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }
}

const cache = new SimpleCache()

// Nominatim API base URL (free, open-source geocoding)
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org"

// User-Agent header (required by Nominatim)
const headers = {
  "User-Agent": "MetroMind/1.0 (City Intelligence App)",
  "Accept-Language": "en",
}

/**
 * Reverse geocoding using Nominatim (free)
 * Converts coordinates to address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationDetails | null> {
  const cacheKey = `reverse_${lat.toFixed(4)}_${lng.toFixed(4)}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers }
    )

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`)
    }

    const data = await response.json()

    if (!data || data.error) {
      throw new Error(data?.error || "No results found")
    }

    const result: LocationDetails = {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      displayName: data.display_name,
      district: data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || "Unknown District",
      city: data.address?.city || data.address?.town || data.address?.village || "Unknown City",
      country: data.address?.country || "Unknown Country",
      address: {
        road: data.address?.road,
        suburb: data.address?.suburb,
        city: data.address?.city || data.address?.town,
        state: data.address?.state,
        country: data.address?.country,
        postcode: data.address?.postcode,
      },
    }

    cache.set(cacheKey, result, 10 * 60 * 1000) // 10 minutes cache
    return result
  } catch (error) {
    console.error("Reverse geocoding error:", error)
    return null
  }
}

/**
 * Forward geocoding / Search using Nominatim (free)
 * Converts address/place name to coordinates
 */
export async function searchPlaces(query: string, limit = 5): Promise<SearchResult[]> {
  const cacheKey = `search_${query}_${limit}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1`,
      { headers }
    )

    if (!response.ok) {
      throw new Error(`Nominatim search error: ${response.status}`)
    }

    const data = await response.json()

    const results: SearchResult[] = data.map((item: any) => ({
      placeId: item.place_id?.toString(),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      type: item.type,
      importance: item.importance,
      address: {
        road: item.address?.road,
        suburb: item.address?.suburb,
        city: item.address?.city || item.address?.town,
        state: item.address?.state,
        country: item.address?.country,
      },
    }))

    cache.set(cacheKey, results, 5 * 60 * 1000) // 5 minutes cache
    return results
  } catch (error) {
    console.error("Place search error:", error)
    return []
  }
}

/**
 * Search for nearby places using Overpass API (free)
 * More powerful than Nominatim for POI search
 */
export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  type: string = "amenity",
  radius: number = 1000
): Promise<PlaceResult[]> {
  const cacheKey = `nearby_${lat.toFixed(3)}_${lng.toFixed(3)}_${type}_${radius}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  try {
    // Overpass API query for nearby places
    const query = `
      [out:json][timeout:10];
      (
        node["${type}"](around:${radius},${lat},${lng});
        way["${type}"](around:${radius},${lat},${lng});
      );
      out center 20;
    `

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`)
    }

    const data = await response.json()

    const results: PlaceResult[] = data.elements
      .filter((el: any) => el.tags?.name)
      .map((el: any) => {
        const elLat = el.lat || el.center?.lat
        const elLng = el.lon || el.center?.lon

        return {
          name: el.tags.name,
          lat: elLat,
          lng: elLng,
          type: el.tags[type] || type,
          distance: calculateDistance(lat, lng, elLat, elLng),
          address: el.tags["addr:street"]
            ? `${el.tags["addr:street"]}${el.tags["addr:housenumber"] ? " " + el.tags["addr:housenumber"] : ""}`
            : undefined,
        }
      })
      .sort((a: PlaceResult, b: PlaceResult) => (a.distance || 0) - (b.distance || 0))

    cache.set(cacheKey, results, 5 * 60 * 1000)
    return results
  } catch (error) {
    console.error("Nearby places search error:", error)
    return []
  }
}

/**
 * Quick place search using Photon API (faster alternative)
 * Powered by OpenStreetMap data
 */
export async function quickSearch(query: string, lat?: number, lng?: number, limit = 5): Promise<SearchResult[]> {
  const cacheKey = `photon_${query}_${lat}_${lng}_${limit}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  try {
    let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${limit}`

    // Add location bias if coordinates provided
    if (lat && lng) {
      url += `&lat=${lat}&lon=${lng}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Photon API error: ${response.status}`)
    }

    const data = await response.json()

    const results: SearchResult[] = data.features.map((feature: any) => ({
      placeId: feature.properties.osm_id?.toString(),
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      displayName: formatPhotonResult(feature.properties),
      type: feature.properties.osm_value || feature.properties.type,
      importance: feature.properties.importance || 0,
      address: {
        road: feature.properties.street,
        suburb: feature.properties.district,
        city: feature.properties.city,
        state: feature.properties.state,
        country: feature.properties.country,
      },
    }))

    cache.set(cacheKey, results, 5 * 60 * 1000)
    return results
  } catch (error) {
    console.error("Quick search error:", error)
    // Fallback to Nominatim
    return searchPlaces(query, limit)
  }
}

/**
 * Format Photon result into display name
 */
function formatPhotonResult(props: any): string {
  const parts = []
  if (props.name) parts.push(props.name)
  if (props.street) parts.push(props.street)
  if (props.district) parts.push(props.district)
  if (props.city) parts.push(props.city)
  if (props.state) parts.push(props.state)
  if (props.country) parts.push(props.country)
  return parts.join(", ")
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

/**
 * Get user's current location using browser Geolocation API
 */
export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  })
}

/**
 * Watch user's location continuously
 */
export function watchLocation(
  onUpdate: (coords: { lat: number; lng: number }) => void,
  onError: (error: GeolocationPositionError) => void
): number {
  if (!navigator.geolocation) {
    onError({ code: 0, message: "Geolocation not supported", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError)
    return -1
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    },
    onError,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    }
  )
}

/**
 * Stop watching location
 */
export function stopWatchingLocation(watchId: number) {
  if (watchId !== -1 && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId)
  }
}

/**
 * Clear all caches
 */
export function clearOSMCache() {
  cache.clear()
}
