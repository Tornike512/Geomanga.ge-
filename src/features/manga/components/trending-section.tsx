"use client";

import { Flame } from "lucide-react";
import { useTrendingManga } from "../hooks";
import { MangaGrid } from "./manga-grid";

export function TrendingSection() {
  const { data: trending, isLoading } = useTrendingManga();

  return (
    <section className="mb-32 border-[#3F3F46] border-b-2 pb-24">
      <div className="mb-16">
        <h2 className="mb-6 flex items-center gap-4 font-bold text-[clamp(2rem,6vw,4rem)] uppercase tracking-tighter">
          <Flame className="h-12 w-12 text-[#DFE104]" />
          TRENDING NOW
        </h2>
        <p className="text-2xl text-[#A1A1AA]">MOST POPULAR MANGA THIS WEEK</p>
      </div>
      <MangaGrid manga={trending || []} isLoading={isLoading} />
    </section>
  );
}
