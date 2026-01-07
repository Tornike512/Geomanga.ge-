"use client";

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { Skeleton } from "@/components/skeleton";
import { useChapterWithPages } from "@/features/reader/hooks/use-chapter-with-pages";
import { useTrackReading } from "@/features/reader/hooks/use-track-reading";

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const {
    data: chapter,
    isLoading,
    error,
  } = useChapterWithPages(Number(chapterId));
  const trackReading = useTrackReading();

  // Track reading progress when page changes
  const handlePageChange = (newIndex: number) => {
    setCurrentPageIndex(newIndex);

    if (chapter) {
      trackReading.mutate({
        manga_id: chapter.manga_id,
        chapter_id: chapter.id,
      });
    }
  };

  const goToNextPage = () => {
    if (chapter && currentPageIndex < chapter.pages.length - 1) {
      handlePageChange(currentPageIndex + 1);
    } else if (chapter?.next_chapter_id) {
      router.push(`/read/${chapter.next_chapter_id}`);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      handlePageChange(currentPageIndex - 1);
    } else if (chapter?.previous_chapter_id) {
      router.push(`/read/${chapter.previous_chapter_id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-full max-w-4xl p-4">
          <Skeleton className="h-screen w-full" />
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="mb-4 font-bold text-2xl">Chapter not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentPage = chapter.pages[currentPageIndex];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-50 border-[var(--border)] border-b bg-[var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {chapter.manga && (
              <Link href={`/manga/${chapter.manga.slug}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
            )}
            <div className="text-white">
              <h1 className="font-medium text-base tracking-tight">
                {chapter.manga?.title || "Unknown Manga"}
              </h1>
              <p className="text-[var(--muted-foreground)] text-sm">
                Chapter {chapter.chapter_number}: {chapter.title}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-[var(--accent-foreground)] text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            {currentPageIndex + 1} / {chapter.pages.length}
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="pt-20 pb-24">
        <div className="mx-auto max-w-5xl px-4">
          {currentPage && (
            <button
              type="button"
              onClick={goToNextPage}
              onKeyDown={(e) => e.key === "Enter" && goToNextPage()}
              className="w-full cursor-pointer"
              aria-label="Go to next page"
            >
              <Image
                src={currentPage.image_url}
                alt={`Page ${currentPage.page_number}`}
                width={1200}
                height={1800}
                className="h-auto w-full"
                priority
              />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-[var(--border)] border-t bg-[var(--background)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-4">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPageIndex === 0 && !chapter.previous_chapter_id}
            size="sm"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            {currentPageIndex === 0 && chapter.previous_chapter_id
              ? "Previous Chapter"
              : "Previous"}
          </Button>

          {/* Page Navigation */}
          <div className="flex items-center gap-3">
            <Dropdown
              options={chapter.pages.map((_page, index) => ({
                value: String(index),
                label: `Page ${index + 1}`,
              }))}
              value={String(currentPageIndex)}
              onChange={(value) => handlePageChange(Number(value))}
              aria-label="Select page"
              className="min-w-[120px]"
            />
          </div>

          <Button
            onClick={goToNextPage}
            disabled={
              currentPageIndex === chapter.pages.length - 1 &&
              !chapter.next_chapter_id
            }
            size="sm"
          >
            {currentPageIndex === chapter.pages.length - 1 &&
            chapter.next_chapter_id
              ? "Next Chapter"
              : "Next"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chapter List Sidebar (Optional) */}
      <div className="fixed top-24 right-4 hidden max-h-96 overflow-y-auto rounded-lg bg-gray-900 p-4 lg:block">
        <h3 className="mb-2 font-bold text-white">Chapters</h3>
        <div className="space-y-1">
          {chapter.previous_chapter_id && (
            <Link href={`/read/${chapter.previous_chapter_id}`}>
              <Button
                variant="ghost"
                className="w-full text-left text-gray-400 text-sm"
              >
                Previous Chapter
              </Button>
            </Link>
          )}
          <div className="rounded-md bg-blue-600 px-3 py-2 font-medium text-sm text-white">
            Chapter {chapter.chapter_number}
          </div>
          {chapter.next_chapter_id && (
            <Link href={`/read/${chapter.next_chapter_id}`}>
              <Button
                variant="ghost"
                className="w-full text-left text-gray-400 text-sm"
              >
                Next Chapter
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
