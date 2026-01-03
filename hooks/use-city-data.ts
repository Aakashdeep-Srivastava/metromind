"use client"

import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/stores/app-store'
import {
  fetchLocationNews,
  generateCityMetrics,
  fetchWeather,
  fetchAirQuality,
} from '@/services/news-service'

// Hook to fetch location-based news
export function useLocationNews() {
  const { location } = useAppStore()

  return useQuery({
    queryKey: ['news', location.city, location.district],
    queryFn: () => fetchLocationNews(location.city, location.district),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    enabled: !!location.city,
  })
}

// Hook to fetch city metrics
export function useCityMetrics() {
  const { location } = useAppStore()

  return useQuery({
    queryKey: ['metrics', location.city],
    queryFn: () => generateCityMetrics(location.city),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000,
    enabled: !!location.city,
  })
}

// Hook to fetch weather data
export function useWeather() {
  const { location } = useAppStore()

  return useQuery({
    queryKey: ['weather', location.latitude, location.longitude],
    queryFn: () => fetchWeather(location.latitude, location.longitude),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000,
    enabled: !!location.latitude && !!location.longitude,
  })
}

// Hook to fetch air quality
export function useAirQuality() {
  const { location } = useAppStore()

  return useQuery({
    queryKey: ['airQuality', location.latitude, location.longitude],
    queryFn: () => fetchAirQuality(location.latitude, location.longitude),
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 15 * 60 * 1000,
    enabled: !!location.latitude && !!location.longitude,
  })
}

// Combined hook for all dashboard data
export function useDashboardData() {
  const news = useLocationNews()
  const metrics = useCityMetrics()
  const weather = useWeather()
  const airQuality = useAirQuality()

  return {
    news,
    metrics,
    weather,
    airQuality,
    isLoading: news.isLoading || metrics.isLoading,
    isError: news.isError || metrics.isError,
    refetchAll: () => {
      news.refetch()
      metrics.refetch()
      weather.refetch()
      airQuality.refetch()
    },
  }
}
