"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, MapPin, Camera, Bell, TrendingUp, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useRef, useState } from "react"

const tabs = [
  { id: "dashboard", label: "Home", icon: Home, path: "/dashboard" },
  { id: "map", label: "Map", icon: MapPin, path: "/map" },
  { id: "report", label: "Report", icon: Camera, path: "/report", accent: true, action: "submit_report" },
  { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts", action: "view_alerts" },
  { id: "insights", label: "Insights", icon: TrendingUp, path: "/insights", action: "view_insights" },
]

export function BottomNav({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { requireAuth } = useAuth()
  const navRef = useRef<HTMLDivElement>(null)
  const [dragStartX, setDragStartX] = useState(0)

  // Haptic feedback for supported devices
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
      ref={navRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "pb-safe-bottom",
        className,
      )}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/50" />

      {/* Gradient accent line */}
      <motion.div
        className="absolute top-0 h-[2px] bg-gradient-to-r from-primary via-primary to-primary/60"
        style={{
          width: `${100 / tabs.length}%`,
        }}
        animate={{
          left: `${(activeIndex / tabs.length) * 100}%`,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 35,
        }}
      />

      {/* Nav content */}
      <div className="relative flex items-center h-16 px-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = index === activeIndex
          const isAccent = tab.accent

          const onClick = () => handleTabClick(tab.path, tab.action)

          if (isAccent) {
            return (
              <div key={tab.id} className="flex-1 flex justify-center">
                <motion.button
                  onClick={onClick}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                  aria-label={tab.label}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 blur-lg opacity-50"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Button */}
                  <div className={cn(
                    "relative px-5 h-12 rounded-full flex items-center justify-center gap-2",
                    "bg-gradient-to-r from-rose-500 to-pink-500",
                    "shadow-lg shadow-rose-500/30",
                    "active:shadow-md transition-shadow"
                  )}>
                    <Plus className="h-5 w-5 text-white" />
                    <span className="font-bold text-sm text-white">{tab.label}</span>
                  </div>
                </motion.button>
              </div>
            )
          }

          return (
            <motion.button
              key={tab.id}
              onClick={onClick}
              whileTap={{ scale: 0.85 }}
              className={cn(
                "flex-1 flex flex-col items-center justify-center h-full relative py-2",
                "transition-colors duration-200",
              )}
              aria-label={tab.label}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="navBg"
                  className="absolute inset-x-2 inset-y-1 rounded-2xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon container */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon
                  size={22}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />

                {/* Notification dot for alerts */}
                {tab.id === "alerts" && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500"
                  />
                )}
              </motion.div>

              {/* Label */}
              <motion.span
                className={cn(
                  "text-[10px] mt-1 relative z-10 transition-all duration-200",
                  isActive ? "font-bold text-primary" : "font-medium text-muted-foreground"
                )}
                animate={{
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
