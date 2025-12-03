import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ErrorSuppressor } from "@/components/ErrorSuppressor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naga Academy | Learn to Code",
  description:
    "Master coding the modern way with expertly crafted courses, modules, and hands-on lessons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignInUrl="/auth/redirect"
      afterSignUpUrl="/auth/redirect"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Suppress Sentry errors early - runs immediately */}
          {process.env.NODE_ENV === "development" && (
            <Script
              id="suppress-sentry-errors"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    if (typeof window === 'undefined') return;
                    const originalError = console.error;
                    const originalWarn = console.warn;
                    
                    function shouldSuppress(args) {
                      const firstArg = args[0];
                      let message = '';
                      
                      if (typeof firstArg === 'string') {
                        message = firstArg.toLowerCase();
                      } else if (firstArg instanceof Error) {
                        message = (firstArg.message || '').toLowerCase();
                      } else {
                        message = String(firstArg || '').toLowerCase();
                      }
                      
                      const allArgs = Array.from(args).map(a => String(a).toLowerCase()).join(' ');
                      
                      return (
                        // Sentry errors
                        message.includes('err_blocked_by_client') ||
                        message.includes('sentry.io') ||
                        message.includes('net::err_blocked_by_client') ||
                        allArgs.includes('err_blocked_by_client') ||
                        allArgs.includes('sentry.io') ||
                        allArgs.includes('o449981.ingest.us.sentry.io') ||
                        // Cloudflare challenges
                        message.includes('private access token challenge') ||
                        message.includes('challenges.cloudflare.com') ||
                        message.includes('turnstile') ||
                        (message.includes('script-src') && message.includes('default-src')) ||
                        allArgs.includes('private access token challenge') ||
                        allArgs.includes('challenges.cloudflare.com') ||
                        allArgs.includes('turnstile') ||
                        (allArgs.includes('401') && allArgs.includes('cloudflare')) ||
                        (allArgs.includes('unauthorized') && allArgs.includes('cloudflare'))
                      );
                    }
                    
                    console.error = function(...args) {
                      if (!shouldSuppress(args)) {
                        originalError.apply(console, args);
                      }
                    };
                    
                    console.warn = function(...args) {
                      if (!shouldSuppress(args)) {
                        originalWarn.apply(console, args);
                      }
                    };
                  })();
                `,
              }}
            />
          )}
          <ErrorSuppressor />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
