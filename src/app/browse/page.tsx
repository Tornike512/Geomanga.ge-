"use client";

import { Filter, Globe, Server, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Dropdown } from "@/components/dropdown";
import { Input } from "@/components/input";
import { useGenres } from "@/features/genres/hooks/use-genres";
import {
  useMangaDexBrowse,
  useMangaDexTags,
  useMangaList,
} from "@/features/manga";
import { MangaDexGrid, MangaGrid } from "@/features/manga/components";
import type { MangaListParams, MangaStatus } from "@/types/manga.types";
import { AgeRating, ContentType, TranslationStatus } from "@/types/manga.types";
import type { MangaDexBrowseParams } from "@/types/mangadex.types";

type DataSource = "local" | "mangadex";

// Local manga filter options
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

// MangaDex filter options
const MANGADEX_STATUS_OPTIONS = [
  { value: "", label: "ყველა სტატუსი" },
  { value: "ongoing", label: "მიმდინარე" },
  { value: "completed", label: "დასრულებული" },
  { value: "hiatus", label: "პაუზაზე" },
  { value: "cancelled", label: "გაუქმებული" },
] as const;

const MANGADEX_SORT_OPTIONS = [
  { value: "followedCount", label: "პოპულარობა" },
  { value: "latestUploadedChapter", label: "ბოლო განახლება" },
  { value: "rating", label: "რეიტინგი" },
  { value: "createdAt", label: "შექმნის თარიღი" },
  { value: "title", label: "სათაური" },
  { value: "year", label: "წელი" },
] as const;

const MANGADEX_CONTENT_RATING_OPTIONS = [
  { value: "", label: "ყველა რეიტინგი" },
  { value: "safe", label: "უსაფრთხო" },
  { value: "suggestive", label: "სუგესტიური" },
  { value: "erotica", label: "ეროტიკა" },
] as const;

const MANGADEX_DEMOGRAPHIC_OPTIONS = [
  { value: "", label: "ყველა დემოგრაფია" },
  { value: "shounen", label: "შონენ" },
  { value: "shoujo", label: "შოჯო" },
  { value: "seinen", label: "სეინენ" },
  { value: "josei", label: "ჯოსეი" },
] as const;

const MANGADEX_ORIGINAL_LANGUAGE_OPTIONS = [
  { value: "", label: "ყველა ორიგინალი ენა" },
  { value: "ja", label: "🇯🇵 იაპონური" },
  { value: "ko", label: "🇰🇷 კორეული" },
  { value: "zh", label: "🇨🇳 ჩინური" },
  { value: "en", label: "🇬🇧 ინგლისური" },
] as const;

const MANGADEX_TRANSLATED_LANGUAGE_OPTIONS = [
  { value: "", label: "ყველა თარგმანი" },
  { value: "en", label: "🇬🇧 ინგლისური" },
  { value: "ja", label: "🇯🇵 იაპონური" },
  { value: "ko", label: "🇰🇷 კორეული" },
  { value: "zh", label: "🇨🇳 ჩინური" },
  { value: "es", label: "🇪🇸 ესპანური" },
  { value: "fr", label: "🇫🇷 ფრანგული" },
  { value: "de", label: "🇩🇪 გერმანული" },
  { value: "pt-br", label: "🇧🇷 პორტუგალიური (BR)" },
  { value: "ru", label: "🇷🇺 რუსული" },
  { value: "it", label: "🇮🇹 იტალიური" },
  { value: "pl", label: "🇵🇱 პოლონური" },
  { value: "tr", label: "🇹🇷 თურქული" },
  { value: "ar", label: "🇸🇦 არაბული" },
  { value: "id", label: "🇮🇩 ინდონეზიური" },
  { value: "vi", label: "🇻🇳 ვიეტნამური" },
  { value: "th", label: "🇹🇭 ტაილანდური" },
  { value: "uk", label: "🇺🇦 უკრაინული" },
] as const;

