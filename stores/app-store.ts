import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Types
export interface NewsItem {
  id: string
  title: string
  description: string
  source: string
  category: 'traffic' | 'weather' | 'local' | 'emergency' | 'events' | 'general'
  timestamp: Date
  url?: string
  imageUrl?: string
  location?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface CityMetric {
  id: string
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  change?: number
  icon: string
  color: string
}

export interface LocationState {
  latitude: number
  longitude: number
  city: string
  district: string
  locality: string
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

export interface AppState {
  // Location
  location: LocationState
  setLocation: (location: Partial<LocationState>) => void

  // News
  news: NewsItem[]
  setNews: (news: NewsItem[]) => void
  addNews: (item: NewsItem) => void

  // City Metrics
  metrics: CityMetric[]
  setMetrics: (metrics: CityMetric[]) => void

  // UI State
  activeTab: string
  setActiveTab: (tab: string) => void

  // Filters
  newsFilter: string
  setNewsFilter: (filter: string) => void

  // Refresh
  lastRefresh: Date | null
  setLastRefresh: (date: Date) => void
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      // Location - will be updated by geolocation
      location: {
        latitude: 0,
        longitude: 0,
        city: '',
        district: '',
        locality: '',
        isLoading: true,
        error: null,
        lastUpdated: null,
      },
      setLocation: (location) =>
        set((state) => {
          Object.assign(state.location, location)
        }),

      // News
      news: [],
      setNews: (news) =>
        set((state) => {
          state.news = news
        }),
      addNews: (item) =>
        set((state) => {
          state.news.unshift(item)
        }),

      // Metrics
      metrics: [],
      setMetrics: (metrics) =>
        set((state) => {
          state.metrics = metrics
        }),

      // UI
      activeTab: 'all',
      setActiveTab: (tab) =>
        set((state) => {
          state.activeTab = tab
        }),

      // Filters
      newsFilter: 'all',
      setNewsFilter: (filter) =>
        set((state) => {
          state.newsFilter = filter
        }),

      // Refresh
      lastRefresh: null,
      setLastRefresh: (date) =>
        set((state) => {
          state.lastRefresh = date
        }),
    })),
    {
      name: 'metromind-storage-v3',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Don't persist location - always fetch fresh
        newsFilter: state.newsFilter,
        activeTab: state.activeTab,
      }),
    }
  )
)
