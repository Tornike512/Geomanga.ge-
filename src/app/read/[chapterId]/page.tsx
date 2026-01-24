"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Spinner } from "@/components/spinner";
import { useMangaDexChapterPages } from "@/features/manga";
import { useChapterWithPages } from "@/features/reader/hooks/use-chapter-with-pages";
import { useTrackReading } from "@/features/reader/hooks/use-track-reading";

// Custom hook for auto-hiding UI based on scroll and mouse movement
function useAutoHideUI(hideDelay = 2000) {
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  const showUI = useCallback(() => {
    setIsVisible(true);
    // Clear existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    // Set new timeout to hide
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  }, [hideDelay]);

  const hideUI = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    // Handle scroll - hide immediately when scrolling
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
        hideUI();
      }
      lastScrollY.current = currentScrollY;
    };

    // Handle mouse movement - show UI and start hide timer
    const handleMouseMove = () => {
      showUI();
    };

    // Handle touch for mobile
    const handleTouchStart = () => {
      showUI();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    // Initial show with auto-hide
    showUI();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [showUI, hideUI]);

  return isVisible;
}

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;
  const isUIVisible = useAutoHideUI(2000);

  // Check if this is a MangaDex chapter
  const isMangaDex = chapterId.startsWith("md-");
  const mangaDexChapterId = isMangaDex ? chapterId.slice(3) : null;

  // State to store MangaDex chapter info from URL params
  const [mangaDexInfo, setMangaDexInfo] = useState<{
    mangaId: string | null;
    chapterNumber: string | null;
    title: string | null;
  }>({ mangaId: null, chapterNumber: null, title: null });

  // Local chapter data
  const {
    data: localChapter,
    isLoading: localLoading,
    error: localError,
  } = useChapterWithPages(isMangaDex ? 0 : Number(chapterId));

  // MangaDex chapter pages
  const {
    data: mangaDexPages,
    isLoading: mangaDexLoading,
    error: mangaDexError,
  } = useMangaDexChapterPages(mangaDexChapterId || "");

  const trackReading = useTrackReading();

  // Track reading progress when local chapter loads
  useEffect(() => {
    if (localChapter && !isMangaDex) {
      trackReading.mutate({
        manga_id: localChapter.manga_id,
        chapter_id: localChapter.id,
      });
    }
  }, [
    localChapter?.id,
    localChapter?.manga_id,
    trackReading,
    localChapter,
    isMangaDex,
  ]);

  // Parse chapter info from session storage for MangaDex
  useEffect(() => {
    if (isMangaDex && mangaDexChapterId) {
      // Try to get chapter info from session storage
      const storedInfo = sessionStorage.getItem(
        `md-chapter-${mangaDexChapterId}`,
      );
      if (storedInfo) {
        try {
          const parsed = JSON.parse(storedInfo) as {
            mangaId: string | null;
            chapterNumber: string | null;
            title: string | null;
          };
          setMangaDexInfo(parsed);
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [isMangaDex, mangaDexChapterId]);

  const isLoading = isMangaDex ? mangaDexLoading : localLoading;
  const error = isMangaDex ? mangaDexError : localError;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  if (
    error ||
    (isMangaDex && (!mangaDexPages || mangaDexPages.length === 0)) ||
    (!isMangaDex && !localChapter)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="mb-4 font-bold text-2xl">თავი ვერ მოიძებნა</h1>
          <p className="mb-4 text-gray-400">
            {isMangaDex
              ? "MangaDex-დან გვერდების ჩატვირთვა ვერ მოხერხდა"
              : "ამ თავს ჯერ არ აქვს ატვირთული გვერდები"}
          </p>
          <Button onClick={() => router.back()}>უკან</Button>
        </div>
      </div>
    );
  }

  // Common UI visibility classes
  const uiVisibilityClass = isUIVisible
    ? "translate-y-0 opacity-100"
    : "pointer-events-none opacity-0";

  // For local chapters
  if (!isMangaDex && localChapter) {
    if (!localChapter.pages || localChapter.pages.length === 0) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="text-center text-white">
            <h1 className="mb-4 font-bold text-2xl">გვერდები ვერ მოიძებნა</h1>
            <p className="mb-4 text-gray-400">
              ამ თავს ჯერ არ აქვს ატვირთული გვერდები
            </p>
            <Button onClick={() => router.back()}>უკან</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div
          className={`fixed top-0 right-0 left-0 z-50 border-[var(--border)] border-b bg-[var(--background)]/90 backdrop-blur-md transition-all duration-300 ${uiVisibilityClass}`}
        >
          <div className="mx-auto flex max-w-[1920px] items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              {localChapter.manga ? (
                <Link href={`/manga/${localChapter.manga.slug}`}>
                  <Button variant="outline" size="sm" className="h-8 px-3">
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                    უკან
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  უკან
                </Button>
              )}
              <div className="text-white">
                <h1 className="font-medium text-sm tracking-tight">
                  {localChapter.manga?.title || "უცნობი მანგა"}
                </h1>
                <p className="text-[var(--muted-foreground)] text-xs">
                  თავი {localChapter.chapter_number}
                  {localChapter.title ? `: ${localChapter.title}` : ""}
                </p>
              </div>
            </div>
            <div className="rounded-md bg-[var(--accent)] px-2.5 py-1 font-medium text-[var(--accent-foreground)] text-xs">
              {localChapter.pages.length} გვერდი
            </div>
          </div>
        </div>

        {/* Reader Content */}
        <div className="py-4">
          <div className="mx-auto max-w-4xl">
            {localChapter.pages.map((page) => (
              <div key={page.id} className="w-full">
                <Image
                  src={page.image_url}
                  alt={`გვერდი ${page.page_number}`}
                  width={1200}
                  height={1800}
                  className="h-auto w-full"
                  priority={page.page_number <= 3}
                  loading={page.page_number > 3 ? "lazy" : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chapter Navigation */}
        <div
          className={`fixed right-0 bottom-0 left-0 z-50 border-[var(--border)] border-t bg-[var(--background)]/90 backdrop-blur-md transition-all duration-300 ${uiVisibilityClass}`}
        >
          <div className="mx-auto flex max-w-[1920px] items-center justify-between px-4 py-2">
            {localChapter.previous_chapter_id ? (
              <Link href={`/read/${localChapter.previous_chapter_id}`}>
                <Button size="sm" className="h-8 px-3">
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                  წინა
                </Button>
              </Link>
            ) : (
              <Button size="sm" className="h-8 px-3" disabled>
                <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                წინა
              </Button>
            )}

            <div className="text-[var(--muted-foreground)] text-xs">
              თავი {localChapter.chapter_number}
            </div>

            {localChapter.next_chapter_id ? (
              <Link href={`/read/${localChapter.next_chapter_id}`}>
                <Button size="sm" className="h-8 px-3">
                  შემდეგი
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <Button size="sm" className="h-8 px-3" disabled>
                შემდეგი
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MangaDex reader
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div
        className={`fixed top-0 right-0 left-0 z-50 border-[var(--border)] border-b bg-[var(--background)]/90 backdrop-blur-md transition-all duration-300 ${uiVisibilityClass}`}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              უკან
            </Button>
            <div className="text-white">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1 py-0.5 text-xs">
                  <Globe className="h-3 w-3" />
                  MangaDex
                </Badge>
              </div>
              <p className="mt-0.5 text-[var(--muted-foreground)] text-xs">
                {mangaDexInfo.chapterNumber
                  ? `თავი ${mangaDexInfo.chapterNumber}`
                  : "MangaDex თავი"}
                {mangaDexInfo.title ? `: ${mangaDexInfo.title}` : ""}
              </p>
            </div>
          </div>
          <div className="rounded-md bg-[var(--accent)] px-2.5 py-1 font-medium text-[var(--accent-foreground)] text-xs">
            {mangaDexPages?.length || 0} გვერდი
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="py-4">
        <div className="mx-auto max-w-4xl">
          {mangaDexPages?.map((pageUrl, index) => (
            <div key={pageUrl} className="w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pageUrl}
                alt={`გვერდი ${index + 1}`}
                className="h-auto w-full"
                loading={index <= 2 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-50 border-[var(--border)] border-t bg-[var(--background)]/90 backdrop-blur-md transition-all duration-300 ${uiVisibilityClass}`}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-center px-4 py-2">
          <div className="text-[var(--muted-foreground)] text-xs">
            {mangaDexPages?.length || 0} გვერდი • MangaDex
          </div>
        </div>
      </div>
    </div>
  );
}
