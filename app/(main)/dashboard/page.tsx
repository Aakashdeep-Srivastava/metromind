"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  Camera,
  Zap,
  Search,
  Sparkles,
  TrendingUp,
  ArrowRight
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// Components
import { HeroHeader } from '@/components/dashboard/hero-header'
import { MetricGrid } from '@/components/dashboard/metric-cards'
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
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Hero Header with Weather */}
        <HeroHeader
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          weather={weather.data}
        />

        {/* Quick Action: Report */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={() => router.push("/report")}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 rounded-xl font-semibold"
          >
            <Camera className="mr-2 h-5 w-5" />
            Report an Incident
            <ArrowRight className="ml-auto h-4 w-4" />
          </Button>
        </motion.div>

        {/* Live Metrics */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Metrics
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/insights")}
              className="text-slate-500 hover:text-slate-300 h-7 px-2"
            >
              <span className="text-xs">View All</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          {metrics.isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-slate-800/50 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <MetricGrid metrics={metrics.data || []} />
          )}
        </motion.section>

        {/* AI Insight Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 border border-violet-500/30 p-4"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-violet-300 font-semibold text-sm">AI Prediction</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Based on current patterns, expect <span className="font-semibold text-yellow-400">moderate traffic</span> during
              evening hours. Plan ahead for a smoother commute.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-[10px] text-violet-300 font-medium">
                78% confidence
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-[10px] text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" />
                Updated 2m ago
              </span>
            </div>
          </div>
        </motion.section>

        {/* News Feed Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              {location.district || 'Local'} Updates
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="mb-4 -mx-4 px-4">
            <NewsCategoryTabs
              activeCategory={newsFilter}
              onCategoryChange={setNewsFilter}
              counts={categoryCounts}
            />
          </div>

          {/* News Stack */}
          {news.isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-slate-800/50 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={newsFilter}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
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
              <Search className="h-10 w-10 mx-auto text-slate-700 mb-3" />
              <p className="text-slate-500 text-sm">No updates in this category</p>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  )
}
