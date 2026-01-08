"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { useGenres } from "@/features/genres/hooks/use-genres";
import { useMangaList } from "@/features/manga/hooks/use-manga-list";
import { MangaStatus } from "@/types/manga.types";

export default function GenresPage() {
  const { data: genres, isLoading: genresLoading } = useGenres();
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const genreSkeletonKeys = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `genre-skeleton-${i}`),
    [],
  );
  const mangaSkeletonKeys = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `manga-skeleton-${i}`),
    [],
  );

  const { data: mangaData, isLoading: mangaLoading } = useMangaList({
    genre: selectedGenreId || undefined,
    page: 1,
    limit: 12,
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
    <div className="container mx-auto max-w-[1920px] px-6 py-8 md:px-8 md:py-8 lg:px-12">
      <div className="mb-12">
        <h1 className="mb-4 font-semibold text-3xl tracking-tight sm:text-4xl md:text-5xl">
          ჟანრები
        </h1>
        <p className="text-[var(--muted-foreground)] text-lg">
          აღმოაჩინეთ მანგა თქვენი რჩეული ჟანრების მიხედვით
        </p>
      </div>

      {/* Genre Grid */}
      <div className="mb-16 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {genres?.map((genre) => (
          <Button
            key={genre.id}
            variant="ghost"
            onClick={() =>
              setSelectedGenreId(selectedGenreId === genre.id ? null : genre.id)
            }
            className={`group relative h-auto overflow-hidden rounded-lg border p-8 text-left transition-all duration-200 ${
              selectedGenreId === genre.id
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                : "border-[var(--border)] bg-[var(--card)] backdrop-blur-sm hover:border-[var(--border-hover)] hover:bg-[rgba(26,26,36,0.8)]"
            }`}
          >
            <div>
              <h3 className="mb-2 font-semibold text-xl tracking-tight">
                {genre.name}
              </h3>
              {genre.description && (
                <p className="mb-4 line-clamp-2 text-sm opacity-70">
                  {genre.description}
                </p>
              )}
              <Badge
                variant={selectedGenreId === genre.id ? "default" : "secondary"}
              >
                {genre.manga_count || 0} მანგა
              </Badge>
            </div>
            {selectedGenreId === genre.id && (
              <div className="absolute top-4 right-4">
                <div className="rounded-full bg-[var(--accent-foreground)] p-1.5 text-[var(--accent)]">
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
          </Button>
        ))}
      </div>

      {/* Selected Genre Manga */}
      {selectedGenreId && (
        <div>
          <h2 className="mb-8 border-[var(--border)] border-b pb-4 font-semibold text-2xl tracking-tight">
            {genres?.find((g) => g.id === selectedGenreId)?.name} მანგა
          </h2>

          {mangaLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {mangaSkeletonKeys.map((key) => (
                <div key={key} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded" />
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
                    <Card className="overflow-hidden transition-all duration-200 hover:scale-[1.02]">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={manga.cover_image_url || "/placeholder.png"}
                          alt={manga.title}
                          width={300}
                          height={450}
                          className="h-full w-full object-cover"
                        />
                        {manga.status === MangaStatus.ONGOING && (
                          <Badge
                            className="absolute top-2 left-2"
                            variant="success"
                          >
                            მიმდინარე
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="line-clamp-2 font-medium text-sm transition-colors duration-200 group-hover:text-[var(--accent)]">
                          {manga.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-[var(--muted-foreground)] text-xs">
                          <span>⭐ {manga.rating?.toFixed(1) || "N/A"}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {mangaData.total > 12 && (
                <div className="mt-8 text-center">
                  <Link href={`/browse?genre_id=${selectedGenreId}`}>
                    <Button
                      variant="ghost"
                      className="inline-flex items-center gap-2 font-medium text-[var(--accent)] transition-colors duration-200 hover:text-[var(--foreground)]"
                    >
                      იხილეთ ყველა {mangaData.total} მანგა
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-[var(--muted-foreground)]">
              ამ ჟანრში მანგა არ მოიძებნა
            </div>
          )}
        </div>
      )}
    </div>
  );
}
