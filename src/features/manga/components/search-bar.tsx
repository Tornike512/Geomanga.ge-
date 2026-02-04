"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useDebounce } from "@/hooks";
import { useInfiniteMangaDexSearch } from "../hooks/use-infinite-mangadex-search";
import { useInfiniteSearchManga } from "../hooks/use-infinite-search-manga";
import { MangaCard } from "./manga-card";
import { MangaDexCard } from "./mangadex-card";

type Language = "georgian" | "english";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<Language>("georgian");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch from local API for Georgian manga with infinite scroll
  const {
    data: georgianData,
    isLoading: georgianLoading,
    isFetchingNextPage: georgianFetchingMore,
    hasNextPage: georgianHasMore,
    fetchNextPage: georgianFetchMore,
  } = useInfiniteSearchManga(
    { q: debouncedQuery, language: "georgian", limit: 6 },
    language === "georgian",
  );

  // Fetch from MangaDex for English manga with infinite scroll
  const {
    data: englishData,
    isLoading: englishLoading,
    isFetchingNextPage: englishFetchingMore,
    hasNextPage: englishHasMore,
    fetchNextPage: englishFetchMore,
  } = useInfiniteMangaDexSearch(debouncedQuery, language === "english");

  // Flatten all pages into a single array
  const georgianResults =
    georgianData?.pages.flatMap((page) => page.items) ?? [];
  const englishResults = englishData?.pages.flatMap((page) => page.items) ?? [];

  const isLoading = language === "georgian" ? georgianLoading : englishLoading;
  const isFetchingMore =
    language === "georgian" ? georgianFetchingMore : englishFetchingMore;
  const hasMore = language === "georgian" ? georgianHasMore : englishHasMore;
  const fetchMore =
    language === "georgian" ? georgianFetchMore : englishFetchMore;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          fetchMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, fetchMore, isOpen]);

  const results = language === "georgian" ? georgianResults : englishResults;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="მოძებნეთ მანგა..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="h-10 w-full pr-7 pl-7 sm:h-11 sm:pr-12 sm:pl-10"
        />
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 h-3.5 w-3.5 text-[var(--muted-foreground)] sm:left-3 sm:h-4 sm:w-4" />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="-translate-y-1/2 absolute top-1/2 right-1.5 h-auto p-0 text-[var(--muted-foreground)] hover:bg-transparent hover:text-[var(--foreground)] sm:right-3"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Modal */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)]/95 shadow-xl backdrop-blur-md">
          {/* Language Tabs */}
          <div className="flex gap-2 border-[var(--border)] border-b p-3">
            <Button
              variant={language === "georgian" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage("georgian")}
              className="flex-1"
            >
              ქართულად თარგმნილი
            </Button>
            <Button
              variant={language === "english" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage("english")}
              className="flex-1"
            >
              ინგლისურად თარგმნილი
            </Button>
          </div>

          {/* Results Content */}
          <div className="max-h-[32rem] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                  <p className="text-[var(--muted-foreground)] text-sm">
                    ძიება...
                  </p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="grid auto-rows-fr grid-cols-2 gap-3 p-3 sm:grid-cols-3">
                  {language === "georgian"
                    ? georgianResults.map((manga) => (
                        <Button
                          key={manga.id}
                          variant="ghost"
                          onClick={() => setIsOpen(false)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && setIsOpen(false)
                          }
                          className="h-auto w-full p-0 hover:bg-transparent"
                        >
                          <MangaCard manga={manga} />
                        </Button>
                      ))
                    : englishResults.map((manga) => (
                        <Button
                          key={manga.id}
                          variant="ghost"
                          onClick={() => setIsOpen(false)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && setIsOpen(false)
                          }
                          className="h-auto w-full p-0 hover:bg-transparent"
                        >
                          <MangaDexCard manga={manga} />
                        </Button>
                      ))}
                </div>

                {/* Load More Trigger */}
                <div ref={loadMoreRef} className="p-4">
                  {isFetchingMore ? (
                    <div className="flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                        <p className="text-[var(--muted-foreground)] text-xs">
                          მეტის ჩატვირთვა...
                        </p>
                      </div>
                    </div>
                  ) : hasMore ? (
                    <div className="text-center text-[var(--muted-foreground)] text-xs">
                      გადაადგილდით ქვემოთ მეტის სანახავად
                    </div>
                  ) : (
                    <div className="text-center text-[var(--muted-foreground)] text-xs">
                      ყველა შედეგი ნანახია
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center p-12">
                <p className="text-[var(--muted-foreground)] text-sm">
                  შედეგი არ მოიძებნა
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <Button
          variant="ghost"
          className="fixed inset-0 z-40 h-auto cursor-default rounded-none p-0 hover:bg-transparent"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          aria-label="Close search"
        >
          <span className="sr-only">Close search</span>
        </Button>
      )}
    </div>
  );
}
