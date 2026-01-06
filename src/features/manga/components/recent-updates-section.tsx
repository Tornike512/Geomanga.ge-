"use client";

import { BookOpen } from "lucide-react";
import { useRecentManga } from "../hooks";
import { MangaGrid } from "./manga-grid";

export function RecentUpdatesSection() {
  const { data: recent, isLoading } = useRecentManga();

  return (
    <section className="mb-32">
      <div className="mb-16">
        <h2 className="mb-6 flex items-center gap-4 font-bold text-[clamp(2rem,6vw,4rem)] uppercase tracking-tighter">
          <BookOpen className="h-12 w-12 text-[#DFE104]" />
          RECENTLY UPDATED
        </h2>
        <p className="text-2xl text-[#A1A1AA]">LATEST CHAPTER RELEASES</p>
      </div>
      <MangaGrid manga={recent || []} isLoading={isLoading} />
    </section>
  );
}
