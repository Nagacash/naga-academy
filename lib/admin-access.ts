import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * List of admin email addresses
 * Add admin emails here or use ADMIN_EMAILS environment variable
 */
const getAdminEmails = (): string[] => {
  const envAdmins = process.env.ADMIN_EMAILS;
  if (envAdmins) {
    return envAdmins.split(",").map((email) => email.trim().toLowerCase());
  }
  // Default admin emails
  return ["sonic13.ch@googlemail.com"].map((email) => email.toLowerCase());
};

/**
 * Check if the current user is an admin
 * Checks user's email against the admin list
 */
export async function isAdmin(): Promise<boolean> {
  try {
    // Use auth() first to check if user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return false;
    }

    // Then get user details
    const user = await currentUser();
    if (!user) {
      return false;
    }

    const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
    if (!userEmail) {
      return false;
    }

    const adminEmails = getAdminEmails();
    const isAdminUser = adminEmails.includes(userEmail);
    
    return isAdminUser;
  } catch (error) {
    // Silently fail - don't log errors in production to avoid noise
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.error("[Admin Check] Error checking admin access:", error);
      if (error instanceof Error) {
        console.error("[Admin Check] Error details:", error.message);
      }
    }
    return false;
  }
}

/**
 * Require admin access - throws error if not admin
 * Use in server components and API routes
 */
export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Admin access required");
  }
}

/**
 * Get admin status for client components
 * Returns null if not authenticated, true/false for admin status
 */
export async function getAdminStatus(): Promise<boolean | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    return await isAdmin();
  } catch (error) {
    console.error("Error getting admin status:", error);
    return false;
  }
}

