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
      <div className="grid grid-cols-2 gap-px bg-[#3F3F46] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {skeletonKeys.map((key) => (
          <div key={key} className="space-y-4 bg-[#09090B] p-4">
            <Skeleton className="aspect-[3/4] w-full rounded-none" />
            <Skeleton className="h-4 w-3/4 rounded-none" />
            <Skeleton className="h-3 w-1/2 rounded-none" />
          </div>
        ))}
      </div>
    );
  }

  if (!manga || manga.length === 0) {
    return (
      <div className="border-2 border-[#3F3F46] py-24 text-center">
        <p className="font-bold text-2xl text-[#A1A1AA] uppercase tracking-wider">
          NO MANGA FOUND
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-px bg-[#3F3F46] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {manga.map((item) => (
        <MangaCard key={item.id} manga={item} />
      ))}
    </div>
  );
}
