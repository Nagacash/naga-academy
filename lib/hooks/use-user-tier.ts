"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import type { Tier } from "@/lib/constants";

/**
 * List of admin email addresses (client-side)
 * Should match the server-side list in lib/admin-access.ts
 */
const ADMIN_EMAILS = ["sonic13.ch@googlemail.com"].map((e) => e.toLowerCase());

/**
 * Client-side hook to get the current user's subscription tier.
 * Checks user metadata first (for admin upgrades), then Clerk plans.
 * Admins automatically get "ultra" tier.
 */
export function useUserTier(): Tier {
  const { has } = useAuth();
  const { user } = useUser();

  // Check if user is admin (admins always have ultra tier)
  const userEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
    return "ultra";
  }

  // Check user metadata first (for admin upgrades)
  const metadataTier = user?.publicMetadata?.tier as Tier | undefined;
  if (metadataTier) {
    return metadataTier;
  }

  // Fall back to Clerk plan checks using actual plan keys
  // Check for ultra plan (plan key: "ultra")
  if (has?.({ plan: "ultra" })) return "ultra";
  
  // Check for pro plan (plan key: "pro")
  if (has?.({ plan: "pro" })) return "pro";
  
  // Check for free_user plan (plan key: "free_user") or default to free
  if (has?.({ plan: "free_user" })) return "free";

  // Default: user has no subscription = free tier
  return "free";
}

/**
 * Check if a user tier has access to content at the specified tier.
 *
 * - Free content (or no tier specified): accessible to everyone
 * - Pro content: requires pro or ultra plan
 * - Ultra content: requires ultra plan
 */
export function hasTierAccess(
  userTier: Tier,
  contentTier: Tier | null | undefined
): boolean {
  // Free content or no tier = accessible to everyone
  if (!contentTier || contentTier === "free") return true;

  // Ultra content requires ultra plan
  if (contentTier === "ultra") return userTier === "ultra";

  // Pro content requires pro OR ultra plan
  if (contentTier === "pro") return userTier === "pro" || userTier === "ultra";

  return false;
}
