"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { useMangaList } from "@/features/manga";
import { MangaGrid } from "@/features/manga/components";
import type { MangaStatus } from "@/types/manga.types";

export default function BrowsePage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: undefined as MangaStatus | undefined,
    sort_by: "rating" as const,
    order_desc: true,
  });

  const { data, isLoading } = useMangaList(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-bold text-4xl">Browse Manga</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
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
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          <option value="">All Status</option>
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
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          <option value="rating">Rating</option>
          <option value="views">Views</option>
          <option value="title">Title</option>
          <option value="created_at">Created Date</option>
          <option value="updated_at">Updated Date</option>
        </select>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({ ...filters, order_desc: !filters.order_desc, page: 1 })
          }
        >
          {filters.order_desc ? "↓ Descending" : "↑ Ascending"}
        </Button>
      </div>

      {/* Results */}
      <MangaGrid manga={data?.items || []} isLoading={isLoading} />

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-gray-700">
            Page {filters.page} of {data.pages}
          </span>
          <Button
            variant="outline"
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
