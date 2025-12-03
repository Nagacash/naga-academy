"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Code2,
  Play,
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const loggedOutLinks = [
  { href: "#courses", label: "Courses" },
  { href: "/pricing", label: "Pricing" },
  { href: "#testimonials", label: "Reviews" },
];

/**
 * Smooth scroll to an element by ID with retry logic
 */
function scrollToElement(elementId: string, offset: number = 80, retries: number = 3) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
      behavior: "smooth",
    });
    return true;
  }
  
  // Retry if element not found (might still be loading)
  if (retries > 0) {
    setTimeout(() => {
      scrollToElement(elementId, offset, retries - 1);
    }, 200);
  }
  return false;
}

/**
 * Handle anchor link clicks with smooth scrolling
 */
function handleAnchorClick(
  href: string,
  pathname: string,
  router: ReturnType<typeof useRouter>,
) {
  // Check if it's an anchor link
  if (href.startsWith("#")) {
    const elementId = href.slice(1); // Remove the #
    if (!elementId) return; // Empty hash, do nothing

    // If we're on the home page, scroll directly
    if (pathname === "/") {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToElement(elementId);
      }, 50);
      return;
    }

    // If we're on a different page, navigate to home with hash
    router.push(`/${href}`);
    // Wait for navigation, then scroll (longer delay for page load)
    setTimeout(() => {
      scrollToElement(elementId, 80, 5); // More retries for page navigation
    }, 500);
  }
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { has, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render Clerk components until mounted and Clerk is loaded
  const isReady = mounted && isLoaded;

  const isUltra = has?.({ plan: "ultra" });

  const loggedInLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
    // Show "Account" for Ultra users, "Upgrade" for others
    ...(isUltra
      ? [{ href: "/pricing", label: "Account", icon: Sparkles }]
      : [{ href: "/pricing", label: "Upgrade", icon: Sparkles }]),
  ];

  // Handle hash scrolling on page load
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const elementId = hash.slice(1);
        // Wait for page to fully load, then scroll
        const timer = setTimeout(() => {
          scrollToElement(elementId);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  return (
    <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
      {/* Logo - links to dashboard when logged in, home when logged out */}
      <div>
        {isReady ? (
          <>
            <SignedIn>
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <Logo />
              </Link>
            </SignedIn>
            <SignedOut>
              <Link href="/" className="flex items-center gap-3 group">
                <Logo />
              </Link>
            </SignedOut>
          </>
        ) : (
          <Link href="/" className="flex items-center gap-3 group">
            <Logo />
          </Link>
        )}
      </div>

      {/* Center Navigation - absolute positioning for perfect center on desktop */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {isReady ? (
          <>
            <SignedOut>
              <div className="flex items-center gap-8 text-sm text-zinc-400">
                {loggedOutLinks.map((link) => {
                  const isAnchor = link.href.startsWith("#");
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        if (isAnchor) {
                          e.preventDefault();
                          handleAnchorClick(link.href, pathname, router);
                        }
                      }}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </SignedOut>

            <SignedIn>
          <div className="flex items-center gap-1">
            {loggedInLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-violet-500/10 text-violet-300"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
            </SignedIn>
          </>
        ) : (
          <div className="flex items-center gap-8 text-sm text-zinc-400">
            {loggedOutLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {isReady ? (
          <>
            <SignedOut>
          {/* Mobile: Dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800"
            >
              {loggedOutLinks.map((link) => {
                const isAnchor = link.href.startsWith("#");
                return (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        if (isAnchor) {
                          e.preventDefault();
                          handleAnchorClick(link.href, pathname, router);
                        }
                      }}
                      className="text-zinc-300 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <SignInButton mode="modal">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              Sign in
            </Button>
          </SignInButton>
          <Link href="/pricing" className="hidden sm:block">
            <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-600/25">
              Start Learning
            </Button>
          </Link>
            </SignedOut>

            <SignedIn>
              {/* Mobile: Dropdown menu next to user profile */}
              <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800"
            >
              {loggedInLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" &&
                    pathname.startsWith(link.href));

                return (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive ? "text-violet-300" : "text-zinc-300",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-violet-500/20",
                  },
                }}
              />
            </SignedIn>
          </>
        ) : (
          <div className="w-9 h-9 bg-zinc-800 rounded-full animate-pulse" />
        )}
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
          <Play className="w-2 h-2 text-white fill-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg tracking-tight leading-none">
          NAGA
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          Academy
        </span>
      </div>
    </>
  );
}
