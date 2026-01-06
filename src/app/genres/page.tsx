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
    <div className="container mx-auto max-w-[95vw] px-8 py-32">
      <div className="mb-24">
        <h1 className="mb-8 font-bold text-[clamp(2.5rem,8vw,6rem)] uppercase leading-none tracking-tighter">
          GENRES
        </h1>
        <p className="text-2xl text-[#A1A1AA]">
          DISCOVER MANGA BY YOUR FAVORITE GENRES
        </p>
      </div>

      {/* Genre Grid */}
      <div className="mb-24 grid grid-cols-1 gap-px bg-[#3F3F46] md:grid-cols-2 lg:grid-cols-3">
        {genres?.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() =>
              setSelectedGenreId(selectedGenreId === genre.id ? null : genre.id)
            }
            className={`group relative overflow-hidden border-2 bg-[#09090B] p-12 transition-all ${
              selectedGenreId === genre.id
                ? "border-[#DFE104] bg-[#DFE104] text-[#000000]"
                : "border-[#3F3F46] hover:border-[#DFE104]"
            }`}
          >
            <div className="text-center">
              <h3 className="mb-4 font-bold text-4xl uppercase tracking-tighter">
                {genre.name}
              </h3>
              {genre.description && (
                <p className="mb-6 line-clamp-3 text-lg opacity-70">
                  {genre.description}
                </p>
              )}
              <Badge
                variant="outline"
                className="border-2 uppercase tracking-wider"
              >
                {genre.manga_count || 0} MANGA
              </Badge>
            </div>
            {selectedGenreId === genre.id && (
              <div className="absolute top-6 right-6">
                <div className="border-2 border-[#000000] bg-[#000000] p-2 text-[#DFE104]">
                  <svg
                    className="h-6 w-6"
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
          <h2 className="mb-12 border-[#3F3F46] border-b-4 pb-6 font-bold text-5xl uppercase tracking-tighter">
            {genres?.find((g) => g.id === selectedGenreId)?.name} MANGA
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
