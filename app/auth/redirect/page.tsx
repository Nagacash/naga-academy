import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin-access";

/**
 * Redirect page that checks admin status and redirects accordingly
 * Called after Clerk sign-in/sign-up/onboarding
 * 
 * This is a page route that works better with Clerk's redirect handling
 */
export default async function RedirectPage() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.log("[Redirect] No userId, redirecting to home");
      // Not authenticated, redirect to home
      redirect("/");
    }

    console.log("[Redirect] User authenticated, checking admin status...", userId);

    // Get user details for debugging
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    console.log("[Redirect] User email:", userEmail);

    // Check if user is admin
    const admin = await isAdmin();
    
    console.log("[Redirect] Admin status:", admin);
    
    if (admin) {
      console.log("[Redirect] User is admin, redirecting to /admin");
      // Admin users go to admin dashboard
      redirect("/admin");
    }

    console.log("[Redirect] User is not admin, redirecting to /dashboard");
    // Regular users go to dashboard
    redirect("/dashboard");
  } catch (error) {
    console.error("[Redirect] Error in redirect:", error);
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("[Redirect] Error details:", error.message, error.stack);
    }
    // Fallback to dashboard instead of home (better UX)
    redirect("/dashboard");
  }
}

