import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/setup",
  "/dashboard(.*)",
  "/map(.*)",
  "/report(.*)",
  "/alerts(.*)",
  "/insights(.*)",
  "/financial-pulse(.*)",
  "/profile(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
])

export default clerkMiddleware(async (auth, request) => {
  // All routes are public - no protection needed
  // Clerk will still track authentication state
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
