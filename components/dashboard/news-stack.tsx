"use client"

import { motion, AnimatePresence } from 'framer-motion'
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
  TrendingUp,
  Radio
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
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/30',
  },
  weather: {
    icon: Cloud,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
  },
  local: {
    icon: MapPin,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
  },
  emergency: {
    icon: AlertTriangle,
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
    border: 'border-rose-500/30',
  },
  events: {
    icon: Calendar,
    color: 'text-violet-400',
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/30',
  },
  general: {
    icon: Newspaper,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    border: 'border-slate-500/30',
  },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  return `${diffDays}d`
}

function NewsCard({ item, index, onClick }: {
  item: NewsItem
  index: number
  onClick?: () => void
}) {
  const config = categoryConfig[item.category]
  const Icon = config.icon
  const isUrgent = item.priority === 'urgent'
  const isHigh = item.priority === 'high'

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full text-left",
        "p-3 rounded-xl",
        "bg-slate-800/50 border border-slate-700/50",
        "hover:bg-slate-800/70",
        "transition-all duration-200",
        isUrgent && "border-rose-500/50 bg-rose-500/10"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div className={cn(
          "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
          config.bg
        )}>
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start gap-2">
            <h3 className="text-sm font-medium text-white line-clamp-1 flex-1">
              {item.title}
            </h3>
            {isUrgent && (
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-500 text-white">
                Urgent
              </span>
            )}
            {isHigh && !isUrgent && (
              <Zap className="w-3 h-3 text-orange-400 flex-shrink-0" />
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {item.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="flex items-center gap-1 text-[10px] text-slate-600">
              <Clock className="w-2.5 h-2.5" />
              {formatTimeAgo(item.timestamp)}
            </span>
            <span className="text-[10px] text-slate-600">
              {item.source}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-2" />
      </div>
    </motion.button>
  )
}

export function NewsStack({ news, onItemClick }: NewsStackProps) {
  return (
    <div className="space-y-2">
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
    { id: 'all', label: 'All', icon: Radio },
    { id: 'traffic', label: 'Traffic', icon: Car },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'local', label: 'Local', icon: MapPin },
    { id: 'emergency', label: 'Alerts', icon: AlertTriangle },
    { id: 'events', label: 'Events', icon: Calendar },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id
        const config = cat.id !== 'all' ? categoryConfig[cat.id as keyof typeof categoryConfig] : null
        const Icon = cat.icon

        return (
          <motion.button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
              "transition-all duration-200 whitespace-nowrap",
              isActive
                ? "bg-cyan-500 text-white"
                : "bg-slate-800/50 text-slate-500 hover:text-slate-300 border border-slate-700/50"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {cat.label}
            {counts[cat.id] > 0 && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[9px] font-semibold",
                isActive ? "bg-white/20" : "bg-slate-700"
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
