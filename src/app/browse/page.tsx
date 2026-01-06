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
    <div className="container mx-auto max-w-6xl px-6 py-24 md:px-8 md:py-32 lg:px-12">
      {/* Page Title - Minimalist Dark */}
      <h1 className="mb-8 font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
        Browse Manga
      </h1>

      {/* Filters - Glass effect */}
      <div className="mb-8 flex flex-wrap gap-3">
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
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--foreground)] text-sm backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-hover)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        >
          <option value="">All status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="hiatus">Hiatus</option>
          <option value="cancelled">Cancelled</option>
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
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--foreground)] text-sm backdrop-blur-sm transition-all duration-200 hover:border-[var(--border-hover)] focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
        >
          <option value="rating">Rating</option>
          <option value="views">Views</option>
          <option value="title">Title</option>
          <option value="created_at">Created date</option>
          <option value="updated_at">Updated date</option>
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setFilters({ ...filters, order_desc: !filters.order_desc, page: 1 })
          }
        >
          {filters.order_desc ? "↓ Descending" : "↑ Ascending"}
        </Button>
      </div>

      {/* Results */}
      <MangaGrid manga={data?.items || []} isLoading={isLoading} />

      {/* Pagination - Minimalist Dark */}
      {data && data.pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          <span className="font-medium text-sm">
            <span className="text-[var(--accent)]">{filters.page}</span>
            <span className="mx-2 text-[var(--muted-foreground)]">/</span>
            <span className="text-[var(--muted-foreground)]">{data.pages}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page >= data.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
