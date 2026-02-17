"use client";

import { ArrowLeft, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { Spinner } from "@/components/spinner";
import { API_URL } from "@/config";
import { ChapterComments, MangadexChapterComments } from "@/features/comments";
import { useMangaDexChapterPages } from "@/features/manga";
import { useChapterWithPages } from "@/features/reader/hooks/use-chapter-with-pages";
import { useChaptersByManga } from "@/features/reader/hooks/use-chapters-by-manga";
import { useTrackMangadexReading } from "@/features/reader/hooks/use-track-mangadex-reading";
import { useTrackReading } from "@/features/reader/hooks/use-track-reading";

// Parse initial page ID from URL (e.g., /read/1/18 -> "18")
function getInitialPageIdFromUrl(chapterId: string): string | null {
  if (typeof window === "undefined") return null;

  const pathname = window.location.pathname;
  const expectedPrefix = `/read/${chapterId}/`;

  if (pathname.startsWith(expectedPrefix)) {
    const pageId = pathname.slice(expectedPrefix.length);
    return pageId || null;
  }

  return null;
}

// Custom hook to scroll to initial page from URL
function useInitialPageScroll(
  chapterId: string,
  pageRefs: React.RefObject<Map<number | string, HTMLDivElement | null>>,
  pagesCount: number,
) {
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Only scroll once and when pages are loaded
    if (hasScrolledRef.current || pagesCount === 0) return;

    const initialPageId = getInitialPageIdFromUrl(chapterId);
    if (!initialPageId) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Try to find the element - check both string and number keys
      let element = pageRefs.current.get(initialPageId);
      if (!element) {
        // Try as number for local chapters
        const numericId = Number(initialPageId);
        if (!Number.isNaN(numericId)) {
          element = pageRefs.current.get(numericId);
        }
      }

      if (element) {
        element.scrollIntoView({ behavior: "instant", block: "start" });
        hasScrolledRef.current = true;
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [chapterId, pageRefs, pagesCount]);
}

// Custom hook to track visible page and update URL
function usePageScrollTracking(
  chapterId: string,
  pageRefs: React.RefObject<Map<number | string, HTMLDivElement | null>>,
  pagesCount: number,
) {
  const [currentPageId, setCurrentPageId] = useState<number | string | null>(
    null,
  );

  useEffect(() => {
    // Wait for pages to be rendered
    if (pagesCount === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the entry that is most visible (highest intersection ratio)
      let mostVisibleEntry: IntersectionObserverEntry | null = null;
      let maxRatio = 0;

      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      }

      if (mostVisibleEntry) {
        const pageId = mostVisibleEntry.target.getAttribute("data-page-id");
        if (pageId) {
          const parsedId = pageId.includes("-") ? pageId : Number(pageId);
          setCurrentPageId(parsedId);

          // Update URL without triggering navigation
          const newUrl = `/read/${chapterId}/${pageId}`;
          window.history.replaceState(
            { ...window.history.state, pageId },
            "",
            newUrl,
          );
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null, // viewport
      rootMargin: "-40% 0px -40% 0px", // Consider page visible when it's in the middle 20% of viewport
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    // Observe all page elements
    pageRefs.current.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [chapterId, pageRefs, pagesCount]);

  return currentPageId;
}

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
    mangaTitle: string | null;
    coverImageUrl: string | null;
  }>({
    mangaId: null,
    chapterNumber: null,
    title: null,
    mangaTitle: null,
    coverImageUrl: null,
  });

  // Local chapter data
  const {
    data: localChapter,
    isLoading: localLoading,
    error: localError,
  } = useChapterWithPages(isMangaDex ? 0 : Number(chapterId));

  // All chapters for the manga (for chapter selector dropdown)
  const { data: allChapters } = useChaptersByManga(localChapter?.manga_id ?? 0);

  // MangaDex chapter pages
  const {
    data: mangaDexPages,
    isLoading: mangaDexLoading,
    error: mangaDexError,
  } = useMangaDexChapterPages(mangaDexChapterId || "");

  const trackReading = useTrackReading();
  const trackMangadexReading = useTrackMangadexReading();

  // Refs for page elements (used for scroll tracking)
  const pageRefs = useRef<Map<number | string, HTMLDivElement | null>>(
    new Map(),
  );

  // Calculate pages count for scroll tracking
  const pagesCount = isMangaDex
    ? mangaDexPages?.length || 0
    : localChapter?.pages?.length || 0;

  // Track current page and update URL
  const currentPageId = usePageScrollTracking(chapterId, pageRefs, pagesCount);

  // Scroll to initial page from URL (e.g., /read/1/18 scrolls to page 18)
  useInitialPageScroll(chapterId, pageRefs, pagesCount);

  // Track reading progress when local chapter loads
  useEffect(() => {
    if (localChapter && !isMangaDex) {
      trackReading.mutate({
        manga_id: localChapter.manga_id,
        chapter_id: localChapter.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    localChapter?.id,
    localChapter?.manga_id,
    isMangaDex,
    localChapter,
    trackReading.mutate,
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
            mangaTitle: string | null;
            coverImageUrl: string | null;
          };
          setMangaDexInfo(parsed);
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [isMangaDex, mangaDexChapterId]);

  // Track MangaDex reading progress
  useEffect(() => {
    if (
      isMangaDex &&
      mangaDexChapterId &&
      mangaDexInfo.mangaId &&
      mangaDexInfo.mangaTitle &&
      mangaDexInfo.chapterNumber
    ) {
      trackMangadexReading.mutate({
        mangadex_manga_id: mangaDexInfo.mangaId,
        mangadex_chapter_id: mangaDexChapterId,
        manga_title: mangaDexInfo.mangaTitle,
        chapter_number: mangaDexInfo.chapterNumber,
        cover_image_url: mangaDexInfo.coverImageUrl,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isMangaDex,
    mangaDexChapterId,
    mangaDexInfo.mangaId,
    mangaDexInfo.mangaTitle,
    mangaDexInfo.chapterNumber,
    mangaDexInfo.coverImageUrl,
    trackMangadexReading.mutate,
  ]);

  // Clear refs when chapter changes
  useEffect(() => {
    pageRefs.current.clear();
  }, []);

  const isLoading = isMangaDex ? mangaDexLoading : localLoading;
  const error = isMangaDex ? mangaDexError : localError;

  // Helper to get current page number for display
  const getCurrentPageNumber = (): number | null => {
    if (!currentPageId) return null;

    if (typeof currentPageId === "string" && currentPageId.startsWith("md-")) {
      // MangaDex page: extract number from "md-X"
      return parseInt(currentPageId.slice(3), 10);
    }

    if (!isMangaDex && localChapter?.pages) {
      // Local chapter: find the page and return its page_number
      const page = localChapter.pages.find((p) => p.id === currentPageId);
      return page?.page_number ?? null;
    }

    return null;
  };

  const currentPageNumber = getCurrentPageNumber();

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
          {isMangaDex && mangaDexInfo.mangaId ? (
            <Link href={`/manga/md-${mangaDexInfo.mangaId}`}>
              <Button>უკან</Button>
            </Link>
          ) : (
            <Button onClick={() => router.back()}>უკან</Button>
          )}
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
            <Link href={`/manga/${localChapter.manga?.slug}`}>
              <Button>უკან</Button>
            </Link>
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
            <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
              <Link
                href={`/manga/${localChapter.manga?.slug}`}
                className="shrink-0"
              >
                <Button variant="outline" size="sm" className="h-8 px-3">
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  უკან
                </Button>
              </Link>
              <div className="min-w-0 text-white">
                <h1 className="truncate font-medium text-sm tracking-tight">
                  {localChapter.manga?.title || "უცნობი მანგა"}
                </h1>
                <p className="truncate text-[var(--muted-foreground)] text-xs">
                  თავი {localChapter.chapter_number}
                  {localChapter.title ? `: ${localChapter.title}` : ""}
                </p>
              </div>
            </div>
            <div className="shrink-0 rounded-md bg-[var(--accent)] px-2.5 py-1 font-medium text-[var(--accent-foreground)] text-xs">
              {localChapter.pages.length} გვერდი
            </div>
          </div>
        </div>

        {/* Reader Content */}
        <div className="px-1 py-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-2">
            {localChapter.pages.map((page) => (
              <div
                key={page.id}
                ref={(el) => {
                  pageRefs.current.set(page.id, el);
                }}
                data-page-id={page.id}
                className="w-full"
              >
                <Image
                  src={`${API_URL}/images/pages/${page.chapter_id}/${page.page_number}`}
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

        {/* Chapter Selector */}
        <div className="flex items-center justify-center border-[var(--border)] border-t bg-[var(--background)] px-2 py-3">
          <Dropdown
            value={String(localChapter.id)}
            onChange={(val) => router.push(`/read/${val}`)}
            options={
              allChapters?.map((ch) => ({
                value: String(ch.id),
                label: `თავი ${ch.chapter_number}${ch.title ? ` - ${ch.title}` : ""}`,
              })) ?? []
            }
            placeholder="აირჩიეთ თავი"
            aria-label="აირჩიეთ თავი"
            className="w-full max-w-sm"
          />
        </div>

        {/* Comments Section */}
        <div className="border-[var(--border)] border-t bg-[var(--background)] px-2 pb-20">
          <ChapterComments chapterId={localChapter.id} />
        </div>

        {/* Bottom Bar */}
        <div
          className={`fixed right-0 bottom-0 left-0 z-50 border-[var(--border)] border-t bg-[var(--background)]/90 backdrop-blur-md transition-all duration-300 ${uiVisibilityClass}`}
        >
          <div className="mx-auto flex max-w-[1920px] items-center justify-center gap-3 px-4 py-2">
            {localChapter.previous_chapter_id ? (
              <Link
                href={`/read/${localChapter.previous_chapter_id}`}
                className="rounded-md bg-[var(--accent)] px-3 py-1 font-medium text-[var(--accent-foreground)] text-xs transition-colors hover:bg-[var(--accent)]/80"
              >
                წინა
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-md bg-[var(--accent)]/40 px-3 py-1 font-medium text-black text-xs">
                წინა
              </span>
            )}
            <span className="font-medium text-[var(--foreground)] text-xs">
              თავი {localChapter.chapter_number}
            </span>
            {localChapter.next_chapter_id ? (
              <Link
                href={`/read/${localChapter.next_chapter_id}`}
                className="rounded-md bg-[var(--accent)] px-3 py-1 font-medium text-[var(--accent-foreground)] text-xs transition-colors hover:bg-[var(--accent)]/80"
              >
                შემდეგი
              </Link>
            ) : (
              <span className="cursor-not-allowed rounded-md bg-[var(--accent)]/40 px-3 py-1 font-medium text-black text-xs">
                შემდეგი
              </span>
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
            {mangaDexInfo.mangaId ? (
              <Link href={`/manga/md-${mangaDexInfo.mangaId}`}>
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
      <div className="px-1 py-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-2">
          {mangaDexPages?.map((pageUrl, index) => {
            const pageId = `md-${index + 1}`;
            return (
              <div
                key={pageUrl}
                ref={(el) => {
                  pageRefs.current.set(pageId, el);
                }}
                data-page-id={pageId}
                className="w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  src={pageUrl}
                  alt={`გვერდი ${index + 1}`}
                  className="h-auto w-full"
                  loading={index <= 2 ? "eager" : "lazy"}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments Section */}
      {mangaDexChapterId && (
        <div className="border-[var(--border)] border-t bg-[var(--background)] px-2 pb-20">
          <MangadexChapterComments mangadexChapterId={mangaDexChapterId} />
        </div>
      )}

      {/* Footer Navigation */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-50 border-[var(--border)] border-t bg-[var(--background)]/90 backdrop-blur-md transition-all duration-300 ${uiVisibilityClass}`}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-center px-4 py-2">
          <div className="text-[var(--muted-foreground)] text-xs">
            {currentPageNumber
              ? `${currentPageNumber} / ${mangaDexPages?.length || 0}`
              : `${mangaDexPages?.length || 0} გვერდი`}{" "}
            • MangaDex
          </div>
        </div>
      </div>
    </div>
  );
}
