"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  Home,
  Map,
  PlusCircle,
  AlertTriangle,
  BarChart3,
  Compass,
  Radio,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

const tabs = [
  { id: "dashboard", label: "Home", icon: Home, path: "/dashboard" },
  { id: "map", label: "Map", icon: Compass, path: "/map" },
  { id: "report", label: "Report", icon: PlusCircle, path: "/report", accent: true, action: "submit_report" },
  { id: "alerts", label: "Alerts", icon: Radio, path: "/alerts", action: "view_alerts" },
  { id: "insights", label: "Stats", icon: Activity, path: "/insights", action: "view_insights" },
]

export function BottomNav({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { requireAuth } = useAuth()

  const triggerHaptic = (intensity: number = 10) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(intensity)
    }
  }

  const handleTabClick = (path: string, action?: string) => {
    triggerHaptic(15)
    if (action) {
      requireAuth(action)
    }
    router.push(path)
  }

  const getActiveIndex = () => {
    const index = tabs.findIndex(tab =>
      (pathname === "/" && tab.path === "/dashboard") ||
      (pathname !== "/" && pathname.startsWith(tab.path))
    )
    return index >= 0 ? index : 0
  }

  const activeIndex = getActiveIndex()

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "pb-safe-bottom",
        className,
      )}
    >
      {/* Dark glassmorphism background */}
      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" />

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Nav content */}
      <div className="relative flex items-center justify-around h-16 px-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = index === activeIndex
          const isAccent = tab.accent

          const onClick = () => handleTabClick(tab.path, tab.action)

          if (isAccent) {
            return (
              <motion.button
                key={tab.id}
                onClick={onClick}
                whileTap={{ scale: 0.9 }}
                className="relative -mt-5"
                aria-label={tab.label}
              >
                {/* Glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 blur-md"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.6, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Button */}
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
              </motion.button>
            )
          }

          return (
            <motion.button
              key={tab.id}
              onClick={onClick}
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center justify-center py-2 px-3 relative"
              aria-label={tab.label}
            >
              {/* Active indicator line */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon
                  size={22}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-cyan-400" : "text-slate-500"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>

              {/* Label */}
              <motion.span
                className={cn(
                  "text-[10px] mt-1 transition-all duration-200",
                  isActive ? "font-semibold text-cyan-400" : "font-medium text-slate-500"
                )}
              >
                {tab.label}
              </motion.span>

              {/* Notification dot for alerts */}
              {tab.id === "alerts" && (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
