"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
  } = useBookmarks({ page: currentPage, limit: pageSize });

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useReadingHistory({ page: currentPage, limit: pageSize });

  const isLoading =
    activeTab === "bookmarks" ? bookmarksLoading : historyLoading;
  const error = activeTab === "bookmarks" ? bookmarksError : historyError;
  const data = activeTab === "bookmarks" ? bookmarksData : historyData;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto max-w-[1920px] px-6 py-8 md:px-8 md:py-8 lg:px-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
          ჩემი ბიბლიოთეკა
        </h1>
        <p className="text-[var(--muted-foreground)] text-lg">
          თქვენი სანიშნებში დამატებული მანგა და კითხვის ისტორია
        </p>
      </div>

      {/* Tabs - Glass effect tabs */}
      <div className="mb-8 flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] p-1 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={() => handleTabChange("bookmarks")}
          className={`flex-1 rounded-md px-6 py-8 font-medium text-sm transition-all duration-200 ${
            activeTab === "bookmarks"
              ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          სანიშნეები
          {bookmarksData && (
            <span className="ml-2 opacity-70">({bookmarksData.total})</span>
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleTabChange("history")}
          className={`flex-1 rounded-md px-6 py-8 font-medium text-sm transition-all duration-200 ${
            activeTab === "history"
              ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          კითხვის ისტორია
          {historyData && (
            <span className="ml-2 opacity-70">({historyData.total})</span>
          )}
        </Button>
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
        <div className="py-8 text-center">
          <p className="mb-4 text-red-600">
            ბიბლიოთეკის ჩატვირთვა ვერ მოხერხდა
          </p>
          <Button onClick={() => window.location.reload()}>
            სცადეთ ხელახლა
          </Button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="py-8 text-center">
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
                ? "სანიშნეები ჯერ არ გაქვთ"
                : "კითხვის ისტორია არ გაქვთ"}
            </h3>
            <p className="mb-4 text-gray-600">
              {activeTab === "bookmarks"
                ? "დაიწყეთ მანგის სანიშნებში დამატება, რომ აქ იხილოთ"
                : "დაიწყეთ მანგის კითხვა, რომ აქ იხილოთ თქვენი ისტორია"}
            </p>
          </div>
          <Link href="/browse">
            <Button>მანგის ნავიგაცია</Button>
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
                  className="flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[rgba(26,26,36,0.8)]"
                >
                  <Image
                    src={history.manga.cover_image_url || "/placeholder.png"}
                    alt={history.manga.title}
                    width={64}
                    height={96}
                    className="h-24 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="mb-1 font-medium text-base">
                      {history.manga.title}
                    </h3>
                    <p className="mb-2 text-[var(--muted-foreground)] text-sm">
                      თავი {history.chapter.chapter_number}:{" "}
                      {history.chapter.title}
                    </p>
                    <div className="flex items-center gap-4 text-[var(--muted-foreground)] text-xs">
                      <span>
                        {new Date(history.last_read_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost">
                      კითხვის გაგრძელება
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
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
                size="sm"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                წინა
              </Button>
              <span className="text-[var(--muted-foreground)] text-sm">
                გვერდი{" "}
                <span className="text-[var(--accent)]">{currentPage}</span> /{" "}
                {Math.ceil(data.total / pageSize)}
              </span>
              <Button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= Math.ceil(data.total / pageSize)}
                variant="outline"
                size="sm"
              >
                შემდეგი
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
