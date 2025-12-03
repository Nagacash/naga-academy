import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-access";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/lessons(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Protect learner routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Protect admin routes - require authentication and admin access
  if (isAdminRoute(req)) {
    try {
      // First ensure user is authenticated (Clerk handles redirect automatically)
      const { userId } = await auth.protect();

      if (!userId) {
        // Not authenticated, Clerk will handle redirect
        return;
      }

      // Then check if user is admin
      const admin = await isAdmin();

      // Debug logging
      console.log("[Middleware] Admin route access check:", {
        path: req.url,
        userId,
        isAdmin: admin,
      });

      if (!admin) {
        console.log("[Middleware] User is not admin, redirecting to home");
        // Redirect to home if not admin
        return NextResponse.redirect(new URL("/", req.url));
      }

      console.log("[Middleware] User is admin, allowing access");
    } catch (error) {
      // If there's an error checking admin status, redirect to home for security
      console.error("[Middleware] Error checking admin access:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

