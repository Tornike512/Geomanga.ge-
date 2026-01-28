"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/input";
import { useSearchManga } from "../hooks";
import { MangaCard } from "./manga-card";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: results, isLoading } = useSearchManga(query, query.length > 2);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="relative">
        <Input
          type="search"
          placeholder="მოძებნეთ მანგა..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 2);
          }}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          className="h-10 w-full pr-7 pl-7 sm:h-11 sm:pr-12 sm:pl-10"
        />
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2 h-3.5 w-3.5 text-[var(--muted-foreground)] sm:left-3 sm:h-4 sm:w-4" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="-translate-y-1/2 absolute top-1/2 right-1.5 text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--foreground)] sm:right-3"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        )}
      </div>

      {isOpen && query.length > 2 && (
        <div className="absolute z-50 mt-2 max-h-[28rem] w-full overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--background)]/95 shadow-xl backdrop-blur-md">
          {isLoading ? (
            <div className="p-6 text-center text-[var(--muted-foreground)] text-sm">
              ძიება...
            </div>
          ) : results && results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">
              {results.map((manga) => (
                <button
                  key={manga.id}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsOpen(false)}
                >
                  <MangaCard manga={manga} />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-[var(--muted-foreground)] text-sm">
              შედეგი არ მოიძებნა
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          aria-label="Close search"
        />
      )}
    </div>
  );
}
