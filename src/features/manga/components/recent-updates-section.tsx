"use client";

import { useRecentManga } from "../hooks";
import { MangaGrid } from "./manga-grid";

export function RecentUpdatesSection() {
  const { data: recent, isLoading } = useRecentManga();

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="mb-2 font-bold text-3xl text-gray-900">
          📚 Recently Updated
        </h2>
        <p className="text-gray-600">Latest chapter releases</p>
      </div>
      <MangaGrid manga={recent || []} isLoading={isLoading} />
    </section>
  );
}
