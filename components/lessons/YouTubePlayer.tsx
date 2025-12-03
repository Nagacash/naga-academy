"use client";

import { useMemo } from "react";
import { VideoOff } from "lucide-react";

interface YouTubePlayerProps {
  url: string | null | undefined;
  title?: string;
  className?: string;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Handle various YouTube URL formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://youtube.com/watch?v=VIDEO_ID&feature=share
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return null;
}

export function YouTubePlayer({
  url,
  title,
  className,
}: YouTubePlayerProps) {
  const videoId = useMemo(() => {
    if (!url) return null;
    return extractYouTubeId(url);
  }, [url]);

  if (!url || !videoId) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">Invalid YouTube URL</p>
        </div>
      </div>
    );
  }

  // Use YouTube's embed URL with maximum privacy and minimal branding
  // Parameters to hide YouTube branding and prevent navigation:
  // - rel=0: Don't show related videos from other channels
  // - modestbranding=1: Hide YouTube logo in controls (minimal branding)
  // - showinfo=0: Don't show video info
  // - controls=1: Show player controls
  // - iv_load_policy=3: Disable video annotations
  // - disablekb=1: Disable keyboard controls
  // - cc_load_policy=0: Don't show captions by default
  // - fs=0: Disable fullscreen (prevents navigation)
  // - origin: Restrict embedding
  const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&iv_load_policy=3&disablekb=1&cc_load_policy=0&fs=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;

  return (
    <div className={className}>
      <div 
        className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 relative"
        style={{
          // Hide any YouTube branding that might show through
          isolation: 'isolate',
        }}
        onClick={(e) => {
          // Prevent accidental clicks on the container
          if (e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <iframe
          src={embedUrl}
          title={title ?? "Video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          // Removed allowFullScreen to prevent fullscreen mode
          className="w-full h-full"
          loading="lazy"
          style={{
            // Additional styling to hide YouTube branding
            border: 'none',
          }}
        />
        {/* Comprehensive overlay to block YouTube logo and branding areas */}
        {/* Top-left corner - YouTube logo area */}
        <div 
          className="absolute top-0 left-0 w-32 h-16 z-20 pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
          style={{ 
            cursor: 'default',
            // Transparent but blocks all interactions
            background: 'transparent',
          }}
          aria-hidden="true"
        />
        {/* Top-right corner - YouTube menu/options area */}
        <div 
          className="absolute top-0 right-0 w-24 h-16 z-20 pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
          style={{ 
            cursor: 'default',
            background: 'transparent',
          }}
          aria-hidden="true"
        />
        {/* Bottom overlay to hide YouTube branding in controls */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-12 z-20 pointer-events-none"
          style={{ 
            // Gradient to hide any YouTube text/branding at bottom
            background: 'linear-gradient(to top, rgba(9, 9, 11, 0.8) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

