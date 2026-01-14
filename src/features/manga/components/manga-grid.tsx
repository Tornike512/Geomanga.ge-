"use client";

import { Spinner } from "@/components/spinner";
import type { Manga } from "@/types/manga.types";
import { MangaCard } from "./manga-card";

interface MangaGridProps {
  readonly manga: Manga[];
  readonly isLoading?: boolean;
}

export function MangaGrid({ manga, isLoading }: MangaGridProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!manga || !Array.isArray(manga) || manga.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] backdrop-blur-sm">
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
