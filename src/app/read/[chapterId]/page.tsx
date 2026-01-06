"use client";

import Image from "next/image";
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
      <div className="fixed top-0 right-0 left-0 z-50 border-[#3F3F46] border-b-2 bg-[#09090B]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <div className="flex items-center gap-6">
            <Link href={`/manga/${chapter.manga.slug}`}>
              <Button variant="outline" className="border-2">
                ← BACK
              </Button>
            </Link>
            <div className="text-white">
              <h1 className="font-bold text-2xl uppercase tracking-tighter">
                {chapter.manga.title}
              </h1>
              <p className="text-[#A1A1AA] text-lg">
                CHAPTER {chapter.chapter_number}: {chapter.title}
              </p>
            </div>
          </div>
          <div className="rounded-none border-2 border-[#DFE104] bg-[#DFE104] px-6 py-3 font-bold text-2xl text-[#000000]">
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
      <div className="fixed right-0 bottom-0 left-0 z-50 border-[#3F3F46] border-t-2 bg-[#09090B]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPageIndex === 0 && !chapter.previous_chapter_id}
            className="border-2 px-8"
            size="lg"
          >
            {currentPageIndex === 0 && chapter.previous_chapter_id
              ? "← PREVIOUS CHAPTER"
              : "← PREVIOUS PAGE"}
          </Button>

          {/* Page Navigation */}
          <div className="flex items-center gap-4">
            <select
              value={currentPageIndex}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="h-14 rounded-none border-2 border-[#3F3F46] bg-[#09090B] px-6 font-bold text-white text-xl uppercase tracking-tight"
            >
              {chapter.pages.map((page, index) => (
                <option key={page.id} value={index}>
                  PAGE {index + 1}
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
            className="border-2 px-8"
            size="lg"
          >
            {currentPageIndex === chapter.pages.length - 1 &&
            chapter.next_chapter_id
              ? "NEXT CHAPTER →"
              : "NEXT PAGE →"}
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
