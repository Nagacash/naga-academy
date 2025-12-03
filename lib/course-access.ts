import { auth, currentUser } from "@clerk/nextjs/server";
import type { Tier } from "@/lib/constants";
import { isAdmin } from "@/lib/admin-access";

/**
 * Check if the current user has access to content at the specified tier.
 * Admins always have access to all tiers.
 * Uses Clerk's has() to check plan subscriptions or user metadata.
 *
 * - Free content (or no tier specified): accessible to everyone
 * - Pro content: requires pro or ultra plan
 * - Ultra content: requires ultra plan
 */
export async function hasAccessToTier(
  requiredTier: Tier | null | undefined
): Promise<boolean> {
  // Free content or no tier = accessible to everyone
  if (!requiredTier || requiredTier === "free") return true;

  // Admins have access to everything
  const admin = await isAdmin();
  if (admin) return true;

  const { has } = await auth();
  const user = await currentUser();

  // Check user metadata first (for admin upgrades)
  const metadataTier = user?.publicMetadata?.tier as Tier | undefined;
  if (metadataTier) {
    if (requiredTier === "ultra") {
      return metadataTier === "ultra";
    }
    if (requiredTier === "pro") {
      return metadataTier === "pro" || metadataTier === "ultra";
    }
  }

  // Fall back to Clerk plan checks using actual plan keys
  // Ultra content requires ultra plan
  if (requiredTier === "ultra") {
    return has({ plan: "ultra" });
  }

  // Pro content requires pro OR ultra plan
  if (requiredTier === "pro") {
    return has({ plan: "pro" }) || has({ plan: "ultra" });
  }

  return false;
}

/**
 * Get the user's current subscription tier.
 * Admins always get "ultra" tier.
 */
export async function getUserTier(): Promise<Tier> {
  // Admins always have ultra tier
  const admin = await isAdmin();
  if (admin) return "ultra";

  const { has } = await auth();
  const user = await currentUser();

  // Check user metadata first (for admin upgrades)
  const metadataTier = user?.publicMetadata?.tier as Tier | undefined;
  if (metadataTier) {
    return metadataTier;
  }

  // Fall back to Clerk plan checks using actual plan keys
  // Check for ultra plan (plan key: "ultra")
  if (has({ plan: "ultra" })) return "ultra";
  
  // Check for pro plan (plan key: "pro")
  if (has({ plan: "pro" })) return "pro";
  
  // Check for free_user plan (plan key: "free_user") or default to free
  if (has({ plan: "free_user" })) return "free";

  // Default: user has no subscription = free tier
  return "free";
}
