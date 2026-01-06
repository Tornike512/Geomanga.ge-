"use client";

import { useTrendingManga } from "../hooks";
import { MangaGrid } from "./manga-grid";

export function TrendingSection() {
  const { data: trending, isLoading } = useTrendingManga();

  return (
    <section className="mb-32 border-[#3F3F46] border-b-2 pb-24">
      <div className="mb-16">
        <h2 className="mb-6 font-bold text-[clamp(2rem,6vw,4rem)] uppercase tracking-tighter">
          🔥 TRENDING NOW
        </h2>
        <p className="text-2xl text-[#A1A1AA]">MOST POPULAR MANGA THIS WEEK</p>
      </div>
      <MangaGrid manga={trending || []} isLoading={isLoading} />
    </section>
  );
}
