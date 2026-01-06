"use client";

import { useTrendingManga } from "../hooks";
import { MangaGrid } from "./manga-grid";

export function TrendingSection() {
  const { data: trending, isLoading } = useTrendingManga();

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="mb-2 font-bold text-3xl text-gray-900">
          🔥 Trending Now
        </h2>
        <p className="text-gray-600">Most popular manga this week</p>
      </div>
      <MangaGrid manga={trending || []} isLoading={isLoading} />
    </section>
  );
}
