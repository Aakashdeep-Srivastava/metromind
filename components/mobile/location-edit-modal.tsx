"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLocation } from "@/contexts/location-context"
import { Search, MapPin, Loader2, Navigation } from "lucide-react"
import { quickSearch, reverseGeocode, type SearchResult } from "@/lib/osm-services"

interface LocationEditModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LocationEditModal({ isOpen, onClose }: LocationEditModalProps) {
  const { requestLocation, setManualLocation } = useLocation()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchSuggestions = useCallback(async () => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      const results = await quickSearch(query, undefined, undefined, 5)
      setSuggestions(results)
    } catch (error) {
      console.error("Search error:", error)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }, [query])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query, fetchSuggestions])

  const handleSelectSuggestion = async (result: SearchResult) => {
    setIsLoading(true)
    try {
      const locationDetails = await reverseGeocode(result.lat, result.lng)

      const district = locationDetails?.district || result.address?.suburb || "Selected Location"
      const city = locationDetails?.city || result.address?.city || "Unknown City"
      const country = locationDetails?.country || result.address?.country || "Unknown Country"

      setManualLocation({
        lat: result.lat,
        lng: result.lng,
        district,
        city,
        country,
      })

      setQuery("")
      setSuggestions([])
      onClose()
    } catch (error) {
      console.error("Error selecting location:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseCurrentLocation = () => {
    requestLocation()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Location</DialogTitle>
          <DialogDescription>
            Search for a new area or use your current location. All data will update automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a city or neighborhood..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {isLoading || isSearching ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">
                {isLoading ? "Updating location data..." : "Searching..."}
              </span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.placeId}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left p-2 rounded-md hover:bg-accent flex items-start gap-3 transition-colors"
              >
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{suggestion.displayName.split(",")[0]}</p>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.displayName.split(",").slice(1, 3).join(",")}
                  </p>
                </div>
              </button>
            ))
          ) : query.trim() ? (
            <div className="text-center p-4 text-sm text-muted-foreground">
              No locations found. Try a different search term.
            </div>
          ) : null}
        </div>
        <Button variant="outline" onClick={handleUseCurrentLocation} className="w-full bg-transparent">
          <Navigation className="mr-2 h-4 w-4" />
          Use My Current Location
        </Button>
      </DialogContent>
    </Dialog>
  )
}
