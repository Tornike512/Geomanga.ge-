"use client";

import { useRecentManga } from "../hooks";
import { MangaGrid } from "./manga-grid";

export function RecentUpdatesSection() {
  const { data: recent, isLoading } = useRecentManga();

  return (
    <section className="mb-32">
      <div className="mb-16">
        <h2 className="mb-6 font-bold text-[clamp(2rem,6vw,4rem)] uppercase tracking-tighter">
          📚 RECENTLY UPDATED
        </h2>
        <p className="text-2xl text-[#A1A1AA]">LATEST CHAPTER RELEASES</p>
      </div>
      <MangaGrid manga={recent || []} isLoading={isLoading} />
    </section>
  );
}
