"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/nextjs"
import type { AuthState } from "@/types/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  authState: AuthState
  user: {
    uid: string
    email?: string
    displayName?: string
    photoURL?: string
  } | null
  requireAuth: (action: string, redirectUrl?: string) => boolean
  signIn: () => void
  signOut: () => Promise<void>
  isConfigValid: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser()
  const { openSignIn, signOut: clerkSignOut } = useClerk()
  const router = useRouter()
  const { toast } = useToast()

  const authState: AuthState = isSignedIn && user
    ? {
        mode: "authenticated",
        user: {
          uid: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          displayName: user.fullName || user.firstName || undefined,
          photoURL: user.imageUrl,
        },
        permissions: [
          "read_public",
          "view_map",
          "view_incidents",
          "submit_reports",
          "manage_subscriptions",
          "view_insights",
          "view_financial_pulse",
          "view_alerts",
        ],
      }
    : {
        mode: "anonymous",
        permissions: [
          "read_public",
          "view_map",
          "view_incidents",
          "submit_reports",
          "manage_subscriptions",
          "view_insights",
          "view_financial_pulse",
          "view_alerts",
        ],
      }

  const mappedUser = isSignedIn && user
    ? {
        uid: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        displayName: user.fullName || user.firstName || undefined,
        photoURL: user.imageUrl,
      }
    : null

  const signIn = () => {
    openSignIn({
      afterSignInUrl: window.location.pathname,
      afterSignUpUrl: window.location.pathname,
    })
  }

  const signOut = async () => {
    try {
      await clerkSignOut()
      toast({
        title: "Signed Out",
        description: "You can continue using all features as a guest.",
      })
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Sign Out",
        description: "You have been signed out.",
      })
    }
  }

  // Allow all users access to all features
  const requireAuth = (action: string, redirectUrl?: string) => {
    return true // Full access for everyone
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        user: mappedUser,
        requireAuth,
        signIn,
        signOut,
        isConfigValid: true,
        isLoading: !isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Re-export Clerk components for convenience
export { SignedIn, SignedOut }
