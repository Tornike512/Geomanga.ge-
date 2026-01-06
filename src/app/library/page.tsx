"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";
import { useBookmarks } from "@/features/library/hooks/use-bookmarks";
import { useReadingHistory } from "@/features/library/hooks/use-reading-history";
import { MangaGrid } from "@/features/manga/components/manga-grid";
import type { ReadingHistoryWithDetails } from "@/types/history.types";

type Tab = "bookmarks" | "history";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("bookmarks");
  const librarySkeletonKeys = useMemo(
    () => Array.from({ length: 10 }, () => crypto.randomUUID()),
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const {
    data: bookmarksData,
    isLoading: bookmarksLoading,
    error: bookmarksError,
  } = useBookmarks({ page: currentPage, pageSize: pageSize });

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useReadingHistory({ page: currentPage, pageSize: pageSize });

  const isLoading =
    activeTab === "bookmarks" ? bookmarksLoading : historyLoading;
  const error = activeTab === "bookmarks" ? bookmarksError : historyError;
  const data = activeTab === "bookmarks" ? bookmarksData : historyData;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">My Library</h1>
        <p className="text-gray-600">
          Your bookmarked manga and reading history
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-4 border-gray-200 border-b">
        <button
          type="button"
          onClick={() => handleTabChange("bookmarks")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "bookmarks"
              ? "border-blue-600 border-b-2 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Bookmarks
          {bookmarksData && (
            <span className="ml-2 text-sm">({bookmarksData.total})</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("history")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "history"
              ? "border-blue-600 border-b-2 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Reading History
          {historyData && (
            <span className="ml-2 text-sm">({historyData.total})</span>
          )}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {librarySkeletonKeys.map((key) => (
            <div key={key} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-red-600">Failed to load your library</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">
            <svg
              className="mx-auto mb-4 h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Empty library"
              role="img"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mb-2 font-bold text-xl">
              {activeTab === "bookmarks"
                ? "No bookmarks yet"
                : "No reading history"}
            </h3>
            <p className="mb-4 text-gray-600">
              {activeTab === "bookmarks"
                ? "Start bookmarking manga to see them here"
                : "Start reading manga to see your history here"}
            </p>
          </div>
          <Link href="/browse">
            <Button>Browse Manga</Button>
          </Link>
        </div>
      ) : (
        <>
          {activeTab === "bookmarks" ? (
            <MangaGrid manga={data.items.map((bookmark) => bookmark.manga)} />
          ) : (
            <div className="space-y-4">
              {(activeTab === "history" && "items" in data
                ? (data.items as ReadingHistoryWithDetails[])
                : []
              ).map((history) => (
                <Link
                  key={history.id}
                  href={`/read/${history.chapter.id}`}
                  className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <Image
                    src={history.chapter.manga.cover_image}
                    alt={history.chapter.manga.title}
                    width={64}
                    height={96}
                    className="h-24 w-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="mb-1 font-bold text-lg">
                      {history.chapter.manga.title}
                    </h3>
                    <p className="mb-2 text-gray-600">
                      Chapter {history.chapter.chapter_number}:{" "}
                      {history.chapter.title}
                    </p>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span>Page {history.page_number}</span>
                      <span>•</span>
                      <span>
                        {new Date(history.last_read_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost">Continue Reading →</Button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.total > pageSize && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                ← Previous
              </Button>
              <span className="text-gray-600">
                Page {currentPage} of {Math.ceil(data.total / pageSize)}
              </span>
              <Button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= Math.ceil(data.total / pageSize)}
                variant="outline"
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
