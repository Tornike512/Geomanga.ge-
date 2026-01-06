"use client";

import { BookOpen } from "lucide-react";
import { useRecentManga } from "../hooks";
import { MangaGrid } from "./manga-grid";

export function RecentUpdatesSection() {
  const { data: recent, isLoading } = useRecentManga();

  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="mb-3 flex items-center gap-3 font-semibold text-2xl tracking-tight sm:text-3xl">
          <BookOpen
            className="h-7 w-7 text-[var(--accent)]"
            strokeWidth={1.5}
          />
          Recently Updated
        </h2>
        <p className="text-[var(--muted-foreground)] text-base">
          Latest chapter releases
        </p>
      </div>
      <MangaGrid manga={recent || []} isLoading={isLoading} />
    </section>
  );
}
