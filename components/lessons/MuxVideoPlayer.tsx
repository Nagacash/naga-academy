"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { VideoOff, AlertCircle } from "lucide-react";
import { getMuxSignedTokens } from "@/lib/actions/mux";

interface MuxVideoPlayerProps {
  playbackId: string | null | undefined;
  title?: string;
  className?: string;
}

interface MuxTokens {
  playback: string;
  thumbnail: string;
  storyboard: string;
}

export function MuxVideoPlayer({
  playbackId,
  title,
  className,
}: MuxVideoPlayerProps) {
  const [tokens, setTokens] = useState<MuxTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [hasRendered, setHasRendered] = useState(false);
  const playerMountedRef = useRef(false);
  const shouldRenderRef = useRef(true); // Keep track if we should render
  
  // Memoize playbackId to prevent unnecessary re-renders
  const stablePlaybackId = useMemo(() => playbackId, [playbackId]);
  
  // Once we start rendering, never stop
  useEffect(() => {
    if (stablePlaybackId && !shouldRenderRef.current) {
      shouldRenderRef.current = true;
    }
  }, [stablePlaybackId]);

  useEffect(() => {
    if (!stablePlaybackId) {
      setIsLoading(false);
      return;
    }

    // Only reset if playbackId actually changed
    const currentPlaybackId = stablePlaybackId;
    
    // Reset state when playbackId changes
    setTokens(null);
    setError(null);
    setPlayerError(null);
    setIsLoading(true);
    playerMountedRef.current = false;

    async function fetchTokens() {
      try {
        const result = await getMuxSignedTokens(currentPlaybackId);
        
        if (result.error) {
          console.warn("Mux token generation error:", result.error, result.debug);
          // Continue without tokens - player may work with public playback
          setError(result.error);
        } else if (
          result.playbackToken &&
          result.thumbnailToken &&
          result.storyboardToken
        ) {
          setTokens({
            playback: result.playbackToken,
            thumbnail: result.thumbnailToken,
            storyboard: result.storyboardToken,
          });
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching Mux tokens:", err);
        // Continue without tokens - player may work with public playback
        setError(err instanceof Error ? err.message : "Failed to load tokens");
      } finally {
        setIsLoading(false);
        setHasRendered(true);
      }
    }

    fetchTokens();
  }, [stablePlaybackId]);

  if (!stablePlaybackId) {
    return (
      <div
        className={`aspect-video bg-zinc-900 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-500">No video available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} key={`video-container-${stablePlaybackId}`}>
      {error && !playerError && (
        <div className="mb-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm text-yellow-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Playing without signed tokens (may have limited features)</span>
        </div>
      )}
      {playerError && (
        <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Video playback error: {playerError}</span>
        </div>
      )}
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 relative">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3 animate-pulse" />
              <p className="text-zinc-500">Loading video...</p>
            </div>
          </div>
        ) : shouldRenderRef.current ? (
          <div 
            className="w-full h-full" 
            key={`player-wrapper-${stablePlaybackId}`}
            style={{ minHeight: '400px' }}
            onClick={(e) => {
              // Prevent click-to-play on the video container
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              // Prevent click-to-play on mouse down
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <MuxPlayer
              playbackId={stablePlaybackId}
              tokens={tokens ?? undefined}
              metadata={{
                video_title: title ?? "Lesson video",
              }}
              streamType="on-demand"
              autoPlay={false}
              className="w-full h-full"
              accentColor="#8b5cf6"
              disableClickToPlay
              onError={(e: any) => {
                console.error("MuxPlayer error:", e);
                const errorMsg = e?.message || e?.detail || "Unknown error";
                setPlayerError(errorMsg);
                // Keep the player mounted even on error - don't throw
              }}
              onLoadedMetadata={() => {
                console.log("MuxPlayer metadata loaded successfully");
                setPlayerError(null);
                playerMountedRef.current = true;
              }}
              onPlay={() => {
                console.log("MuxPlayer started playing");
                setPlayerError(null);
              }}
              onLoadStart={() => {
                console.log("MuxPlayer load started");
                setPlayerError(null);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
