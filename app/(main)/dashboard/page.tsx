"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  Camera,
  RefreshCw,
  Sparkles,
  TrendingUp,
  MapPin,
  Zap,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// New components
import { HeroHeader } from '@/components/dashboard/hero-header'
import { MetricGrid, MetricScroller } from '@/components/dashboard/metric-cards'
import { NewsStack, NewsCategoryTabs } from '@/components/dashboard/news-stack'

// Hooks
import { useDashboardData } from '@/hooks/use-city-data'
import { useAppStore } from '@/stores/app-store'

export default function DashboardPage() {
  const router = useRouter()
  const { location, newsFilter, setNewsFilter } = useAppStore()
  const { news, metrics, weather, airQuality, isLoading, refetchAll } = useDashboardData()

  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter news by category
  const filteredNews = useMemo(() => {
    if (!news.data) return []
    if (newsFilter === 'all') return news.data
    return news.data.filter(item => item.category === newsFilter)
  }, [news.data, newsFilter])

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    if (!news.data) return { all: 0 }
    const counts: Record<string, number> = { all: news.data.length }
    news.data.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return counts
  }, [news.data])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetchAll()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Hero Header with Location & Weather */}
        <HeroHeader
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          weather={weather.data}
        />

        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          <Button
            onClick={() => router.push("/report")}
            className="flex-1 h-12 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg shadow-rose-500/25"
          >
            <Camera className="mr-2 h-5 w-5" />
            Report Incident
          </Button>
          <Button
            onClick={() => router.push("/map")}
            variant="outline"
            className="h-12 px-4 border-2"
          >
            <MapPin className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Live Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live City Pulse
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/insights")}>
              <span className="text-xs">View All</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {metrics.isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <MetricGrid metrics={metrics.data || []} />
          )}
        </motion.div>

        {/* AI Insights Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">AI Prediction</span>
            </div>
            <p className="text-white/90 text-sm">
              Based on current patterns, expect <span className="font-bold text-yellow-300">moderate traffic</span> on
              ORR between 6-8 PM. Plan ahead for a smoother commute!
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="px-2 py-1 rounded-full bg-white/20 text-xs text-white">
                78% confidence
              </div>
              <div className="px-2 py-1 rounded-full bg-white/20 text-xs text-white flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Updated 2m ago
              </div>
            </div>
          </div>
        </motion.div>

        {/* News Feed Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              {location.district || 'Local'} Updates
            </h2>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Filters */}
          <div className="mb-4">
            <NewsCategoryTabs
              activeCategory={newsFilter}
              onCategoryChange={setNewsFilter}
              counts={categoryCounts}
            />
          </div>

          {/* News Stack */}
          {news.isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={newsFilter}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <NewsStack
                  news={filteredNews}
                  onItemClick={(item) => {
                    if (item.url) {
                      window.open(item.url, '_blank')
                    }
                  }}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {filteredNews.length === 0 && !news.isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No updates in this category</p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer Spacer */}
        <div className="h-4" />
      </div>
    </div>
  )
}
