"use client";

import { useEffect } from "react";

/**
 * Suppresses known harmless console errors in development
 * Specifically filters out Sentry errors blocked by ad blockers
 * Runs immediately on client mount to catch errors early
 */
export function ErrorSuppressor() {
  useEffect(() => {
    // Only suppress in development
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    // Store original functions - bind to console to preserve 'this' context
    const originalError = console.error.bind(console);
    const originalWarn = console.warn.bind(console);

    // Filter out harmless errors from:
    // 1. Sentry errors blocked by ad blockers
    // 2. Cloudflare Turnstile/Private Access Token challenges
    const shouldSuppress = (args: unknown[]) => {
      const firstArg = args[0];
      
      // Convert all arguments to a searchable string
      const allArgs = args.map(arg => String(arg).toLowerCase()).join(" ");
      
      // Check if it's a string message
      if (typeof firstArg === "string") {
        const message = firstArg.toLowerCase();
        return (
          // Sentry errors
          message.includes("err_blocked_by_client") ||
          message.includes("sentry.io") ||
          message.includes("net::err_blocked_by_client") ||
          (message.includes("failed to fetch") && message.includes("sentry")) ||
          // Cloudflare challenges
          message.includes("private access token challenge") ||
          message.includes("challenges.cloudflare.com") ||
          message.includes("turnstile") ||
          (message.includes("script-src") && message.includes("default-src"))
        );
      }
      
      // Check if it's an Error object
      if (firstArg instanceof Error) {
        const message = firstArg.message.toLowerCase();
        const stack = firstArg.stack?.toLowerCase() || "";
        return (
          message.includes("err_blocked_by_client") ||
          message.includes("sentry.io") ||
          message.includes("challenges.cloudflare.com") ||
          stack.includes("sentry.io") ||
          stack.includes("challenges.cloudflare.com")
        );
      }
      
      // Check all arguments for suppressed patterns
      return (
        // Sentry patterns
        allArgs.includes("err_blocked_by_client") ||
        allArgs.includes("sentry.io") ||
        allArgs.includes("o449981.ingest.us.sentry.io") ||
        // Cloudflare patterns
        allArgs.includes("private access token challenge") ||
        allArgs.includes("challenges.cloudflare.com") ||
        allArgs.includes("turnstile") ||
        (allArgs.includes("401") && allArgs.includes("cloudflare")) ||
        (allArgs.includes("unauthorized") && allArgs.includes("cloudflare"))
      );
    };

    console.error = ((...args: unknown[]) => {
      if (!shouldSuppress(args)) {
        // Call the bound function - console.error accepts any arguments
        (originalError as any)(...args);
      }
    }) as typeof console.error;

    console.warn = ((...args: unknown[]) => {
      if (!shouldSuppress(args)) {
        // Call the bound function - console.warn accepts any arguments
        (originalWarn as any)(...args);
      }
    }) as typeof console.warn;

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []); // Run immediately on mount

  // Always return null to avoid hydration mismatches
  return null;
}

