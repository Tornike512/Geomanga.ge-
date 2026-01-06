"use client";

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
          placeholder="Search manga..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 2);
          }}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          className="w-full py-3 pr-4 pl-10 text-lg"
        />
        <div className="-translate-y-1/2 absolute top-1/2 left-3 text-gray-400">
          🔍
        </div>
      </div>

      {isOpen && query.length > 2 && (
        <div className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results && results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">
              {results.map((manga) => (
                <div
                  key={manga.id}
                  onClick={() => setIsOpen(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsOpen(false)}
                  role="button"
                  tabIndex={0}
                >
                  <MangaCard manga={manga} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close search"
        />
      )}
    </div>
  );
}
