"use client";

import { Skeleton } from "@/components/skeleton";
import type { Manga } from "@/types/manga.types";
import { MangaCard } from "./manga-card";

interface MangaGridProps {
  readonly manga: Manga[];
  readonly isLoading?: boolean;
}

const skeletonKeys = Array.from({ length: 10 }, () => crypto.randomUUID());

export function MangaGrid({ manga, isLoading }: MangaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {skeletonKeys.map((key) => (
          <div key={key} className="space-y-2">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!manga || manga.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No manga found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {manga.map((item) => (
        <MangaCard key={item.id} manga={item} />
      ))}
    </div>
  );
}
