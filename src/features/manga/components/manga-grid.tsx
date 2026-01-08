"use client";

import { Skeleton } from "@/components/skeleton";
import type { Manga } from "@/types/manga.types";
import { MangaCard } from "./manga-card";

interface MangaGridProps {
  readonly manga: Manga[];
  readonly isLoading?: boolean;
}

const SKELETON_COUNT = 10;
const skeletonKeys = Array.from(
  { length: SKELETON_COUNT },
  (_, i) => `skeleton-${i}`,
);

export function MangaGrid({ manga, isLoading }: MangaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {skeletonKeys.map((key) => (
          <div
            key={key}
            className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 backdrop-blur-sm"
          >
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!manga || !Array.isArray(manga) || manga.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] py-16 text-center backdrop-blur-sm">
        <p className="text-[var(--muted-foreground)] text-lg">
          მანგა არ მოიძებნა
        </p>
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
