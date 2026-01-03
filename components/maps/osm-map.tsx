// components/maps/osm-map.tsx - OpenStreetMap Component (Free & Open Source)
"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Loader2, MapPin, Search, X, Navigation } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { quickSearch, reverseGeocode, type SearchResult } from "@/lib/osm-services"

interface OSMMapProps {
  fullscreen?: boolean
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
  showReports?: boolean
  reports?: UserReport[]
  onReportSelect?: (report: UserReport | null) => void
  selectedReport?: UserReport | null
  activeFilters?: string[]
  onLocationSelect?: (location: { lat: number; lng: number; address?: string }) => void
  showSearch?: boolean
  showLocationButton?: boolean
  clickToSelect?: boolean
}

export interface UserReport {
  id: string
  userId: string
  userName: string
  userEmail?: string
  location: {
    lat: number
    lng: number
    address?: string
  }
  media: {
    url: string
    type: "image" | "video"
    fileName: string
    size: number
  }
  analysis: {
    category: string
    severity: "low" | "medium" | "high" | "critical"
    description: string
    tags: string[]
    confidence: number
    suggestedActions: string[]
    landmarks: string[]
    aiTitle: string
  }
  userComments?: string
  timestamp: Date
  status: "pending" | "analyzed" | "verified" | "resolved"
  views: number
  helpfulVotes: number
}

