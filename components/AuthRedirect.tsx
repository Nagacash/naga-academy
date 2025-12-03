"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

/**
 * Client-side component that redirects authenticated users
 * Checks admin status and redirects accordingly
 */
export function AuthRedirect() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !userId) return;

    // Check if user is admin (client-side check)
    const checkAndRedirect = async () => {
      try {
        // Call our API to check admin status
        const response = await fetch("/api/debug/user");
        const data = await response.json();

        if (data.admin) {
          // Admin - redirect to admin
          router.push("/admin");
        } else if (userId) {
          // Regular user - redirect to dashboard
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        // Fallback: if authenticated, go to dashboard
        if (userId) {
          router.push("/dashboard");
        }
      }
    };

    // Small delay to ensure auth is fully loaded
    const timer = setTimeout(checkAndRedirect, 100);
    return () => clearTimeout(timer);
  }, [isLoaded, userId, router]);

  return null;
}