interface LocalFilterState {
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

interface MangaDexFilterState {
  page: number;
  limit: number;
  title: string;
  status: MangaDexBrowseParams["status"];
  contentRating: MangaDexBrowseParams["contentRating"];
  demographic: MangaDexBrowseParams["demographic"];
  sortBy: MangaDexBrowseParams["sortBy"];
  orderDesc: boolean;
  includedTags: string[];
  originalLanguage: string;
  availableTranslatedLanguage: string;
}

export default function BrowsePage() {
  const [source, setSource] = useState<DataSource>("local");

  // Local filters
  const [localFilters, setLocalFilters] = useState<LocalFilterState>({
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

  // MangaDex filters
  const [mangadexFilters, setMangadexFilters] = useState<MangaDexFilterState>({
    page: 1,
    limit: 20,
    title: "",
    status: undefined,
    contentRating: undefined,
    demographic: undefined,
    sortBy: "followedCount",
    orderDesc: true,
    includedTags: [],
    originalLanguage: "",
    availableTranslatedLanguage: "",
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Data fetching
  const { data: genres } = useGenres();
  const { data: mangadexTags } = useMangaDexTags();

  const { data: localData, isLoading: localLoading } = useMangaList({
    ...localFilters,
    genres: localFilters.genres.length > 0 ? localFilters.genres : undefined,
  });

  const { data: mangadexData, isLoading: mangadexLoading } = useMangaDexBrowse({
    page: mangadexFilters.page,
    limit: mangadexFilters.limit,
    title: mangadexFilters.title || undefined,
    status: mangadexFilters.status,
    contentRating: mangadexFilters.contentRating,
    demographic: mangadexFilters.demographic,
    sortBy: mangadexFilters.sortBy,
    orderDesc: mangadexFilters.orderDesc,
    includedTags:
      mangadexFilters.includedTags.length > 0
        ? mangadexFilters.includedTags
        : undefined,
    originalLanguage: mangadexFilters.originalLanguage || undefined,
    availableTranslatedLanguage:
      mangadexFilters.availableTranslatedLanguage || undefined,
  });

  // Filter by tag group for MangaDex
  const genreTags =
    mangadexTags?.filter((tag) => tag.group === "genre").slice(0, 20) || [];

  const toggleLocalGenre = (genreId: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter((id) => id !== genreId)
        : [...prev.genres, genreId],
      page: 1,
    }));
  };

  const toggleMangadexTag = (tagId: string) => {
    setMangadexFilters((prev) => ({
      ...prev,
      includedTags: prev.includedTags.includes(tagId)
        ? prev.includedTags.filter((id) => id !== tagId)
        : [...prev.includedTags, tagId],
      page: 1,
    }));
  };

  const clearLocalFilters = () => {
    setLocalFilters({
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

  const clearMangadexFilters = () => {
    setMangadexFilters({
      page: 1,
      limit: 20,
      title: "",
      status: undefined,
      contentRating: undefined,
      demographic: undefined,
      sortBy: "followedCount",
      orderDesc: true,
      includedTags: [],
      originalLanguage: "",
      availableTranslatedLanguage: "",
    });
    setSearchInput("");
  };

  const handleSearch = () => {
    setMangadexFilters((prev) => ({
      ...prev,
      title: searchInput,
      page: 1,
    }));
  };

  const localActiveFilterCount =
    (localFilters.status ? 1 : 0) +
    (localFilters.translation_status ? 1 : 0) +
    (localFilters.content_type ? 1 : 0) +
    (localFilters.age_rating ? 1 : 0) +
    localFilters.genres.length;

  const mangadexActiveFilterCount =
    (mangadexFilters.status ? 1 : 0) +
    (mangadexFilters.contentRating ? 1 : 0) +
    (mangadexFilters.demographic ? 1 : 0) +
    (mangadexFilters.originalLanguage ? 1 : 0) +
    (mangadexFilters.availableTranslatedLanguage ? 1 : 0) +
    mangadexFilters.includedTags.length;

  const activeFilterCount =
    source === "local" ? localActiveFilterCount : mangadexActiveFilterCount;

  return (
    <div className="container mx-auto max-w-[1920px] px-6 py-12 md:px-8 md:py-12 lg:px-12">
      {/* Page Title */}
      <h1 className="mb-8 font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
        მანგის ნავიგაცია
      </h1>

      {/* Source Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={source === "local" ? "default" : "outline"}
          size="sm"
          onClick={() => setSource("local")}
          className="flex items-center gap-2"
        >
          <Server className="h-4 w-4" />
          ლოკალური
        </Button>
        <Button
          variant={source === "mangadex" ? "default" : "outline"}
          size="sm"
          onClick={() => setSource("mangadex")}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          MangaDex
        </Button>
      </div>

      {/* Filters - Local */}
      {source === "local" && (
        <div className="mb-8 flex flex-wrap gap-3">
          <Dropdown
            options={STATUS_OPTIONS}
            value={localFilters.status || ""}
            onChange={(value) =>
              setLocalFilters({
                ...localFilters,
                status: value ? (value as MangaStatus) : undefined,
                page: 1,
              })
            }
            aria-label="Filter by status"
            className="min-w-[140px]"
          />

          <Dropdown
            options={SORT_OPTIONS}
            value={localFilters.sort_by || "rating"}
            onChange={(value) =>
              setLocalFilters({
                ...localFilters,
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
              setLocalFilters({
                ...localFilters,
                order_desc: !localFilters.order_desc,
                page: 1,
              })
            }
            className="h-auto min-w-[140px] px-4 py-2.5"
          >
            {localFilters.order_desc ? "↓ კლებადი" : "↑ ზრდადი"}
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
      )}

      {/* Filters - MangaDex */}
      {source === "mangadex" && (
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="მოძებნე მანგა..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-md"
            />
            <Button onClick={handleSearch}>ძებნა</Button>
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap gap-3">
            <Dropdown
              options={MANGADEX_STATUS_OPTIONS}
              value={mangadexFilters.status || ""}
              onChange={(value) =>
                setMangadexFilters({
                  ...mangadexFilters,
                  status: value
                    ? (value as MangaDexBrowseParams["status"])
                    : undefined,
                  page: 1,
                })
              }
              aria-label="Filter by status"
              className="min-w-[140px]"
            />

            <Dropdown
              options={MANGADEX_SORT_OPTIONS}
              value={mangadexFilters.sortBy || "followedCount"}
              onChange={(value) =>
                setMangadexFilters({
                  ...mangadexFilters,
                  sortBy: value as MangaDexBrowseParams["sortBy"],
                  page: 1,
                })
              }
              aria-label="Sort by"
              className="min-w-[160px]"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setMangadexFilters({
                  ...mangadexFilters,
                  orderDesc: !mangadexFilters.orderDesc,
                  page: 1,
                })
              }
              className="h-auto min-w-[140px] px-4 py-2.5"
            >
              {mangadexFilters.orderDesc ? "↓ კლებადი" : "↑ ზრდადი"}
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
        </div>
      )}

      {/* Results */}
      {source === "local" ? (
        <MangaGrid manga={localData?.items || []} isLoading={localLoading} />
      ) : (
        <MangaDexGrid
          manga={mangadexData?.items || []}
          isLoading={mangadexLoading}
        />
      )}

      {/* Pagination - Local */}
      {source === "local" && localData && localData.pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setLocalFilters({ ...localFilters, page: localFilters.page - 1 })
            }
            disabled={localFilters.page === 1}
          >
            წინა
          </Button>
          <span className="font-medium text-sm">
            <span className="text-[var(--accent)]">{localFilters.page}</span>
            <span className="mx-2 text-[var(--muted-foreground)]">/</span>
            <span className="text-[var(--muted-foreground)]">
              {localData.pages}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setLocalFilters({ ...localFilters, page: localFilters.page + 1 })
            }
            disabled={localFilters.page >= localData.pages}
          >
            შემდეგი
          </Button>
        </div>
      )}

      {/* Pagination - MangaDex */}
      {source === "mangadex" && mangadexData && mangadexData.pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setMangadexFilters({
                ...mangadexFilters,
                page: mangadexFilters.page - 1,
              })
            }
            disabled={mangadexFilters.page === 1}
          >
            წინა
          </Button>
          <span className="font-medium text-sm">
            <span className="text-[var(--accent)]">{mangadexFilters.page}</span>
            <span className="mx-2 text-[var(--muted-foreground)]">/</span>
            <span className="text-[var(--muted-foreground)]">
              {mangadexData.pages}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setMangadexFilters({
                ...mangadexFilters,
                page: mangadexFilters.page + 1,
              })
            }
            disabled={mangadexFilters.page >= mangadexData.pages}
          >
            შემდეგი
          </Button>
        </div>
      )}

      {/* Filter Modal - Local */}
      {source === "local" && (
        // biome-ignore lint/a11y/useSemanticElements: Modal backdrop overlay requires div with role=button for proper click handling
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
                value={localFilters.age_rating || ""}
                onChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
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
                value={localFilters.content_type || ""}
                onChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
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
                value={localFilters.translation_status || ""}
                onChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
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
                      localFilters.genres.includes(genre.id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleLocalGenre(genre.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${
                      localFilters.genres.includes(genre.id)
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
              <Button
                variant="outline"
                onClick={clearLocalFilters}
                className="flex-1"
              >
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
      )}

      {/* Filter Modal - MangaDex */}
      {source === "mangadex" && (
        // biome-ignore lint/a11y/useSemanticElements: Modal backdrop overlay requires div with role=button for proper click handling
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
            aria-labelledby="mangadex-filter-modal-title"
            className={`relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card-solid)] p-6 shadow-2xl transition-all duration-300 ${
              isFilterModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between border-[var(--border)] border-b pb-4">
              <h2
                id="mangadex-filter-modal-title"
                className="font-semibold text-xl"
              >
                MangaDex ფილტრები
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

            {/* Content Rating Filter */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-[var(--muted-foreground)] text-sm">
                კონტენტის რეიტინგი
              </h3>
              <Dropdown
                options={MANGADEX_CONTENT_RATING_OPTIONS}
                value={mangadexFilters.contentRating || ""}
                onChange={(value) =>
                  setMangadexFilters({
                    ...mangadexFilters,
                    contentRating: value
                      ? (value as MangaDexBrowseParams["contentRating"])
                      : undefined,
                    page: 1,
                  })
                }
                aria-label="Filter by content rating"
                className="w-full"
              />
            </div>

            {/* Demographic Filter */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-[var(--muted-foreground)] text-sm">
                დემოგრაფია
              </h3>
              <Dropdown
                options={MANGADEX_DEMOGRAPHIC_OPTIONS}
                value={mangadexFilters.demographic || ""}
                onChange={(value) =>
                  setMangadexFilters({
                    ...mangadexFilters,
                    demographic: value
                      ? (value as MangaDexBrowseParams["demographic"])
                      : undefined,
                    page: 1,
                  })
                }
                aria-label="Filter by demographic"
                className="w-full"
              />
            </div>

            {/* Translated Language Filter */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-[var(--muted-foreground)] text-sm">
                თარგმანის ენა (მანგები, რომლებსაც აქვთ თარგმანი ამ ენაზე)
              </h3>
              <Dropdown
                options={MANGADEX_TRANSLATED_LANGUAGE_OPTIONS}
                value={mangadexFilters.availableTranslatedLanguage || ""}
                onChange={(value) =>
                  setMangadexFilters({
                    ...mangadexFilters,
                    availableTranslatedLanguage: value || "",
                    page: 1,
                  })
                }
                aria-label="Filter by translated language"
                className="w-full"
              />
            </div>

            {/* Original Language Filter */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-[var(--muted-foreground)] text-sm">
                ორიგინალი ენა
              </h3>
              <Dropdown
                options={MANGADEX_ORIGINAL_LANGUAGE_OPTIONS}
                value={mangadexFilters.originalLanguage || ""}
                onChange={(value) =>
                  setMangadexFilters({
                    ...mangadexFilters,
                    originalLanguage: value || "",
                    page: 1,
                  })
                }
                aria-label="Filter by original language"
                className="w-full"
              />
            </div>

            {/* Genre Tags Filter */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-[var(--muted-foreground)] text-sm">
                ჟანრები
              </h3>
              <div className="flex flex-wrap gap-2">
                {genreTags.map((tag) => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant={
                      mangadexFilters.includedTags.includes(tag.id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleMangadexTag(tag.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${
                      mangadexFilters.includedTags.includes(tag.id)
                        ? ""
                        : "hover:border-[var(--border-hover)]"
                    }`}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-[var(--border)] border-t pt-4">
              <Button
                variant="outline"
                onClick={clearMangadexFilters}
                className="flex-1"
              >
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
      )}
    </div>
  );
}
