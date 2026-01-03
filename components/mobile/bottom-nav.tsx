"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, MapPin, Camera, Bell, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

export function BottomNav({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { requireAuth } = useAuth()

  // Haptic feedback for supported devices
  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }

  const handleTabClick = (path: string, action?: string) => {
    triggerHaptic()
    if (action) {
      requireAuth(action)
    }
    router.push(path)
  }

  const tabs = [
    { id: "dashboard", label: "Home", icon: Home, path: "/dashboard" },
    { id: "map", label: "Map", icon: MapPin, path: "/map" },
    { id: "report", label: "Report", icon: Camera, path: "/report", accent: true, action: "submit_report" },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts", action: "view_alerts" },
    { id: "insights", label: "Insights", icon: TrendingUp, path: "/insights", action: "view_insights" },
  ]

  return (
    <header
      className={cn(
        "fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur-sm",
        "pb-safe-bottom z-50",
        className,
      )}
    >
      <nav className="flex items-center h-full px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive =
            (pathname === "/" && tab.path === "/dashboard") || (pathname !== "/" && pathname.startsWith(tab.path))
          const isAccent = tab.accent

          const onClick = () => handleTabClick(tab.path, tab.action)

          if (isAccent) {
            return (
              <div key={tab.id} className="flex-1 flex justify-center">
                <motion.button
                  onClick={onClick}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-5 h-11 rounded-full flex items-center justify-center gap-2 shadow-lg",
                    "bg-primary text-primary-foreground",
                    "active:shadow-md transition-shadow"
                  )}
                  aria-label={tab.label}
                >
                  <Icon size={18} />
                  <span className="font-bold text-sm">{tab.label}</span>
                </motion.button>
              </div>
            )
          }

          return (
            <motion.button
              key={tab.id}
              onClick={onClick}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex-1 flex flex-col items-center justify-center h-full relative",
                "transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
              aria-label={tab.label}
            >
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon size={22} className="mb-0.5" />
              </motion.div>
              <span className={cn(
                "text-[10px] transition-all",
                isActive ? "font-bold" : "font-medium"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0 w-1 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </nav>
    </header>
  )
}
