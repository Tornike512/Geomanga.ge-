"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Spinner } from "@/components/spinner";
import { useLibraryEntries } from "@/features/library/hooks/use-library-entries";
import { useMangadexLibraryEntries } from "@/features/library/hooks/use-mangadex-library-entries";
import { useMangadexReadingHistory } from "@/features/library/hooks/use-mangadex-reading-history";
import { useReadingHistory } from "@/features/library/hooks/use-reading-history";
import { MangaGrid } from "@/features/manga/components/manga-grid";
import type {
  MangadexReadingHistory,
  ReadingHistoryWithDetails,
} from "@/types/history.types";
import type {
  LibraryCategory,
  MangadexLibraryEntry,
} from "@/types/library.types";

const TABS = {
  bookmarks: "სანიშნეები",
  reading: "ვკითხულობ",
  history: "კითხვის ისტორია",
  dropped: "მიტოვებული",
  toread: "წასაკითხი",
  favorites: "ფავორიტები",
} as const;

type Tab = keyof typeof TABS;

const LIBRARY_TAB_TO_CATEGORY: Partial<Record<Tab, LibraryCategory>> = {
  bookmarks: "bookmarks",
  reading: "reading",
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

  // MangaDex library entries for the reading tab
  const { data: mangadexLibraryData, isLoading: mangadexLibraryLoading } =
    useMangadexLibraryEntries(libraryCategory || "bookmarks", {
      page: 1,
      limit: 100,
    });

  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useReadingHistory({ page: 1, limit: 100 });

  const {
    data: mangadexHistoryData,
    isLoading: mangadexHistoryLoading,
    error: mangadexHistoryError,
  } = useMangadexReadingHistory({ page: 1, limit: 100 });

  // Fetch counts for all library tabs (for display in tabs)
  const { data: bookmarksCount } = useLibraryEntries("bookmarks", { limit: 1 });
  const { data: readingCount } = useLibraryEntries("reading", { limit: 1 });
  const { data: mangadexReadingCount } = useMangadexLibraryEntries("reading", {
    limit: 1,
  });
  const { data: droppedCount } = useLibraryEntries("dropped", { limit: 1 });
  const { data: toreadCount } = useLibraryEntries("toread", { limit: 1 });
  const { data: favoritesCount } = useLibraryEntries("favorites", { limit: 1 });

  type UnifiedHistoryItem =
    | { source: "local"; data: ReadingHistoryWithDetails }
    | { source: "mangadex"; data: MangadexReadingHistory };

  const mergedHistory = useMemo(() => {
    if (activeTab !== "history") return [];
    const items: UnifiedHistoryItem[] = [];
    if (historyData?.items) {
      for (const item of historyData.items) {
        items.push({ source: "local", data: item });
      }
    }
    if (mangadexHistoryData?.items) {
      for (const item of mangadexHistoryData.items) {
        items.push({ source: "mangadex", data: item });
      }
    }
    items.sort(
      (a, b) =>
        new Date(b.data.last_read_at).getTime() -
        new Date(a.data.last_read_at).getTime(),
    );
    return items;
  }, [activeTab, historyData?.items, mangadexHistoryData?.items]);

  // Merged reading entries (local + MangaDex) for the reading tab
  type UnifiedReadingItem =
    | {
        source: "local";
        data: {
          id: number;
          manga: {
            id: number;
            title: string;
            cover_image_url?: string | null;
            slug: string;
          };
          created_at: string;
        };
      }
    | { source: "mangadex"; data: MangadexLibraryEntry };

  const mergedReading = useMemo(() => {
    if (activeTab !== "reading") return [];
    const items: UnifiedReadingItem[] = [];
    if (libraryData?.items) {
      for (const item of libraryData.items) {
        items.push({
          source: "local",
          data: {
            id: item.id,
            manga: {
              id: item.manga.id,
              title: item.manga.title,
              cover_image_url: item.manga.cover_image_url,
              slug: item.manga.slug,
            },
            created_at: item.created_at,
          },
        });
      }
    }
    if (mangadexLibraryData?.items) {
      for (const item of mangadexLibraryData.items) {
        items.push({ source: "mangadex", data: item });
      }
    }
    items.sort(
      (a, b) =>
        new Date(b.data.created_at).getTime() -
        new Date(a.data.created_at).getTime(),
    );
    return items;
  }, [activeTab, libraryData?.items, mangadexLibraryData?.items]);

  const totalHistoryCount =
    (historyData?.total ?? 0) + (mangadexHistoryData?.total ?? 0);
  const paginatedHistory = mergedHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const totalHistoryPages = Math.ceil(totalHistoryCount / pageSize);

  const totalReadingCount =
    (readingCount?.total ?? 0) + (mangadexReadingCount?.total ?? 0);

  const tabCounts: Partial<Record<Tab, number>> = {
    bookmarks: bookmarksCount?.total,
    reading: totalReadingCount || undefined,
    history: totalHistoryCount || undefined,
    dropped: droppedCount?.total,
    toread: toreadCount?.total,
    favorites: favoritesCount?.total,
  };

  const isReadingTab = activeTab === "reading";
  const isHistoryTab = activeTab === "history";

  const isLoading = isHistoryTab
    ? historyLoading || mangadexHistoryLoading
    : isReadingTab
      ? libraryLoading || mangadexLibraryLoading
      : libraryLoading;
  const error = isHistoryTab
    ? historyError || mangadexHistoryError
    : libraryError;
  const data = isHistoryTab ? historyData : isLibraryTab ? libraryData : null;

  // For non-reading library tabs, check if empty based on local data only
  // For reading tab, check merged data
  const isEmpty = isHistoryTab
    ? mergedHistory.length === 0
    : isReadingTab
      ? mergedReading.length === 0
      : !data || data.items.length === 0;

  return (
    <div className="container mx-auto box-border max-w-[1920px] overflow-x-hidden px-2 py-12 sm:px-4 md:px-8 md:py-12">
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
      ) : isEmpty ? (
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
                : activeTab === "reading"
                  ? "ვკითხულობ სიაში მანგა არ გაქვთ"
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
                : activeTab === "reading"
                  ? 'დაამატეთ მანგა „ვკითხულობ" სიაში, რომ აქ იხილოთ'
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
          {isReadingTab ? (
            // Reading tab: merged local + MangaDex entries displayed as cards
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {mergedReading.map((item) => {
                if (item.source === "local") {
                  const entry = item.data;
                  return (
                    <Link
                      key={`local-${entry.id}`}
                      href={`/manga/${entry.manga.slug}`}
                      className="group block overflow-hidden"
                    >
                      <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                        <div className="relative aspect-[2/3] w-full overflow-hidden">
                          {entry.manga.cover_image_url ? (
                            <Image
                              src={entry.manga.cover_image_url}
                              alt={entry.manga.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[var(--muted)]">
                              <span className="text-[var(--muted-foreground)] text-xs">
                                N/A
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 p-2">
                          <h3 className="truncate font-medium text-sm [text-wrap:nowrap] group-hover:text-[var(--accent)]">
                            {entry.manga.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  );
                }
                const entry = item.data;
                return (
                  <Link
                    key={`md-${entry.id}`}
                    href={`/manga/md-${entry.mangadex_manga_id}`}
                    className="group block overflow-hidden"
                  >
                    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                      <div className="relative aspect-[2/3] w-full overflow-hidden">
                        {entry.cover_image_url ? (
                          <Image
                            src={entry.cover_image_url}
                            alt={entry.manga_title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[var(--muted)]">
                            <span className="text-[var(--muted-foreground)] text-xs">
                              N/A
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 p-2">
                        <div className="flex min-w-0 items-center gap-1">
                          <h3 className="min-w-0 truncate font-medium text-sm [text-wrap:nowrap] group-hover:text-[var(--accent)]">
                            {entry.manga_title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="shrink-0 gap-0.5 px-1 py-0 text-[8px]"
                          >
                            <Globe className="h-2 w-2" />
                            MD
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : isLibraryTab && data ? (
            <MangaGrid manga={data.items.map((entry) => entry.manga)} />
          ) : (
            <div className="space-y-4">
              {paginatedHistory.map((item) => {
                if (item.source === "local") {
                  const history = item.data;
                  return (
                    <Link
                      key={`local-${history.id}`}
                      href={`/read/${history.chapter.id}`}
                      className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[rgba(26,26,36,0.8)] sm:gap-4 sm:p-4"
                    >
                      <Image
                        src={
                          history.manga.cover_image_url || "/placeholder.png"
                        }
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
                          {history.chapter.title &&
                            `: ${history.chapter.title}`}
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
                  );
                }
                const history = item.data;
                return (
                  <Link
                    key={`md-${history.id}`}
                    href={`/read/md-${history.mangadex_chapter_id}`}
                    className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[rgba(26,26,36,0.8)] sm:gap-4 sm:p-4"
                  >
                    {history.cover_image_url ? (
                      <Image
                        src={history.cover_image_url}
                        alt={history.manga_title}
                        width={64}
                        height={96}
                        className="h-20 w-14 shrink-0 rounded-lg object-cover sm:h-24 sm:w-16"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] sm:h-24 sm:w-16">
                        <span className="text-[var(--muted-foreground)] text-xs">
                          N/A
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="truncate font-medium text-sm sm:text-base">
                          {history.manga_title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="shrink-0 gap-1 py-0 text-[10px]"
                        >
                          <Globe className="h-2.5 w-2.5" />
                          MD
                        </Badge>
                      </div>
                      <p className="mb-1 truncate text-[var(--muted-foreground)] text-xs sm:mb-2 sm:text-sm">
                        თავი {history.chapter_number}
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
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {(isHistoryTab ? totalHistoryCount : (data?.total ?? 0)) >
            pageSize && (
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
                {isHistoryTab
                  ? totalHistoryPages
                  : Math.ceil((data?.total ?? 0) / pageSize)}
              </span>
              <Button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={
                  currentPage >=
                  (isHistoryTab
                    ? totalHistoryPages
                    : Math.ceil((data?.total ?? 0) / pageSize))
                }
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
