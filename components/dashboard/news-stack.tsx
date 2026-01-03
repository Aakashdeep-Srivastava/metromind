"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Car,
  Cloud,
  MapPin,
  AlertTriangle,
  Calendar,
  Newspaper,
  Clock,
  ChevronRight,
  Zap,
  TrendingUp
} from 'lucide-react'
import type { NewsItem } from '@/stores/app-store'
import { cn } from '@/lib/utils'

interface NewsStackProps {
  news: NewsItem[]
  onItemClick?: (item: NewsItem) => void
}

const categoryConfig = {
  traffic: {
    icon: Car,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    bgGradient: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/30',
    glowColor: 'shadow-orange-500/20',
  },
  weather: {
    icon: Cloud,
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/20',
  },
  local: {
    icon: MapPin,
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/30',
    glowColor: 'shadow-green-500/20',
  },
  emergency: {
    icon: AlertTriangle,
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    bgGradient: 'from-red-500/10 to-rose-500/10',
    borderColor: 'border-red-500/30',
    glowColor: 'shadow-red-500/20',
  },
  events: {
    icon: Calendar,
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    bgGradient: 'from-purple-500/10 to-violet-500/10',
    borderColor: 'border-purple-500/30',
    glowColor: 'shadow-purple-500/20',
  },
  general: {
    icon: Newspaper,
    gradient: 'from-gray-500 via-slate-500 to-zinc-500',
    bgGradient: 'from-gray-500/10 to-slate-500/10',
    borderColor: 'border-gray-500/30',
    glowColor: 'shadow-gray-500/20',
  },
}

const priorityConfig = {
  urgent: {
    badge: 'bg-red-500 text-white animate-pulse',
    ring: 'ring-2 ring-red-500/50',
  },
  high: {
    badge: 'bg-orange-500 text-white',
    ring: 'ring-1 ring-orange-500/30',
  },
  medium: {
    badge: 'bg-yellow-500 text-black',
    ring: '',
  },
  low: {
    badge: 'bg-gray-500 text-white',
    ring: '',
  },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function NewsCard({ item, index, onClick }: {
  item: NewsItem
  index: number
  onClick?: () => void
}) {
  const config = categoryConfig[item.category]
  const priority = priorityConfig[item.priority]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer",
        "bg-gradient-to-br backdrop-blur-xl",
        config.bgGradient,
        "border",
        config.borderColor,
        priority.ring,
        "shadow-lg",
        config.glowColor,
        "transition-all duration-300"
      )}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r",
          config.gradient,
          "animate-gradient-x"
        )} />
      </div>

      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/5 dark:bg-black/20" />

      {/* Content */}
      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* Category Icon */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl",
            "bg-gradient-to-br",
            config.gradient,
            "flex items-center justify-center",
            "shadow-lg",
            config.glowColor
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {item.priority === 'urgent' && (
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-bold rounded-full uppercase",
                  priority.badge
                )}>
                  Urgent
                </span>
              )}
              {item.priority === 'high' && (
                <Zap className="w-3 h-3 text-orange-500" />
              )}
            </div>

            <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">
              {item.title}
            </h3>

            <p className="text-xs text-muted-foreground line-clamp-1">
              {item.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(item.timestamp)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {item.source}
              </span>
              {item.location && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </motion.div>
  )
}

export function NewsStack({ news, onItemClick }: NewsStackProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // Group news by category
  const groupedNews = news.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, NewsItem[]>)

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {news.slice(0, 10).map((item, index) => (
          <NewsCard
            key={item.id}
            item={item}
            index={index}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Category filter tabs
export function NewsCategoryTabs({
  activeCategory,
  onCategoryChange,
  counts
}: {
  activeCategory: string
  onCategoryChange: (category: string) => void
  counts: Record<string, number>
}) {
  const categories = [
    { id: 'all', label: 'All', icon: TrendingUp },
    { id: 'traffic', label: 'Traffic', icon: Car },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'local', label: 'Local', icon: MapPin },
    { id: 'emergency', label: 'Alerts', icon: AlertTriangle },
    { id: 'events', label: 'Events', icon: Calendar },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id
        const config = cat.id !== 'all' ? categoryConfig[cat.id as keyof typeof categoryConfig] : null
        const Icon = cat.icon

        return (
          <motion.button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
              "transition-all duration-200 whitespace-nowrap",
              isActive
                ? cn(
                    "bg-gradient-to-r text-white shadow-lg",
                    config?.gradient || "from-primary to-primary/80"
                  )
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {cat.label}
            {counts[cat.id] > 0 && (
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-[10px]",
                isActive ? "bg-white/20" : "bg-muted-foreground/20"
              )}>
                {counts[cat.id]}
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
