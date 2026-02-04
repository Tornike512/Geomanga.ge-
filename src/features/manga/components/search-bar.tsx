"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useDebounce } from "@/hooks";
import { useMangaDexSearch, useSearchManga } from "../hooks";
import { MangaCard } from "./manga-card";
import { MangaDexCard } from "./mangadex-card";

type Language = "georgian" | "english";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<Language>("georgian");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  // Fetch from local API for Georgian manga
  const { data: georgianResults, isLoading: georgianLoading } = useSearchManga(
    { q: debouncedQuery, language: "georgian" },
    debouncedQuery.length > 2 && language === "georgian",
  );

  // Fetch from MangaDex for English manga
  const { data: englishResults, isLoading: englishLoading } =
    useMangaDexSearch(debouncedQuery);

  const isLoading = language === "georgian" ? georgianLoading : englishLoading;

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
          <div className="max-h-[28rem] overflow-y-auto">
            {query.length < 3 ? (
              <div className="p-6 text-center text-[var(--muted-foreground)] text-sm">
                მინიმუმ 3 სიმბოლო აკრიფეთ ძიებისთვის
              </div>
            ) : isLoading ? (
              <div className="p-6 text-center text-[var(--muted-foreground)] text-sm">
                ძიება...
              </div>
            ) : language === "georgian" ? (
              georgianResults && georgianResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">
                  {georgianResults.map((manga) => (
                    <Button
                      key={manga.id}
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                      onKeyDown={(e) => e.key === "Enter" && setIsOpen(false)}
                      className="h-auto w-full p-0 hover:bg-transparent"
                    >
                      <MangaCard manga={manga} />
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-[var(--muted-foreground)] text-sm">
                  შედეგი არ მოიძებნა
                </div>
              )
            ) : englishResults && englishResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">
                {englishResults.map((manga) => (
                  <Button
                    key={manga.id}
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    onKeyDown={(e) => e.key === "Enter" && setIsOpen(false)}
                    className="h-auto w-full p-0 hover:bg-transparent"
                  >
                    <MangaDexCard manga={manga} />
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-[var(--muted-foreground)] text-sm">
                შედეგი არ მოიძებნა
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
