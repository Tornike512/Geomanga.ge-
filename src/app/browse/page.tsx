"use client";

import { Filter, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { useGenres } from "@/features/genres/hooks/use-genres";
import { useMangaList } from "@/features/manga";
import { MangaGrid } from "@/features/manga/components";
import type { MangaListParams, MangaStatus } from "@/types/manga.types";
import { AgeRating, ContentType, TranslationStatus } from "@/types/manga.types";

const STATUS_OPTIONS = [
  { value: "", label: "ყველა სტატუსი" },
  { value: "ongoing", label: "მიმდინარე" },
  { value: "completed", label: "დასრულებული" },
  { value: "hiatus", label: "პაუზაზე" },
  { value: "cancelled", label: "გაუქმებული" },
] as const;

const SORT_OPTIONS = [
  { value: "rating", label: "რეიტინგი" },
  { value: "views", label: "ნახვები" },
  { value: "title", label: "სათაური" },
  { value: "created_at", label: "შექმნის თარიღი" },
  { value: "updated_at", label: "განახლების თარიღი" },
] as const;

const AGE_RATING_OPTIONS = [
  { value: "", label: "ყველა ასაკი" },
  { value: AgeRating.FOR_EVERYONE, label: "ყველასთვის" },
  { value: AgeRating.SIXTEEN_PLUS, label: "16+" },
  { value: AgeRating.EIGHTEEN_PLUS, label: "18+" },
] as const;

const CONTENT_TYPE_OPTIONS = [
  { value: "", label: "ყველა ტიპი" },
  { value: ContentType.MANGA, label: "მანგა" },
  { value: ContentType.MANHUA, label: "მანხუა" },
  { value: ContentType.MANHWA, label: "მანხვა" },
  { value: ContentType.COMICS, label: "კომიქსი" },
  { value: ContentType.OEL_MANGA, label: "OEL-მანგა" },
] as const;

const TRANSLATION_STATUS_OPTIONS = [
  { value: "", label: "ყველა თარგმანი" },
  { value: TranslationStatus.TRANSLATING, label: "ითარგმნება" },
  { value: TranslationStatus.COMPLETED, label: "თარგმნილი" },
] as const;

interface FilterState {
  page: number;
  limit: number;
  status: MangaStatus | undefined;
  translation_status: TranslationStatus | undefined;
  content_type: ContentType | undefined;
  age_rating: AgeRating | undefined;
  genres: number[];
  sort_by: MangaListParams["sort_by"];
  order_desc: boolean;
}

export default function BrowsePage() {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 20,
    status: undefined,
    translation_status: undefined,
    content_type: undefined,
    age_rating: undefined,
    genres: [],
    sort_by: "rating",
    order_desc: true,
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { data: genres } = useGenres();

  const { data, isLoading } = useMangaList({
    ...filters,
    genres: filters.genres.length > 0 ? filters.genres : undefined,
  });

  const toggleGenre = (genreId: number) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter((id) => id !== genreId)
        : [...prev.genres, genreId],
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      status: undefined,
      translation_status: undefined,
      content_type: undefined,
      age_rating: undefined,
      genres: [],
      sort_by: "rating",
      order_desc: true,
    });
  };

  const activeFilterCount =
    (filters.status ? 1 : 0) +
    (filters.translation_status ? 1 : 0) +
    (filters.content_type ? 1 : 0) +
    (filters.age_rating ? 1 : 0) +
    filters.genres.length;

  return (
    <div className="container mx-auto max-w-[1920px] px-6 py-12 md:px-8 md:py-12 lg:px-12">
      {/* Page Title */}
      <h1 className="mb-8 font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
        მანგის ნავიგაცია
      </h1>

      {/* Filters */}
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
          value={filters.sort_by || "rating"}
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
          className="h-auto min-w-[140px] px-4 py-2.5"
        >
          {filters.order_desc ? "↓ კლებადი" : "↑ ზრდადი"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterModalOpen(true)}
          className="relative h-auto min-w-[140px] px-4 py-2.5"
        >
          <Filter className="mr-2 h-4 w-4" />
          ფილტრები
          {activeFilterCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Results */}
      <MangaGrid manga={data?.items || []} isLoading={isLoading} />

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            წინა
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
            შემდეგი
          </Button>
        </div>
      )}

      {/* Filter Modal */}
      {/* biome-ignore lint/a11y/useSemanticElements: Modal backdrop overlay requires div with role=button for proper click handling */}
      <div
        role="button"
        tabIndex={-1}
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          isFilterModalOpen
            ? "visible bg-black/60 opacity-100"
            : "invisible opacity-0"
        }`}
        onClick={() => setIsFilterModalOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
            setIsFilterModalOpen(false);
          }
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-modal-title"
          className={`relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card-solid)] p-6 shadow-2xl transition-all duration-300 ${
            isFilterModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="mb-6 flex items-center justify-between border-[var(--border)] border-b pb-4">
            <h2 id="filter-modal-title" className="font-semibold text-xl">
              ფილტრები
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterModalOpen(false)}
              className="rounded-lg p-2"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Age Rating Filter */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium text-[var(--muted-foreground)] text-sm">
              ასაკობრივი შეზღუდვა
            </h3>
            <Dropdown
              options={AGE_RATING_OPTIONS}
              value={filters.age_rating || ""}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  age_rating: value ? (value as AgeRating) : undefined,
                  page: 1,
                })
              }
              aria-label="Filter by age rating"
              className="w-full"
            />
          </div>

          {/* Content Type Filter */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium text-[var(--muted-foreground)] text-sm">
              კონტენტის ტიპი
            </h3>
            <Dropdown
              options={CONTENT_TYPE_OPTIONS}
              value={filters.content_type || ""}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  content_type: value ? (value as ContentType) : undefined,
                  page: 1,
                })
              }
              aria-label="Filter by content type"
              className="w-full"
            />
          </div>

          {/* Translation Status Filter */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium text-[var(--muted-foreground)] text-sm">
              თარგმანის სტატუსი
            </h3>
            <Dropdown
              options={TRANSLATION_STATUS_OPTIONS}
              value={filters.translation_status || ""}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  translation_status: value
                    ? (value as TranslationStatus)
                    : undefined,
                  page: 1,
                })
              }
              aria-label="Filter by translation status"
              className="w-full"
            />
          </div>

          {/* Genres Filter */}
          <div className="mb-6">
            <h3 className="mb-3 font-medium text-[var(--muted-foreground)] text-sm">
              ჟანრები
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres?.map((genre) => (
                <Button
                  key={genre.id}
                  type="button"
                  variant={
                    filters.genres.includes(genre.id) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => toggleGenre(genre.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    filters.genres.includes(genre.id)
                      ? ""
                      : "hover:border-[var(--border-hover)]"
                  }`}
                >
                  {genre.name_ka || genre.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 border-[var(--border)] border-t pt-4">
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              გასუფთავება
            </Button>
            <Button
              variant="default"
              onClick={() => setIsFilterModalOpen(false)}
              className="flex-1"
            >
              გამოყენება
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
