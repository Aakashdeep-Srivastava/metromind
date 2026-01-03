"use client"

import { useEffect, useState } from "react"
import { Bell, User, MapPin, Navigation, Loader2 } from "lucide-react"
import { useLocation } from "@/contexts/location-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "./app-sidebar"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function MobileHeader() {
  const { district, city, isLoading, error, requestLocation } = useLocation()
  const { authState } = useAuth()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Mock unread count
  const unreadNotifications = 3

  const handleNotificationsClick = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
    router.push("/alerts")
  }

  const handleRefreshLocation = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
    requestLocation()
  }

  const getLocationText = () => {
    if (isLoading) return "Detecting..."
    if (error) return "Enable Location"
    if (!district && !city) return "Detecting..."
    return district || city || "Your Location"
  }

  const getCityText = () => {
    if (isLoading || error || !city) return ""
    return city
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe-top">
        {/* Clean gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />

        {/* Subtle accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        <div className="relative flex items-center justify-between h-14 px-4">
          {/* Location Section - LEFT */}
          <motion.button
            onClick={handleRefreshLocation}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 min-w-0"
          >
            {/* Location Icon with pulse */}
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4 text-cyan-400" />
                )}
              </div>
              {!isLoading && !error && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
              )}
            </div>

            {/* Location Text */}
            <div className="flex flex-col items-start min-w-0">
              <AnimatePresence mode="wait">
                <motion.span
                  key={getLocationText()}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="font-semibold text-sm text-white truncate max-w-[140px]"
                >
                  {getLocationText()}
                </motion.span>
              </AnimatePresence>
              {getCityText() && (
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {getCityText()}
                </span>
              )}
            </div>
          </motion.button>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5">
            {/* Notification Bell */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border-0"
                onClick={handleNotificationsClick}
              >
                <Bell className="h-[18px] w-[18px] text-slate-300" />
                <AnimatePresence>
                  {unreadNotifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white"
                    >
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Profile Avatar */}
            <AppSidebar>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl overflow-hidden p-0 bg-white/5 hover:bg-white/10 border-0"
                >
                  {authState.mode === "authenticated" ? (
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={authState.user?.photoURL || ""}
                        alt={authState.user?.displayName || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold">
                        {authState.user?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-[18px] w-[18px] text-slate-300" />
                  )}
                </Button>
              </motion.div>
            </AppSidebar>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-14 pt-safe-top" />
    </>
  )
}
