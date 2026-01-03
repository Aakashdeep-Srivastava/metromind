"use client"

import { useState } from "react"
import { Bell, User, ChevronDown, IndianRupee } from "lucide-react"
import { useLocation } from "@/contexts/location-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "./app-sidebar"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LocationEditModal } from "./location-edit-modal"
import { Badge } from "@/components/ui/badge"

export function MobileHeader() {
  const { district, city, isLoading, error } = useLocation()
  const { authState, requireAuth } = useAuth()
  const router = useRouter()
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)

  // Mock unread count - connect to real notification system later
  const unreadNotifications = 3

  const handleFinancialPulseClick = () => {
    if (requireAuth("view_financial_pulse", "/financial-pulse")) {
      router.push("/financial-pulse")
    }
  }

  const handleNotificationsClick = () => {
    router.push("/alerts")
  }

  const getLocationDisplay = () => {
    if (isLoading) return { main: "Locating...", sub: "Fetching position..." }
    if (error) return { main: "Location Error", sub: "Tap to set manually" }
    return { main: district || "Unknown Area", sub: city || "Bengaluru" }
  }

  const locationDisplay = getLocationDisplay()

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm pt-safe-top">
        <div className="container flex h-16 items-center px-4">
          {/* Location - LEFT (MyGate style - prominent) */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex-1 flex flex-col items-start justify-center text-left min-w-0"
          >
            <div className="flex items-center gap-1">
              <h1 className="font-bold text-lg leading-tight truncate max-w-[180px]">
                {locationDisplay.main}
              </h1>
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
              {locationDisplay.sub}
            </p>
          </button>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {/* Financial Pulse - Key Feature */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleFinancialPulseClick}
            >
              <IndianRupee className="h-5 w-5" />
            </Button>

            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              onClick={handleNotificationsClick}
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
            </Button>

            {/* Profile Avatar (sidebar trigger) */}
            <AppSidebar>
              <Button variant="ghost" size="icon" className="rounded-full">
                {authState.mode === "authenticated" ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={authState.user?.photoURL || ""}
                      alt={authState.user?.displayName || ""}
                    />
                    <AvatarFallback className="text-sm">
                      {authState.user?.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </AppSidebar>
          </div>
        </div>
      </header>
      <LocationEditModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  )
}
