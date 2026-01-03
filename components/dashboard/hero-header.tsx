"use client"

import { motion } from 'framer-motion'
import { MapPin, RefreshCw, Sparkles } from 'lucide-react'
import { useAppStore } from '@/stores/app-store'
import { cn } from '@/lib/utils'

interface HeroHeaderProps {
  isRefreshing?: boolean
  onRefresh?: () => void
  weather?: {
    temperature: number
    weatherCode: number
  } | null
}

const weatherEmoji: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌧️',
  53: '🌧️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '🌨️',
  80: '🌧️',
  81: '🌧️',
  82: '🌧️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
}

export function HeroHeader({ isRefreshing, onRefresh, weather }: HeroHeaderProps) {
  const { location } = useAppStore()
  const currentHour = new Date().getHours()
  const isLocationLoading = location.isLoading || (!location.city && !location.district)

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />

      {/* Animated mesh pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] opacity-40" />
      </div>

      {/* Floating particles */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-4 right-8 w-2 h-2 bg-white rounded-full"
      />
      <motion.div
        animate={{
          y: [0, 10, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-12 right-20 w-1.5 h-1.5 bg-white rounded-full"
      />
      <motion.div
        animate={{
          y: [0, -15, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-8 left-12 w-2 h-2 bg-white rounded-full"
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-2"
            >
              <span className="text-2xl">{getTimeEmoji()}</span>
              <span className="text-white/80 text-sm font-medium">
                {getGreeting()}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-3"
            >
              {isLocationLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-32 h-7 bg-white/20 rounded-lg animate-pulse" />
                </span>
              ) : (
                location.district || 'Your Area'
              )}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-white" />
                {isLocationLoading ? (
                  <span className="w-20 h-4 bg-white/30 rounded animate-pulse" />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {location.city || 'Detecting...'}
                  </span>
                )}
              </div>

              {weather && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-lg">
                    {weatherEmoji[weather.weatherCode] || '🌤️'}
                  </span>
                  <span className="text-white text-sm font-medium">
                    {Math.round(weather.temperature)}°C
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRefresh}
            className={cn(
              "w-10 h-10 rounded-xl",
              "bg-white/20 backdrop-blur-sm",
              "flex items-center justify-center",
              "shadow-lg"
            )}
          >
            <RefreshCw
              className={cn(
                "w-5 h-5 text-white",
                isRefreshing && "animate-spin"
              )}
            />
          </motion.button>
        </div>

        {/* Quick stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center gap-2 overflow-x-auto scrollbar-hide"
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-xs font-medium whitespace-nowrap">
              AI-Powered Insights
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
            <span className="text-xs text-white/80 whitespace-nowrap">
              Live Updates
            </span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
