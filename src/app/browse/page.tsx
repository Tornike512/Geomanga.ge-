"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { useMangaList } from "@/features/manga";
import { MangaGrid } from "@/features/manga/components";
import type { MangaListParams, MangaStatus } from "@/types/manga.types";

const STATUS_OPTIONS = [
  { value: "", label: "All status" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "hiatus", label: "Hiatus" },
  { value: "cancelled", label: "Cancelled" },
] as const;

const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "views", label: "Views" },
  { value: "title", label: "Title" },
  { value: "created_at", label: "Created date" },
  { value: "updated_at", label: "Updated date" },
] as const;

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
        <Dropdown
          options={STATUS_OPTIONS}
          value={filters.status || ""}
          onChange={(value) =>
            setFilters({
              ...filters,
              status: value ? (value as MangaStatus) : undefined,
              page: 1,
            })
          }
          aria-label="Filter by status"
          className="min-w-[140px]"
        />

        <Dropdown
          options={SORT_OPTIONS}
          value={filters.sort_by}
          onChange={(value) =>
            setFilters({
              ...filters,
              sort_by: value as MangaListParams["sort_by"],
              page: 1,
            })
          }
          aria-label="Sort by"
          className="min-w-[140px]"
        />

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