export function OSMMap({
  fullscreen = false,
  initialCenter,
  initialZoom = 13,
  showReports = false,
  reports = [],
  onReportSelect,
  selectedReport,
  activeFilters = [],
  onLocationSelect,
  showSearch = false,
  showLocationButton = true,
  clickToSelect = false,
}: OSMMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const userMarkerRef = useRef<any>(null)
  const userCircleRef = useRef<any>(null)

  const [loading, setLoading] = useState(true)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [center, setCenter] = useState(initialCenter || { lat: 12.9716, lng: 77.5946 })
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const LRef = useRef<any>(null)

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      // Load CSS
      const linkExists = document.querySelector('link[href*="leaflet"]')
      if (!linkExists) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Import Leaflet
      const L = await import("leaflet")
      LRef.current = L.default || L

      // Fix default marker icons
      delete (LRef.current.Icon.Default.prototype as any)._getIconUrl
      LRef.current.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      setLeafletLoaded(true)
      setLoading(false)
    }

    loadLeaflet()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapRef.current) return

    const L = LRef.current
    if (!L) return

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: initialZoom,
      zoomControl: true,
    })

    // Add OpenStreetMap tiles (FREE)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Handle click events
    if (clickToSelect) {
      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng
        setSelectedLocation({ lat, lng })
        updateUserMarker(lat, lng)

        const locationDetails = await reverseGeocode(lat, lng)
        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            address: locationDetails?.displayName,
          })
        }
      })
    }

    mapRef.current = map

    // Add initial user marker
    if (initialCenter) {
      updateUserMarker(initialCenter.lat, initialCenter.lng)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [leafletLoaded, clickToSelect])

  // Update user marker
  const updateUserMarker = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || !LRef.current) return

    const L = LRef.current

    // Remove existing markers
    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
    }
    if (userCircleRef.current) {
      userCircleRef.current.remove()
    }

    // Add circle for location accuracy
    userCircleRef.current = L.circle([lat, lng], {
      color: "#4285F4",
      fillColor: "#4285F4",
      fillOpacity: 0.2,
      radius: 50,
    }).addTo(mapRef.current)

    // Add marker
    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: #4285F4;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup("<strong>Your Location</strong>")
  }, [])

  // Update map center
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom())
    }
  }, [center])

  // Get stored reports
  const getStoredReports = useCallback((): UserReport[] => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem("metromind_reports")
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.map((report: any) => ({
          ...report,
          timestamp: new Date(report.timestamp),
        }))
      }
    } catch (error) {
      console.error("Error loading stored reports:", error)
    }
    return []
  }, [])

  // Get filtered reports
  const getFilteredReports = useCallback((): UserReport[] => {
    const allReports = reports.length > 0 ? reports : getStoredReports()
    if (!showReports) return []
    if (activeFilters.length === 0) return allReports
    return allReports.filter(
      (report) =>
        activeFilters.includes(report.analysis.category) ||
        activeFilters.includes(report.analysis.severity)
    )
  }, [reports, getStoredReports, showReports, activeFilters])

  // Update report markers
  useEffect(() => {
    if (!mapRef.current || !LRef.current || !showReports) return

    const L = LRef.current

    // Clear existing report markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const reportsToShow = getFilteredReports()

    reportsToShow.forEach((report) => {
      const color = getSeverityColor(report.analysis.severity)
      const icon = getCategoryIcon(report.analysis.category)

      const markerIcon = L.divIcon({
        className: "report-marker",
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          ">${icon}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker([report.location.lat, report.location.lng], { icon: markerIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="max-width: 250px; padding: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 20px;">${icon}</span>
              <span style="
                padding: 2px 8px;
                background: ${color};
                color: white;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
              ">${report.analysis.severity}</span>
            </div>
            <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${report.analysis.aiTitle}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 8px;">
              ${report.analysis.description.substring(0, 100)}...
            </p>
            <div style="font-size: 11px; color: #888;">
              By ${report.userName} &bull; ${new Date(report.timestamp).toLocaleDateString()}
            </div>
          </div>
        `)

      marker.on("click", () => {
        if (onReportSelect) {
          onReportSelect(report)
        }
      })

      markersRef.current.push(marker)
    })
  }, [showReports, getFilteredReports, onReportSelect])

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await quickSearch(query, center.lat, center.lng, 5)
      setSearchResults(results)
      setShowSearchResults(true)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }, [center])

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, handleSearch])

  // Handle search result selection
  const handleSelectSearchResult = async (result: SearchResult) => {
    setCenter({ lat: result.lat, lng: result.lng })
    setSelectedLocation({ lat: result.lat, lng: result.lng })
    setSearchQuery(result.displayName.split(",")[0])
    setShowSearchResults(false)

    updateUserMarker(result.lat, result.lng)

    if (onLocationSelect) {
      onLocationSelect({
        lat: result.lat,
        lng: result.lng,
        address: result.displayName,
      })
    }
  }

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCenter({ lat: latitude, lng: longitude })
        setSelectedLocation({ lat: latitude, lng: longitude })
        updateUserMarker(latitude, longitude)

        const locationDetails = await reverseGeocode(latitude, longitude)

        if (onLocationSelect) {
          onLocationSelect({
            lat: latitude,
            lng: longitude,
            address: locationDetails?.displayName,
          })
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        alert("Could not get your location. Please enable location services.")
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Get severity color
  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      low: "#10B981",
      medium: "#F59E0B",
      high: "#EF4444",
      critical: "#DC2626",
    }
    return colors[severity] || "#6B7280"
  }

  // Get category icon
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      traffic: "🚗",
      infrastructure: "🏗️",
      weather: "🌧️",
      emergency: "🚨",
      environmental: "🌿",
      social: "👥",
      event: "🎉",
      other: "📍",
    }
    return icons[category] || "📍"
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${fullscreen ? "h-full" : "h-full"} w-full`}>
      {/* Search Box */}
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-white shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSearchResults([])
                  setShowSearchResults(false)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.placeId}
                  onClick={() => handleSelectSearchResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-sm truncate">
                    {result.displayName.split(",")[0]}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {result.displayName.split(",").slice(1).join(",")}
                  </div>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="mt-2 bg-white rounded-lg shadow-lg p-4 text-center">
              <Loader2 className="animate-spin h-4 w-4 mx-auto" />
            </div>
          )}
        </div>
      )}

      {/* Current Location Button */}
      {showLocationButton && (
        <Button
          onClick={handleGetCurrentLocation}
          size="icon"
          variant="secondary"
          className="absolute bottom-24 right-4 z-[1000] shadow-lg bg-white hover:bg-gray-100"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Legend */}
      {showReports && getFilteredReports().length > 0 && (
        <div className="absolute top-4 right-4 z-[1000]">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="text-sm font-bold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Severity Legend
            </div>
            <div className="space-y-2 text-xs">
              {["critical", "high", "medium", "low"].map((severity) => (
                <div key={severity} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: getSeverityColor(severity) }}
                  />
                  <span className="font-medium text-gray-700 capitalize">{severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report Stats */}
      {fullscreen && showReports && (
        <div className="absolute bottom-4 left-4 z-[1000]">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-xl text-blue-600">{getFilteredReports().length}</div>
                <div className="text-gray-600 text-xs font-medium">Total Reports</div>
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <div className="text-center">
                <div className="font-bold text-xl text-red-600">
                  {getFilteredReports().filter((r) => ["critical", "high"].includes(r.analysis.severity)).length}
                </div>
                <div className="text-gray-600 text-xs font-medium">Urgent</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
