"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { useMangaList } from "@/features/manga";
import { MangaGrid } from "@/features/manga/components";
import type { MangaListParams, MangaStatus } from "@/types/manga.types";

export default function BrowsePage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: undefined as MangaStatus | undefined,
    sort_by: "rating" as MangaListParams["sort_by"],
    order_desc: true,
  });

  const { data, isLoading } = useMangaList(filters);

  return (
    <div className="container mx-auto max-w-[95vw] px-8 py-20 md:py-32">
      {/* Page Title - Kinetic Typography */}
      <h1 className="mb-12 font-bold text-[clamp(2.5rem,8vw,6rem)] uppercase leading-none tracking-tighter">
        BROWSE MANGA
      </h1>

      {/* Filters - Brutalist Style */}
      <div className="mb-12 flex flex-wrap gap-4">
        <select
          value={filters.status || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value
                ? (e.target.value as MangaStatus)
                : undefined,
              page: 1,
            })
          }
          className="rounded-none border-2 border-[#3F3F46] bg-[#09090B] px-6 py-4 font-bold text-[#FAFAFA] text-sm uppercase tracking-wider transition-colors hover:border-[#DFE104] focus:border-[#DFE104] focus:outline-none"
        >
          <option value="">ALL STATUS</option>
          <option value="ongoing">ONGOING</option>
          <option value="completed">COMPLETED</option>
          <option value="hiatus">HIATUS</option>
          <option value="cancelled">CANCELLED</option>
        </select>

        <select
          value={filters.sort_by}
          onChange={(e) =>
            setFilters({
              ...filters,
              sort_by: e.target.value as MangaListParams["sort_by"],
              page: 1,
            })
          }
          className="rounded-none border-2 border-[#3F3F46] bg-[#09090B] px-6 py-4 font-bold text-[#FAFAFA] text-sm uppercase tracking-wider transition-colors hover:border-[#DFE104] focus:border-[#DFE104] focus:outline-none"
        >
          <option value="rating">RATING</option>
          <option value="views">VIEWS</option>
          <option value="title">TITLE</option>
          <option value="created_at">CREATED DATE</option>
          <option value="updated_at">UPDATED DATE</option>
        </select>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({ ...filters, order_desc: !filters.order_desc, page: 1 })
          }
        >
          {filters.order_desc ? "↓ DESCENDING" : "↑ ASCENDING"}
        </Button>
      </div>

      {/* Results */}
      <MangaGrid manga={data?.items || []} isLoading={isLoading} />

      {/* Pagination - Kinetic Style */}
      {data && data.pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-6">
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            PREVIOUS
          </Button>
          <span className="font-bold text-2xl uppercase tracking-wider">
            <span className="text-[#DFE104]">{filters.page}</span>
            <span className="mx-2 text-[#3F3F46]">/</span>
            <span className="text-[#A1A1AA]">{data.pages}</span>
          </span>
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page >= data.pages}
          >
            NEXT
          </Button>
        </div>
      )}
    </div>
  );
}
