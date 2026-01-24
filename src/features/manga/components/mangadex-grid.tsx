"use client";

import { Spinner } from "@/components/spinner";
import type { MangaDexTransformedManga } from "@/types/mangadex.types";
import { MangaDexCard } from "./mangadex-card";

interface MangaDexGridProps {
  readonly manga: MangaDexTransformedManga[];
  readonly isLoading?: boolean;
}

export function MangaDexGrid({ manga, isLoading }: MangaDexGridProps) {
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
        <MangaDexCard key={item.id} manga={item} />
      ))}
    </div>
  );
}
