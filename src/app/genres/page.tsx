"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { useGenres } from "@/features/genres/hooks/use-genres";
import { useMangaList } from "@/features/manga/hooks/use-manga-list";
import { MangaStatus } from "@/types/manga.types";

export default function GenresPage() {
  const { data: genres, isLoading: genresLoading } = useGenres();
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const genreSkeletonKeys = useMemo(
    () => Array.from({ length: 12 }, () => crypto.randomUUID()),
    [],
  );
  const mangaSkeletonKeys = useMemo(
    () => Array.from({ length: 12 }, () => crypto.randomUUID()),
    [],
  );

  const { data: mangaData, isLoading: mangaLoading } = useMangaList({
    genre_id: selectedGenreId || undefined,
    page: 1,
    page_size: 12,
  });

  if (genresLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {genreSkeletonKeys.map((key) => (
            <Skeleton key={key} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Browse by Genre</h1>
        <p className="text-gray-600">Discover manga by your favorite genres</p>
      </div>

      {/* Genre Grid */}
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {genres?.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() =>
              setSelectedGenreId(selectedGenreId === genre.id ? null : genre.id)
            }
            className={`group relative overflow-hidden rounded-lg transition-all ${
              selectedGenreId === genre.id
                ? "scale-105 ring-2 ring-blue-600"
                : "hover:scale-105"
            }`}
          >
            <div
              className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
              style={{
                backgroundImage: `linear-gradient(135deg, ${getGenreColor(genre.name)})`,
              }}
            >
              <div className="p-4 text-center text-white">
                <h3 className="mb-1 font-bold text-lg">{genre.name}</h3>
                {genre.description && (
                  <p className="line-clamp-2 text-sm opacity-90">
                    {genre.description}
                  </p>
                )}
                <div className="mt-2">
                  <Badge
                    variant="default"
                    className="border-white/40 bg-white/20 text-white"
                  >
                    {genre.manga_count || 0} manga
                  </Badge>
                </div>
              </div>
            </div>
            {selectedGenreId === genre.id && (
              <div className="absolute top-2 right-2">
                <div className="rounded-full bg-blue-600 p-1 text-white">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label="Selected"
                    role="img"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Genre Manga */}
      {selectedGenreId && (
        <div>
          <h2 className="mb-6 font-bold text-2xl">
            {genres?.find((g) => g.id === selectedGenreId)?.name} Manga
          </h2>

          {mangaLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {mangaSkeletonKeys.map((key) => (
                <div key={key} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : mangaData && mangaData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {mangaData.items.map((manga) => (
                  <Link
                    key={manga.id}
                    href={`/manga/${manga.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={manga.cover_image}
                          alt={manga.title}
                          width={300}
                          height={450}
                          className="h-full w-full object-cover"
                        />
                        {manga.status === MangaStatus.ONGOING && (
                          <Badge className="absolute top-2 left-2">
                            Ongoing
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="line-clamp-2 font-semibold transition-colors group-hover:text-blue-600">
                          {manga.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-gray-600 text-sm">
                          <span>
                            ⭐ {manga.average_rating?.toFixed(1) || "N/A"}
                          </span>
                          <span>•</span>
                          <span>{manga.chapters_count} chapters</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {mangaData.total > 12 && (
                <div className="mt-8 text-center">
                  <Link href={`/browse?genre_id=${selectedGenreId}`}>
                    <button
                      type="button"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View all {mangaData.total} manga →
                    </button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-gray-500">
              No manga found in this genre
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to get genre-specific colors
const getGenreColor = (genreName: string): string => {
  const colors: Record<string, string> = {
    Action: "#ef4444, #dc2626",
    Romance: "#ec4899, #db2777",
    Comedy: "#f59e0b, #d97706",
    Drama: "#8b5cf6, #7c3aed",
    Fantasy: "#06b6d4, #0891b2",
    Horror: "#000000, #374151",
    Mystery: "#6366f1, #4f46e5",
    "Sci-Fi": "#10b981, #059669",
    "Slice of Life": "#84cc16, #65a30d",
    Sports: "#f97316, #ea580c",
  };

  return colors[genreName] || "#3b82f6, #2563eb";
};
