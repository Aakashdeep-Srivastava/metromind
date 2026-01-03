"use client"

import { motion } from 'framer-motion'
import {
  Wind,
  Car,
  Thermometer,
  Droplets,
  Bell,
  FileText,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Gauge,
  CloudRain,
  Zap
} from 'lucide-react'
import type { CityMetric } from '@/stores/app-store'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const iconMap: Record<string, any> = {
  Wind,
  Car,
  Thermometer,
  Droplets,
  Bell,
  FileText,
  Gauge,
  CloudRain,
  Zap
}

// Map metric IDs to routes
const routeMap: Record<string, string> = {
  aqi: '/insights',
  traffic: '/map',
  temp: '/insights',
  humidity: '/insights',
  alerts: '/alerts',
  reports: '/report',
}

interface MetricCardProps {
  metric: CityMetric
  index: number
  onClick?: () => void
}

function MetricCard({ metric, index, onClick }: MetricCardProps) {
  const Icon = iconMap[metric.icon] || Gauge
  const isUp = metric.trend === 'up'
  const isDown = metric.trend === 'down'

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "relative w-full text-left",
        "p-3 rounded-2xl",
        "bg-slate-800/50 border border-slate-700/50",
        "hover:bg-slate-800/70 hover:border-slate-600/50",
        "transition-all duration-200",
        "group"
      )}
    >
      {/* Content row */}
      <div className="flex items-center justify-between">
        {/* Left: Value and label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">
              {metric.value}
            </span>
            {metric.unit && (
              <span className="text-sm text-slate-400">
                {metric.unit}
              </span>
            )}
            {metric.trend && metric.change && (
              <span className={cn(
                "text-xs font-medium ml-1",
                isUp ? "text-emerald-400" : isDown ? "text-rose-400" : "text-slate-500"
              )}>
                {isUp ? '↑' : isDown ? '↓' : '—'}{metric.change}%
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 truncate mt-0.5">
            {metric.label}
          </div>
        </div>

        {/* Right: Icon */}
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          "bg-gradient-to-br",
          metric.color,
          "shadow-lg",
          "group-hover:scale-110 transition-transform duration-200"
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.button>
  )
}

interface MetricGridProps {
  metrics: CityMetric[]
}

export function MetricGrid({ metrics }: MetricGridProps) {
  const router = useRouter()

  const handleClick = (metricId: string) => {
    const route = routeMap[metricId] || '/insights'
    router.push(route)
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {metrics.slice(0, 6).map((metric, index) => (
        <MetricCard
          key={metric.id}
          metric={metric}
          index={index}
          onClick={() => handleClick(metric.id)}
        />
      ))}
    </div>
  )
}

// Compact horizontal scrolling metrics
export function MetricScroller({ metrics }: MetricGridProps) {
  const router = useRouter()

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.icon] || Gauge
        const route = routeMap[metric.id] || '/insights'

        return (
          <motion.button
            key={metric.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(route)}
            className={cn(
              "flex-shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl",
              "bg-slate-800/60 border border-slate-700/50",
              "hover:bg-slate-800/80",
              "transition-all duration-200"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              "bg-gradient-to-br",
              metric.color
            )}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-white leading-tight">
                {metric.value}{metric.unit}
              </div>
              <div className="text-[10px] text-slate-500">{metric.label}</div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
