"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button";
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
        chapter_id: chapter.id,
        page_number: newIndex + 1,
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
      <div className="fixed top-0 right-0 left-0 z-50 border-gray-800 border-b bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href={`/manga/${chapter.manga.slug}`}>
              <Button variant="ghost" className="text-white">
                ← Back to Manga
              </Button>
            </Link>
            <div className="text-white">
              <h1 className="font-bold">{chapter.manga.title}</h1>
              <p className="text-gray-400 text-sm">
                Chapter {chapter.chapter_number}: {chapter.title}
              </p>
            </div>
          </div>
          <div className="text-sm text-white">
            Page {currentPageIndex + 1} / {chapter.pages.length}
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="pt-20 pb-24">
        <div className="mx-auto max-w-5xl px-4">
          {currentPage && (
            <img
              src={currentPage.image_url}
              alt={`Page ${currentPage.page_number}`}
              className="h-auto w-full"
              onClick={goToNextPage}
            />
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-gray-800 border-t bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPageIndex === 0 && !chapter.previous_chapter_id}
            className="text-white"
          >
            {currentPageIndex === 0 && chapter.previous_chapter_id
              ? "← Previous Chapter"
              : "← Previous Page"}
          </Button>

          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <select
              value={currentPageIndex}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
            >
              {chapter.pages.map((page, index) => (
                <option key={page.id} value={index}>
                  Page {index + 1}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={goToNextPage}
            disabled={
              currentPageIndex === chapter.pages.length - 1 &&
              !chapter.next_chapter_id
            }
            className="text-white"
          >
            {currentPageIndex === chapter.pages.length - 1 &&
            chapter.next_chapter_id
              ? "Next Chapter →"
              : "Next Page →"}
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
