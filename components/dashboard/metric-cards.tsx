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
  Minus
} from 'lucide-react'
import type { CityMetric } from '@/stores/app-store'
import { cn } from '@/lib/utils'

const iconMap: Record<string, any> = {
  Wind,
  Car,
  Thermometer,
  Droplets,
  Bell,
  FileText,
}

interface MetricCardProps {
  metric: CityMetric
  index: number
}

function MetricCard({ metric, index }: MetricCardProps) {
  const Icon = iconMap[metric.icon] || Wind
  const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-4",
        "bg-gradient-to-br backdrop-blur-xl",
        "border border-white/10 dark:border-white/5",
        "shadow-xl",
        "cursor-pointer group"
      )}
    >
      {/* Animated gradient background */}
      <div className={cn(
        "absolute inset-0 opacity-90 bg-gradient-to-br",
        metric.color
      )} />

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Glowing orb effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all duration-500" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            "w-10 h-10 rounded-xl",
            "bg-white/20 backdrop-blur-sm",
            "flex items-center justify-center",
            "shadow-lg"
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>

          {metric.trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              "bg-white/20 backdrop-blur-sm",
              metric.trend === 'up' ? 'text-white' : metric.trend === 'down' ? 'text-white' : 'text-white/70'
            )}>
              <TrendIcon className="w-3 h-3" />
              {metric.change ? `${metric.change}%` : ''}
            </div>
          )}
        </div>

        <div className="text-3xl font-bold text-white mb-1">
          {metric.value}
          {metric.unit && (
            <span className="text-lg font-normal text-white/80 ml-1">
              {metric.unit}
            </span>
          )}
        </div>

        <div className="text-sm text-white/80 font-medium">
          {metric.label}
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  )
}

interface MetricGridProps {
  metrics: CityMetric[]
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  )
}

// Compact horizontal scrolling metrics
export function MetricScroller({ metrics }: MetricGridProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.icon] || Wind

        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl",
              "bg-gradient-to-r backdrop-blur-xl",
              metric.color,
              "shadow-lg"
            )}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {metric.value}{metric.unit}
              </div>
              <div className="text-xs text-white/70">{metric.label}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
