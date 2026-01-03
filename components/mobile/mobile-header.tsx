"use client"

import { useState, useEffect } from "react"
import { Bell, User, ChevronDown, MapPin, Sparkles } from "lucide-react"
import { useLocation } from "@/contexts/location-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "./app-sidebar"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LocationEditModal } from "./location-edit-modal"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function MobileHeader() {
  const { district, city, isLoading, error } = useLocation()
  const { authState } = useAuth()
  const router = useRouter()
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Mock unread count - connect to real notification system later
  const unreadNotifications = 3

  const handleNotificationsClick = () => {
    // Haptic feedback
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
    router.push("/alerts")
  }

  const getLocationDisplay = () => {
    if (isLoading) return { main: "Locating...", sub: "Fetching your position" }
    if (error) return { main: "Set Location", sub: "Tap to enable" }
    return { main: district || "Your Area", sub: city || "Detecting..." }
  }

  const locationDisplay = getLocationDisplay()

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe-top">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50" />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />

        <div className="relative flex items-center h-16 px-4">
          {/* Location Section - LEFT */}
          <motion.button
            onClick={() => setIsLocationModalOpen(true)}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center gap-3 min-w-0"
          >
            {/* Animated Location Pin */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
              >
                <MapPin className="h-5 w-5 text-primary" />
              </motion.div>
              {/* Live indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background animate-pulse" />
            </div>

            {/* Location Text */}
            <div className="flex flex-col items-start min-w-0">
              <div className="flex items-center gap-1.5">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={locationDisplay.main}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="font-bold text-base leading-tight truncate max-w-[140px]"
                  >
                    {locationDisplay.main}
                  </motion.h1>
                </AnimatePresence>
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              <motion.p
                className="text-xs text-muted-foreground truncate max-w-[160px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {locationDisplay.sub}
              </motion.p>
            </div>
          </motion.button>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-xs font-medium text-violet-600 dark:text-violet-400">AI</span>
            </motion.div>

            {/* Notification Bell */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-2xl bg-muted/50 hover:bg-muted"
                onClick={handleNotificationsClick}
              >
                <Bell className="h-5 w-5" />
                <AnimatePresence>
                  {unreadNotifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold shadow-lg shadow-rose-500/30"
                    >
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Profile Avatar (sidebar trigger) */}
            <AppSidebar>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-2xl overflow-hidden p-0 ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                >
                  {authState.mode === "authenticated" ? (
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={authState.user?.photoURL || ""}
                        alt={authState.user?.displayName || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-sm bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold">
                        {authState.user?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/60">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </AppSidebar>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 pt-safe-top" />

      <LocationEditModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  )
}
