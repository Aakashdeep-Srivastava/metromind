"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { reverseGeocode } from "@/lib/osm-services"

// Default location (Bengaluru)
const DEFAULT_LOCATION = {
  lat: 12.9716,
  lng: 77.5946,
  district: "Bengaluru Urban",
  city: "Bengaluru",
  country: "India",
}

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
  // Initialize with default location
  const [district, setDistrict] = useState<string | null>(DEFAULT_LOCATION.district)
  const [city, setCity] = useState<string | null>(DEFAULT_LOCATION.city)
  const [country, setCountry] = useState<string | null>(DEFAULT_LOCATION.country)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>({ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchCityName = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true)
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
        toast({
          title: "Location Error",
          description: "Could not determine location details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const requestLocation = useCallback(() => {
    setIsLoading(true)
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchCityName(latitude, longitude)
      },
      () => {
        setError("Unable to retrieve your location.")
        setIsLoading(false)
        toast({
          title: "Location Access Denied",
          description: "Please enable location services to get city-specific data.",
          variant: "destructive",
        })
      },
    )
  }, [fetchCityName, toast])

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
    [toast],
  )

  const refreshLocationData = useCallback(() => {
    if (coords) {
      fetchCityName(coords.lat, coords.lng)
    }
  }, [coords, fetchCityName])

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding")
    if (hasCompletedOnboarding) {
      requestLocation()
    } else {
      setIsLoading(false)
    }
  }, [requestLocation])

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
