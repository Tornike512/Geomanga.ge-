"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button";
import { Spinner } from "@/components/spinner";
import { useLibraryEntries } from "@/features/library/hooks/use-library-entries";
import { useReadingHistory } from "@/features/library/hooks/use-reading-history";
import { MangaGrid } from "@/features/manga/components/manga-grid";
import type { ReadingHistoryWithDetails } from "@/types/history.types";
import type { LibraryCategory } from "@/types/library.types";

const TABS = {
  bookmarks: "სანიშნეები",
  history: "კითხვის ისტორია",
  dropped: "მიტოვებული",
  toread: "წასაკითხი",
  favorites: "ფავორიტები",
} as const;

type Tab = keyof typeof TABS;

const LIBRARY_TAB_TO_CATEGORY: Partial<Record<Tab, LibraryCategory>> = {
  bookmarks: "bookmarks",
  dropped: "dropped",
  toread: "toread",
  favorites: "favorites",
};

function isValidTab(tab: string): tab is Tab {
  return tab in TABS;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

export default function LibraryTabPage() {
  const params = useParams();
  const tab = params.tab as string;

  if (!isValidTab(tab)) {
    notFound();
  }

  const activeTab = tab;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const libraryCategory = LIBRARY_TAB_TO_CATEGORY[activeTab];
  const isLibraryTab = !!libraryCategory;

  const {
    data: libraryData,
    isLoading: libraryLoading,
    error: libraryError,
  } = useLibraryEntries(libraryCategory || "bookmarks", {
    page: currentPage,
    limit: pageSize,
  });

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useReadingHistory({ page: currentPage, limit: pageSize });

  // Fetch counts for all library tabs (for display in tabs)
  const { data: bookmarksCount } = useLibraryEntries("bookmarks", { limit: 1 });
  const { data: droppedCount } = useLibraryEntries("dropped", { limit: 1 });
  const { data: toreadCount } = useLibraryEntries("toread", { limit: 1 });
  const { data: favoritesCount } = useLibraryEntries("favorites", { limit: 1 });

  const tabCounts: Partial<Record<Tab, number>> = {
    bookmarks: bookmarksCount?.total,
    history: historyData?.total,
    dropped: droppedCount?.total,
    toread: toreadCount?.total,
    favorites: favoritesCount?.total,
  };

  const isLoading = activeTab === "history" ? historyLoading : libraryLoading;
  const error = activeTab === "history" ? historyError : libraryError;
  const data =
    activeTab === "history" ? historyData : isLibraryTab ? libraryData : null;

  return (
    <div className="container mx-auto box-border max-w-[1920px] overflow-x-hidden px-4 py-12 sm:px-6 md:px-8 md:py-12 lg:px-12">
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
      <div className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-1 backdrop-blur-sm">
        <div className="flex flex-col gap-1 sm:flex-row">
          {(Object.keys(TABS) as Tab[]).map((tabKey) => (
            <Link
              key={tabKey}
              href={`/library/${tabKey}`}
              onClick={() => setCurrentPage(1)}
              className={`min-w-0 flex-1 whitespace-nowrap rounded-md px-4 py-3 text-center font-medium text-sm transition-all duration-200 sm:px-6 ${
                activeTab === tabKey
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "text-[var(--muted-foreground)] hover:bg-white/5 hover:text-[var(--foreground)]"
              }`}
            >
              {TABS[tabKey]}
              {tabCounts[tabKey] != null && tabCounts[tabKey] > 0 && (
                <span className="ml-2 opacity-70">({tabCounts[tabKey]})</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="mb-4 text-red-600">
            ბიბლიოთეკის ჩატვირთვა ვერ მოხერხდა
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="whitespace-nowrap"
          >
            სცადეთ ხელახლა
          </Button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mb-4 flex flex-col items-center justify-center text-gray-400">
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
                : activeTab === "history"
                  ? "კითხვის ისტორია არ გაქვთ"
                  : activeTab === "dropped"
                    ? "მიტოვებული მანგა არ გაქვთ"
                    : activeTab === "toread"
                      ? "წასაკითხი მანგა არ გაქვთ"
                      : "ფავორიტები ჯერ არ გაქვთ"}
            </h3>
            <p className="mb-4 text-gray-600">
              {activeTab === "bookmarks"
                ? "დაიწყეთ მანგის სანიშნებში დამატება, რომ აქ იხილოთ"
                : activeTab === "history"
                  ? "დაიწყეთ მანგის კითხვა, რომ აქ იხილოთ თქვენი ისტორია"
                  : activeTab === "dropped"
                    ? "მიტოვებული მანგა აქ გამოჩნდება"
                    : activeTab === "toread"
                      ? "წასაკითხი მანგა აქ გამოჩნდება"
                      : "ფავორიტები აქ გამოჩნდება"}
            </p>
          </div>
          <Link href="/browse">
            <Button className="whitespace-nowrap">მანგის ნავიგაცია</Button>
          </Link>
        </div>
      ) : (
        <>
          {isLibraryTab ? (
            <MangaGrid manga={data.items.map((entry) => entry.manga)} />
          ) : (
            <div className="space-y-4">
              {(activeTab === "history" && "items" in data
                ? (data.items as ReadingHistoryWithDetails[])
                : []
              ).map((history) => (
                <Link
                  key={history.id}
                  href={`/read/${history.chapter.id}`}
                  className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[rgba(26,26,36,0.8)] sm:gap-4 sm:p-4"
                >
                  <Image
                    src={history.manga.cover_image_url || "/placeholder.png"}
                    alt={history.manga.title}
                    width={64}
                    height={96}
                    className="h-20 w-14 shrink-0 rounded-lg object-cover sm:h-24 sm:w-16"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 truncate font-medium text-sm sm:text-base">
                      {history.manga.title}
                    </h3>
                    <p className="mb-1 truncate text-[var(--muted-foreground)] text-xs sm:mb-2 sm:text-sm">
                      თავი {history.chapter.chapter_number}
                      {history.chapter.title && `: ${history.chapter.title}`}
                    </p>
                    {formatDate(history.last_read_at) && (
                      <div className="text-[var(--muted-foreground)] text-xs">
                        {formatDate(history.last_read_at)}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--accent)]" />
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
