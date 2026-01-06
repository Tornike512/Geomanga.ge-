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
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="relative">
        <Input
          type="search"
          placeholder="SEARCH MANGA..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 2);
          }}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          className="h-16 w-full rounded-none border-2 border-[#3F3F46] bg-transparent py-4 pr-16 pl-16 font-bold text-xl uppercase tracking-tight placeholder:text-[#71717A] focus:border-[#DFE104]"
        />
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-5 h-6 w-6 text-[#A1A1AA]" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="-translate-y-1/2 absolute top-1/2 right-5 text-[#A1A1AA] transition-colors hover:text-[#DFE104]"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {isOpen && query.length > 2 && (
        <div className="absolute z-50 mt-2 max-h-[32rem] w-full overflow-y-auto rounded-none border-2 border-[#3F3F46] bg-[#09090B] shadow-2xl">
          {isLoading ? (
            <div className="p-8 text-center text-[#A1A1AA] text-xl uppercase tracking-wider">
              SEARCHING...
            </div>
          ) : results && results.length > 0 ? (
            <div className="grid grid-cols-2 gap-px bg-[#3F3F46] sm:grid-cols-3">
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
            <div className="p-8 text-center text-[#A1A1AA] text-xl uppercase tracking-wider">
              NO RESULTS FOUND
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
