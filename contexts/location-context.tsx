"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { reverseGeocode } from "@/lib/osm-services"
import { useAppStore } from "@/stores/app-store"

interface LocationState {
  district: string | null
  city: string | null
  country: string | null
  coords: { lat: number; lng: number } | null
  error: string | null
  isLoading: boolean
  requestLocation: () => void
  setManualLocation: (details: {
    lat: number
    lng: number
    district: string
    city: string
    country: string
  }) => void
  refreshLocationData: () => void
}

const LocationContext = createContext<LocationState | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  // Get Zustand store setLocation function
  const setAppLocation = useAppStore((state) => state.setLocation)

  // Initialize with empty/loading state - no hardcoded defaults
  const [district, setDistrict] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Sync location to Zustand store
  const syncToStore = useCallback((data: {
    lat: number
    lng: number
    district: string
    city: string
    locality?: string
  }) => {
    setAppLocation({
      latitude: data.lat,
      longitude: data.lng,
      city: data.city,
      district: data.district,
      locality: data.locality || data.district,
      isLoading: false,
      error: null,
      lastUpdated: new Date(),
    })
  }, [setAppLocation])

  const fetchCityName = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true)
      setAppLocation({ isLoading: true })

      try {
        // Use OpenStreetMap's Nominatim API (free, no API key required)
        const data = await reverseGeocode(lat, lng)

        if (data) {
          const newDistrict = data.district || "Current Location"
          const newCity = data.city || "Unknown City"
          const newCountry = data.country || "Unknown Country"

          setDistrict(newDistrict)
          setCity(newCity)
          setCountry(newCountry)
          setCoords({ lat, lng })
          setError(null)

          // Sync to Zustand store
          syncToStore({
            lat,
            lng,
            district: newDistrict,
            city: newCity,
            locality: data.address?.suburb || newDistrict,
          })

          // Trigger a custom event to notify other components about location change
          window.dispatchEvent(
            new CustomEvent("locationChanged", {
              detail: { lat, lng, district: newDistrict, city: newCity, country: newCountry },
            }),
          )

          toast({
            title: "Location Updated",
            description: `Now showing data for ${newDistrict}, ${newCity}`,
          })
        } else {
          throw new Error("No location data found")
        }
      } catch (e) {
        console.error("Geocoding failed", e)
        setError("Could not determine city name.")
        setAppLocation({ isLoading: false, error: "Could not determine location" })
        toast({
          title: "Location Error",
          description: "Could not determine location details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast, syncToStore, setAppLocation],
  )

  const requestLocation = useCallback(() => {
    setIsLoading(true)
    setAppLocation({ isLoading: true })

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      setAppLocation({ isLoading: false, error: "Geolocation not supported" })
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchCityName(latitude, longitude)
      },
      (err) => {
        console.error("Geolocation error:", err)
        setError("Unable to retrieve your location.")
        setIsLoading(false)
        setAppLocation({ isLoading: false, error: "Location access denied" })
        toast({
          title: "Location Access Denied",
          description: "Please enable location services to get local data.",
          variant: "destructive",
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    )
  }, [fetchCityName, toast, setAppLocation])

  const setManualLocation = useCallback(
    (details: {
      lat: number
      lng: number
      district: string
      city: string
      country: string
    }) => {
      setIsLoading(true)
      setCoords({ lat: details.lat, lng: details.lng })
      setDistrict(details.district)
      setCity(details.city)
      setCountry(details.country)
      setError(null)

      // Sync to Zustand store
      syncToStore({
        lat: details.lat,
        lng: details.lng,
        district: details.district,
        city: details.city,
      })

      // Trigger location change event
      window.dispatchEvent(
        new CustomEvent("locationChanged", {
          detail: details,
        }),
      )

      toast({
        title: "Location Changed",
        description: `Now showing data for ${details.district}, ${details.city}`,
      })

      // Simulate loading for smooth UX
      setTimeout(() => setIsLoading(false), 500)
    },
    [toast, syncToStore],
  )

  const refreshLocationData = useCallback(() => {
    if (coords) {
      fetchCityName(coords.lat, coords.lng)
    }
  }, [coords, fetchCityName])

  // Auto-request location on mount
  useEffect(() => {
    // Always try to get user's real location
    requestLocation()
  }, []) // Empty dependency - run once on mount

  return (
    <LocationContext.Provider
      value={{
        district,
        city,
        country,
        coords,
        error,
        isLoading,
        requestLocation,
        setManualLocation,
        refreshLocationData,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
