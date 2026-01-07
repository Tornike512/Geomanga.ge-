"use client";

import { Flame } from "lucide-react";
import { useTrendingManga } from "../hooks";
import { MangaGrid } from "./manga-grid";

export function TrendingSection() {
  const { data: trending, isLoading } = useTrendingManga();

  return (
    <section className="mb-16 border-[var(--border)] border-b pb-16">
      <div className="mb-8">
        <h2 className="mb-3 flex items-center gap-3 font-semibold text-2xl tracking-tight sm:text-3xl">
          <Flame className="h-7 w-7 text-[var(--accent)]" strokeWidth={1.5} />
          ტრენდული ახლა
        </h2>
        <p className="text-[var(--muted-foreground)] text-base">
          ყველაზე პოპულარული მანგა ამ კვირაში
        </p>
      </div>
      <MangaGrid manga={trending || []} isLoading={isLoading} />
    </section>
  );
}
