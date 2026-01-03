"use client"

import { motion } from 'framer-motion'
import { MapPin, RefreshCw, Sparkles } from 'lucide-react'
import { useLocation } from '@/contexts/location-context'
import { cn } from '@/lib/utils'

interface HeroHeaderProps {
  isRefreshing?: boolean
  onRefresh?: () => void
  weather?: {
    temperature: number
    humidity?: number
    windSpeed?: number
    weatherCode: number
  } | null
}

const weatherEmoji: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌧️', 53: '🌧️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  80: '🌧️', 81: '🌧️', 82: '🌧️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

const weatherDesc: Record<number, string> = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
  45: 'Foggy', 48: 'Foggy',
  51: 'Light Rain', 53: 'Rain', 55: 'Heavy Rain',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Snow', 73: 'Snow', 75: 'Heavy Snow',
  80: 'Showers', 81: 'Showers', 82: 'Heavy Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Severe Storm',
}

export function HeroHeader({ isRefreshing, onRefresh, weather }: HeroHeaderProps) {
  // Use LocationContext directly for fresh data
  const { district, city, isLoading } = useLocation()
  const currentHour = new Date().getHours()

  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning'
    if (currentHour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getTimeEmoji = () => {
    if (currentHour < 6) return '🌙'
    if (currentHour < 12) return '🌅'
    if (currentHour < 17) return '☀️'
    if (currentHour < 20) return '🌆'
    return '🌙'
  }

  // Get display location - prefer district, fallback to city
  const displayLocation = district && district !== 'Unknown District' && district !== 'Current Location'
    ? district
    : city || 'Your Location'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Top row: Greeting and Refresh */}
        <div className="flex items-center justify-between mb-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <span className="text-xl">{getTimeEmoji()}</span>
            <span className="text-slate-400 text-sm font-medium">
              {getGreeting()}
            </span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRefresh}
            className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <RefreshCw
              className={cn(
                "w-4 h-4 text-slate-400",
                isRefreshing && "animate-spin"
              )}
            />
          </motion.button>
        </div>

        {/* Location */}
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="text-xl font-bold text-white mb-3"
        >
          {isLoading ? (
            <span className="inline-block w-36 h-6 bg-slate-700/50 rounded-lg animate-pulse" />
          ) : (
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              {displayLocation}
            </span>
          )}
        </motion.h1>

        {/* Weather Stats Row */}
        {weather && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 flex-wrap"
          >
            {/* Temperature */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-700/40">
              <span className="text-lg">{weatherEmoji[weather.weatherCode] || '🌤️'}</span>
              <span className="text-white font-semibold">
                {Math.round(weather.temperature)}°
              </span>
              <span className="text-slate-400 text-xs">
                {weatherDesc[weather.weatherCode] || 'Clear'}
              </span>
            </div>

            {/* AI Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-medium text-violet-300">AI Insights</span>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/40">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </motion.div>
        )}

        {!weather && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <div className="w-24 h-8 bg-slate-700/50 rounded-xl animate-pulse" />
            <div className="w-20 h-8 bg-slate-700/50 rounded-xl animate-pulse" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
