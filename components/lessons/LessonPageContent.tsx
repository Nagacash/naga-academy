"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GatedFallback } from "@/components/courses/GatedFallback";
import { useUserTier, hasTierAccess } from "@/lib/hooks/use-user-tier";
import { useAuth } from "@clerk/nextjs";
import { MuxVideoPlayer } from "./MuxVideoPlayer";
import { YouTubePlayer } from "./YouTubePlayer";
import { LessonContent } from "./LessonContent";
import { LessonCompleteButton } from "./LessonCompleteButton";
import { LessonSidebar } from "./LessonSidebar";
import type { LESSON_BY_ID_QUERYResult } from "@/sanity.types";

interface LessonPageContentProps {
  lesson: NonNullable<LESSON_BY_ID_QUERYResult>;
  userId: string | null;
}

export function LessonPageContent({ lesson, userId }: LessonPageContentProps) {
  const { isLoaded: isAuthLoaded } = useAuth();
  const userTier = useUserTier();
  const [hasRendered, setHasRendered] = useState(false);

  // Find the first course the user has access to (courses are sorted by tier: free, pro, ultra)
  // This allows users to access lessons if they have access to ANY course containing the lesson
  const courses = lesson.courses ?? [];
  
  // Memoize access check to prevent unnecessary recalculations
  const accessibleCourse = useMemo(() => {
    if (!isAuthLoaded) return null;
    return courses.find((course) => hasTierAccess(userTier, course.tier));
  }, [courses, userTier, isAuthLoaded]);
  
  const hasAccess = !!accessibleCourse;

  // Debug logging
  useEffect(() => {
    console.log("LessonPageContent render:", {
      userTier,
      isAuthLoaded,
      hasAccess,
      coursesCount: courses.length,
      playbackId: lesson.video?.asset?.playbackId,
      youtubeUrl: lesson.youtubeUrl,
      hasVideo: !!lesson.video,
      hasAsset: !!lesson.video?.asset,
      videoData: lesson.video,
    });
  }, [userTier, isAuthLoaded, hasAccess, courses.length, lesson.video, lesson.youtubeUrl]);

  // Mark as rendered after auth is loaded to prevent flickering
  useEffect(() => {
    if (isAuthLoaded && !hasRendered) {
      setHasRendered(true);
    }
  }, [isAuthLoaded, hasRendered]);

  // Use the accessible course for navigation, or fall back to the first course for gated fallback
  const activeCourse = accessibleCourse ?? courses[0];

  // Check if user has completed this lesson
  const isCompleted = userId
    ? (lesson.completedBy?.includes(userId) ?? false)
    : false;

  // Find previous and next lessons for navigation
  const modules = activeCourse?.modules;
  let prevLesson: { id: string; slug: string; title: string } | null = null;
  let nextLesson: { id: string; slug: string; title: string } | null = null;
  const completedLessonIds: string[] = [];

  if (modules) {
    const allLessons: Array<{ id: string; slug: string; title: string }> = [];

    for (const module of modules) {
      if (module.lessons) {
        for (const l of module.lessons) {
          allLessons.push({
            id: l._id,
            slug: l.slug!.current!,
            title: l.title ?? "Untitled Lesson",
          });
          if (userId && l.completedBy?.includes(userId)) {
            completedLessonIds.push(l._id);
          }
        }
      }
    }

    const currentIndex = allLessons.findIndex((l) => l.id === lesson._id);
    prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    nextLesson =
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      {activeCourse && hasAccess && (
        <LessonSidebar
          courseSlug={activeCourse.slug!.current!}
          courseTitle={activeCourse.title}
          modules={activeCourse.modules ?? null}
          currentLessonId={lesson._id}
          completedLessonIds={completedLessonIds}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 min-w-0">
        {hasAccess ? (
          <>
            {/* Video Player Section - Always render to prevent flickering */}
            <div className="mb-6">
              {lesson.youtubeUrl ? (
                <YouTubePlayer
                  key={`youtube-${lesson.youtubeUrl}`}
                  url={lesson.youtubeUrl}
                  title={lesson.title ?? undefined}
                  className=""
                />
              ) : lesson.video?.asset?.playbackId ? (
                <MuxVideoPlayer
                  key={`video-${lesson.video.asset.playbackId}`}
                  playbackId={lesson.video.asset.playbackId}
                  title={lesson.title ?? undefined}
                  className=""
                />
              ) : lesson.video ? (
                <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                  <div className="text-center">
                    <VideoOff className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <p className="text-yellow-400 font-semibold mb-2">Video Processing</p>
                    <p className="text-zinc-500 text-sm">
                      {lesson.video.asset?.status === "preparing" 
                        ? "Your video is being processed. Please wait..."
                        : "Video is not ready yet. Check back in a few minutes."}
                    </p>
                    {lesson.video.asset?.status && (
                      <p className="text-zinc-600 text-xs mt-2">Status: {lesson.video.asset.status}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                  <div className="text-center">
                    <VideoOff className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400">No video available for this lesson</p>
                    <p className="text-zinc-600 text-sm mt-2">
                      Upload a Mux video or add a YouTube URL in the admin panel
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {lesson.title ?? "Untitled Lesson"}
                </h1>
                {lesson.description && (
                  <p className="text-zinc-400">{lesson.description}</p>
                )}
              </div>

              {userId && (
                <LessonCompleteButton
                  lessonId={lesson._id}
                  lessonSlug={lesson.slug!.current!}
                  isCompleted={isCompleted}
                />
              )}
            </div>

            {/* Lesson Content */}
            {lesson.content && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-semibold">Lesson Notes</h2>
                </div>
                <LessonContent content={lesson.content} />
              </div>
            )}

            {/* Navigation between lessons */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.slug}`}>
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{prevLesson.title}</span>
                    <span className="sm:hidden">Previous</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.slug}`}>
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white">
                    <span className="hidden sm:inline">{nextLesson.title}</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </>
        ) : (
          <GatedFallback requiredTier={activeCourse?.tier} />
        )}
      </div>
    </div>
  );
}
